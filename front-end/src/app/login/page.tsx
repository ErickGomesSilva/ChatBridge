'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '../lib/api'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', { email, password })
      login(res.data.access_token)
      router.push('/') // depois vamos redirecionar pra inbox
    } catch (err) {
      setError('Credenciais inválidas')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow dark:bg-zinc-900">
        <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
          Login
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          className="border border-gray-300 px-3 py-2 w-full mb-3 rounded"
          placeholder="Email"
          id="dica"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border border-gray-300 px-3 py-2 w-full mb-4 rounded"
          placeholder="Senha"
          id="dica"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Entrar
        </button>
        <p className="text-sm mt-4 text-center text-gray-500 dark:text-gray-400">
          Ainda não tem conta? <a className="text-blue-500" href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  )
}
