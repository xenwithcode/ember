// frontend/src/hooks/useElevenLabs.ts

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - warm female voice
// Otras opciones de voz:
// "AZnzlk1XvdvUeBnXmlld" - Domi (warm, confident)
// "EXAVITQu4vr4xnSDxMaL" - Sarah (soft, gentle)
// "ErXwobaYiN019PkySvjV" - Antoni (calm male)

// If ElevenLabs returns 401/402/403 (bad key or no credits), stop trying
// for the rest of the session: every retry adds latency and breaks
// voice-to-screen sync in the demos.
let elevenLabsBroken = false;
let elevenLabsWarningShown = false;

const FALLBACK_VOICE_NAMES = [
  "Google US English",
  "Samantha",
  "Microsoft Aria Online (Natural)",
  "Microsoft Jenny Online (Natural)",
  "Microsoft Aria",
  "Microsoft Jenny",
  "Karen",
  "Moira",
  "Tessa",
];

function pickFallbackVoice(): SpeechSynthesisVoice | null {
  const synth =
    typeof window !== "undefined" && "speechSynthesis" in window
      ? window.speechSynthesis
      : null;
  if (!synth) return null;
  const voices = synth.getVoices();
  for (const name of FALLBACK_VOICE_NAMES) {
    const match = voices.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (match) return match;
  }
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith("en-us")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    null
  );
}

export async function textToSpeech(
  text: string,
  options?: {
    voiceId?: string;
    speed?: number;
    stability?: number;
    signal?: AbortSignal;
  }
): Promise<Blob> {
  const voiceId = options?.voiceId || VOICE_ID;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY || "",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: options?.stability ?? 0.5,
          similarity_boost: 0.75,
          speed: options?.speed ?? 1,
        },
      }),
      signal: options?.signal,
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs error: ${response.status}`);
  }

  return response.blob();
}

// Play audio from blob (aborts cleanly if the signal fires)
export function playAudio(blob: Blob, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    const cleanup = () => {
      audio.pause();
      audio.src = "";
      URL.revokeObjectURL(url);
    };

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
    audio.onended = () => {
      signal?.removeEventListener("abort", onAbort);
      cleanup();
      resolve();
    };
    audio.onerror = () => {
      signal?.removeEventListener("abort", onAbort);
      cleanup();
      reject(new Error("Audio playback failed"));
    };
    audio.play().catch((e) => {
      signal?.removeEventListener("abort", onAbort);
      cleanup();
      reject(e);
    });
  });
}

// Speak text and wait for completion
export async function speakText(
  text: string,
  options?: { voiceId?: string; speed?: number; signal?: AbortSignal }
): Promise<void> {
  if (!ELEVENLABS_API_KEY && !elevenLabsWarningShown) {
    elevenLabsWarningShown = true;
    console.warn(
      "[useElevenLabs] NEXT_PUBLIC_ELEVENLABS_API_KEY is empty. " +
        "Add it to frontend/.env.local and restart `npm run dev`. " +
        "Using Web Speech fallback."
    );
  }

  // No key, or ElevenLabs already failed this session → Web Speech directly
  if (!ELEVENLABS_API_KEY || elevenLabsBroken) {
    await speakWithWebSpeech(text, options);
    return;
  }

  try {
    const blob = await textToSpeech(text, options);
    await playAudio(blob, options?.signal);
    console.info("[useElevenLabs] Spoke with ElevenLabs (Rachel)");
  } catch (error) {
    if (options?.signal?.aborted) return; // intentional stop, not a failure

    const status = error instanceof Error ? error.message : "";
    if (/40[123]/.test(status)) {
      elevenLabsBroken = true;
      console.warn(
        "[useElevenLabs] ElevenLabs not available (" +
          status +
          "). Using Web Speech API for the rest of the session."
      );
    } else {
      console.error("ElevenLabs TTS failed, falling back to Web Speech API:", error);
    }
    await speakWithWebSpeech(text, options);
  }
}

// Web Speech API with a native US voice (waits for completion)
async function speakWithWebSpeech(
  text: string,
  options?: { speed?: number; signal?: AbortSignal }
): Promise<void> {
  const hasWindow =
    typeof window !== "undefined" && "speechSynthesis" in window;
  if (!hasWindow) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  // Split into sentences: Chrome can drop very long single utterances,
  // but queues consecutive ones reliably.
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) ?? [text];
  const voice = pickFallbackVoice();

  console.info(
    "[useElevenLabs] Web Speech fallback voice:",
    voice?.name ?? "default"
  );

  await new Promise<void>((resolve) => {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      options?.signal?.removeEventListener("abort", onAbort);
      resolve();
    };

    const onAbort = () => {
      synth.cancel();
      settle();
    };
    options?.signal?.addEventListener("abort", onAbort, { once: true });

    // Chrome drops the first utterance if speak() runs in the same tick
    // as cancel() — the small delay keeps the fallback voice reliable.
    window.setTimeout(() => {
      let i = 0;
      const speakNext = () => {
        if (options?.signal?.aborted) {
          synth.cancel();
          settle();
          return;
        }
        if (i >= sentences.length) {
          settle();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(sentences[i++].trim());
        if (voice) utterance.voice = voice;
        utterance.rate = options?.speed ?? 0.95;
        // Short gap between sentences so the engine never drops the next one
        utterance.onend = () => window.setTimeout(speakNext, 120);
        utterance.onerror = () => window.setTimeout(speakNext, 120);
        synth.speak(utterance);
      };
      speakNext();
    }, 80);
  });
}