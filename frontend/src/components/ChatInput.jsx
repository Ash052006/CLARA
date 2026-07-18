import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, Paperclip } from 'lucide-react'

export default function ChatInput({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleInput = (e) => {
    onChange(e.target.value)
    // Auto-resize
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
    }
  }

  return (
    <div className="p-4 border-t border-white/[0.06]">
      <div
        className="flex items-end gap-3 rounded-2xl px-4 py-3 glass border border-white/[0.08] focus-within:border-purple-500/50 transition-all duration-300"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 mb-1 flex-shrink-0">
          <Paperclip size={16} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask CLARA anything... (Shift+Enter for new line)"
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 resize-none outline-none leading-relaxed"
          style={{ maxHeight: '160px', minHeight: '24px' }}
        />

        <div className="flex items-center gap-2 flex-shrink-0 mb-1">
          <button className="text-slate-500 hover:text-slate-300 transition-colors p-1">
            <Mic size={16} />
          </button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          >
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-600 mt-2">
        CLARA is in demo mode. Responses are simulated.
      </p>
    </div>
  )
}
