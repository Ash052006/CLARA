import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

const BOT_AVATAR = (
  <div
    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
    style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
  >
    <Zap size={14} className="text-white" />
  </div>
)

const USER_AVATAR = (
  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-700 border border-slate-600 text-sm font-bold text-slate-200">
    U
  </div>
)

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex gap-3 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } items-end`}
    >
      {isUser ? USER_AVATAR : BOT_AVATAR}

      <div
        className={`max-w-[75%] ${
          isUser ? 'items-end' : 'items-start'
        } flex flex-col gap-1`}
      >
        <span
          className={`text-[10px] font-medium tracking-wide ${
            isUser
              ? 'text-right text-slate-500'
              : 'text-slate-500'
          }`}
        >
          {isUser ? 'You' : 'CLARA'}
        </span>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'rounded-br-sm text-white'
              : 'glass border border-white/[0.06] rounded-bl-sm text-slate-200'
          }`}
          style={
            isUser
              ? {
                  background:
                    'linear-gradient(135deg, #7c3aed, #2563eb)',
                }
              : {}
          }
        >
          {message.content}

          {/* Email List Card */}
          {message.card?.type === 'emails' && (
            <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3">
              <h3 className="font-semibold text-purple-400 mb-3">
                📬 Latest Emails
              </h3>

              <div className="space-y-2">
                {message.card.emails.map((email, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-700 pb-2 last:border-b-0"
                  >
                    <p className="text-xs font-medium text-slate-200">
                      {email.from || 'Unknown Sender'}
                    </p>

                    <p className="text-xs text-slate-400">
                      {email.subject || 'No Subject'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Sent Card */}
          {message.card?.type === 'email_sent' && (
            <div className="mt-3 rounded-xl border border-green-700 bg-green-900/20 p-3">
              <h3 className="font-semibold text-green-400 mb-2">
                📧 Email Sent
              </h3>

              <p className="text-xs text-slate-300">
                To: {message.card.recipient || 'Unknown'}
              </p>

              <p className="text-xs text-slate-400">
                Subject: {message.card.subject || 'No Subject'}
              </p>
            </div>
          )}

          {/* Reply Sent Card */}
          {message.card?.type === 'reply_sent' && (
            <div className="mt-3 rounded-xl border border-cyan-700 bg-cyan-900/20 p-3">
              <h3 className="font-semibold text-cyan-400 mb-2">
                📨 Reply Sent
              </h3>

              <p className="text-xs text-slate-300">
                To: {message.card.recipient || 'Unknown'}
              </p>

              <p className="text-xs text-slate-400">
                Subject: {message.card.subject || 'No Subject'}
              </p>
            </div>
          )}

          {/* Calendar Event Card */}
          {message.card?.type === 'calendar_event' && (
            <div className="mt-3 rounded-xl border border-purple-700 bg-purple-900/20 p-3">
              <h3 className="font-semibold text-purple-400 mb-2">
                📅 Calendar Event
              </h3>

              <p className="text-xs text-slate-300">
                {message.card.message}
              </p>

              {message.card.time && (
                <p className="text-xs text-slate-400 mt-1">
                  {message.card.time}
                </p>
              )}
            </div>
          )}

          {/* Events List Card */}
          {message.card?.type === 'events' && (
            <div className="mt-3 rounded-xl border border-blue-700 bg-blue-900/20 p-3">
              <h3 className="font-semibold text-blue-400 mb-2">
                📆 Upcoming Events
              </h3>

              {message.card.events.map((event, index) => (
                <div
                  key={index}
                  className="border-b border-slate-700 pb-2 mb-2 last:border-b-0"
                >
                  <p className="text-xs text-slate-200">
                    {event.title}
                  </p>

                  <p className="text-xs text-slate-400">
                    {event.start}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="text-[10px] text-slate-600">
          {message.time ||
            new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
        </span>
      </div>
    </motion.div>
  )
}