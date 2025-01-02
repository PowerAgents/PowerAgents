'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/temp',
    body: { email },
    initialMessages: [{ role: 'system', content: "You are a helpful AI assistant with blockchain capabilities." }],
  })

  const handleInitialize = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setIsInitialized(true)
    } else {
      alert('Please enter a valid email address')
    }
  }

  return (
    <div className="min-h-screen bg-yellow-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center border-4 border-black p-4 bg-white">Neo-Brutalist Chatbot</h1>
        
        {!isInitialized ? (
          <form onSubmit={handleInitialize} className="mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-4 text-lg border-4 border-black mb-4"
              required
            />
            <button type="submit" className="w-full p-4 text-lg font-bold bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-colors">
              Initialize Chatbot
            </button>
          </form>
        ) : (
          <div className="border-4 border-black bg-white p-4">
            <div className="h-[60vh] overflow-y-auto mb-4">
              {messages.map(m => (
                <div key={m.id} className={`mb-4 p-4 border-2 border-black ${m.role === 'user' ? 'bg-blue-200' : 'bg-green-200'}`}>
                  <strong>{m.role === 'user' ? 'You:' : 'Bot:'}</strong> {m.content}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
                className="flex-grow p-4 text-lg border-4 border-black mr-2"
              />
              <button type="submit" className="p-4 text-lg font-bold bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-colors">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

