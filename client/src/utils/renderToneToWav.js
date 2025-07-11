import * as Tone from 'tone'

// AudioBuffer → WAV Blob 변환 함수
function audioBufferToWavBlob(buffer) {
  const numOfChan = buffer.numberOfChannels
  const length = buffer.length * numOfChan * 2 + 44
  const bufferArray = new ArrayBuffer(length)
  const view = new DataView(bufferArray)
  let offset = 0

  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset++, str.charCodeAt(i))
    }
  }

  function writeUint32(data) {
    view.setUint32(offset, data, true)
    offset += 4
  }

  function writeUint16(data) {
    view.setUint16(offset, data, true)
    offset += 2
  }

  writeString('RIFF')
  writeUint32(length - 8)
  writeString('WAVE')
  writeString('fmt ')
  writeUint32(16)
  writeUint16(1)
  writeUint16(numOfChan)
  writeUint32(buffer.sampleRate)
  writeUint32(buffer.sampleRate * 2 * numOfChan)
  writeUint16(numOfChan * 2)
  writeUint16(16)
  writeString('data')
  writeUint32(length - offset - 4)

  const channels = []
  for (let i = 0; i < numOfChan; i++) {
    channels.push(buffer.getChannelData(i))
  }

  const interleaved = new Float32Array(buffer.length * numOfChan)
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      interleaved[i * numOfChan + channel] = channels[channel][i]
    }
  }

  for (let i = 0; i < interleaved.length; i++) {
    const sample = Math.max(-1, Math.min(1, interleaved[i]))
    view.setInt16(offset, sample * 0x7FFF, true)
    offset += 2
  }

  return new Blob([view], { type: 'audio/wav' })
}

// ⚙️ 메인 렌더링 함수
export async function renderToneToWav(config) {
  const {
    instrument = 'Synth',
    volume = -6,
    pitch = [],
    rhythm = [],
    duration = [],
    effects = {},
    sampleUrl
  } = config

  const SynthMap = {
    Synth: Tone.Synth,
    AMSynth: Tone.AMSynth,
    FMSynth: Tone.FMSynth,
    DuoSynth: Tone.DuoSynth,
    MembraneSynth: Tone.MembraneSynth,
    MonoSynth: Tone.MonoSynth,
    MetalSynth: Tone.MetalSynth,
  }

  const buffer = await Tone.Offline(async ({ transport, context }) => {
    const destination = context?.destination || Tone.getContext().rawContext.destination
    let finalNode = destination
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

    // 체인 연결
    for (let i = effectsChain.length - 1; i >= 0; i--) {
      effectsChain[i].connect(finalNode)
      finalNode = effectsChain[i]
    }

    if (instrument === 'Sample' && sampleUrl) {
      const player = new Tone.Player({
        url: sampleUrl,
        volume: parseFloat(volume),
        autostart: true,
      }).connect(finalNode)
    } else {
      const SynthClass = SynthMap[instrument] || Tone.Synth
      const synth = new Tone.PolySynth(SynthClass).connect(finalNode)
      synth.volume.value = parseFloat(volume)

      pitch.forEach((note, i) => {
        if (note) {
          const offset = parseFloat(rhythm[i]) || 0
          const dur = duration[i] || '1'
          synth.triggerAttackRelease(note, dur, offset)
        }
      })
    }

    transport.start()
  }, 2)

  return audioBufferToWavBlob(buffer)
}




