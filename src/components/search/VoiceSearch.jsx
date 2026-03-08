'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiMic } from 'react-icons/fi';

export default function VoiceSearch({ setSearchQuery, setShowAutocomplete }) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);

  const VOICE_SEARCH_MAP = {
    মোবাইল: 'mobile',
    ফোন: 'mobile',
    ল্যাপটপ: 'laptop',
    কম্পিউটার: 'computer',
    জামা: 'shirt',
    কাপড়: 'clothes',
    জুতা: 'shoes',
    ঘড়ি: 'watch',
    ক্যামেরা: 'camera',
    বই: 'books',
    ব্যাগ: 'bag',
    টিভি: 'tv',
    গেমিং: 'gaming',
    হেডফোন: 'headphones',
  };

  const startVoiceSearch = useCallback(() => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      alert('Voice search not supported');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = e => {
      let transcript = e.results[0][0].transcript.trim().toLowerCase();

      Object.keys(VOICE_SEARCH_MAP).forEach(bnWord => {
        if (transcript.includes(bnWord)) {
          transcript = VOICE_SEARCH_MAP[bnWord];
        }
      });

      setSearchQuery(transcript);
      setShowAutocomplete(true);

      router.push(`/products?q=${encodeURIComponent(transcript)}`);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [router, setSearchQuery, setShowAutocomplete]);

  return (
    <button
      type="button"
      onClick={startVoiceSearch}
      className={`h-10 px-3 transition-colors ${
        isListening
          ? 'text-red-500 animate-pulse'
          : 'text-gray-400 hover:text-gray-700'
      }`}
      title="Voice search"
    >
      <FiMic size={16} />
    </button>
  );
}
