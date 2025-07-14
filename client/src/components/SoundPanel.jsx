import React from 'react'
import * as Tone from 'tone'
import MiniSquareButton from './MiniSquareButton'
import { uploadSample } from '../utils/uploadSample'

export default function SoundPanel({ id, config = {}, onUpdate, userId, projectId, phaseId, stepId }) {
  const handlePlay = async () => {
    await Tone.start()

    const volume = parseFloat(config.volume) || -6
    const effects = config.effects || {}
    const sampleUrl = config.sampleUrl || ''
    const instrument = config.instrument || 'Synth'

    // ✅ 이펙트 체인 새로 생성 (항상 fresh하게)
    const effectsChain = []

    if (effects.reverb) {
      const reverb = new Tone.Reverb({ decay: 4, wet: 0.6 })
      await reverb.generate()
      effectsChain.push(reverb)
    }

    if (effects.delay) {
      const delay = new Tone.FeedbackDelay('8n', 0.3)
      effectsChain.push(delay)
    }

    if (effects.distortion) {
      const distortion = new Tone.Distortion(0.4)
      effectsChain.push(distortion)
    }

    // ✅ 항상 라이브 컨텍스트에 연결
    let finalNode = Tone.Destination
    for (let i = effectsChain.length - 1; i >= 0; i--) {
      effectsChain[i].connect(finalNode)
      finalNode = effectsChain[i]
    }

    if (instrument === 'Sample' && sampleUrl) {
      const player = new Tone.Player({
        url: sampleUrl,
        volume,
        autostart: true,
      }).connect(finalNode)
      return
    }

    const SynthMap = {
      Synth: Tone.Synth,
      AMSynth: Tone.AMSynth,
      FMSynth: Tone.FMSynth,
      DuoSynth: Tone.DuoSynth,
      MembraneSynth: Tone.MembraneSynth,
      MonoSynth: Tone.MonoSynth,
      MetalSynth: Tone.MetalSynth,
    }

    const SynthClass = SynthMap[instrument] || Tone.Synth
    const synth = new Tone.PolySynth(SynthClass).connect(finalNode)
    synth.volume.value = volume

    const pitchArray = config.pitch || []
    const rhythmArray = config.rhythm || []
    const durationArray = config.duration || []

    pitchArray.forEach((pitch, i) => {
      if (pitch) {
        const offset = parseFloat(rhythmArray[i]) || 0
        const dur = durationArray[i] || '1'
        synth.triggerAttackRelease(pitch, dur, Tone.now() + offset)
      }
    })
  }

  const handleArrayUpdate = (key, index, value) => {
    const current = [...(config[key] || [])]
    current[index] = value
    onUpdate(id, key, current)
  }

  const handleSampleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !userId || !projectId || !phaseId) return
    try {
      const fileUrl = await uploadSample(userId, projectId, phaseId, stepId, file)
      onUpdate(id, 'sampleUrl', fileUrl)
    } catch (err) {
      console.error('Sample upload failed:', err)
    }
  }

  return (
    <div className="w-64 max-w-sm bg-white border rounded-xl shadow p-4 space-y-3 mt-2">

      <div>
        <label className="text-xs text-gray-500">Timbre</label>
        <select
          className="border rounded p-1 w-full text-sm"
          value={config.instrument || 'Synth'}
          onChange={e => onUpdate(id, 'instrument', e.target.value)}
        >
          <option value="Synth">Synth</option>
          <option value="AMSynth">AMSynth</option>
          <option value="FMSynth">FMSynth</option>
          <option value="DuoSynth">DuoSynth</option>
          <option value="MembraneSynth">MembraneSynth</option>
          <option value="MonoSynth">MonoSynth</option>
          <option value="MetalSynth">MetalSynth</option>
          <option value="Sample">Sample</option>
        </select>
      </div>

      {config.instrument !== 'Sample' && (
        <>
          {['pitch', 'rhythm', 'duration'].map((field) => (
            <div key={field}>
              <label className="text-xs text-gray-500 capitalize">{field}</label>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                  <input
                    key={i}
                    type="text"
                    placeholder={field === 'pitch' ? `c${i + 2}` : '0'}
                    className="placeholder:text-xs border rounded p-1 w-12 text-sm"
                    value={config[field]?.[i] || ''}
                    onChange={e => handleArrayUpdate(field, i, e.target.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {config.instrument === 'Sample' && (
        <div>
          <label className="text-xs text-gray-500">Upload Sample File</label>
          <input
            type="file"
            accept="audio/*"
            className="text-xs"
            onChange={handleSampleUpload}
          />
        </div>
      )}

      <div>
        <label className="text-xs text-gray-500">Volume (dB)</label>
        <input
          type="text"
          placeholder="-6"
          className="placeholder:text-xs border rounded p-1 w-full text-sm"
          value={config.volume || ''}
          onChange={e => onUpdate(id, 'volume', e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500">Effects</label>
        {['reverb', 'delay', 'distortion'].map(effect => (
          <div key={effect} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.effects?.[effect] || false}
              onChange={e =>
                onUpdate(id, 'effects', {
                  ...config.effects,
                  [effect]: e.target.checked,
                })
              }
            />
            <span className="text-sm capitalize">{effect}</span>
          </div>
        ))}
      </div>

      <div className="text-right flex items-center justify-end gap-2">
        <MiniSquareButton onClick={handlePlay}>🎵</MiniSquareButton>
      </div>
    </div>
  )
}
















