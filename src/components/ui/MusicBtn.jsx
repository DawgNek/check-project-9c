// src/components/ui/MusicBtn.jsx
// Background music toggle — soft piano/nature sounds
import { useState, useRef, useEffect } from 'react';

// Embed a tiny silent audio generator using Web Audio API
// Replace audioSrc with actual music file URL
const AUDIO_SRC = null; // Set to '/music/garden-piano.mp3' or a CDN URL

export default function MusicBtn() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const ctxRef   = useRef(null);

  // Gentle ambient tone via Web Audio API (fallback if no audio file)
  const startAmbient = () => {
    if (AUDIO_SRC) return;
    if (ctxRef.current) { ctxRef.current.resume(); return; }

    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    // Create gentle ambient pad
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(.12, ctx.currentTime + 3);
    masterGain.connect(ctx.destination);

    const notes = [261.63, 329.63, 392.00, 493.88]; // C major chord
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.04 - i * 0.005;
      osc.connect(gain);
      gain.connect(masterGain);

      // Gentle tremolo
      const lfo  = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.15 + i * 0.05;
      lfoG.gain.value = 0.015;
      lfo.connect(lfoG);
      lfoG.connect(gain.gain);
      lfo.start();
      osc.start();
    });
  };

  const stopAmbient = () => {
    if (ctxRef.current) {
      const g = ctxRef.current.createGain();
      g.connect(ctxRef.current.destination);
      ctxRef.current.suspend();
    }
  };

  const toggle = () => {
    if (AUDIO_SRC) {
      // Real audio file path
      if (!audioRef.current) {
        audioRef.current = new Audio(AUDIO_SRC);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.22;
      }
      if (playing) audioRef.current.pause();
      else         audioRef.current.play().catch(() => {});
    } else {
      if (playing) stopAmbient();
      else         startAmbient();
    }
    setPlaying(p => !p);
  };

  useEffect(() => () => {
    audioRef.current?.pause();
    ctxRef.current?.close();
  }, []);

  return (
    <button id="music-btn" className={playing ? 'playing' : ''} onClick={toggle}
      title={playing ? 'Tắt nhạc' : 'Bật nhạc nền'}>
      {playing ? '🎵' : '🎶'}
    </button>
  );
}
