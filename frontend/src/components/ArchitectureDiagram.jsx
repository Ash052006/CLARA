import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, MessageSquare, Database, Cpu, Calendar, Mail, ArrowDown, ChevronRight, Zap } from 'lucide-react'

const nodes = [
  {
    id: 'user',
    label: 'User Message',
    icon: MessageSquare,
    gradient: 'from-slate-600 to-slate-500',
    description: 'Natural language input from the user',
    level: 0,
  },
  {
    id: 'brain',
    label: 'CLARA Brain',
    icon: Brain,
    gradient: 'from-violet-600 to-purple-500',
    description: 'Core processing engine',
    level: 1,
    children: ['intent', 'entity', 'memory', 'planning'],
  },
  {
    id: 'mcp',
    label: 'MCP Registry',
    icon: Cpu,
    gradient: 'from-blue-600 to-cyan-500',
    description: 'Model Context Protocol router',
    level: 2,
    children: ['calendar-mcp', 'gmail-mcp'],
  },
  {
    id: 'execution',
    label: 'Execution Layer',
    icon: Zap,
    gradient: 'from-emerald-600 to-teal-500',
    description: 'Executes tool actions on external services',
    level: 3,
  },
  {
    id: 'response',
    label: 'Response',
    icon: MessageSquare,
    gradient: 'from-indigo-600 to-violet-500',
    description: 'Formatted response returned to user',
    level: 4,
  },
]

const brainModules = [
  { label: 'Intent Detection', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { label: 'Entity Extraction', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { label: 'Memory System', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Planning Engine', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
]

const mcpNodes = [
  { label: 'Calendar MCP', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { label: 'Gmail MCP', icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
]

function FlowArrow() {
  return (
    <div className="flex justify-center my-2">
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-slate-600"
      >
        <ArrowDown size={20} />
      </motion.div>
    </div>
  )
}

function FlowNode({ label, icon: Icon, gradient, description, active, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="relative cursor-pointer"
    >
      <div
        className={`glass rounded-xl px-5 py-3.5 border transition-all duration-300 flex items-center gap-3 ${
          active ? 'border-purple-500/50 shadow-lg' : 'border-white/[0.08] hover:border-white/[0.15]'
        }`}
        style={active ? { boxShadow: '0 0 20px rgba(124,58,237,0.3)' } : {}}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradient} flex-shrink-0`}>
          <Icon size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{label}</p>
          {active && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-slate-400 mt-0.5"
            >
              {description}
            </motion.p>
          )}
        </div>
        <ChevronRight size={14} className={`text-slate-500 transition-transform ${active ? 'rotate-90' : ''}`} />
      </div>
    </motion.div>
  )
}

export default function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState('brain')

  const toggle = (id) => setActiveNode(activeNode === id ? null : id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto"
    >
      <div className="space-y-0">
        {/* User Message */}
        <FlowNode
          label="User Message"
          icon={MessageSquare}
          gradient="from-slate-600 to-slate-500"
          description="Natural language input from the user"
          active={activeNode === 'user'}
          onClick={() => toggle('user')}
          index={0}
        />

        <FlowArrow />

        {/* CLARA Brain */}
        <div>
          <FlowNode
            label="CLARA Brain"
            icon={Brain}
            gradient="from-violet-600 to-purple-500"
            description="Core processing and orchestration engine"
            active={activeNode === 'brain'}
            onClick={() => toggle('brain')}
            index={1}
          />
          <AnimatePresence>
            {activeNode === 'brain' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-6 mt-2 mb-2 pl-4 border-l border-purple-500/30 space-y-1.5"
              >
                {brainModules.map((mod) => (
                  <motion.div
                    key={mod.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${mod.color} ${mod.bg}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-current" />
                    {mod.label}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <FlowArrow />

        {/* MCP Registry */}
        <div>
          <FlowNode
            label="MCP Registry"
            icon={Cpu}
            gradient="from-blue-600 to-cyan-500"
            description="Routes actions to the correct MCP server"
            active={activeNode === 'mcp'}
            onClick={() => toggle('mcp')}
            index={2}
          />
          <AnimatePresence>
            {activeNode === 'mcp' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-6 mt-2 mb-2 pl-4 border-l border-blue-500/30 space-y-1.5"
              >
                {mcpNodes.map((mcp) => {
                  const MIcon = mcp.icon
                  return (
                    <motion.div
                      key={mcp.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${mcp.color} ${mcp.bg}`}
                    >
                      <MIcon size={12} />
                      {mcp.label}
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <FlowArrow />

        {/* Execution Layer */}
        <FlowNode
          label="Execution Layer"
          icon={Zap}
          gradient="from-emerald-600 to-teal-500"
          description="Calls Gmail API and Google Calendar API"
          active={activeNode === 'execution'}
          onClick={() => toggle('execution')}
          index={3}
        />

        <FlowArrow />

        {/* Response */}
        <FlowNode
          label="Response"
          icon={MessageSquare}
          gradient="from-indigo-600 to-violet-500"
          description="Structured response delivered to the user"
          active={activeNode === 'response'}
          onClick={() => toggle('response')}
          index={4}
        />
      </div>

      <p className="text-center text-xs text-slate-600 mt-4">
        Click any node to expand details
      </p>
    </motion.div>
  )
}
