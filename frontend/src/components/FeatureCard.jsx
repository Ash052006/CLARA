import { motion } from 'framer-motion'

export default function FeatureCard({ icon: Icon, title, description, gradient, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="relative group cursor-default"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: gradient, transform: 'scale(0.85)' }}
      />

      <div className="relative glass rounded-2xl p-6 border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-300 h-full">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: gradient }}
        >
          <Icon size={22} className="text-white" />
        </div>

        {/* Text */}
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: gradient }}
        />
      </div>
    </motion.div>
  )
}
