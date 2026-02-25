'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, Trash2, Loader2, Mail, MailOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge } from '@/components/ui/Badge'
import type { Message } from '@/types/database'

export default function AdminMessagesPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const markRead = async (msg: Message) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: !msg.is_read })
      .eq('id', msg.id)
    if (error) { toast.error('Update failed.'); return }
    fetchMessages()
  }

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return
    setDeleting(id)
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) { toast.error('Delete failed.') }
    else { toast.success('Message deleted.') }
    setDeleting(null)
    fetchMessages()
  }

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {messages.length} total
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      ) : messages.length === 0 ? (
        <div className="card card-padding text-center py-16 text-gray-400 dark:text-gray-600">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`card card-padding transition-all duration-150 ${
                !msg.is_read
                  ? 'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/10'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{msg.name}</p>
                    {!msg.is_read && <Badge variant="primary">New</Badge>}
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                      {new Date(msg.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-3 block"
                  >
                    {msg.email}
                  </a>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => markRead(msg)}
                    title={msg.is_read ? 'Mark unread' : 'Mark read'}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800
                               text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {msg.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    disabled={deleting === msg.id}
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20
                               text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    {deleting === msg.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
