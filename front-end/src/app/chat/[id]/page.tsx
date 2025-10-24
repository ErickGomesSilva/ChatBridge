'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import axios from '@/app/lib/api'
import io from 'socket.io-client'

interface Message {
  id: string
  text: string
  sender: { id: string; email: string }
  conversation?: {id:string; email:string}
}

let socket: any

export default function ChatRoom() {
  const { id: conversationId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!conversationId) return

    // 1. Carregar mensagens da conversa
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/messages/${conversationId}`)
        setMessages(res.data)
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // 2. Conectar socket.io
    socket = io('http://localhost:3000') // porta do BACK
    socket.emit('joinConversation', conversationId)

    socket.on('newMessage', (newMsg: Message) => {
      if (
        newMsg.conversation?.id === conversationId &&
        newMsg.sender.id !== user?.id
      ) {
        setMessages((prev) => [...prev, newMsg])
      }
    })
    

    return () => {
      socket.disconnect()
    }
  }, [conversationId])

  const handleSend = async () => {
    if (!text.trim() || !user) return

    try {
      const res = await axios.post(`/messages/${conversationId}`, {
        senderId: user.id,
        text,
      })

      setMessages((prev) => [...prev, res.data])
      setText('')
    } catch (err) {
      console.error('Erro ao enviar mensagem', err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      {loading ? (
        <p>Carregando mensagens...</p>
      ) : (
        <>
          <div className="space-y-2 mb-6">
  {messages.map((msg) => {
    const isMe = msg.sender?.id === user?.id

    return (
      <div
        key={msg.id}
        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs px-4 py-2 rounded-lg ${
            isMe
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-red-200 text-black rounded-bl-none'
          }`}
        >
          <p className="text-sm">{msg.text}</p>
          <p className="text-[10px] mt-1 opacity-70">{msg.sender?.email}</p>
        </div>
      </div>
    )
  })}
  <div ref={messagesEndRef} />
</div>


          {/* ✅ Formulário de envio de mensagem */}
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Digite sua mensagem..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSend}
            >
              Enviar
            </button>
          </div>
        </>
      )}
    </div>
  )
}
