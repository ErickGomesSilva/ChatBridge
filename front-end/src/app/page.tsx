'use client'

import { useAuth } from '@/context/AuthContext'
import axios from './lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

interface User {
  id: string
  email: string
}

interface Message {
  text: string
  createdAt: string
}

interface Conversation {
  id: string
  user1: User
  user2: User
  messages: Message[]
}

export default function InboxPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const fetchConversations = async () => {
      try {
        const res = await axios.get(`/conversations/${user.id}`)
        setConversations(res.data)
      } catch (err) {
        console.error('Erro ao buscar conversas', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [user?.id])

  if (loading) return <p className="p-6 text-gray-500">Carregando conversas...</p>

  return (
    <div className="p-6">
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Suas Conversas</h1>
        <LogoutButton />
      </div>

      {conversations.length === 0 ? (
        <p className="text-gray-500">Nenhuma conversa encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conversation) => {
            const participants = [conversation.user1, conversation.user2]
            const other = participants.find(p => p.id !== user?.id)
            const lastMessage = conversation.messages?.[conversation.messages.length - 1]

            return (
              <li key={conversation.id} className="p-4 border rounded hover:bg-gray-50 transition">
                <Link href={`/chat/${conversation.id}`}>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Conversa com: {other?.email}
                    </p>
                    {lastMessage && (
                      <p className="text-gray-600 text-sm mt-1">
                        Última mensagem: {lastMessage.text}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
      <Link href="/new" className="text-blue-600 underline block mb-4">
        ➕ Nova conversa
      </Link>
    </div>
  )
}
