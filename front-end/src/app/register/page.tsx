'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '../lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    try {
      await axios.post('/auth/register', { email, password })
      router.push('/login')
    } catch (err) {
      setError('Erro ao registrar usuário')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          className="border px-3 py-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border px-3 py-2 w-full mb-4"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 w-full rounded"
          onClick={handleRegister}
        >
          Cadastrar
        </button>
      </div>
    </div>
  )
}
