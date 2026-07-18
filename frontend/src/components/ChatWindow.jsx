import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 min-h-0">
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center h-full text-center py-16"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #7c3aed22, #2563eb22)', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-slate-300 font-semibold text-lg mb-2">Start a conversation</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Try clicking one of the demo commands below, or type your own message.
          </p>
        </motion.div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  )
}
