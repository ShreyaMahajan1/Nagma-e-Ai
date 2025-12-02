'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import EmotionAnalyzer from '@/components/EmotionAnalyzer'
import SongStructure from '@/components/SongStructure'
import RhymeVisualizer from '@/components/RhymeVisualizer'

type AssistanceType = 'rhyme' | 'nextline' | 'style' | 'assistant'
type Language = 'english' | 'hinglish'

const QuillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
)

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
)

const MicIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path
      d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"
      className={active ? 'text-emerald-400' : ''}
    />
    <path d="M19 11a7 7 0 0 1-14 0" />
    <line x1="12" y1="21" x2="12" y2="17" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
)

const SpeakerIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" className={active ? 'text-emerald-400' : ''} />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
)

export default function PoetryCompanionPage() {
  const [userInput, setUserInput] = useState('')
  const [assistanceType, setAssistanceType] = useState<AssistanceType>('rhyme')
  const [language, setLanguage] = useState<Language>('english')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Voice AI state
  const [isRecording, setIsRecording] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [ttsSupported, setTtsSupported] = useState(false)
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null)

  const [userName, setUserName] = useState<string>('') // optional, abhi use nahi kar rahe but future ke liye
  const [isVoiceFlowRunning, setIsVoiceFlowRunning] = useState(false)

  // Analysis features state
  const [emotions, setEmotions] = useState<any>(null)
  const [songStructure, setSongStructure] = useState<any>(null)
  const [analyzingEmotion, setAnalyzingEmotion] = useState(false)
  const [analyzingStructure, setAnalyzingStructure] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const recognitionRef = useRef<any>(null)

  // Helper function to clean markdown formatting for speech
  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold **text**
      .replace(/\*(.+?)\*/g, '$1') // Remove italic *text*
      .replace(/_(.+?)_/g, '$1') // Remove italic _text_
      .replace(/`(.+?)`/g, '$1') // Remove code `text`
      .replace(/#+\s/g, '') // Remove headers #
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links [text](url) -> text
      .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
      .trim()
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setSpeechSupported(true)
    }

    if ('speechSynthesis' in window) {
      setTtsSupported(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    setLoading(true)
    setResults([])

    try {
      const res = await fetch('/api/poetry-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, assistanceType, language, count: 6 }),
      })

      if (!res.ok) throw new Error('Failed to fetch from API')

      const data = await res.json()
      const suggestions = Array.isArray(data.result)
        ? data.result
        : data.result.split('\n\n').filter((s: string) => s.trim())

      setResults(suggestions.slice(0, 6))
    } catch (error) {
      console.error(error)
      setResults(['Sorry, something went wrong. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  // Analysis functions
  const analyzeEmotions = async () => {
    if (!userInput.trim()) {
      alert(language === 'hinglish' ? 'Pehle lyrics likho!' : 'Please enter lyrics first!')
      return
    }

    setAnalyzingEmotion(true)
    setShowAnalysis(true)

    try {
      const res = await fetch('/api/emotion-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: userInput, language }),
      })

      if (!res.ok) throw new Error('Failed to analyze emotions')

      const data = await res.json()
      setEmotions(data.emotions)
    } catch (error) {
      console.error(error)
      alert(language === 'hinglish' ? 'Analysis fail ho gaya. Dobara try karo.' : 'Analysis failed. Please try again.')
    } finally {
      setAnalyzingEmotion(false)
    }
  }

  const analyzeSongStructure = async () => {
    if (!userInput.trim()) {
      alert(language === 'hinglish' ? 'Pehle lyrics likho!' : 'Please enter lyrics first!')
      return
    }

    setAnalyzingStructure(true)
    setShowAnalysis(true)

    try {
      const res = await fetch('/api/song-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: userInput, language }),
      })

      if (!res.ok) throw new Error('Failed to analyze structure')

      const data = await res.json()
      setSongStructure(data.structure)
    } catch (error) {
      console.error(error)
      alert(language === 'hinglish' ? 'Analysis fail ho gaya. Dobara try karo.' : 'Analysis failed. Please try again.')
    } finally {
      setAnalyzingStructure(false)
    }
  }

  const analyzeAll = async () => {
    await Promise.all([analyzeEmotions(), analyzeSongStructure()])
  }

  const toggleFavorite = (index: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Helper: listen once and return final transcript
  const listenOnce = (onFinal: (text: string) => void) => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.')
      setIsVoiceFlowRunning(false)
      return
    }

    console.log('🎤 Creating speech recognition...')
    const recognition = new SpeechRecognition()
    
    // Always use en-US for best results (works for both English and Hinglish)
    const recognitionLang = 'en-US'
    console.log('🎤 Setting recognition language to:', recognitionLang)
    
    recognition.lang = recognitionLang
    recognition.interimResults = false // Simpler - only final results
    recognition.continuous = false // Stop after one phrase
    recognition.maxAlternatives = 1

    let hasResult = false
    let fullTranscript = ''

    recognition.onstart = () => {
      console.log('🎤 ✓ Speech recognition STARTED - speak your full question!')
      setIsRecording(true)
    }

    recognition.onaudiostart = () => {
      console.log('🎤 Audio capture started')
    }

    recognition.onsoundstart = () => {
      console.log('🎤 Sound detected!')
    }

    recognition.onspeechstart = () => {
      console.log('🎤 Speech detected!')
    }

    recognition.onresult = (event: any) => {
      console.log('🎤 ===== GOT RESULT EVENT =====')
      console.log('🎤 Results count:', event.results.length)
      console.log('🎤 Full event:', event)
      
      // Get the final transcript
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript
      const confidence = result[0].confidence
      const isFinal = result.isFinal
      
      console.log(`🎤 Transcript: "${transcript}"`)
      console.log(`🎤 Is final: ${isFinal}`)
      console.log(`🎤 Confidence: ${confidence}`)
      
      if (transcript && transcript.trim()) {
        fullTranscript = transcript.trim()
        hasResult = true
        console.log('🎤 ✓ Got valid transcript, stopping recognition')
        recognition.stop()
      }
    }

    recognition.onspeechend = () => {
      console.log('🎤 Speech ended')
      // Recognition will auto-stop with continuous: false
    }

    recognition.onsoundend = () => {
      console.log('🎤 Sound ended - waiting for results...')
    }

    recognition.onaudioend = () => {
      console.log('🎤 Audio capture ended')
    }
    
    recognition.onnomatch = () => {
      console.log('🎤 ⚠ No match found for speech')
    }

    recognition.onerror = (event: any) => {
      console.error('🎤 ✗ Speech recognition error:', event.error)
      console.error('🎤 Error details:', event)
      setIsRecording(false)
      setIsVoiceFlowRunning(false)
      
      // Show user-friendly error
      if (event.error === 'no-speech') {
        console.log('🎤 Error: No speech was detected')
        alert(language === 'hinglish' ? 'Kuch sunai nahi diya. Zor se bolo aur dobara try karo.' : 'No speech detected. Please speak louder and try again.')
      } else if (event.error === 'audio-capture') {
        console.log('🎤 Error: Audio capture failed')
        alert(language === 'hinglish' ? 'Microphone kaam nahi kar raha. Check karo.' : 'Microphone not working. Please check it.')
      } else if (event.error === 'not-allowed') {
        console.log('🎤 Error: Microphone permission denied')
        alert(language === 'hinglish' ? 'Microphone permission nahi mila. Browser settings check karo.' : 'Microphone permission denied. Check browser settings.')
      } else if (event.error === 'network') {
        console.log('🎤 Error: Network issue')
        alert(language === 'hinglish' ? 'Internet connection check karo.' : 'Please check your internet connection.')
      } else if (event.error === 'aborted') {
        console.log('🎤 Speech recognition aborted')
      } else {
        console.log('🎤 Unknown error:', event.error)
        alert(language === 'hinglish' ? `Error: ${event.error}` : `Error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      console.log('🎤 ===== Speech recognition ENDED =====')
      console.log('🎤 Full transcript:', `"${fullTranscript}"`)
      console.log('🎤 Transcript length:', fullTranscript.length)
      console.log('🎤 hasResult:', hasResult)
      setIsRecording(false)
      
      // Send the transcript if we have one
      if (fullTranscript.trim()) {
        console.log('🎤 ✓ Sending transcript to callback:', fullTranscript.trim())
        onFinal(fullTranscript.trim())
      } else {
        console.log('🎤 ✗ No transcript received')
        console.log('🎤 This might be a microphone or language issue')
        setIsVoiceFlowRunning(false)
        
        // Show helpful message
        alert(language === 'hinglish' 
          ? 'Kuch sunai nahi diya. Microphone check karo aur phir se try karo.' 
          : 'No speech detected. Please check your microphone and try again.')
      }
    }

    recognitionRef.current = recognition
    
    try {
      console.log('🎤 Calling recognition.start()...')
      recognition.start()
      console.log('🎤 recognition.start() called successfully')
    } catch (err) {
      console.error('🎤 ✗ Failed to start recognition:', err)
      setIsRecording(false)
      setIsVoiceFlowRunning(false)
      alert(language === 'hinglish' ? 'Microphone start nahi ho paaya.' : 'Failed to start microphone.')
    }
  }

  // 🎤 Voice input for textarea only - simplified version
  const startVoiceInput = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert(language === 'hinglish' ? 'Voice input supported nahi hai.' : 'Voice input not supported.')
      return
    }

    console.log('🎤 ===== VOICE INPUT BUTTON CLICKED =====')
    
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US' // Always use English for better results
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    setIsRecording(true)

    recognition.onstart = () => {
      console.log('🎤 Voice input started - speak now!')
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      console.log('🎤 Voice input result:', transcript)
      setUserInput(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('🎤 Voice input error:', event.error)
      setIsRecording(false)
      if (event.error === 'no-speech') {
        alert(language === 'hinglish' ? 'Kuch sunai nahi diya. Dobara try karo.' : 'No speech detected. Try again.')
      }
    }

    recognition.onend = () => {
      console.log('🎤 Voice input ended')
      setIsRecording(false)
    }

    try {
      recognition.start()
    } catch (err) {
      console.error('🎤 Failed to start:', err)
      setIsRecording(false)
    }
  }

  // 🔊 Google Gemini voice assistant:
  // user jo bolega -> Gemini se answer -> answer bola bhi jayega + UI me dikh bhi jayega
  const startVoiceConversation = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const synth = window.speechSynthesis

    console.log('===== TALK TO GOOGLE AI BUTTON CLICKED =====')
    console.log('Voice conversation started')
    console.log('SpeechRecognition available:', !!SpeechRecognition)
    console.log('SpeechSynthesis available:', !!synth)
    console.log('Current language:', language)

    if (!SpeechRecognition || !synth) {
      console.warn('Voice not fully supported in this browser.')
      alert(language === 'hinglish' ? 'Voice feature supported nahi hai is browser me.' : 'Voice feature is not supported in this browser.')
      return
    }

    // Cancel any ongoing speech - IMPORTANT for Chrome
    synth.cancel()

    setIsVoiceFlowRunning(true)

    // Step 1: Intro line (assistant bolta hai)
    const introText =
      language === 'hinglish'
        ? 'Kuch bhi puchho, main sun raha hoon.'
        : 'Ask me anything, I am listening.'

    console.log('Creating intro utterance:', introText)

    const introUtterance = new SpeechSynthesisUtterance(introText)
    introUtterance.lang = language === 'hinglish' ? 'hi-IN' : 'en-US'
    introUtterance.rate = 0.9
    introUtterance.pitch = 1.0
    introUtterance.volume = 1.0

    // Get voices synchronously (Chrome usually has them loaded already)
    const availableVoices = synth.getVoices()
    console.log('Available voices:', availableVoices.length)
    
    if (availableVoices.length > 0) {
      const preferredVoice = availableVoices.find(voice => 
        language === 'hinglish' 
          ? (voice.lang.includes('hi') || voice.lang.includes('HI'))
          : (voice.lang.includes('en') || voice.lang.includes('EN'))
      )
      
      if (preferredVoice) {
        console.log('Using voice:', preferredVoice.name)
        introUtterance.voice = preferredVoice
      }
    }

    let speechStarted = false

    introUtterance.onstart = () => {
      console.log('✓ Intro speech STARTED')
      speechStarted = true
    }

    introUtterance.onerror = (event) => {
      console.error('✗ Speech synthesis error:', event.error)
      setIsVoiceFlowRunning(false)
      alert(language === 'hinglish' ? 'Speech nahi chal paaya. Dobara try karo.' : 'Speech failed. Please try again.')
    }

    introUtterance.onend = () => {
      console.log('✓ Intro speech ENDED')
      
      // Small delay before starting recognition
      setTimeout(() => {
        console.log('Starting speech recognition...')
        // Step 2: User ka question suno
        listenOnce(async (queryText) => {
          try {
            // Don't fill textarea in voice conversation mode
            console.log('User said:', queryText)
            
            // Step 3: Query Gemini ko bhejo as a general assistant
            const res = await fetch('/api/poetry-companion', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userInput: queryText,
                assistanceType: 'assistant',
                language,
              }),
            })

            if (!res.ok) {
              throw new Error('Failed to fetch assistant reply from API')
            }

            const data = await res.json()
            const rawAnswer: string =
              data.result ||
              (language === 'hinglish'
                ? 'Sorry, abhi jawab nahi laa paaya.'
                : 'Sorry, I could not generate an answer.')

            console.log('Gemini response (raw):', rawAnswer)

            // Clean markdown for speech
            const cleanAnswer = cleanTextForSpeech(rawAnswer)
            console.log('Gemini response (cleaned for speech):', cleanAnswer)

            // UI me bhi dikha do (latest answer on top) - show original with formatting
            setResults(prev => [rawAnswer, ...prev])

            // Step 4: Answer ko bolke sunao - use cleaned version
            // Split into sentences to avoid Chrome speech synthesis bug with long text
            const sentences = cleanAnswer.match(/[^.!?]+[.!?]+/g) || [cleanAnswer]
            console.log('Split into', sentences.length, 'sentences')
            
            let currentSentenceIndex = 0
            
            const speakNextSentence = () => {
              if (currentSentenceIndex >= sentences.length) {
                console.log('✓ All sentences spoken - resetting to original state')
                speechCompleted = true
                setIsVoiceFlowRunning(false)
                setIsRecording(false)
                return
              }

              const sentence = sentences[currentSentenceIndex].trim()
              console.log(`Speaking sentence ${currentSentenceIndex + 1}/${sentences.length}:`, sentence)
              
              const answerUtterance = new SpeechSynthesisUtterance(sentence)
              answerUtterance.lang = language === 'hinglish' ? 'hi-IN' : 'en-US'
              answerUtterance.rate = 0.9
              answerUtterance.pitch = 1.0
              answerUtterance.volume = 1.0

              const voices = synth.getVoices()
              const voice = voices.find(v => 
                language === 'hinglish' 
                  ? (v.lang.includes('hi') || v.lang.includes('HI'))
                  : (v.lang.includes('en') || v.lang.includes('EN'))
              )
              if (voice) {
                answerUtterance.voice = voice
              }

              answerUtterance.onend = () => {
                console.log(`✓ Sentence ${currentSentenceIndex + 1} completed`)
                currentSentenceIndex++
                // Small delay between sentences
                setTimeout(() => speakNextSentence(), 100)
              }

              answerUtterance.onerror = (event) => {
                console.error('✗ Sentence speech error:', event.error)
                speechCompleted = true
                setIsVoiceFlowRunning(false)
                setIsRecording(false)
              }

              synth.speak(answerUtterance)
            }

            let speechCompleted = false
            
            // Start speaking
            console.log('Starting to speak answer...')
            speakNextSentence()
            
            // Fallback timeout for entire answer
            const totalEstimatedDuration = (cleanAnswer.split(' ').length / 2.5) * 1000 + 10000
            setTimeout(() => {
              if (!speechCompleted) {
                console.warn('⚠ Answer speech timeout, forcing reset')
                synth.cancel()
                speechCompleted = true
                setIsVoiceFlowRunning(false)
                setIsRecording(false)
              }
            }, totalEstimatedDuration)
          } catch (err) {
            console.error('Error in Gemini assistant flow:', err)
            setIsVoiceFlowRunning(false)
            alert(language === 'hinglish' ? 'Kuch galat ho gaya. Dobara try karo.' : 'Something went wrong. Please try again.')
          }
        })
      }, 500)
    }

    // Speak the intro - this should trigger immediately
    console.log('Calling synth.speak()...')
    synth.speak(introUtterance)
    
    // Fallback: if speech doesn't start in 2 seconds, skip to listening
    setTimeout(() => {
      if (!speechStarted && isVoiceFlowRunning) {
        console.warn('⚠ Speech did not start, skipping to listening')
        synth.cancel()
        introUtterance.onend?.(new Event('end') as any)
      }
    }, 2000)
  }

  // 🔊 Text-to-speech for suggestions grid - speaks line by line like a song
  const speakResult = (text: string, index: number) => {
    if (typeof window === 'undefined') return
    const synth = window.speechSynthesis
    if (!synth) return

    if (synth.speaking) {
      synth.cancel()
      if (speakingIndex === index) {
        setSpeakingIndex(null)
        return
      }
    }

    setSpeakingIndex(index)

    // Split text into lines for song-like delivery
    const lines = text.split('\n').filter(line => line.trim())
    let currentLineIndex = 0

    const speakNextLine = () => {
      if (currentLineIndex >= lines.length) {
        setSpeakingIndex(null)
        return
      }

      const line = lines[currentLineIndex].trim()
      const utterance = new SpeechSynthesisUtterance(line)
      utterance.lang = language === 'hinglish' ? 'hi-IN' : 'en-US'
      utterance.rate = 0.85 // Slightly slower for song-like feel
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onend = () => {
        currentLineIndex++
        // Pause between lines (like singing)
        setTimeout(() => speakNextLine(), 800)
      }

      utterance.onerror = () => {
        setSpeakingIndex(null)
      }

      synth.speak(utterance)
    }

    speakNextLine()
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#050816] text-stone-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-[#d4af37]/20 blur-3xl opacity-70" />
        <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-stone-900/70 border border-stone-800/70 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-xl px-6 py-7 sm:px-10 sm:py-10">
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block">
                  <Image
                    src="/logo.png"
                    alt=" Nagma-e-AI  Logo"
                    width={46}
                    height={50}
                    className="rounded-full border border-stone-700/60 bg-black/40"
                    priority
                  />
                </div>
                <div className="sm:hidden">
                  <Image
                    src="/logo.png"
                    alt=" Nagma-e-AI  Logo"
                    width={36}
                    height={36}
                    className="rounded-full border border-stone-700/60 bg-black/40"
                    priority
                  />
                </div>
                <div className="rounded-full border border-stone-700/60 bg-black/40 px-2.5 py-1 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.18em] text-stone-400">
                  Song Studio
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                ✨ Beta Muse
              </span>
            </div>

            <header className="text-center mb-8 border-b border-stone-800/70 pb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-wide text-[#f5e2a8] drop-shadow-[0_0_12px_rgba(0,0,0,0.7)]">
                 Nagma-e-AI 
              </h1>
              <p className="mt-2 text-stone-400 text-sm sm:text-base">
                Your AI songwriting companion for lyrics, melodies & music styles.
              </p>
              {userName && (
                <p className="mt-1 text-xs text-stone-500">
                  Talking to: <span className="text-[#f5e2a8] font-semibold">{userName}</span>
                </p>
              )}
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                  Language
                </label>
                <div className="inline-flex items-center justify-center rounded-full bg-black/40 border border-stone-800/80 p-1 mx-auto sm:mx-0">
                  <button
                    type="button"
                    onClick={() => setLanguage('english')}
                    className={`px-4 py-1.5 text-sm sm:text-base rounded-full transition-all font-serif ${
                      language === 'english'
                        ? 'bg-[#d4af37] text-stone-900 shadow-md'
                        : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hinglish')}
                    className={`ml-2 px-4 py-1.5 text-sm sm:text-base rounded-full transition-all font-serif ${
                      language === 'hinglish'
                        ? 'bg-[#d4af37] text-stone-900 shadow-md'
                        : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                    }`}
                  >
                    Hinglish
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                    Your Line
                  </label>
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={startVoiceInput}
                      disabled={isRecording}
                      className={`inline-flex items-center gap-1 text-[11px] rounded-full border px-2 py-1
                        ${
                          isRecording
                            ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-200 opacity-80 cursor-not-allowed'
                            : 'border-stone-700/80 text-stone-400 hover:border-stone-500 hover:text-stone-100'
                        }`}
                    >
                      <MicIcon active={isRecording} />
                      <span>
                        {isRecording
                          ? (language === 'hinglish' ? 'Sun raha hoon…' : 'Listening…')
                          : (language === 'hinglish' ? 'Voice Input' : 'Voice Input')}
                      </span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={
                      language === 'hinglish'
                        ? 'Apne gaane ki ek line yahan likho... ya voice input use karo.'
                        : 'Write a line from your song here... or just say it, I’ll listen and write it.'
                    }
                    className="w-full h-32 sm:h-36 rounded-xl bg-black/40 border border-stone-800/80 px-4 py-3 text-base text-stone-100 focus:ring-2 focus:ring-[#d4af37]/80 focus:border-transparent outline-none transition shadow-inner placeholder:text-stone-600 resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                  What do you want help with?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAssistanceType('rhyme')}
                    className={`flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      assistanceType === 'rhyme'
                        ? 'bg-[#d4af37]/10 border-[#d4af37]/80 shadow-[0_0_18px_rgba(212,175,55,0.35)]'
                        : 'border-stone-800/80 hover:bg-stone-900/70 hover:border-stone-500/60'
                    }`}
                  >
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/90" />
                      {language === 'hinglish' ? 'Rhyme Karo' : 'Find Rhymes'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssistanceType('nextline')}
                    className={`flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      assistanceType === 'nextline'
                        ? 'bg-[#d4af37]/10 border-[#d4af37]/80 shadow-[0_0_18px_rgba(212,175,55,0.35)]'
                        : 'border-stone-800/80 hover:bg-stone-900/70 hover:border-stone-500/60'
                    }`}
                  >
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-sky-400/90" />
                      {language === 'hinglish' ? 'Aage Badhao' : 'Continue Song'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssistanceType('style')}
                    className={`flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      assistanceType === 'style'
                        ? 'bg-[#d4af37]/10 border-[#d4af37]/80 shadow-[0_0_18px_rgba(212,175,55,0.35)]'
                        : 'border-stone-800/80 hover:bg-stone-900/70 hover:border-stone-500/60'
                    }`}
                  >
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-fuchsia-400/90" />
                      {language === 'hinglish' ? 'Style Explore' : 'Explore Styles'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#d4af37] text-stone-900 py-3.5 text-base font-serif font-semibold tracking-wide shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_18px_55px_rgba(0,0,0,0.95)] hover:translate-y-[1px] active:translate-y-[2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="rounded-full bg-black/10 p-1.5">
                    <QuillIcon />
                  </span>
                  {loading ? (language === 'hinglish' ? 'Bana raha hoon…' : 'Creating…') : (language === 'hinglish' ? 'Gaana Banao' : 'Create Song')}
                </button>

                <button
                  type="button"
                  onClick={analyzeAll}
                  disabled={analyzingEmotion || analyzingStructure || !userInput.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 text-base font-serif font-semibold tracking-wide shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_18px_55px_rgba(0,0,0,0.95)] hover:translate-y-[1px] active:translate-y-[2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="text-xl">🎭</span>
                  {(analyzingEmotion || analyzingStructure) ? (language === 'hinglish' ? 'Analyze kar raha hoon…' : 'Analyzing…') : (language === 'hinglish' ? 'Analyze Karo' : 'Analyze Song')}
                </button>
              </div>
            </form>

            {/* Voice AI Assistant Button */}
            {speechSupported && ttsSupported && (
              <div className="mt-6 pt-6 border-t border-stone-800/70">
                <button
                  type="button"
                  onClick={startVoiceConversation}
                  disabled={isVoiceFlowRunning}
                  className={`w-full flex items-center justify-center gap-3 rounded-full py-4 text-base sm:text-lg font-serif font-semibold tracking-wide shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all ${
                    isVoiceFlowRunning
                      ? 'bg-emerald-500/20 text-emerald-200 border-2 border-emerald-400/70 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-[0_18px_55px_rgba(0,0,0,0.95)] hover:translate-y-[1px] active:translate-y-[2px]'
                  }`}
                >
                  <span className={`rounded-full p-2 ${isVoiceFlowRunning ? 'bg-emerald-400/20' : 'bg-white/10'}`}>
                    <MicIcon active={isVoiceFlowRunning} />
                  </span>
                  <span>
                    {isVoiceFlowRunning
                      ? (language === 'hinglish' ? '🎧 Sun raha hoon...' : '🎧 Listening...')
                      : (language === 'hinglish' ? '🤖 Google AI se Baat Karo' : '🤖 Talk to Google AI')}
                  </span>
                </button>
                <p className="mt-2 text-center text-xs text-stone-500">
                  {language === 'hinglish' 
                    ? 'Kuch bhi pucho, AI jawab dega aur bolega bhi' 
                    : 'Ask anything, AI will answer and speak it out loud'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Section - Pinterest Style */}
        {showAnalysis && (
          <div className="max-w-7xl mx-auto mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#f5e2a8] text-center mb-8">
              {language === 'hinglish' ? '📊 Gaane Ka Analysis' : '📊 Song Analysis'}
            </h2>
            
            {/* Masonry/Pinterest-style layout */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              <div className="break-inside-avoid">
                <EmotionAnalyzer emotions={emotions} loading={analyzingEmotion} />
              </div>
              
              <div className="break-inside-avoid">
                <SongStructure structure={songStructure} loading={analyzingStructure} />
              </div>
              
              <div className="break-inside-avoid">
                <RhymeVisualizer lyrics={userInput} />
              </div>
            </div>
          </div>
        )}

        {/* Pinterest-style Results Grid */}
        {results.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#f5e2a8] text-center mb-8">
              AI ke Gaane <span className="text-stone-500 text-lg">(AI&apos;s Songs)</span>
            </h2>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {results.map((result, index) => (
                <div key={index} className="break-inside-avoid">
                  <div className="group relative bg-stone-900/70 border border-stone-800/70 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-300 hover:scale-[1.02]">
                    {/* Card Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {ttsSupported && (
                        <button
                          onClick={() => speakResult(result, index)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                            speakingIndex === index
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-black/40 text-stone-400 hover:text-emerald-300'
                          }`}
                        >
                          <SpeakerIcon active={speakingIndex === index} />
                        </button>
                      )}
                      <button
                        onClick={() => toggleFavorite(index)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                          favorites.has(index)
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-black/40 text-stone-400 hover:text-rose-400'
                        }`}
                      >
                        <HeartIcon filled={favorites.has(index)} />
                      </button>
                      <button
                        onClick={() => handleCopy(result, index)}
                        className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-stone-400 hover:text-[#d4af37] transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="pr-16">
                      <pre className="text-stone-100 whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed">
                        {result}
                      </pre>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-4 pt-3 border-t border-stone-800/50 flex items-center justify-between">
                      <span className="text-xs text-stone-500 uppercase tracking-wider">
                        Suggestion {index + 1}
                      </span>
                      {copiedIndex === index && (
                        <span className="text-xs text-emerald-400 font-medium">✓ Copied</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
