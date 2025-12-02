'use client'
import React, { useMemo } from 'react'

interface RhymeVisualizerProps {
  lyrics: string
}

const rhymeColors = [
  'bg-blue-500/30 border-blue-500',
  'bg-green-500/30 border-green-500',
  'bg-purple-500/30 border-purple-500',
  'bg-pink-500/30 border-pink-500',
  'bg-yellow-500/30 border-yellow-500',
  'bg-cyan-500/30 border-cyan-500',
  'bg-orange-500/30 border-orange-500',
  'bg-red-500/30 border-red-500',
]

const getLastWord = (line: string): string => {
  const words = line.trim().split(/\s+/)
  return words[words.length - 1].toLowerCase().replace(/[.,!?;:]$/g, '')
}

const getLastSyllables = (word: string): string => {
  // Simple approximation: get last 2-3 characters
  return word.slice(-3)
}

export default function RhymeVisualizer({ lyrics }: RhymeVisualizerProps) {
  const analysis = useMemo(() => {
    if (!lyrics.trim()) return null

    const lines = lyrics.split('\n').filter(l => l.trim())
    if (lines.length === 0) return null

    // Detect rhyme scheme
    const rhymeMap = new Map<string, number>()
    const lineRhymes: number[] = []
    let colorIndex = 0

    lines.forEach(line => {
      const lastWord = getLastWord(line)
      const syllables = getLastSyllables(lastWord)

      // Check if this syllable pattern exists
      let rhymeGroup = -1
      rhymeMap.forEach((value, key) => {
        if (rhymeGroup === -1 && (key.includes(syllables) || syllables.includes(key))) {
          rhymeGroup = value
        }
      })

      if (rhymeGroup === -1) {
        rhymeGroup = colorIndex
        rhymeMap.set(syllables, colorIndex)
        colorIndex = (colorIndex + 1) % rhymeColors.length
      }

      lineRhymes.push(rhymeGroup)
    })

    // Generate rhyme scheme letters (A, B, C, etc.)
    const schemeLetters = lineRhymes.map(r => String.fromCharCode(65 + r))
    const scheme = schemeLetters.join('')

    return { lines, lineRhymes, scheme }
  }, [lyrics])

  if (!analysis) {
    return (
      <div className="bg-stone-900/70 border border-stone-800/70 rounded-2xl p-5 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all">
        <h3 className="text-lg font-serif text-[#f5e2a8] mb-3 flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          Rhyme Pattern
        </h3>
        <p className="text-xs text-stone-400 text-center py-6">
          Enter lyrics to see rhyme patterns
        </p>
      </div>
    )
  }

  return (
    <div className="bg-stone-900/70 border border-stone-800/70 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-serif text-[#f5e2a8] flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          Rhyme Pattern
        </h3>
        <div className="text-xs bg-[#d4af37]/10 px-3 py-1 rounded-full">
          <span className="text-stone-400">Scheme: </span>
          <span className="text-[#d4af37] font-mono font-bold">{analysis.scheme}</span>
        </div>
      </div>

      <div className="space-y-2">
        {analysis.lines.map((line, index) => {
          const rhymeGroup = analysis.lineRhymes[index]
          const colorClass = rhymeColors[rhymeGroup % rhymeColors.length]
          const letter = String.fromCharCode(65 + rhymeGroup)

          return (
            <div
              key={index}
              className={`flex items-center gap-2 p-2.5 rounded-lg border-l-4 ${colorClass} transition-all hover:scale-[1.01]`}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black/30 flex items-center justify-center">
                <span className="text-xs font-bold text-stone-100">{letter}</span>
              </div>
              <div className="flex-1 text-stone-100 text-xs leading-relaxed">{line}</div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-stone-800/50">
        <p className="text-[10px] text-stone-500 text-center">
          Same letters = rhyming lines
        </p>
      </div>
    </div>
  )
}
