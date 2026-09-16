import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback transliteration / conversion if API key is not yet set in environment
      return NextResponse.json({
        arabic: fallbackTransliterate(text),
        fallback: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a specialist in official UAE / Gulf rubber stamps and trade license names.
The user wants to convert English company and business names to Arabic for the bottom curved arc of an official rubber stamp seal.

CRITICAL INSTRUCTION:
Convert brand names, personal names, proper nouns, and company titles into their phonetic Arabic equivalent (transliteration / Arabization), exactly as done on UAE / Saudi commercial licenses and rubber stamps.
- Proper nouns & brand names MUST be phonetically transliterated into Arabic letters, NOT translated to Arabic dictionary words!
  For example:
  - "HALAWA" -> "حلاوة" (NOT a literal translation or something else)
  - "HALAWA TECHNICAL SERVICES EST." -> "مؤسسة حلاوة للخدمات الفنية" or "حلاوة للخدمات الفنية"
  - "AL NOOR" -> "النور"
  - "AL MANAR" -> "المنار"
  - "BIN LADEN" -> "بن لادن"
  - "EMIRATES" -> "الإمارات"
  - "GOLDEN FALCON" -> "الصقر الذهبي" or "جولدن فالكون"
  - "SAMIR TRADING" -> "سمير للتجارة"
  - "AHMED CONTRACTING" -> "أحمد للمقاولات"
  - "ALEXANDRIA" -> "الإسكندرية"
  - "MAX ENTERPRISES" -> "ماكس للمشاريع"
  - "APEX CONSULTANCY" -> "أبيكس للاستشارات"
- Standard company suffix words:
  - "EST." or "ESTABLISHMENT" -> "مؤسسة"
  - "LLC" or "L.L.C" -> "ش.ذ.م.م"
  - "SERVICES" -> "للخدمات" (or "خدمات")
  - "TECHNICAL" -> "الفنية"
  - "TRADING" -> "للتجارة"
  - "CONTRACTING" -> "للمقاولات"
  - "CONSULTANCY" -> "للاستشارات"
  - "GENERAL TRADING" -> "للتجارة العامة"
- Return ONLY the final clean Arabic text on a single line.
- Do NOT output explanations, transliteration keys, quotes, English text, or pronunciation marks.

English text:
"${text.trim()}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const arabicText = response.text ? response.text.trim().replace(/^["']|["']$/g, '') : '';

    return NextResponse.json({
      arabic: arabicText || fallbackTransliterate(text),
    });
  } catch (error: unknown) {
    console.error('Conversion error:', error);
    const body = await req.json().catch(() => ({ text: '' }));
    return NextResponse.json({
      arabic: fallbackTransliterate(body.text || ''),
      fallback: true,
    });
  }
}

// Built-in intelligent transliteration & trade name conversion dictionary
function fallbackTransliterate(eng: string): string {
  const clean = eng.trim();
  const lower = clean.toLowerCase();

  const knownMap: Record<string, string> = {
    'halawa': 'حلاوة',
    'halawa technical services': 'حلاوة للخدمات الفنية',
    'halawa technical services est.': 'مؤسسة حلاوة للخدمات الفنية',
    'halawa technical services est': 'مؤسسة حلاوة للخدمات الفنية',
    'department of economy & tourism': 'دائرة الاقتصاد والسياحة',
    'kingdom of saudi arabia - c.r.': 'المملكة العربية السعودية - السجل التجاري',
    'certified true copy & official': 'صورة طبق الأصل معتمدة رسمياً',
    'quality assurance & qc passed': 'إدارة الجودة وضمان الجودة معتمد',
    'general trading llc': 'للتجارة العامة ش.ذ.م.م',
    'technical services': 'خدمات فنية',
    'approved': 'معتمد',
    'rejected': 'مرفوض',
    'paid': 'مدفوع',
    'received': 'تم الاستلام',
    'certified true copy': 'صورة طبق الأصل',
    'dubai - uae': 'دبي - الإمارات العربية المتحدة',
  };

  if (knownMap[lower]) {
    return knownMap[lower];
  }

  // Common Arabizations for name words
  const words = clean.split(/\s+/);
  const translatedWords = words.map((w) => {
    const lw = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    const wordMap: Record<string, string> = {
      halawa: 'حلاوة',
      hilal: 'هلال',
      noor: 'نور',
      al: 'ال',
      ahmed: 'أحمد',
      samir: 'سمير',
      tariq: 'طارق',
      khalid: 'خالد',
      mohammed: 'محمد',
      ali: 'علي',
      omar: 'عمر',
      hassan: 'حسن',
      hussain: 'حسين',
      zayed: 'زايد',
      rashid: 'راشد',
      dubai: 'دبي',
      sharjah: 'الشارقة',
      abu: 'أبو',
      dhabi: 'ظبي',
      riyadh: 'الرياض',
      technical: 'الفنية',
      services: 'للخدمات',
      trading: 'للتجارة',
      contracting: 'للمقاولات',
      consultancy: 'للاستشارات',
      engineering: 'الهندسية',
      management: 'الإدارة',
      commercial: 'التجارية',
      general: 'العامة',
      company: 'شركة',
      group: 'مجموعة',
      est: 'مؤسسة',
      llc: 'ش.ذ.م.م',
    };

    if (wordMap[lw]) {
      return wordMap[lw];
    }

    return phoneticLetterTransliterate(w);
  });

  return translatedWords.join(' ');
}

// Simple phonetic transliterator for English words to Arabic letters
function phoneticLetterTransliterate(word: string): string {
  // Simple phonetic map
  const charMap: Record<string, string> = {
    th: 'ث',
    sh: 'ش',
    kh: 'خ',
    dh: 'ذ',
    gh: 'غ',
    ph: 'ف',
    ch: 'تش',
    a: 'ا',
    b: 'ب',
    c: 'ك',
    d: 'د',
    e: 'ي',
    f: 'ف',
    g: 'ج',
    h: 'ه',
    i: 'ي',
    j: 'ج',
    k: 'ك',
    l: 'ل',
    m: 'م',
    n: 'ن',
    o: 'و',
    p: 'ب',
    q: 'ق',
    r: 'ر',
    s: 'س',
    t: 'ت',
    u: 'و',
    v: 'ف',
    w: 'و',
    x: 'كس',
    y: 'ي',
    z: 'ز',
  };

  let str = word.toLowerCase();
  let out = '';
  let i = 0;
  while (i < str.length) {
    const two = str.substr(i, 2);
    if (charMap[two]) {
      out += charMap[two];
      i += 2;
    } else {
      const one = str.substr(i, 1);
      out += charMap[one] || one;
      i += 1;
    }
  }
  return out;
}
