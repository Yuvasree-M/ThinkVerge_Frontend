// components/submissions/SubmitAssignmentModal.jsx
import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { submissionApi, uploadApi } from '../../api/services'
import { X, Upload, FileText, Loader2, Trash2, Download, Eye, ExternalLink, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

// ✅ Use Google Docs viewer for Cloudinary PDF URLs so browser renders inline
const pdfViewerUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('blob:')) return url
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

export default function SubmitAssignmentModal({
  isOpen,
  onClose,
  assignment,   // { id, title, description, dueDate, maxPoints, pdfUrl }
  onSubmitted,
}) {
  const fileInputRef = useRef()
  const [tab, setTab] = useState('details')

  const [pdfFile,     setPdfFile]     = useState(null)
  const [pdfPreview,  setPdfPreview]  = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [uploading,   setUploading]   = useState(false)
  const [content,     setContent]     = useState('')

  // ✅ Fetch existing submission for this assignment (to pre-fill on resubmit)
  const { data: mySubmissions = [] } = useQuery({
    queryKey: ['my-submissions'],
    // Already fetched by parent — uses cached data, no extra network call
    queryFn: () => submissionApi.mySubmissions().then(r => r.data),
    enabled: isOpen && !!assignment,
  })

  const existingSubmission = mySubmissions.find(s => s.assignmentId === assignment?.id)
  const isResubmit = !!existingSubmission

  // ✅ Pre-fill form when modal opens for resubmit
  useEffect(() => {
    if (!isOpen || !assignment) return
    setTab('details')

    if (existingSubmission) {
      // Pre-fill with existing values so student sees their previous work
      setContent(existingSubmission.content || '')
      if (existingSubmission.fileUrl) {
        setUploadedUrl(existingSubmission.fileUrl)
        setPdfPreview(existingSubmission.fileUrl)
      } else {
        setUploadedUrl(null)
        setPdfPreview(null)
      }
      setPdfFile(null)
    } else {
      setContent('')
      setPdfFile(null)
      setPdfPreview(null)
      setUploadedUrl(null)
    }
  }, [isOpen, assignment?.id])

  const handleFilePick = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    setPdfFile(file)
    const blobUrl = URL.createObjectURL(file)
    setPdfPreview(blobUrl)
    setUploadedUrl(null)

    setUploading(true)
    try {
      const res = await uploadApi.upload(file)
      const cloudUrl = typeof res.data === 'string' ? res.data : res.data.url
      setUploadedUrl(cloudUrl)
      setPdfPreview(cloudUrl)
      toast.success('Answer PDF uploaded!')
    } catch {
      toast.error('Upload failed')
      setPdfFile(null)
      setPdfPreview(null)
      setUploadedUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const clearPdf = () => {
    setPdfFile(null)
    setPdfPreview(null)
    setUploadedUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () =>
      submissionApi.submit({
        assignmentId: assignment.id,
        fileUrl:      uploadedUrl || null,
        content:      content.trim() || null,
      }),
    onSuccess: () => {
      toast.success(isResubmit ? 'Resubmitted successfully!' : 'Submitted successfully!')
      onSubmitted?.()
      onClose()
    },
    onError: () => toast.error('Submission failed'),
  })

  const handleSubmit = () => {
    if (!uploadedUrl && !content.trim()) {
      toast.error('Please upload a PDF or write your answer')
      return
    }
    if (uploading) { toast.error('Wait for upload to complete'); return }
    submit()
  }

  if (!isOpen || !assignment) return null

  const isDuePassed = assignment.dueDate && new Date() > new Date(assignment.dueDate)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isResubmit ? 'bg-amber-500' : 'bg-royal-gradient'}`}>
              {isResubmit
                ? <RefreshCw size={16} className="text-white" />
                : <FileText  size={16} className="text-white" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-navy-800 text-sm">{assignment.title}</h2>
                {/* ✅ Resubmit badge */}
                {isResubmit && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    Resubmitting
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                {assignment.dueDate && (
                  <span className={`text-xs ${isDuePassed ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                    Due: {new Date(assignment.dueDate).toLocaleString()}
                    {isDuePassed && ' · Overdue'}
                  </span>
                )}
                {assignment.maxPoints && (
                  <span className="text-xs text-slate-400">{assignment.maxPoints} pts</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 flex-shrink-0">
          {[
            { id: 'details', label: 'Assignment Details' },
            { id: 'submit',  label: isResubmit ? 'Update Answer' : 'Your Answer' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.id
                  ? 'border-royal-500 text-royal-600'
                  : 'border-transparent text-slate-500 hover:text-navy-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Details Tab ── */}
          {tab === 'details' && (
            <div className="p-6 space-y-4">

              {assignment.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Instructions
                  </p>
                  <p className="text-sm text-navy-700 bg-surface rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
                    {assignment.description}
                  </p>
                </div>
              )}

              {assignment.pdfUrl ? (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Assignment PDF
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <a
                      href={assignment.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost text-xs text-royal-500 flex items-center gap-1.5"
                    >
                      <Eye size={13} /> View Full Screen
                    </a>
                    <a
                      href={assignment.pdfUrl}
                      download="assignment.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost text-xs text-emerald-600 flex items-center gap-1.5"
                    >
                      <Download size={13} /> Download PDF
                    </a>
                  </div>
                  <div className="border border-royal-100 rounded-xl overflow-hidden">
                    <iframe
                      src={pdfViewerUrl(assignment.pdfUrl)}
                      title="Assignment PDF"
                      className="w-full"
                      style={{ height: 420 }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400 bg-surface rounded-xl p-4">
                  <FileText size={16} />
                  No PDF attached to this assignment.
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button onClick={() => setTab('submit')} className="btn-primary text-sm">
                  {isResubmit ? 'Update My Answer →' : 'Submit My Answer →'}
                </button>
              </div>
            </div>
          )}

          {/* ── Submit / Resubmit Tab ── */}
          {tab === 'submit' && (
            <div className="p-6 space-y-4">

              {/* ✅ Resubmit notice */}
              {isResubmit && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700">
                  <RefreshCw size={15} className="flex-shrink-0 mt-0.5" />
                  <span>
                    You already have a submission. Saving here will <strong>replace</strong> your
                    previous answer. You can resubmit until the instructor grades it.
                  </span>
                </div>
              )}

              {/* Overdue warning */}
              {isDuePassed && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                  ⚠️ The deadline has passed. Your submission will be marked as late.
                </div>
              )}

              {/* PDF Upload */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Upload Answer as PDF
                </label>

                {!pdfPreview ? (
                  <label
                    htmlFor="answer-pdf"
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-royal-200 rounded-xl py-8 cursor-pointer hover:border-royal-400 hover:bg-royal-50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-royal-100 flex items-center justify-center">
                      <Upload size={18} className="text-royal-500" />
                    </div>
                    <p className="text-sm text-navy-600 font-medium">
                      {isResubmit ? 'Upload new answer PDF' : 'Click to upload your answer PDF'}
                    </p>
                    <p className="text-xs text-slate-400">PDF files only</p>
                    <input
                      id="answer-pdf"
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFilePick}
                    />
                  </label>
                ) : (
                  <div className="border border-royal-200 rounded-xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-3 py-2 bg-royal-50 border-b border-royal-100">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-royal-500" />
                        <span className="text-xs font-medium text-navy-700 truncate max-w-[180px]">
                          {pdfFile?.name || (isResubmit ? 'Previous submission' : 'answer.pdf')}
                        </span>
                        {uploading && (
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <Loader2 size={11} className="animate-spin" /> Uploading…
                          </span>
                        )}
                        {!uploading && uploadedUrl && (
                          <span className="text-xs text-emerald-600 font-semibold">✓ Ready</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {uploadedUrl && (
                          <a
                            href={uploadedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-ghost text-xs text-royal-500 px-2 py-1"
                          >
                            <ExternalLink size={11} />
                          </a>
                        )}
                        <button type="button" onClick={clearPdf} className="btn-icon text-red-400">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {uploading ? (
                      <div className="flex items-center justify-center h-36 bg-slate-50">
                        <Loader2 size={22} className="animate-spin text-royal-400" />
                        <span className="ml-2 text-sm text-slate-500">Uploading…</span>
                      </div>
                    ) : (
                      <iframe
                        src={pdfViewerUrl(pdfPreview)}
                        title="Answer Preview"
                        className="w-full"
                        style={{ height: 220 }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Text answer */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Or Type Your Answer
                </label>
                <textarea
                  className="input w-full resize-none"
                  rows={4}
                  placeholder="Type your answer here (optional if PDF uploaded)..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer — only on submit tab */}
        {tab === 'submit' && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-surface flex-shrink-0">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={isPending || uploading}
              className={`btn-primary flex items-center gap-2 ${isResubmit ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
            >
              {isPending
                ? <><Loader2 size={14} className="animate-spin" /> {isResubmit ? 'Updating…' : 'Submitting…'}</>
                : isResubmit
                  ? <><RefreshCw size={14} /> Update Submission</>
                  : 'Submit Assignment'
              }
            </button>
          </div>
        )}
      </div>
    </div>
  )
}