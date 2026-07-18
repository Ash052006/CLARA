import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])

  return count
}

export default function StatsCard({ icon: Icon, label, value, suffix = '', color, gradient, index = 0 }) {
  const [inView, setInView] = useState(false)
  const ref = useRef(null)
  const numericValue = parseInt(value) || 0
  const count = useCountUp(numericValue, 1800, inView)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const displayValue = isNaN(parseInt(value)) ? value : `${count}${suffix}`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
        style={{ background: gradient }}
      />

      <div className="relative glass rounded-2xl p-5 border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: gradient }}
          >
            <Icon size={18} className="text-white" />
          </div>
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: color }}
          />
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-black gradient-text">
            {displayValue}
          </div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}
