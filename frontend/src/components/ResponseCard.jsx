import { motion } from 'framer-motion'
import {
  Calendar, Mail, Search, Reply, CheckCircle2,
  Clock, MapPin, User, Tag
} from 'lucide-react'

const cardConfigs = {
  calendar: {
    icon: Calendar,
    label: 'Calendar MCP',
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-300',
  },
  email: {
    icon: Mail,
    label: 'Gmail MCP',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-300',
  },
  search: {
    icon: Search,
    label: 'Gmail MCP · Search',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-300',
  },
  reply: {
    icon: Reply,
    label: 'Gmail MCP · Reply',
    color: 'from-orange-500 to-amber-500',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-300',
  },
  success: {
    icon: CheckCircle2,
    label: 'Execution · Success',
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-300',
  },
}

export default function ResponseCard({ type = 'success', action, status = 'success', result, meta = [] }) {
  const config = cardConfigs[type] || cardConfigs.success
  const Icon = config.icon

  const statusColors = {
    success: 'text-green-400 bg-green-400/10',
    pending: 'text-yellow-400 bg-yellow-400/10',
    error: 'text-red-400 bg-red-400/10',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border ${config.borderColor} overflow-hidden`}
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Header */}
      <div className={`px-3 py-2 flex items-center justify-between ${config.bgColor} border-b ${config.borderColor}`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br ${config.color}`}>
            <Icon size={12} className="text-white" />
          </div>
          <span className={`text-[11px] font-semibold tracking-wide uppercase ${config.textColor}`}>
            {config.label}
          </span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        {action && (
          <p className="text-xs font-medium text-white mb-2">{action}</p>
        )}
        {result && (
          <p className="text-xs text-slate-400 leading-relaxed mb-2">{result}</p>
        )}
        {meta.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {meta.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                {item.icon && <item.icon size={11} className="text-slate-500" />}
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Pre-built card factories
export function CalendarEventCard({ event, status = 'success' }) {
  return (
    <ResponseCard
      type="calendar"
      action={`📅 ${event?.title || 'Meeting Scheduled'}`}
      status={status}
      result={event?.description || 'Event successfully added to your Google Calendar.'}
      meta={[
        { icon: Clock, value: event?.time || 'Tomorrow at 5:00 PM' },
        { icon: MapPin, value: event?.location || 'Google Meet' },
      ]}
    />
  )
}

export function EmailActionCard({ subject, to, status = 'success' }) {
  return (
    <ResponseCard
      type="email"
      action={`✉️ Email Sent`}
      status={status}
      result={`"${subject || 'Demo'}" sent successfully.`}
      meta={[
        { icon: User, value: to || 'test@gmail.com' },
        { icon: Tag, value: subject || 'Demo' },
      ]}
    />
  )
}

export function InboxSearchCard({ query, count = 3, status = 'success' }) {
  return (
    <ResponseCard
      type="search"
      action={`🔍 Inbox Search`}
      status={status}
      result={`Found ${count} email${count !== 1 ? 's' : ''} matching "${query || 'your query'}".`}
      meta={[
        { icon: Search, value: `${count} results` },
        { icon: Tag, value: query || 'recruiter' },
      ]}
    />
  )
}

export function ReplySentCard({ to, status = 'success' }) {
  return (
    <ResponseCard
      type="reply"
      action={`↩️ Reply Sent`}
      status={status}
      result={`Successfully replied to the latest email from ${to || 'sender'}.`}
      meta={[
        { icon: User, value: to || 'sender@gmail.com' },
        { icon: CheckCircle2, value: 'Delivered' },
      ]}
    />
  )
}
