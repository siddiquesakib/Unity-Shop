'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiMic } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Bengali → English keyword translations (extended)
const BN_TO_EN = {
  মোবাইল: 'mobile',
  ফোন: 'phone',
  স্মার্টফোন: 'smartphone',
  ল্যাপটপ: 'laptop',
  কম্পিউটার: 'computer',
  ট্যাবলেট: 'tablet',
  জামা: 'shirt',
  কাপড়: 'clothes',
  পোশাক: 'dress',
  শার্ট: 'shirt',
  প্যান্ট: 'pants',
  জুতা: 'shoes',
  স্যান্ডেল: 'sandal',
  ঘড়ি: 'watch',
  ক্যামেরা: 'camera',
  বই: 'books',
  ব্যাগ: 'bag',
  টিভি: 'tv',
  টেলিভিশন: 'television',
  গেমিং: 'gaming',
  হেডফোন: 'headphones',
  ইয়ারফোন: 'earphone',
  চেয়ার: 'chair',
  টেবিল: 'table',
  বালিশ: 'pillow',
  চাদর: 'bedsheet',
  রান্না: 'kitchen',
  ব্লেন্ডার: 'blender',
  সাবান: 'soap',
  ক্রিম: 'cream',
  লিপস্টিক: 'lipstick',
  চাল: 'rice',
  ডাল: 'lentil',
  তেল: 'oil',
  বিস্কুট: 'biscuit',
  খেলনা: 'toys',
  বাচ্চা: 'baby',
  সাইকেল: 'bicycle',
  ক্রিকেট: 'cricket',
  ফুটবল: 'football',
  স্পোর্টস: 'sports',
  গাড়ি: 'car',
  অটো: 'automotive',
  টুলস: 'tools',
};

// Irregular plurals that can't be handled by suffix rules
const IRREGULAR_PLURALS = {
  furnitures: 'furniture',
  clothings: 'clothing',
  equipments: 'equipment',
  luggages: 'luggage',
  baggages: 'baggage',
  jewelries: 'jewelry',
  jewelleries: 'jewellery',
  softwares: 'software',
  hardwares: 'hardware',
  underwears: 'underwear',
  outerwears: 'outerwear',
  footwears: 'footwear',
  eyewears: 'eyewear',
  sportswears: 'sportswear',
  swimwears: 'swimwear',
  knitwears: 'knitwear',
  leisurewears: 'leisurewear',
  headwears: 'headwear',
};

function translateTranscript(text) {
  let result = text.toLowerCase().trim();
  Object.entries(BN_TO_EN).forEach(([bn, en]) => {
    result = result.replaceAll(bn, en);
  });
  return result.trim();
}

function normalizeQuery(text) {
  let q = text.toLowerCase().trim();

  // 1. Check irregular plurals first (exact word match)
  const words = q.split(' ');
  const normalized = words.map(word => IRREGULAR_PLURALS[word] || word);
  q = normalized.join(' ');

  // 2. Apply suffix rules word by word
  const suffixNormalized = q.split(' ').map(word => {
    // Skip short words (avoid breaking words like "his", "bus", "gas")
    if (word.length <= 4) return word;

    if (word.endsWith('ies') && word.length > 5) {
      return word.slice(0, -3) + 'y'; // batteries → battery
    }
    if (word.endsWith('ves') && word.length > 5) {
      return word.slice(0, -3) + 'f'; // knives → knife
    }
    if (word.endsWith('sses')) {
      return word.slice(0, -2); // glasses → glass
    }
    if (
      word.endsWith('ches') ||
      word.endsWith('shes') ||
      word.endsWith('xes')
    ) {
      return word.slice(0, -2); // watches → watch, dishes → dish
    }
    if (word.endsWith('es') && word.length > 5) {
      return word.slice(0, -2); // phones → phon (only if no better rule)
    }
    if (word.endsWith('s') && !word.endsWith('ss') && word.length > 5) {
      return word.slice(0, -1); // laptops → laptop
    }

    return word;
  });

  return suffixNormalized.join(' ');
}

export default function VoiceSearch({ setSearchQuery, setShowAutocomplete }) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchAllMatches = async query => {
    setIsSearching(true);
    try {
      const res = await fetch(
        `${API_URL}/products/search?q=${encodeURIComponent(query)}&limit=100`,
      );
      if (res.ok) {
        const data = await res.json();
        setMatchedProducts(data.products || []);
      }
    } catch (err) {
      console.error('Voice search fetch error:', err);
      setMatchedProducts([]);
    } finally {
      setIsSearching(false);
    }
  };

  const startVoiceSearch = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice search is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setMatchedProducts([]);
    };

    recognition.onresult = async e => {
      const alternatives = Array.from(e.results[0]).map(alt =>
        alt.transcript.trim(),
      );

      // Translate Bengali if needed, then normalize plurals
      let transcript = translateTranscript(alternatives[0]);
      if (!transcript) transcript = alternatives[0].trim().toLowerCase();
      transcript = normalizeQuery(transcript);

      setSearchQuery(transcript);
      setShowAutocomplete(true);

      await fetchAllMatches(transcript);

      router.push(`/products?q=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = e => {
      console.error('Voice recognition error:', e.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [router, setSearchQuery, setShowAutocomplete]);

  return (
    <button
      type="button"
      onClick={startVoiceSearch}
      disabled={isListening || isSearching}
      className={`h-10 px-3 transition-all duration-200 ${
        isListening
          ? 'text-red-500 animate-pulse scale-110'
          : isSearching
            ? 'text-blue-400 animate-pulse'
            : 'text-gray-400 hover:text-gray-700'
      }`}
      title={
        isListening
          ? 'Listening...'
          : isSearching
            ? 'Searching...'
            : 'Voice search'
      }
    >
      <FiMic size={16} />
    </button>
  );
}
