import * as Tone from 'tone'

// -----------------------------
// AudioBuffer → WAV Blob 변환
// -----------------------------
function audioBufferToWavBlob(buffer) {
  const numOfChan = buffer.numberOfChannels
  const length    = buffer.length * numOfChan * 2 + 44
  const view      = new DataView(new ArrayBuffer(length))
  let offset      = 0

  const u8  = v => view.setUint8(offset++, v)
  const u16 = v => (view.setUint16(offset, v, true), offset += 2)
  const u32 = v => (view.setUint32(offset, v, true), offset += 4)
  const str = s => [...s].forEach(c => u8(c.charCodeAt(0)))

  str('RIFF'); u32(length - 8); str('WAVEfmt '); u32(16); u16(1)
  u16(numOfChan); u32(buffer.sampleRate)
  u32(buffer.sampleRate * numOfChan * 2); u16(numOfChan * 2); u16(16)
  str('data'); u32(length - offset - 4)

  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numOfChan; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]))
      view.setInt16(offset, sample * 0x7FFF, true); offset += 2
    }
  }
  return new Blob([view], { type: 'audio/wav' })
}

// -----------------------------
// 메인 렌더링 함수
// -----------------------------
export async function renderToneToWav(config) {
  // ✅ 컨텍스트가 일시중지 상태일 때 재개
  await Tone.start()
  await Tone.context.resume()

  const {
    instrument = 'Synth',
    volume = -6,
    pitch = [],
    rhythm = [],
    duration = [],
    effects = {},
    sampleUrl
  } = config

  // ▶️ 자동 총 길이 계산 (Tone.Time 사용, 여유 2초)
  const totalDuration = (() => {
    if (!pitch.length) return 3     // 최소 3초
    let max = 0
    for (let i = 0; i < pitch.length; i++) {
      const offsetSec = Tone.Time(rhythm[i] ?? 0).toSeconds()
      const durSec    = Tone.Time(duration[i] ?? '1').toSeconds()
      max = Math.max(max, offsetSec + durSec)
    }
    return max + 1                  // tail 여유
  })()

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
    // ✅ context가 undefined일 때 안전 fallback
    const destination = context?.destination || Tone.getContext().rawContext.destination
    let finalNode = destination
    const chain = []

    if (effects.reverb) {
      const reverb = new Tone.Reverb({ decay: 4, wet: 0.6 })
      await reverb.generate()
      chain.push(reverb)
    }
    if (effects.delay)      chain.push(new Tone.FeedbackDelay('8n', 0.3))
    if (effects.distortion) chain.push(new Tone.Distortion(0.4))

    for (let i = chain.length - 1; i >= 0; i--) {
      chain[i].connect(finalNode)
      finalNode = chain[i]
    }

    if (instrument === 'Sample' && sampleUrl) {
      new Tone.Player({
        url: sampleUrl,
        volume: parseFloat(volume),
        autostart: true
      }).connect(finalNode)
    } else {
      const SynthClass = SynthMap[instrument] || Tone.Synth
      const synth = new Tone.PolySynth(SynthClass).connect(finalNode)
      synth.volume.value = parseFloat(volume)

      pitch.forEach((note, i) => {
        if (!note) return
        const offsetSec = Tone.Time(rhythm[i] ?? 0).toSeconds()
        const durVal    = duration[i] ?? '1'
        synth.triggerAttackRelease(note, durVal, offsetSec)
      })
    }

    transport.start()
  }, totalDuration)

  return audioBufferToWavBlob(buffer)
}





