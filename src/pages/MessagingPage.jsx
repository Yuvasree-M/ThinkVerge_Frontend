import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { messageApi } from '../api/services'
import {
  MessageSquare, User, ChevronLeft, Send,
  BookOpen, Loader2, Sparkles, RefreshCw, Search
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, isAI, profileImage, size = 8 }) {
  if (isAI) {
    return (
      <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md`}>
        <Sparkles size={size === 8 ? 16 : 12} className="text-white" />
      </div>
    )
  }
  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={name}
        className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0 shadow-sm`}
      />
    )
  }
  return (
    <div className={`w-${size} h-${size} rounded-full bg-royal-gradient flex items-center justify-center flex-shrink-0 shadow-sm`}>
      <span className="text-white text-xs font-bold">{name?.[0]?.toUpperCase() ?? '?'}</span>
    </div>
  )
}

// ── MessageBubble ─────────────────────────────────────────────────────────────

function MessageBubble({ msg, currentUserId }) {
  const isOwn = !msg.aiMessage && msg.senderId === currentUserId
  const isAI  = msg.aiMessage

  const time = msg.sentAt
    ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  if (isAI) {
    return (
      <div className="flex items-start gap-3 max-w-2xl">
        <Avatar isAI size={8} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-violet-600">AI Assistant</span>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
            {msg.content}
          </div>
        </div>
      </div>
    )
  }

  if (isOwn) {
    return (
      <div className="flex items-end gap-3 max-w-2xl ml-auto flex-row-reverse">
        <Avatar name={msg.senderName} size={7} />
        <div className="flex-1 flex flex-col items-end">
          <span className="text-xs text-gray-400 mb-1">{time}</span>
          <div className="bg-royal-gradient text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed shadow-md">
            {msg.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 max-w-2xl">
      <Avatar name={msg.senderName} size={8} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-600">{msg.senderName}</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed shadow-sm">
          {msg.content}
        </div>
      </div>
    </div>
  )
}

// ── AI Chat Panel ─────────────────────────────────────────────────────────────
// POST /api/messages/ai/ask  — Spring AI calls Gemini, persists both turns.
// GET  /api/messages/ai/:courseId — loads existing AI chat history on mount.

function AIChatPanel({ course }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(true)   // initial history load
  const [sending, setSending]   = useState(false)
  const bottomRef = useRef(null)

  // Load AI chat history from the server on mount / course change
  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await messageApi.getAiMessages(course.courseId)
      if (data.length === 0) {
        // No history — show welcome message
        setMessages([{
          id: 'welcome',
          senderId: null,
          senderName: 'AI Assistant',
          content: `Hi! 👋 I'm your AI assistant for **${course.courseTitle}**. Ask me anything about the course content, concepts, or if you need help understanding a topic!`,
          aiMessage: true,
          sentAt: new Date().toISOString(),
        }])
      } else {
        setMessages(data)
      }
    } catch {
      toast.error('Failed to load AI chat history')
    } finally {
      setLoading(false)
    }
  }, [course.courseId, course.courseTitle])

  useEffect(() => { loadHistory() }, [loadHistory])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const question = input.trim()
    if (!question || sending) return

    // Optimistically add the user's message
    const tempId = `temp-${Date.now()}`
    const userMsg = {
      id: tempId,
      senderId: user.id,
      senderName: user.name,
      content: question,
      aiMessage: false,
      sentAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      // POST /api/messages/ai/ask — backend persists both turns and returns reply
      const { data } = await messageApi.askAi(course.courseId, question)

      // ApiResponse<String>: { success, message, data: "<reply text>" }
      const replyText = data?.data ?? data ?? 'Sorry, I could not generate a response.'

      const aiMsg = {
        id: `ai-${Date.now()}`,
        senderId: null,
        senderName: 'AI Assistant',
        content: replyText,
        aiMessage: true,
        sentAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      const errMsg = err?.response?.data?.message ?? 'AI assistant is currently unavailable'
      toast.error(errMsg)
      // Roll back the optimistic message and restore input
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setInput(question)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-violet-50 to-indigo-50">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">AI Course Assistant</p>
          <p className="text-xs text-violet-500">{course.courseTitle}</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 size={24} className="animate-spin text-violet-400" />
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} currentUserId={user?.id} />
          ))
        )}
        {sending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex gap-2 items-end bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-violet-400 focus-within:bg-white transition-all">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask anything about the course..."
            rows={1}
            className="flex-1 bg-transparent resize-none text-sm text-gray-700 placeholder-gray-400 outline-none max-h-32 py-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white disabled:opacity-40 transition-all hover:shadow-md hover:scale-105 flex-shrink-0"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">Shift+Enter for new line · Enter to send</p>
      </div>
    </div>
  )
}

// ── Human Chat Panel (student ↔ instructor) ───────────────────────────────────

function HumanChatPanel({ course, otherUser, role }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sending, setSending]   = useState(false)
  const bottomRef = useRef(null)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await messageApi.getDirectMessages(course.courseId, otherUser.id)
      setMessages(data)
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [course.courseId, otherUser.id])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || sending) return

    setSending(true)
    try {
      const { data } = await messageApi.sendMessage({
        receiverId: otherUser.id,
        courseId: course.courseId,
        content,
      })
      setMessages(prev => [...prev, data])
      setInput('')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
        <Avatar name={otherUser.name} profileImage={otherUser.profileImage} size={9} />
        <div>
          <p className="font-semibold text-gray-800 text-sm">{otherUser.name}</p>
          <p className="text-xs text-gray-400">
            {role === 'STUDENT' ? 'Instructor' : 'Student'} · {course.courseTitle}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="ml-auto p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          title="Refresh messages"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 size={24} className="animate-spin text-royal-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <MessageSquare size={32} className="opacity-30" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} currentUserId={user?.id} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex gap-2 items-end bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-blue-400 focus-within:bg-white transition-all">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={`Message ${otherUser.name}...`}
            rows={1}
            className="flex-1 bg-transparent resize-none text-sm text-gray-700 placeholder-gray-400 outline-none max-h-32 py-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-royal-gradient text-white disabled:opacity-40 transition-all hover:shadow-md hover:scale-105 flex-shrink-0"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">Shift+Enter for new line · Enter to send</p>
      </div>
    </div>
  )
}

// ── Instructor: student selector within a course ──────────────────────────────

function InstructorStudentList({ course, onSelect, selected }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(false)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    if (!course) return
    setLoading(true)
    messageApi.getCourseStudents(course.courseId)
      .then(r => setStudents(r.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false))
  }, [course?.courseId])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full border-r border-gray-100">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Students</p>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
          <Search size={13} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            className="bg-transparent text-xs outline-none flex-1 text-gray-600 placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No students enrolled</p>
        ) : (
          filtered.map(s => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition ${
                selected?.id === s.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <Avatar name={s.name} profileImage={s.profileImage} size={8} />
              <p className="text-sm font-medium text-gray-700">{s.name}</p>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ── Sidebar: course list ──────────────────────────────────────────────────────

function CourseSidebar({ chats, activeChat, onSelect, role }) {
  return (
    <div className="flex flex-col h-full border-r border-gray-100 w-64 flex-shrink-0">
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Courses</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <button
            key={chat.courseId}
            onClick={() => onSelect(chat)}
            className={`w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition border-b border-gray-50 ${
              activeChat?.courseId === chat.courseId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-royal-gradient flex items-center justify-center flex-shrink-0 shadow-sm">
              <BookOpen size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{chat.courseTitle}</p>
              {role === 'STUDENT' && (
                <p className="text-xs text-gray-400 truncate">by {chat.instructorName}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Chat type tabs (for students) ─────────────────────────────────────────────

function ChatTypeTabs({ active, onChange }) {
  return (
    <div className="flex border-b border-gray-100 bg-white px-4 pt-3 gap-1">
      {[
        { key: 'ai',         label: 'AI Assistant', icon: Sparkles },
        { key: 'instructor', label: 'Instructor',   icon: User },
      ].map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
            active === key
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}

// ── Main MessagingPage ────────────────────────────────────────────────────────

export default function MessagingPage() {
  const { role } = useAuth()
  const [chats, setChats]                   = useState([])
  const [loadingChats, setLoadingChats]     = useState(true)
  const [activeChat, setActiveChat]         = useState(null)
  const [chatType, setChatType]             = useState('ai')        // 'ai' | 'instructor'
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showList, setShowList]             = useState(true)         // mobile toggle

  useEffect(() => {
    const fetch = role === 'STUDENT'
      ? messageApi.getStudentChats
      : messageApi.getInstructorChats

    fetch()
      .then(r => {
        setChats(r.data)
        if (r.data.length > 0) setActiveChat(r.data[0])
      })
      .catch(() => toast.error('Failed to load chats'))
      .finally(() => setLoadingChats(false))
  }, [role])

  const handleCourseSelect = (chat) => {
    setActiveChat(chat)
    setSelectedStudent(null)
    setChatType('ai')
    setShowList(false)
  }

  if (loadingChats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-royal-400" />
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
        <MessageSquare size={40} className="opacity-25" />
        <div className="text-center">
          <p className="font-semibold text-gray-600">No courses yet</p>
          <p className="text-sm mt-1">
            {role === 'STUDENT'
              ? 'Enroll in a course to start chatting with your instructor or AI assistant.'
              : 'Create a course to start receiving student messages.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Course List Sidebar */}
      <div className={`${showList ? 'flex' : 'hidden'} md:flex flex-shrink-0`}>
        <CourseSidebar
          chats={chats}
          activeChat={activeChat}
          onSelect={handleCourseSelect}
          role={role}
        />
      </div>

      {/* Main Chat Area */}
      {activeChat && (
        <div className={`flex-1 flex flex-col min-w-0 ${!showList ? 'flex' : 'hidden'} md:flex`}>

          {/* Mobile back button */}
          <div className="md:hidden flex items-center px-4 py-2 border-b border-gray-100">
            <button
              onClick={() => setShowList(true)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={16} /> Courses
            </button>
          </div>

          {/* Student: AI / Instructor tab switcher */}
          {role === 'STUDENT' && (
            <ChatTypeTabs active={chatType} onChange={setChatType} />
          )}

          {/* Instructor: pick a student then chat */}
          {role === 'INSTRUCTOR' ? (
            <div className="flex flex-1 min-h-0">
              <div className="w-52 flex-shrink-0">
                <InstructorStudentList
                  course={activeChat}
                  onSelect={setSelectedStudent}
                  selected={selectedStudent}
                />
              </div>
              <div className="flex-1 min-w-0">
                {selectedStudent ? (
                  <HumanChatPanel
                    course={activeChat}
                    otherUser={selectedStudent}
                    role={role}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                    <User size={32} className="opacity-25" />
                    <p className="text-sm">Select a student to start chatting</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Student: AI tab or Instructor tab
            <div className="flex-1 min-h-0">
              {chatType === 'ai' ? (
                <AIChatPanel key={`ai-${activeChat.courseId}`} course={activeChat} />
              ) : (
                <HumanChatPanel
                  key={`human-${activeChat.courseId}`}
                  course={activeChat}
                  otherUser={{
                    id: activeChat.instructorId,
                    name: activeChat.instructorName,
                    profileImage: activeChat.instructorProfileImage,
                  }}
                  role={role}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
