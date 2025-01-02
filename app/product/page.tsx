'use client'

import '@/styles/neo-brutalism.css'
import { useState, FormEvent, useRef, useEffect, ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mic, ImageIcon } from 'lucide-react'
import { Message, AgentResponse, AgentType } from '@/types/agents'
import { useChatStore } from '@/store/chatStore'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { OnchainResponse } from '@/components/OnchainResponse'
import { MarketAnalysis } from '@/components/market-analysis'

const agentImages: Record<AgentType, string> = {
  superagent: '/superagent.gif',
  trading: '/superagent.gif',
  travel: '/travel.gif',
  healthcare: '/superagent.gif',
  nft: '/superagent.gif',
  personal: '/superagent.gif',
  vision: '/superagent.gif',
  onchain: '/superagent.gif'
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<AgentType>('superagent')
  const [showChat, setShowChat] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle')
  const [isOnchainMode, setIsOnchainMode] = useState(false)
  const [onchainButtons, setOnchainButtons] = useState<string[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { messages, addMessage } = useChatStore()

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOnchainMode) {
      setOnchainButtons(['Create Wallet', 'Mint NFT', 'Check NFT Status', 'View NFT'])
    } else {
      setOnchainButtons([])
    }
  }, [isOnchainMode])

  const uploadToBlob = async (file: File): Promise<string> => {
    const filename = encodeURIComponent(file.name)
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`/api/blob-storage?filename=${filename}`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file to blob storage')
    }

    const blob = await response.json()
    return blob.url
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    setShowChat(true)
    const userMessage: Message = { 
      role: 'user', 
      content: selectedImage ? `[Image uploaded] ${input}` : input,
      imageUrl: imageUrl
    }
    addMessage(userMessage)
    setInput('')
    setIsLoading(true)

    let currentAgentType: AgentType
    let apiRoute: string

    if (isOnchainMode) {
      currentAgentType = 'onchain'
      apiRoute = '/api/onchain-chat'
    } else if (selectedImage) {
      currentAgentType = 'vision'
      apiRoute = '/api/vision'
    } else {
      currentAgentType = 'superagent'
      apiRoute = '/api/superagent'
    }

    setCurrentAgent(currentAgentType)

    try {
      const body = {
        messages: [...messages, userMessage],
        imageUrl: imageUrl
      }

      console.log('Sending request to:', apiRoute)
      console.log('Request body:', JSON.stringify(body))

      const res = await fetch(apiRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`API request failed: ${res.status} ${res.statusText}\n${errorText}`)
      }

      const data: AgentResponse = await res.json()
      console.log('API response:', data)

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content), 
        agent: data.agent,
        functionResponse: data.functionResponse
      }
      addMessage(assistantMessage)
      setCurrentAgent(data.agent as AgentType)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      addMessage({ 
        role: 'assistant', 
        content: `Sorry, I encountered an error. Please try again. Error details: ${error instanceof Error ? error.message : String(error)}` 
      })
      setCurrentAgent('superagent')
    } finally {
      setIsLoading(false)
      setSelectedImage(null)
      setImageUrl(null)
      setUploadStatus('idle')
    }
  }

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setUploadStatus('uploading')
      try {
        const blobUrl = await uploadToBlob(file)
        setImageUrl(blobUrl)
        setUploadStatus('uploaded')
      } catch (error) {
        console.error('Error uploading image to blob storage:', error)
        setUploadStatus('idle')
      }
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        await transcribeAudio(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.wav')

    try {
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const data = await response.json()
      setInput(data.text)
    } catch (error) {
      console.error('Error transcribing audio:', error)
      setInput('Failed to transcribe audio. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderMessage = (message: Message) => {
    if (message.role === 'user') {
      return <p className="text-sm">{message.content}</p>
    }

    switch (message.agent) {
      case 'onchain':
        return <OnchainResponse content={message.content} functionResponse={message.functionResponse} />
      case 'vision':
        return <MarketAnalysis content={message.content} />
      default:
        return <p className="text-sm">{message.content}</p>
    }
  }

  return (
    <div className="min-h-screen bg-yellow-200 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <motion.div 
          className="mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image src={agentImages[currentAgent]} alt="Agent" width={150} height={150} className="" />
        </motion.div>

        <motion.div 
          className="mb-4 text-lg font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentAgent === 'superagent' 
            ? 'SuperAgent'
            : `SuperAgent > ${currentAgent.charAt(0).toUpperCase() + currentAgent.slice(1)}`
          }
        </motion.div>
        
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full mb-8"
            >
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full">
                <CardContent className="p-4 max-h-[60vh] overflow-y-auto" ref={chatContainerRef}>
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div 
                        key={index} 
                        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className={`inline-block p-2 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : message.agent === 'onchain'
                              ? 'w-full'
                              : 'bg-white border-2 border-black'
                        }`}>
                          {renderMessage(message)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div 
                      className="flex justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your prompt here..."
                className="flex-grow border-2 border-black rounded-none bg-white"
              />
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded-none" 
                type="submit" 
                disabled={isLoading || isRecording}
              >
                Send
              </Button>
              <Button
                type="button"
                onClick={() => document.getElementById('imageUpload')?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded-none"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded-none"
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                variant={isRecording ? "destructive" : "secondary"}
              >
                <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
              </Button>
            </form>

            <div className="mt-4">
              <Button
                onClick={() => setIsOnchainMode(!isOnchainMode)}
                className={`w-full mb-2 ${isOnchainMode ? 'bg-green-500' : 'bg-gray-500'} ${isOnchainMode ? 'hover:bg-green-600' : 'hover:bg-gray-400'} text-white font-bold py-2 px-4 border-b-4 ${isOnchainMode ? 'border-green-700 ' : 'border-gray-700 '} ${isOnchainMode ? 'hover:border-green-800' : 'hover:border-gray-800'} rounded-none`}
              >
                {isOnchainMode ? 'Onchain Mode: ON' : 'Onchain Mode: OFF'}
              </Button>
              {isOnchainMode && (
                <div className="flex flex-wrap gap-2">
                  {onchainButtons.map((button, index) => {
                    const colors = ['blue', 'green', 'red', 'purple'];
                    const colorClass = `bg-blue-500 hover:bg-blue-600 border-${colors[index % colors.length]}-700 hover:border-${colors[index % colors.length]}-800`;
                    return (
                      <Button
                        key={index}
                        onClick={() => setInput(button)}
                        className={`${colorClass} text-white font-bold py-2 px-4 border-b-4 rounded-none flex-grow`}
                      >
                        {button}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>

            {imageUrl && (
              <div className="mt-2">
                {uploadStatus === 'uploading' && <p>Uploading, please wait...</p>}
                {uploadStatus === 'uploaded' && (
                  <>
                    <p>Uploaded</p>
                    <img src={imageUrl} alt="Selected" className="max-w-full h-auto" />
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

