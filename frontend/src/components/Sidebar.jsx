import { motion } from 'framer-motion'
import {
  Calendar, Mail, Brain, Cpu, Activity,
  Clock, CheckCircle, AlertCircle, Zap,
  MessageSquare, Search, Reply
} from 'lucide-react'

const statusDot = (color) => (
  <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
)

const quickActions = [
  { icon: Calendar, label: 'Schedule Event', cmd: 'Schedule a meeting tomorrow at 5PM', color: 'text-purple-400' },
  { icon: Mail, label: 'Check Inbox', cmd: 'Show my latest emails', color: 'text-blue-400' },
  { icon: Search, label: 'Search Emails', cmd: 'Find emails from recruiter', color: 'text-emerald-400' },
  { icon: Reply, label: 'Reply Email', cmd: 'Reply to latest email saying thank you', color: 'text-orange-400' },
]

const recentActivity = [
  { icon: Calendar, text: 'Event created: Team Sync', time: '2m ago', color: 'text-purple-400' },
  { icon: Mail, text: 'Email sent to test@gmail.com', time: '5m ago', color: 'text-blue-400' },
  { icon: Search, text: 'Searched: recruiter emails', time: '8m ago', color: 'text-emerald-400' },
  { icon: Brain, text: 'Memory updated', time: '12m ago', color: 'text-yellow-400' },
]

export default function Sidebar({ onCommandClick }) {
  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="hidden lg:flex flex-col w-64 xl:w-72 glass border-r border-white/[0.06] overflow-y-auto flex-shrink-0"
    >
      <div className="p-4 space-y-5">
        {/* Project Status */}
        <div>
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3 px-1">
            Project Status
          </h3>
          <div className="glass rounded-xl p-3 space-y-2">
            {[
              { label: 'Calendar MCP', status: 'online', color: 'bg-green-400' },
              { label: 'Gmail MCP', status: 'online', color: 'bg-green-400' },
              { label: 'Core Brain', status: 'active', color: 'bg-blue-400' },
              { label: 'Memory System', status: 'active', color: 'bg-yellow-400' },
              { label: 'Backend API', status: 'demo', color: 'bg-orange-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.color} ${item.status === 'online' ? 'animate-pulse' : ''}`} />
                  <span className="text-[10px] text-slate-500 capitalize">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3 px-1">
            Quick Actions
          </h3>
          <div className="space-y-1.5">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCommandClick(action.cmd)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left glass border border-white/[0.04] hover:border-purple-500/30 transition-all duration-200 group"
                >
                  <Icon size={14} className={`${action.color} flex-shrink-0`} />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Demo Commands */}
        <div>
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3 px-1">
            Demo Commands
          </h3>
          <div className="space-y-1.5">
            {[
              'What events do I have tomorrow',
              'Send email to test@gmail.com subject Demo saying Hello',
              'Find emails from recruiter',
            ].map((cmd) => (
              <motion.button
                key={cmd}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCommandClick(cmd)}
                className="w-full px-3 py-2 rounded-lg text-left text-[11px] text-slate-500 hover:text-slate-300 glass border border-white/[0.03] hover:border-purple-500/20 transition-all duration-200 leading-snug"
              >
                "{cmd}"
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3 px-1">
            Recent Activity
          </h3>
          <div className="space-y-2">
            {recentActivity.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-2.5 px-1">
                  <div className={`mt-0.5 flex-shrink-0 ${item.color}`}>
                    <Icon size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-400 leading-snug truncate">{item.text}</p>
                    <p className="text-[10px] text-slate-600">{item.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Version Badge */}
        <div className="pt-2 border-t border-white/[0.04]">
          <div className="glass rounded-lg px-3 py-2 text-center">
            <p className="text-[10px] text-slate-600">CLARA v1.0 · Demo Mode</p>
            <p className="text-[10px] text-slate-700 mt-0.5">Backend: Not Connected</p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
