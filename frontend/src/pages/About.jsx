import { motion } from 'framer-motion'
import {
  Calendar, Mail, Brain, Cpu, MessageSquare, Target,
  CheckCircle2, Zap, Globe, Smartphone, Mic, FolderOpen,
  Sparkles, GitBranch, Server, Database, Code2, Layers,
  Shield, Clock, ArrowRight
} from 'lucide-react'

import ArchitectureDiagram from '../components/ArchitectureDiagram'
import TechCard from '../components/TechCard'
import RoadmapCard from '../components/RoadmapCard'
import ProjectStatus from '../components/ProjectStatus'
import Footer from '../components/Footer'

// ── Why CLARA ──────────────────────────────────────────────────────────────────
const whyItems = [
  { icon: MessageSquare, text: 'Understand requests in plain language', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { icon: Target, text: 'Generate multi-step execution plans', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: Zap, text: 'Execute actions on real services', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { icon: Globe, text: 'Integrate with Gmail & Google Calendar', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { icon: Database, text: 'Remember preferences and context', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { icon: Layers, text: 'Scale through MCP architecture', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
]

// ── MCP Nodes ─────────────────────────────────────────────────────────────────
const currentMCPs = [
  {
    icon: Calendar,
    name: 'Calendar MCP',
    status: 'Live',
    gradient: 'from-purple-600 to-violet-600',
    borderColor: 'border-purple-500/40',
    statusColor: 'text-green-400 bg-green-400/10',
    features: ['Create Events', 'Read Events', 'Update Events', 'Delete Events'],
  },
  {
    icon: Mail,
    name: 'Gmail MCP',
    status: 'Live',
    gradient: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/40',
    statusColor: 'text-green-400 bg-green-400/10',
    features: ['Send Email', 'Read Inbox', 'Search Emails', 'Reply To Emails'],
  },
]

const futureMCPs = [
  { icon: MessageSquare, name: 'WhatsApp MCP', description: 'Send and receive WhatsApp messages autonomously.', gradient: 'from-green-600 to-emerald-600' },
  { icon: Globe, name: 'Telegram MCP', description: 'Full Telegram bot integration via MCP protocol.', gradient: 'from-sky-600 to-blue-600' },
  { icon: FolderOpen, name: 'File MCP', description: 'Read, write, and manage local and cloud files.', gradient: 'from-amber-600 to-orange-600' },
  { icon: Mic, name: 'Voice MCP', description: 'Voice input and text-to-speech response capabilities.', gradient: 'from-rose-600 to-pink-600' },
]

// ── Tech Stack ────────────────────────────────────────────────────────────────
const techStack = [
  {
    category: 'Frontend',
    items: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  },
  {
    category: 'Backend',
    items: ['FastAPI', 'Python 3.11', 'Pydantic', 'Uvicorn'],
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  },
  {
    category: 'AI & NLP',
    items: ['HuggingFace Transformers', 'DistilBART MNLI', 'Zero-shot Classification'],
    gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)',
  },
  {
    category: 'Integrations',
    items: ['Google Calendar API', 'Gmail API', 'Google OAuth 2.0'],
    gradient: 'linear-gradient(135deg, #059669, #047857)',
  },
  {
    category: 'Architecture',
    items: ['Model Context Protocol (MCP)', 'MCP Registry', 'Tool-based Execution'],
    gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
  },
]

// ── Current Features ──────────────────────────────────────────────────────────
const currentFeatures = [
  {
    title: 'Calendar MCP',
    icon: Calendar,
    gradient: 'from-purple-600 to-violet-600',
    items: ['Create Events', 'Read Events', 'Update Events', 'Delete Events'],
  },
  {
    title: 'Gmail MCP',
    icon: Mail,
    gradient: 'from-blue-600 to-cyan-600',
    items: ['Send Email', 'Read Inbox', 'Search Emails', 'Reply To Emails'],
  },
  {
    title: 'Core AI',
    icon: Brain,
    gradient: 'from-violet-600 to-indigo-600',
    items: ['Intent Detection', 'Entity Extraction', 'Planning Engine', 'Memory System', 'Tool Execution'],
  },
]

// ── Roadmap ───────────────────────────────────────────────────────────────────
const roadmap = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'completed',
    items: [
      { icon: '✓', text: 'Calendar Integration' },
      { icon: '✓', text: 'Gmail Integration' },
      { icon: '✓', text: 'Email Search' },
      { icon: '✓', text: 'Email Reply' },
      { icon: '✓', text: 'Memory System' },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Frontend & Deployment',
    status: 'current',
    items: [
      { icon: '🔄', text: 'Frontend Development' },
      { icon: '🔄', text: 'Production Deployment' },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Intelligence Upgrade',
    status: 'planned',
    items: [
      { icon: '📌', text: 'Gemini Integration' },
      { icon: '📌', text: 'Smarter Memory' },
      { icon: '📌', text: 'Contact Management' },
      { icon: '📌', text: 'File Handling' },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Platform Expansion',
    status: 'planned',
    items: [
      { icon: '📌', text: 'WhatsApp Integration' },
      { icon: '📌', text: 'Telegram Integration' },
      { icon: '📌', text: 'Voice Assistant' },
      { icon: '📌', text: 'Mobile App' },
    ],
  },
]

// ── Metrics ───────────────────────────────────────────────────────────────────
const metrics = [
  { icon: Server, value: '2', label: 'MCP Servers', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { icon: Zap, value: '8+', label: 'Supported Actions', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: Calendar, value: '✓', label: 'Google Calendar', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { icon: Mail, value: '✓', label: 'Gmail Connected', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { icon: Database, value: '✓', label: 'Memory Enabled', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { icon: Brain, value: '✓', label: 'AI Planner Active', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
]

const highlights = [
  { icon: Layers, text: 'MCP Architecture' },
  { icon: Calendar, text: 'Calendar Automation' },
  { icon: Mail, text: 'Gmail Automation' },
  { icon: Database, text: 'Memory System' },
  { icon: GitBranch, text: 'Extensible Design' },
  { icon: Brain, text: 'AI Planning' },
]

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ badge, title, highlight, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      {badge && (
        <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
        {title}{highlight && <> <span className="gradient-text">{highlight}</span></>}
      </h2>
      {description && <p className="text-slate-400 max-w-2xl mx-auto">{description}</p>}
    </motion.div>
  )
}

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      {/* ── About Hero ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="orb orb-purple w-[500px] h-[500px] -top-32 -left-32" />
        <div className="orb orb-blue w-[400px] h-[400px] -bottom-20 -right-20" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-sm text-purple-300 font-medium mb-8"
          >
            <Sparkles size={14} />
            About the Project
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black gradient-text mb-4"
          >
            CLARA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 font-medium mb-6"
          >
            Contextual Language Assistant & Resource Automation
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            CLARA is a modular AI assistant built using{' '}
            <span className="text-purple-400 font-medium">FastAPI</span>,{' '}
            <span className="text-blue-400 font-medium">MCP architecture</span>,{' '}
            <span className="text-emerald-400 font-medium">Gmail API</span>,{' '}
            <span className="text-cyan-400 font-medium">Google Calendar API</span>, and{' '}
            <span className="text-violet-400 font-medium">HuggingFace Transformers</span>.
          </motion.p>
        </div>
      </section>

      {/* ── Why CLARA ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Differentiator" title="Why" highlight="CLARA?" description="Most assistants only answer questions. CLARA goes further." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left: contrast card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-red-500/20"
            >
              <h3 className="text-base font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Other Assistants
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Most AI assistants simply <span className="text-red-400 font-medium">answer questions</span> — they have no ability to interact with external services, execute real actions, or maintain persistent context about you.
              </p>
            </motion.div>

            {/* Right: CLARA card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-purple-500/30"
              style={{ boxShadow: '0 0 30px rgba(124,58,237,0.1)' }}
            >
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                CLARA Can
              </h3>
              <div className="space-y-2">
                {whyItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.text} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm ${item.color} ${item.bg}`}>
                      <Icon size={14} className="flex-shrink-0" />
                      <span className="text-slate-300">{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Architecture Diagram ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="Architecture"
            title="How CLARA"
            highlight="Works"
            description="An interactive view of CLARA's processing pipeline. Click any node to explore."
          />
          <ArchitectureDiagram />
        </div>
      </section>

      {/* ── MCP Architecture ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="MCP"
            title="MCP Powered"
            highlight="Architecture"
            description="CLARA uses Model Context Protocol servers to interact with external services in a modular, extensible way."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Current MCPs — Live
              </p>
              <div className="space-y-4">
                {currentMCPs.map((mcp) => {
                  const Icon = mcp.icon
                  return (
                    <motion.div
                      key={mcp.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -2 }}
                      className={`glass rounded-2xl p-5 border ${mcp.borderColor} transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${mcp.gradient} flex items-center justify-center`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <span className="font-semibold text-white text-sm">{mcp.name}</span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${mcp.statusColor}`}>
                          {mcp.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {mcp.features.map((f) => (
                          <div key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                            <CheckCircle2 size={11} className="text-green-400 flex-shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4 flex items-center gap-2">
                <Clock size={12} />
                Future MCPs — Coming Soon
              </p>
              <div className="space-y-3">
                {futureMCPs.map((mcp, i) => {
                  const Icon = mcp.icon
                  return (
                    <motion.div
                      key={mcp.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -2 }}
                      className="glass rounded-xl p-4 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex items-center gap-3 group"
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${mcp.gradient} flex items-center justify-center flex-shrink-0 opacity-60`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-300">{mcp.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{mcp.description}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-800 border border-slate-700 px-2 py-1 rounded-full flex-shrink-0">
                        Soon
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Current Features ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Features" title="Current" highlight="Features" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentFeatures.map((feat, i) => {
              const Icon = feat.icon
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-white">{feat.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Stack" title="Technology" highlight="Stack" description="Built with modern, production-grade technologies." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {techStack.map((t, i) => (
              <TechCard key={t.category} {...t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Numbers" title="Project" highlight="Metrics" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((m, i) => {
              const Icon = m.icon
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className={`glass rounded-xl p-4 border text-center ${m.bg} transition-all duration-300`}
                >
                  <div className={`text-2xl font-black mb-1 ${m.color}`}>{m.value}</div>
                  <div className={`text-[11px] font-medium ${m.color} opacity-80`}>{m.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Project Status ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader badge="Progress" title="Project" highlight="Status" />
          <ProjectStatus />
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader badge="Roadmap" title="Development" highlight="Timeline" description="Phased approach to building a full-featured AI assistant." />
          <div>
            {roadmap.map((phase, i) => (
              <RoadmapCard
                key={phase.phase}
                {...phase}
                index={i}
                isLast={i === roadmap.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Future Integrations ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Roadmap" title="Future" highlight="Integrations" description="Upcoming capabilities that will extend CLARA's reach." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: MessageSquare, name: 'WhatsApp', description: 'Send, receive and automate WhatsApp messages through CLARA.', gradient: 'from-green-500 to-emerald-500' },
              { icon: Globe, name: 'Telegram', description: 'Full Telegram integration with bot creation and management.', gradient: 'from-sky-500 to-blue-500' },
              { icon: Mic, name: 'Voice Assistant', description: 'Speak directly to CLARA with full voice input/output support.', gradient: 'from-violet-500 to-purple-500' },
              { icon: FolderOpen, name: 'File Manager', description: 'Read, write, organize and search local and cloud files.', gradient: 'from-amber-500 to-orange-500' },
              { icon: Sparkles, name: 'Gemini Brain', description: 'Upgrade CLARA\'s intelligence with Google Gemini Pro integration.', gradient: 'from-rose-500 to-pink-500' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="relative glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center opacity-90`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 border border-slate-700 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{item.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>

                  {/* Subtle gradient on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl bg-gradient-to-br ${item.gradient}`}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative glass rounded-3xl p-10 sm:p-14 border border-purple-500/20 text-center overflow-hidden"
            style={{ boxShadow: '0 0 60px rgba(124,58,237,0.15)' }}
          >
            <div className="orb orb-purple w-64 h-64 -top-16 -left-16 opacity-20" />
            <div className="orb orb-blue w-48 h-48 -bottom-12 -right-12 opacity-15" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300 font-medium mb-6">
                <Sparkles size={14} />
                Our Vision
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                Building the Future of
                <span className="gradient-text block mt-1">AI Assistance</span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Our vision is to build a modular AI assistant capable of interacting with multiple
                services through MCP tools while maintaining{' '}
                <span className="text-purple-400 font-semibold">memory</span>,{' '}
                <span className="text-blue-400 font-semibold">context</span>, and{' '}
                <span className="text-cyan-400 font-semibold">natural language understanding</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Project Highlights ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Summary" title="Project" highlight="Highlights" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {highlights.map((h, i) => {
              const Icon = h.icon
              return (
                <motion.div
                  key={h.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4, scale: 1.04 }}
                  className="glass rounded-xl p-4 border border-white/[0.06] hover:border-purple-500/30 text-center transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #7c3aed22, #2563eb22)', border: '1px solid rgba(124,58,237,0.3)' }}
                  >
                    <Icon size={16} className="text-purple-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-400">{h.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
