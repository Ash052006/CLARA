import { motion } from 'framer-motion'
import { CheckCircle2, Clock, MapPin } from 'lucide-react'

const phaseConfig = {
  completed: {
    label: 'Completed',
    dot: 'bg-green-500',
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    lineColor: 'from-green-500 to-transparent',
    icon: '✓',
  },
  current: {
    label: 'In Progress',
    dot: 'bg-blue-500 animate-pulse',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    lineColor: 'from-blue-500 to-transparent',
    icon: '🔄',
  },
  planned: {
    label: 'Planned',
    dot: 'bg-slate-500',
    border: 'border-white/[0.06]',
    bg: 'bg-white/[0.02]',
    text: 'text-slate-400',
    lineColor: 'from-slate-500 to-transparent',
    icon: '📌',
  },
}

export default function RoadmapCard({ phase, title, status = 'planned', items = [], index = 0, isLast = false }) {
  const config = phaseConfig[status] || phaseConfig.planned

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-6"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-10 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent" />
      )}

      {/* Dot */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${config.dot === 'bg-green-500' ? 'border-green-500 bg-green-500/20' : config.dot.includes('blue') ? 'border-blue-500 bg-blue-500/20' : 'border-slate-600 bg-slate-800'}`}>
          <span className="text-sm">{config.icon}</span>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 mb-8 glass rounded-2xl p-5 border ${config.border} group hover:border-white/[0.12] transition-all duration-300`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">{phase}</span>
            <h3 className="text-base font-semibold text-white mt-0.5">{title}</h3>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.text} border ${config.border}`}>
            {config.label}
          </span>
        </div>

        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-sm flex-shrink-0">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
