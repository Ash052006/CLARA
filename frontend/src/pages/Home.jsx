import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar, Mail, Brain, Cpu, BookOpen,
  Sparkles, BarChart3, Clock, Search, Reply,
  CheckCircle, Zap, Target, Activity
} from 'lucide-react'

import HeroSection from '../components/HeroSection'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import FeatureCard from '../components/FeatureCard'
import StatsCard from '../components/StatsCard'
import Footer from '../components/Footer'
import ResponseCard, {
  CalendarEventCard,
  EmailActionCard,
  InboxSearchCard,
  ReplySentCard,
} from '../components/ResponseCard'
import { sendToCLARA } from '../services/api'
import { sendVoiceMessage } from "../services/voice";

import { buildAssistantMessage } from "../utils/messageBuilder";
// Demo responses


const features = [
  {
    icon: Calendar,
    title: 'Calendar Management',
    description: 'Create, update, delete and view calendar events with natural language commands.',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  },
  {
    icon: Mail,
    title: 'Email Automation',
    description: 'Send, search, read and reply to emails effortlessly through Gmail integration.',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  },
  {
    icon: Brain,
    title: 'Memory System',
    description: 'Stores your preferences and contextual information for personalised responses.',
    gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)',
  },
  {
    icon: Cpu,
    title: 'MCP Architecture',
    description: 'Extensible tool-based execution using Model Context Protocol servers.',
    gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
  },
  {
    icon: BookOpen,
    title: 'Natural Language Understanding',
    description: 'Interpret and understand user requests expressed in plain everyday English.',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
  },
  {
    icon: Target,
    title: 'Task Planning',
    description: 'Automatically generates multi-step execution plans for complex requests.',
    gradient: 'linear-gradient(135deg, #d97706, #b45309)',
  },
]

const statsData = [
  { icon: Calendar, label: 'Events Created', value: '24', color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)' },
  { icon: Mail, label: 'Emails Sent', value: '18', color: '#2563eb', gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
  { icon: Search, label: 'Emails Searched', value: '47', color: '#0891b2', gradient: 'linear-gradient(135deg, #0891b2, #0e7490)' },
  { icon: Reply, label: 'Replies Sent', value: '12', color: '#059669', gradient: 'linear-gradient(135deg, #059669, #047857)' },
  { icon: Zap, label: 'Available MCP Tools', value: '8', suffix: '+', color: '#d97706', gradient: 'linear-gradient(135deg, #d97706, #b45309)' },
  { icon: Activity, label: 'Connected Services', value: '2', color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)' },
]

const demoCommands = [
  { text: 'Schedule a meeting tomorrow at 5PM', icon: Calendar, color: 'text-purple-400' },
  { text: 'What events do I have tomorrow', icon: Calendar, color: 'text-violet-400' },
  { text: 'Send email to test@gmail.com subject Demo saying Hello', icon: Mail, color: 'text-blue-400' },
  { text: 'Show my latest emails', icon: Mail, color: 'text-cyan-400' },
  { text: 'Find emails from recruiter', icon: Search, color: 'text-emerald-400' },
  { text: 'Reply to latest email saying thank you', icon: Reply, color: 'text-orange-400' },
]

let msgIdCounter = 1

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef(null)

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

    const userMsg = {
      id: msgIdCounter++,
      role: 'user',
      content: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }



    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Simulate backend delay
   let assistantMsg;

    try {

        const result = await sendToCLARA(trimmed);

        console.log(result);

        assistantMsg = buildAssistantMessage(result);

    } catch (error) {

        console.error(error);

        assistantMsg = {
            id: msgIdCounter++,
            role: "assistant",
            content: "Backend connection failed.",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    }

    setMessages((prev) => [...prev, assistantMsg])
    setLoading(false)
  }, [input, loading])

  const handleVoice = async (audioBlob) => {
    setLoading(true);

    try {
      const result = await sendVoiceMessage(audioBlob);

      console.log("VOICE RESPONSE:", result);

      // User message
      const userMsg = {
        id: msgIdCounter++,
        role: "user",
        content: result.transcript,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Process assistant response
      const assistantMsg = buildAssistantMessage(result.response);

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommandClick = (cmd) => {
    setInput(cmd)
    scrollToChat()
    setTimeout(() => sendMessage(cmd), 100)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection onTryCLARA={scrollToChat} />

      {/* Chat Interface */}
      <section ref={chatRef} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Talk to <span className="gradient-text">CLARA</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Try the live demo below. Click any command card or type your own message.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex h-[600px] rounded-2xl overflow-hidden glass border border-white/[0.08]"
            style={{ boxShadow: '0 0 60px rgba(124,58,237,0.12)' }}
          >
            <Sidebar onCommandClick={handleCommandClick} />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] glass flex-shrink-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                  <Zap size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">CLARA</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] text-slate-500">Demo Mode Active</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    v1.0
                  </span>
                </div>
              </div>

              <ChatWindow messages={messages} />
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={() => sendMessage()}
                onVoiceRecorded={handleVoice}
                disabled={loading}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Mode */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Try <span className="gradient-text">CLARA</span>
            </h2>
            <p className="text-slate-400">Click any command to instantly try it in the chat above.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoCommands.map((cmd, i) => {
              const Icon = cmd.icon
              return (
                <motion.button
                  key={cmd.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCommandClick(cmd.text)}
                  className="text-left glass rounded-2xl p-5 border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center glass border border-white/[0.08] flex-shrink-0 group-hover:border-purple-500/30 transition-colors">
                      <Icon size={16} className={cmd.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                        "{cmd.text}"
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1.5 group-hover:text-purple-500 transition-colors">
                        Click to try →
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              What CLARA Can Do
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A modular AI assistant built for real-world productivity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
              Live Stats
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Dashboard Overview
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statsData.map((s, i) => (
              <StatsCard key={s.label} {...s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
