import { motion } from 'framer-motion'

export default function TechCard({ category, items, gradient, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.09 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative group glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Category header */}
      <div className="mb-4">
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ background: gradient + '22', color: '#a78bfa', border: `1px solid rgba(124,58,237,0.3)` }}
        >
          {category}
        </span>
      </div>

      {/* Tech items */}
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.09 + i * 0.05 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: gradient.includes(',') ? gradient.split(',')[0].replace('linear-gradient(135deg, ', '') : '#7c3aed' }} />
            <span className="text-sm font-medium text-slate-300">{item}</span>
          </motion.div>
        ))}
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: gradient }}
      />
    </motion.div>
  )
}
