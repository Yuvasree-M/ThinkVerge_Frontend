// components/assignments/AssignmentModal.jsx
import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { assignmentApi, uploadApi } from '../../api/services'
import { X, Upload, FileText, Loader2, Trash2, Calendar, Hash } from 'lucide-react'
import toast from 'react-hot-toast'

// ✅ Converts any Cloudinary raw PDF URL to a Google Docs viewer URL for inline display
const pdfViewerUrl = (url) => {
  if (!url) return ''
  // If it's a local blob URL (before upload), use directly
  if (url.startsWith('blob:')) return url
  // Use Google Docs viewer for Cloudinary URLs so browser renders PDF inline
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

export default function AssignmentModal({
  isOpen,
  onClose,
  assignment,   // if present → edit mode
  courseId,
  onSaved,
}) {
  const isEdit = !!assignment
  const fileInputRef = useRef()

  const [form, setForm] = useState({
    title:       assignment?.title       || '',
    description: assignment?.description || '',
    dueDate:     assignment?.dueDate
                   ? new Date(assignment.dueDate).toISOString().slice(0, 16)
                   : '',
    maxMarks:    assignment?.maxPoints   || '',
  })

  const [pdfFile,     setPdfFile]     = useState(null)
  const [pdfPreview,  setPdfPreview]  = useState(assignment?.pdfUrl || null) // blob or cloudinary URL
  const [uploading,   setUploading]   = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(assignment?.pdfUrl || null) // final Cloudinary URL

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleFilePick = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    setPdfFile(file)
    const blobUrl = URL.createObjectURL(file)
    setPdfPreview(blobUrl)   // show local blob immediately
    setUploadedUrl(null)     // reset until upload completes

    setUploading(true)
    try {
      const res = await uploadApi.upload(file)
      // backend returns { url: '...' } — handle both plain string and object
      const cloudUrl = typeof res.data === 'string' ? res.data : res.data.url
      setUploadedUrl(cloudUrl)
      setPdfPreview(cloudUrl)  // switch preview to Cloudinary URL
      toast.success('PDF uploaded!')
    } catch {
      toast.error('PDF upload failed')
      setPdfFile(null)
      setPdfPreview(assignment?.pdfUrl || null)
      setUploadedUrl(assignment?.pdfUrl || null)
    } finally {
      setUploading(false)
    }
  }

  const clearPdf = () => {
    setPdfFile(null)
    setPdfPreview(assignment?.pdfUrl || null)
    setUploadedUrl(assignment?.pdfUrl || null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        courseId:    courseId,
        title:       form.title,
        description: form.description,
        dueDate:     form.dueDate || null,
        maxMarks:    form.maxMarks ? Number(form.maxMarks) : null,
        pdfUrl:      uploadedUrl || null,
      }
      return isEdit
        ? assignmentApi.update(assignment.id, payload)
        : assignmentApi.create(payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Assignment updated!' : 'Assignment created!')
      onSaved?.()
      onClose()
    },
    onError: () => toast.error('Failed to save assignment'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (uploading) { toast.error('Wait for PDF upload to finish'); return }
    save()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-royal-gradient flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <h2 className="font-semibold text-navy-800">
              {isEdit ? 'Edit Assignment' : 'New Assignment'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Title *
            </label>
            <input
              className="input w-full"
              placeholder="e.g. Week 3 Problem Set"
              value={form.title}
              onChange={set('title')}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Description
            </label>
            <textarea
              className="input w-full resize-none"
              rows={3}
              placeholder="Instructions for students..."
              value={form.description}
              onChange={set('description')}
            />
          </div>

          {/* Due Date + Max Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar size={12} /> Due Date
              </label>
              <input
                type="datetime-local"
                className="input w-full"
                value={form.dueDate}
                onChange={set('dueDate')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Hash size={12} /> Max Marks
              </label>
              <input
                type="number"
                min={1}
                className="input w-full"
                placeholder="100"
                value={form.maxMarks}
                onChange={set('maxMarks')}
              />
            </div>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Assignment PDF {isEdit && uploadedUrl ? '(replace to update)' : ''}
            </label>

            {!pdfPreview ? (
              /* ── Drop zone ── */
              <label
                htmlFor="assignment-pdf"
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-royal-200 rounded-xl py-8 cursor-pointer hover:border-royal-400 hover:bg-royal-50 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-royal-100 flex items-center justify-center">
                  <Upload size={18} className="text-royal-500" />
                </div>
                <p className="text-sm text-navy-600 font-medium">Click to upload PDF</p>
                <p className="text-xs text-slate-400">PDF files only</p>
                <input
                  id="assignment-pdf"
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFilePick}
                />
              </label>
            ) : (
              /* ── PDF Preview ── */
              <div className="border border-royal-200 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 bg-royal-50 border-b border-royal-100">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-royal-500" />
                    <span className="text-xs font-medium text-navy-700 truncate max-w-[180px]">
                      {pdfFile?.name || 'assignment.pdf'}
                    </span>
                    {uploading && (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <Loader2 size={11} className="animate-spin" /> Uploading…
                      </span>
                    )}
                    {!uploading && uploadedUrl && (
                      <span className="text-xs text-emerald-600 font-semibold">✓ Uploaded</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {uploadedUrl && (
                      <a
                        href={uploadedUrl}
                        download="assignment.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost text-xs text-royal-500 px-2 py-1"
                      >
                        View
                      </a>
                    )}
                    <button type="button" onClick={clearPdf} className="btn-icon text-red-400 hover:text-red-600">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* ✅ Inline PDF preview via Google Docs viewer */}
                {uploading ? (
                  <div className="flex items-center justify-center h-40 bg-slate-50">
                    <Loader2 size={24} className="animate-spin text-royal-400" />
                    <span className="ml-2 text-sm text-slate-500">Uploading PDF…</span>
                  </div>
                ) : (
                  <iframe
                    src={pdfViewerUrl(pdfPreview)}
                    title="Assignment PDF Preview"
                    className="w-full"
                    style={{ height: 260 }}
                  />
                )}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-surface">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={isPending || uploading}
            className="btn-primary"
          >
            {isPending
              ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
              : isEdit ? 'Update' : 'Create Assignment'
            }
          </button>
        </div>
      </div>
    </div>
  )
}