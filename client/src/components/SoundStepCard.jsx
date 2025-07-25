import React from 'react'
import MiniSquareButton from './MiniSquareButton'
import { makeSoundDesignPrompt } from '../utils/promptTemplates'
import { generateText } from '../utils/generateText'
import toast from 'react-hot-toast'

export default function SoundStepCard({
  step,
  selected,
  onSelect,
  soundConfig = {},
  onUpdateSoundConfig,
  onUpdateSoundPanel
}) {
  const idStr = String(step.id)
  const config = soundConfig[idStr] || {}

  const handleGenerateSound = async () => {
    if (!config.cognitivePhase || !config.interactionIntent || !config.urgency) {
      toast.error('Please fill in the details first!')
      return
    }

    const prompt = makeSoundDesignPrompt(config)
    try {
      const toastId = toast.loading('Generating…')
      const aiResult = await generateText(prompt)
      let parsed = {}
      try {
        const cleanText = aiResult.trim()
          .replace(/^```json/, '')
          .replace(/^```/, '')
          .replace(/```$/, '')
          .trim()
      
        parsed = JSON.parse(cleanText)
      } catch (err) {
        console.error('Parsing failed:', err, aiResult)
        toast.error('Result parsing failed!')
        return
      }

      Object.entries(parsed).forEach(([key, value]) => {
        if (key === 'notes') {
          const pitches = value.map(n => n.pitch)
          const rhythms = value.map(n => n.rhythm)
          const durations = value.map(n => n.duration)
      
          onUpdateSoundPanel(step.id, 'pitch', pitches)
          onUpdateSoundPanel(step.id, 'rhythm', rhythms)
          onUpdateSoundPanel(step.id, 'duration', durations)
        } else {
          onUpdateSoundPanel(step.id, key, value) // 예: volume
        }
      })

      toast.success('Sound applied!', { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Sound failed!', { id: toastId })
    }
  }

  return (
    <div className={`border rounded-xl p-4 shadow space-y-3 w-64 flex-shrink-0 ${selected ? 'bg-sky-100' : 'bg-white'}`}>
      <p className="text-sm font-medium border-b border-gray-300 pb-1">{step.description}</p>

      <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-gray-100">
        {step.imageUrl ? (
          <img src={step.imageUrl} alt="Step" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {selected && (
        <div className="flex flex-col gap-2 pt-2">
          <select
            value={config.cognitivePhase || ''}
            onChange={e => onUpdateSoundConfig(step.id, 'cognitivePhase', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="" disabled>Emotional Flow</option>
            <option value="start">Start</option>
            <option value="rising">Build</option>
            <option value="peak">Peak</option>
            <option value="falling">Ease</option>
            <option value="end">End</option>
            <option value="attention">Attention</option>
          </select>

          <select
            value={config.interactionIntent || ''}
            onChange={e => onUpdateSoundConfig(step.id, 'interactionIntent', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="" disabled>Interaction Intent</option>
            <option value="warning">Alert</option>
            <option value="confirmation">Notification</option>
            <option value="welcome">Confirmation</option>
            <option value="error">Guidance</option>
            <option value="notification">Expression</option>
          </select>

          <select
            value={config.urgency || ''}
            onChange={e => onUpdateSoundConfig(step.id, 'urgency', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="" disabled>Importance</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="text-right flex items-center justify-end gap-2">
            <MiniSquareButton onClick={handleGenerateSound} title="Sound Generation">✨</MiniSquareButton>
          </div>
        </div>
      )}

      <div className="text-right flex items-center justify-end gap-2">
        <MiniSquareButton onClick={onSelect} title="Select Card">✔️</MiniSquareButton>
      </div>
    </div>
  )
}






