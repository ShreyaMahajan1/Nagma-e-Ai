'use client'
import React from 'react'

interface StructureSection {
  section: string
  bars: number
  description: string
}

interface SongStructureData {
  suggested_structure: StructureSection[]
  rhyme_scheme: string
  tempo_suggestion: string
  key_suggestion: string
  overall_vibe: string
}

interface SongStructureProps {
  structure: SongStructureData | null
  loading: boolean
}

const sectionColors: { [key: string]: string } = {
  'Intro': 'bg-purple-500/20 border-purple-500/50',
  'Verse': 'bg-blue-500/20 border-blue-500/50',
  'Chorus': 'bg-emerald-500/20 border-emerald-500/50',
  'Bridge': 'bg-orange-500/20 border-orange-500/50',
  'Outro': 'bg-pink-500/20 border-pink-500/50',
  'Pre-Chorus': 'bg-cyan-500/20 border-cyan-500/50',
}

const getSectionColor = (section: string): string => {
  for (const key in sectionColors) {
    if (section.includes(key)) {
      return sectionColors[key]
    }
  }
  return 'bg-stone-500/20 border-stone-500/50'
}

export default function SongStructure({ structure, loading }: SongStructureProps) {
  if (loading) {
    return (
      <div className="bg-stone-900/70 border border-stone-800/70 rounded-2xl p-5 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all">
        <h3 className="text-lg font-serif text-[#f5e2a8] mb-3 flex items-center gap-2">
          <span className="text-2xl">🎵</span>
          Song Structure
        </h3>
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]"></div>
        </div>
      </div>
    )
  }

  if (!structure) {
    return null
  }

  return (
    <div className="bg-stone-900/70 border border-stone-800/70 rounded-2xl p-4 backdrop-blur-xl shadow-lg hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-300 hover:scale-[1.02]">
      <h3 className="text-lg font-serif text-[#f5e2a8] mb-1.5 flex items-center gap-2">
        <span className="text-2xl">🎵</span>
        Song Structure
      </h3>
      <p className="text-[10px] text-stone-400 mb-3 line-clamp-1">{structure.overall_vibe}</p>

      {/* Structure Timeline - Two Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {structure.suggested_structure.map((section, index) => (
          <div
            key={index}
            className={`border-l-4 rounded-lg p-2.5 transition-all hover:scale-[1.02] ${getSectionColor(section.section)}`}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-stone-100 text-xs">{section.section}</h4>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full text-stone-300">
                {section.bars}
              </span>
            </div>
            <p className="text-[10px] text-stone-300 leading-relaxed">{section.description}</p>
          </div>
        ))}
      </div>

      {/* Music Details - Compact Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-stone-800/50">
        <div className="text-center bg-black/20 rounded-lg py-1.5 px-1.5">
          <div className="text-[9px] text-stone-500 uppercase tracking-wider mb-1">Rhyme</div>
          <div className="text-[10px] font-bold text-[#d4af37] break-words leading-tight">{structure.rhyme_scheme}</div>
        </div>
        <div className="text-center bg-black/20 rounded-lg py-1.5 px-1.5">
          <div className="text-[9px] text-stone-500 uppercase tracking-wider mb-1">Tempo</div>
          <div className="text-[10px] font-bold text-[#d4af37] break-words leading-tight">{structure.tempo_suggestion}</div>
        </div>
        <div className="text-center bg-black/20 rounded-lg py-1.5 px-1.5">
          <div className="text-[9px] text-stone-500 uppercase tracking-wider mb-1">Key</div>
          <div className="text-[10px] font-bold text-[#d4af37] break-words leading-tight">{structure.key_suggestion}</div>
        </div>
      </div>
    </div>
  )
}
