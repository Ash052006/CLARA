import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react'

export default function HeroSection({ onTryCLARA }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background orbs */}
      <div className="orb orb-purple w-[600px] h-[600px] -top-48 -left-48" />
      <div className="orb orb-blue w-[500px] h-[500px] -bottom-24 -right-24" />
      <div className="orb orb-purple w-[300px] h-[300px] top-1/2 right-1/4" style={{ opacity: 0.08 }} />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-sm text-purple-300 font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
          </span>
          AI-Powered Personal Assistant · Now Live
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight mb-4"
        >
          <span className="gradient-text">CLARA</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-xl sm:text-2xl font-semibold text-slate-300 tracking-wide">
            Personal AI Assistant
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          An AI-powered assistant capable of understanding natural language, planning tasks,
          remembering context, and executing actions through{' '}
          <span className="text-purple-400 font-medium">Gmail</span> and{' '}
          <span className="text-blue-400 font-medium">Google Calendar</span> integrations.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onTryCLARA}
            className="btn-primary flex items-center gap-2 text-base px-8 py-4"
          >
            <Sparkles size={18} />
            Try CLARA
            <ArrowRight size={16} />
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/about" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        {/* Tech pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {['FastAPI', 'MCP Architecture', 'Gmail API', 'Google Calendar', 'HuggingFace', 'Python'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium text-slate-400 rounded-full glass border border-white/[0.06]"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
