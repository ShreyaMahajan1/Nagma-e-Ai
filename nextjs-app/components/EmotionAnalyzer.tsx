'use client'
import React from 'react'

interface EmotionData {
  happy: number
  sad: number
  angry: number
  romantic: number
  energetic: number
  melancholic: number
  dominant_emotion: string
  mood_description: string
}

interface EmotionAnalyzerProps {
  emotions: EmotionData | null
  loading: boolean
}

const emotionConfig = {
  happy: { emoji: '😊', color: 'bg-yellow-500', label: 'Happy' },
  sad: { emoji: '😢', color: 'bg-blue-500', label: 'Sad' },
  angry: { emoji: '😡', color: 'bg-red-500', label: 'Angry' },
  romantic: { emoji: '💕', color: 'bg-pink-500', label: 'Romantic' },
  energetic: { emoji: '⚡', color: 'bg-orange-500', label: 'Energetic' },
  melancholic: { emoji: '🌧️', color: 'bg-indigo-500', label: 'Melancholic' },
}

export default function EmotionAnalyzer({ emotions, loading }: EmotionAnalyzerProps) {
  if (loading) {
    return (
      <div className="bg-stone-900/70 border border-stone-800/70 rounded-2xl p-5 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all">
        <h3 className="text-lg font-serif text-[#f5e2a8] mb-3 flex items-center gap-2">
          <span className="text-2xl">🎭</span>
          Emotion Analysis
        </h3>
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]"></div>
        </div>
      </div>
    )
  }

  if (!emotions) {
    return null
  }

  // Filter out emotions with 0% to save space
  const activeEmotions = Object.entries(emotionConfig).filter(([key]) => {
    const value = emotions[key as keyof typeof emotionConfig]
    return typeof value === 'number' && value > 0
  })

  return (
    <div className="bg-stone-900/70 border border-stone-800/70 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-300 hover:scale-[1.02]">
      <h3 className="text-lg font-serif text-[#f5e2a8] mb-2 flex items-center gap-2">
        <span className="text-2xl">🎭</span>
        Emotion Analysis
      </h3>
      <p className="text-xs text-stone-400 mb-4 line-clamp-2">{emotions.mood_description}</p>

      <div className="space-y-3">
        {activeEmotions.map(([key, config]) => {
          const value = emotions[key as keyof typeof emotionConfig]
          if (typeof value !== 'number') return null

          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="text-lg">{config.emoji}</span>
                  <span className="text-stone-300 font-medium">{config.label}</span>
                </span>
                <span className="text-[#d4af37] font-bold text-sm">{value}%</span>
              </div>
              <div className="w-full bg-stone-800/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`${config.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-800/50">
        <div className="flex items-center justify-center gap-2 bg-[#d4af37]/10 rounded-lg py-2 px-3">
          <span className="text-xs text-stone-400">Dominant:</span>
          <span className="text-base font-bold text-[#d4af37] capitalize flex items-center gap-1">
            <span className="text-xl">{emotionConfig[emotions.dominant_emotion as keyof typeof emotionConfig]?.emoji}</span>
            {emotions.dominant_emotion}
          </span>
        </div>
      </div>
    </div>
  )
}
