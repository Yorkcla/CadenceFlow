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

    const chain = []

    if (effects.reverb) {
      const reverb = new Tone.Reverb({ decay: 2, wet: 0.3 })
      await reverb.generate()
      chain.push(reverb)
    }

    if (effects.delay) {
      const delay = new Tone.FeedbackDelay('8n', 0.25)
      chain.push(delay)
    }

    if (effects.distortion) {
      const distortion = new Tone.Distortion(0.4)
      chain.push(distortion)
    }

    const destination = chain.reduce((acc, effect) => {
      acc.connect(effect)
      return effect
    }, Tone.Destination)

    if (instrument === 'Sample' && sampleUrl) {
      const player = new Tone.Player({
        url: sampleUrl,
        volume,
        autostart: true, // ⭐ 여기가 핵심
      }).connect(destination)
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
    const synth = new Tone.PolySynth(SynthClass).connect(destination)
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
      console.log('Uploading sample:', file.name)
      const fileUrl = await uploadSample(userId, projectId, phaseId, stepId, file)
      console.log('Uploaded sample URL:', fileUrl)
      onUpdate(id, 'sampleUrl', fileUrl)
    } catch (err) {
      console.error('Sample upload failed:', err)
    }
  }

  return (
    <div className="border rounded-xl p-4 shadow w-64 bg-white mt-2 space-y-3">
      <p className="text-sm font-semibold text-gray-800">Sound for {id}</p>

      <div>
        <label className="text-xs text-gray-500">Instrument</label>
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
                    className="border rounded p-1 w-12 text-sm"
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
          className="border rounded p-1 w-full text-sm"
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

      <div className="text-right">
        <MiniSquareButton onClick={handlePlay}>🔊</MiniSquareButton>
      </div>
    </div>
  )
}














