'use client'

import { useEffect, useState } from 'react'
import axios from '../lib/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface User {
  id: string
  email: string
}

export default function NewConversationPage() {
  const [users, setUsers] = useState<User[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    axios.get('/users').then((res) => {
      const filtered = res.data.filter((u: User) => u.id !== user?.id)
      setUsers(filtered)
    })
  }, [user?.id])

  const startConversation = async (otherUserId: string) => {
    try {
      const res = await axios.post('/conversations', {
        user1Id: user?.id,
        user2Id: otherUserId,
      })

      router.push(`/chat/${res.data.id}`)
    } catch (err) {
      console.error('Erro ao criar conversa', err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Nova Conversa</h1>
      <ul className="space-y-3">
        {users.map((u) => (
          <li key={u.id} className="flex justify-between items-center border p-3 rounded">
            <span>{u.email}</span>
            <button
              onClick={() => startConversation(u.id)}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Conversar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
