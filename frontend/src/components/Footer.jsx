import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Github, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-1/4 w-96 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-xl font-black gradient-text tracking-wider">CLARA</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Contextual Language Assistant & Resource Automation
            </p>
            <p className="text-xs text-slate-600">
              An AI-powered modular assistant with Gmail and Google Calendar integrations.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'About CLARA', path: '/about' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Built With */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'FastAPI', 'MCP', 'Gmail API', 'Google Calendar API', 'HuggingFace'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-[11px] text-slate-400 rounded-md glass border border-white/[0.06]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2024 CLARA · Contextual Language Assistant & Resource Automation
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Built with</span>
            <Heart size={11} className="text-red-500 fill-red-500 mx-1" />
            <span>using React · FastAPI · MCP · Gmail API · Google Calendar API</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
