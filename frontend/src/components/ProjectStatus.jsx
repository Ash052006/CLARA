import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const progressItems = [
  { label: 'Calendar MCP', value: 100, color: 'from-green-500 to-emerald-400' },
  { label: 'Gmail MCP', value: 100, color: 'from-green-500 to-emerald-400' },
  { label: 'Core Brain', value: 90, color: 'from-violet-500 to-purple-400' },
  { label: 'Memory System', value: 70, color: 'from-blue-500 to-cyan-400' },
  { label: 'Frontend', value: 75, color: 'from-indigo-500 to-violet-400', label2: 'In Progress' },
  { label: 'Deployment', value: 20, color: 'from-slate-500 to-slate-400', label2: 'Planned' },
  { label: 'Overall MVP', value: 85, color: 'from-purple-500 via-violet-500 to-blue-500', bold: true },
]

function ProgressBar({ item, inView, index }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${item.bold ? 'text-white' : 'text-slate-300'}`}>
          {item.label}
        </span>
        <div className="flex items-center gap-2">
          {item.label2 && (
            <span className="text-[10px] text-slate-500 italic">{item.label2}</span>
          )}
          <span className={`text-sm font-bold ${item.bold ? 'gradient-text' : 'text-slate-400'}`}>
            {item.value}%
          </span>
        </div>
      </div>
      <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${item.color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${item.value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Shimmer */}
        <motion.div
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={inView ? { x: ['−100%', '300%'] } : {}}
          transition={{ duration: 1.5, delay: index * 0.12 + 1, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

export default function ProjectStatus() {
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Project Status</h3>
          <p className="text-sm text-slate-500 mt-0.5">Development progress overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-purple-300 font-medium">Active Development</span>
        </div>
      </div>

      <div className="space-y-4">
        {progressItems.map((item, i) => (
          <div key={item.label} className={item.bold ? 'pt-3 border-t border-white/[0.06]' : ''}>
            <ProgressBar item={item} inView={inView} index={i} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}
