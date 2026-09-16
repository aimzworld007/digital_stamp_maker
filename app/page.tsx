'use client';

import React, { useState, useRef } from 'react';

// Supported Stamp Shapes
export type StampShape = 'circle' | 'rectangle' | 'oval' | 'square';

interface StampPreset {
  id: string;
  name: string;
  shape: StampShape;
  stampColor: string;
  arabicFont: string;
  englishFont: string;
  vintageIntensity: number;
  topText: string;
  topFontSize: number;
  bottomText: string;
  bottomFontSize: number;
  centerLine1: string;
  centerLine1Size: number;
  centerLine2: string;
  centerLine2Size: number;
  starSymbol: string;
  starSize: number;
}

const OFFICIAL_PRESETS: StampPreset[] = [
  {
    id: 'halawa-technical',
    name: 'Halawa Technical Services (Circle - Commercial)',
    shape: 'circle',
    stampColor: '#0b32a4',
    arabicFont: "'Cairo', sans-serif",
    englishFont: "'Roboto Condensed', sans-serif",
    vintageIntensity: 0,
    topText: 'مؤسسة حلاوة للخدمات الفنية',
    topFontSize: 28,
    bottomText: 'HALAWA TECHNICAL SERVICES EST.',
    bottomFontSize: 22,
    centerLine1: 'P.O. BOX: 2235',
    centerLine1Size: 32,
    centerLine2: 'DUBAI - UAE',
    centerLine2Size: 30,
    starSymbol: '★',
    starSize: 26,
  },
  {
    id: 'dubai-ded',
    name: 'Dubai Economy & Tourism (Circle - Government)',
    shape: 'circle',
    stampColor: '#0b32a4',
    arabicFont: "'Cairo', sans-serif",
    englishFont: "'Roboto Condensed', sans-serif",
    vintageIntensity: 15,
    topText: 'دائرة الاقتصاد والسياحة - حكومة دبي',
    topFontSize: 26,
    bottomText: 'DEPARTMENT OF ECONOMY & TOURISM',
    bottomFontSize: 21,
    centerLine1: 'COMMERCIAL LICENSE: 584920',
    centerLine1Size: 28,
    centerLine2: 'GOVERNMENT OF DUBAI',
    centerLine2Size: 27,
    starSymbol: '✦',
    starSize: 24,
  },
  {
    id: 'saudi-cr-oval',
    name: 'Ministry of Commerce - C.R. (Oval - Notary)',
    shape: 'oval',
    stampColor: '#065f46',
    arabicFont: "'Cairo', sans-serif",
    englishFont: "'Oswald', sans-serif",
    vintageIntensity: 25,
    topText: 'المملكة العربية السعودية - السجل التجاري',
    topFontSize: 24,
    bottomText: 'KINGDOM OF SAUDI ARABIA - C.R.',
    bottomFontSize: 20,
    centerLine1: 'C.R. NO: 1010482910',
    centerLine1Size: 26,
    centerLine2: 'RIYADH - SAUDI ARABIA',
    centerLine2Size: 24,
    starSymbol: '❖',
    starSize: 22,
  },
  {
    id: 'certified-rectangle',
    name: 'Certified True Copy (Rectangle - Attestation)',
    shape: 'rectangle',
    stampColor: '#991b1b',
    arabicFont: "'Cairo', sans-serif",
    englishFont: "'Roboto Condensed', sans-serif",
    vintageIntensity: 20,
    topText: 'صورة طبق الأصل معتمدة رسمياً',
    topFontSize: 24,
    bottomText: 'CERTIFIED TRUE COPY & OFFICIAL',
    bottomFontSize: 20,
    centerLine1: 'VERIFIED & ATTESTED',
    centerLine1Size: 28,
    centerLine2: 'LEGAL TRANSLATION DEPT.',
    centerLine2Size: 24,
    starSymbol: '✔',
    starSize: 24,
  },
  {
    id: 'qc-pass-square',
    name: 'Quality Assurance & QC Pass (Square - Inspection)',
    shape: 'square',
    stampColor: '#1e293b',
    arabicFont: "'Cairo', sans-serif",
    englishFont: "'Oswald', sans-serif",
    vintageIntensity: 35,
    topText: 'إدارة الجودة والمواصفات والمقاييس',
    topFontSize: 24,
    bottomText: 'QUALITY ASSURANCE & QC PASSED',
    bottomFontSize: 20,
    centerLine1: 'INSPECTION ID: QC-9481',
    centerLine1Size: 26,
    centerLine2: 'BATCH VERIFIED 2026',
    centerLine2Size: 24,
    starSymbol: '✪',
    starSize: 24,
  },
];

export default function BilingualStampConstructor() {
  // Shape State
  const [shape, setShape] = useState<StampShape>('circle');

  // Selected preset tracking
  const [selectedPresetId, setSelectedPresetId] = useState<string>('halawa-technical');

  // Color & Fonts
  const [stampColor, setStampColor] = useState<string>('#0b32a4');
  const [arabicFont, setArabicFont] = useState<string>("'Cairo', sans-serif");
  const [englishFont, setEnglishFont] = useState<string>("'Roboto Condensed', sans-serif");

  // Vintage Distress Texture (0% - 100%)
  const [vintageIntensity, setVintageIntensity] = useState<number>(0);

  // Top Curved Arabic Text
  const [topText, setTopText] = useState<string>('مؤسسة حلاوة للخدمات الفنية');
  const [topFontSize, setTopFontSize] = useState<number>(28);

  // Bottom Curved English Text
  const [bottomText, setBottomText] = useState<string>('HALAWA TECHNICAL SERVICES EST.');
  const [bottomFontSize, setBottomFontSize] = useState<number>(22);

  // Center Content Lines
  const [centerLine1, setCenterLine1] = useState<string>('P.O. BOX: 2235');
  const [centerLine1Size, setCenterLine1Size] = useState<number>(32);
  const [centerLine2, setCenterLine2] = useState<string>('DUBAI - UAE');
  const [centerLine2Size, setCenterLine2Size] = useState<number>(30);

  // Side Separators
  const [starSymbol, setStarSymbol] = useState<string>('★');
  const [starSize, setStarSize] = useState<number>(26);

  // SVG ref for high-res export
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Preset selector handler
  const handleSelectPreset = (presetId: string) => {
    const preset = OFFICIAL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setShape(preset.shape);
    setStampColor(preset.stampColor);
    setArabicFont(preset.arabicFont);
    setEnglishFont(preset.englishFont);
    setVintageIntensity(preset.vintageIntensity);
    setTopText(preset.topText);
    setTopFontSize(preset.topFontSize);
    setBottomText(preset.bottomText);
    setBottomFontSize(preset.bottomFontSize);
    setCenterLine1(preset.centerLine1);
    setCenterLine1Size(preset.centerLine1Size);
    setCenterLine2(preset.centerLine2);
    setCenterLine2Size(preset.centerLine2Size);
    setStarSymbol(preset.starSymbol);
    setStarSize(preset.starSize);
  };

  // -------------------------------------------------------------
  // REAL-TIME VINTAGE INK FILTER CALCULATION
  // -------------------------------------------------------------
  const freq = (0.05 + (vintageIntensity / 100) * 0.15).toFixed(3);
  const alphaMult = 4 + (vintageIntensity / 100) * 20;
  const alphaOffset = -1 - (vintageIntensity / 100) * 8;
  const colorMatrixValues = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alphaMult} ${alphaOffset}`;

  // -------------------------------------------------------------
  // EXPORT ENGINE: SVG & HIGH-RESOLUTION PNG (1200x1200)
  // -------------------------------------------------------------
  const getSvgString = (): string => {
    if (!svgRef.current) return '';
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgRef.current);
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return svgString;
  };

  const exportSVG = () => {
    const svgString = getSvgString();
    if (!svgString) return;

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `bilingual-stamp-${shape}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPNG = async () => {
    if (!svgRef.current) return;

    // Ensure web fonts are rendered
    if (document.fonts) {
      await document.fonts.ready;
    }

    const svgString = getSvgString();
    const canvas = document.createElement('canvas');
    const exportSize = 1200; // Ultra High Resolution
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.clearRect(0, 0, exportSize, exportSize);
        ctx.drawImage(img, 0, 0, exportSize, exportSize);
        URL.revokeObjectURL(url);

        const link = document.createElement('a');
        link.download = `bilingual-stamp-${shape}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = url;
  };

  // -------------------------------------------------------------
  // SHAPE-BASED SVG GEOMETRIES
  // -------------------------------------------------------------
  const renderStampContent = () => {
    switch (shape) {
      case 'oval':
        return (
          <>
            {/* Defs for Oval arcs */}
            <defs>
              {/* Top Oval Arc */}
              <path id="topOvalArc" d="M 60,250 A 190,125 0 0,1 440,250" fill="none" />
              {/* Bottom Oval Arc */}
              <path id="bottomOvalArc" d="M 60,250 A 190,125 0 0,0 440,250" fill="none" />
            </defs>

            {/* Outer Thick Oval */}
            <ellipse cx="250" cy="250" rx="232" ry="160" fill="none" stroke={stampColor} strokeWidth="5" />
            {/* Outer Thin Oval */}
            <ellipse cx="250" cy="250" rx="222" ry="150" fill="none" stroke={stampColor} strokeWidth="2" />
            {/* Inner Oval */}
            <ellipse cx="250" cy="250" rx="160" ry="100" fill="none" stroke={stampColor} strokeWidth="3" />

            {/* Top Text (Arabic Curve) */}
            <text fontFamily={arabicFont} fontWeight="bold" fill={stampColor}>
              <textPath href="#topOvalArc" startOffset="50%" textAnchor="middle" fontSize={topFontSize}>
                {topText}
              </textPath>
            </text>

            {/* Bottom Text (English Curve) */}
            <text fontFamily={englishFont} fontWeight="bold" fill={stampColor} letterSpacing="1px">
              <textPath href="#bottomOvalArc" startOffset="50%" textAnchor="middle" fontSize={bottomFontSize}>
                {bottomText}
              </textPath>
            </text>

            {/* Side Stars */}
            <text x="68" y="258" fontFamily="Arial, sans-serif" fontSize={starSize} fill={stampColor} textAnchor="middle">
              {starSymbol}
            </text>
            <text x="432" y="258" fontFamily="Arial, sans-serif" fontSize={starSize} fill={stampColor} textAnchor="middle">
              {starSymbol}
            </text>

            {/* Center Content Lines */}
            <text
              x="250"
              y="235"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine1Size}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine1}
            </text>
            <text
              x="250"
              y="278"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine2Size}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine2}
            </text>
          </>
        );

      case 'rectangle':
        return (
          <>
            {/* Outer Thick Rectangle */}
            <rect x="25" y="80" width="450" height="340" rx="14" fill="none" stroke={stampColor} strokeWidth="5" />
            {/* Outer Thin Rectangle */}
            <rect x="35" y="90" width="430" height="320" rx="10" fill="none" stroke={stampColor} strokeWidth="2" />
            {/* Inner Border Box */}
            <rect x="55" y="110" width="390" height="280" rx="6" fill="none" stroke={stampColor} strokeWidth="2.5" />

            {/* Top Horizontal Dividing Bar */}
            <line x1="55" y1="170" x2="445" y2="170" stroke={stampColor} strokeWidth="2" />
            {/* Bottom Horizontal Dividing Bar */}
            <line x1="55" y1="330" x2="445" y2="330" stroke={stampColor} strokeWidth="2" />

            {/* Top Arabic Text (Header Box) */}
            <text
              x="250"
              y="150"
              fontFamily={arabicFont}
              fontWeight="bold"
              fontSize={topFontSize}
              fill={stampColor}
              textAnchor="middle"
            >
              {topText}
            </text>

            {/* Side Stars on Center Row */}
            <text x="82" y="258" fontFamily="Arial, sans-serif" fontSize={starSize} fill={stampColor} textAnchor="middle">
              {starSymbol}
            </text>
            <text x="418" y="258" fontFamily="Arial, sans-serif" fontSize={starSize} fill={stampColor} textAnchor="middle">
              {starSymbol}
            </text>

            {/* Center Content Lines */}
            <text
              x="250"
              y="235"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine1Size}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine1}
            </text>
            <text
              x="250"
              y="280"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine2Size}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine2}
            </text>

            {/* Bottom English Text (Footer Box) */}
            <text
              x="250"
              y="370"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={bottomFontSize}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {bottomText}
            </text>
          </>
        );

      case 'square':
        return (
          <>
            {/* Outer Thick Square */}
            <rect x="35" y="35" width="430" height="430" rx="14" fill="none" stroke={stampColor} strokeWidth="5" />
            {/* Outer Thin Square */}
            <rect x="45" y="45" width="410" height="410" rx="10" fill="none" stroke={stampColor} strokeWidth="2" />
            {/* Inner Border Box */}
            <rect x="68" y="68" width="364" height="364" rx="6" fill="none" stroke={stampColor} strokeWidth="2.5" />

            {/* Top Horizontal Dividing Bar */}
            <line x1="68" y1="145" x2="432" y2="145" stroke={stampColor} strokeWidth="2" />
            {/* Bottom Horizontal Dividing Bar */}
            <line x1="68" y1="355" x2="432" y2="355" stroke={stampColor} strokeWidth="2" />

            {/* Top Arabic Text */}
            <text
              x="250"
              y="120"
              fontFamily={arabicFont}
              fontWeight="bold"
              fontSize={topFontSize}
              fill={stampColor}
              textAnchor="middle"
            >
              {topText}
            </text>

            {/* Side Stars on Center Row */}
            <text x="96" y="258" fontFamily="Arial, sans-serif" fontSize={starSize} fill={stampColor} textAnchor="middle">
              {starSymbol}
            </text>
            <text x="404" y="258" fontFamily="Arial, sans-serif" fontSize={starSize} fill={stampColor} textAnchor="middle">
              {starSymbol}
            </text>

            {/* Center Content Lines */}
            <text
              x="250"
              y="235"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine1Size}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine1}
            </text>
            <text
              x="250"
              y="285"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine2Size}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine2}
            </text>

            {/* Bottom English Text */}
            <text
              x="250"
              y="395"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={bottomFontSize}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {bottomText}
            </text>
          </>
        );

      case 'circle':
      default:
        return (
          <>
            <defs>
              {/* Top Curve Path (Clockwise Arc for Top Arabic) */}
              <path id="topArcPath" d="M 68,250 A 182,182 0 0,1 432,250" fill="none" />
              {/* Bottom Curve Path (Left-to-Right Arc for Bottom English) */}
              <path id="bottomArcPath" d="M 68,250 A 182,182 0 0,0 432,250" fill="none" />
            </defs>

            {/* OUTER DOUBLE RING BORDER */}
            {/* Outer Thick Ring */}
            <circle cx="250" cy="250" r="232" fill="none" stroke={stampColor} strokeWidth="5" />
            {/* Outer Thin Ring */}
            <circle cx="250" cy="250" r="222" fill="none" stroke={stampColor} strokeWidth="2" />
            {/* Inner Ring */}
            <circle cx="250" cy="250" r="150" fill="none" stroke={stampColor} strokeWidth="3" />

            {/* TOP CURVED ARABIC TEXT */}
            <text fontFamily={arabicFont} fontWeight="bold" fill={stampColor}>
              <textPath href="#topArcPath" startOffset="50%" textAnchor="middle" id="svgTopText" fontSize={topFontSize}>
                {topText}
              </textPath>
            </text>

            {/* BOTTOM CURVED ENGLISH TEXT */}
            <text fontFamily={englishFont} fontWeight="bold" fill={stampColor} letterSpacing="1px">
              <textPath href="#bottomArcPath" startOffset="50%" textAnchor="middle" id="svgBottomText" fontSize={bottomFontSize}>
                {bottomText}
              </textPath>
            </text>

            {/* SIDE SEPARATOR STARS */}
            <text id="starLeft" x="78" y="258" fontFamily="Arial, sans-serif" fontSize={starSize} fill={stampColor} textAnchor="middle">
              {starSymbol}
            </text>
            <text id="starRight" x="422" y="258" fontFamily="Arial, sans-serif" fontSize={starSize} fill={stampColor} textAnchor="middle">
              {starSymbol}
            </text>

            {/* CENTER CONTENT (LINE 1 & LINE 2) */}
            <text
              id="svgCenterLine1"
              x="250"
              y="228"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine1Size}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine1}
            </text>
            <text
              id="svgCenterLine2"
              x="250"
              y="278"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine2Size}
              fill={stampColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine2}
            </text>
          </>
        );
    }
  };

  return (
    <div
      id="bilingual-stamp-constructor-app"
      className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-100 text-slate-800 font-sans"
    >
      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR CONTROL PANEL (380px fixed width matching HTML) */}
      {/* ------------------------------------------------------------- */}
      <aside
        id="sidebar-panel"
        className="w-full md:w-[380px] bg-white border-r border-slate-300 flex flex-col h-full shrink-0 shadow-md z-10"
      >
        {/* Header */}
        <div id="sidebar-header" className="px-5 py-4 bg-slate-900 text-white shrink-0">
          <h2 className="m-0 text-lg font-semibold tracking-tight">Bilingual Stamp Constructor</h2>
        </div>

        {/* Controls Body */}
        <div
          id="controls-body"
          className="p-4 overflow-y-auto flex-grow flex flex-col gap-3 scrollbar-thin scrollbar-thumb-slate-300"
        >
          {/* Card: Stamp Shape Switcher */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Stamp Shape
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'circle', label: 'Circle' },
                { id: 'oval', label: 'Oval' },
                { id: 'rectangle', label: 'Rectangle' },
                { id: 'square', label: 'Square' },
              ].map((s) => (
                <button
                  key={s.id}
                  id={`shape-btn-${s.id}`}
                  onClick={() => setShape(s.id as StampShape)}
                  className={`py-2 px-1 rounded text-xs font-semibold border transition cursor-pointer text-center ${
                    shape === s.id
                      ? 'bg-[#0b32a4] text-white border-[#0b32a4] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card: Official Stamp Presets */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Official Template Preset
            </div>
            <select
              id="officialPresetSelect"
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white font-medium focus:border-blue-700 focus:outline-none cursor-pointer"
            >
              {OFFICIAL_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Card 1: Color & Font Style */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Color & Font Style
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="stampColor" className="text-xs font-semibold text-slate-700">
                Ink Color
              </label>
            </div>
            <input
              type="color"
              id="stampColor"
              value={stampColor}
              onChange={(e) => setStampColor(e.target.value)}
              className="w-full h-9 border-0 rounded cursor-pointer p-0 bg-transparent"
            />

            <div className="flex items-center justify-between mt-1">
              <label htmlFor="arabicFont" className="text-xs font-semibold text-slate-700">
                Arabic Font
              </label>
            </div>
            <select
              id="arabicFont"
              value={arabicFont}
              onChange={(e) => setArabicFont(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white focus:border-blue-700 focus:outline-none"
            >
              <option value="'Cairo', sans-serif">Cairo (Bold)</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Segoe UI', sans-serif">Segoe UI</option>
              <option value="'Tahoma', sans-serif">Tahoma</option>
            </select>

            <div className="flex items-center justify-between mt-1">
              <label htmlFor="englishFont" className="text-xs font-semibold text-slate-700">
                English Font
              </label>
            </div>
            <select
              id="englishFont"
              value={englishFont}
              onChange={(e) => setEnglishFont(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white focus:border-blue-700 focus:outline-none"
            >
              <option value="'Roboto Condensed', sans-serif">Roboto Condensed (Default)</option>
              <option value="'Oswald', sans-serif">Oswald</option>
              <option value="Arial, sans-serif">Arial Bold</option>
              <option value="Impact, sans-serif">Impact</option>
            </select>
          </div>

          {/* Card 2: Vintage Distress Texture */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Stamp Ink Texture (Vintage Wear)
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="vintageIntensity" className="text-xs font-semibold text-slate-700">
                Texture Intensity
              </label>
              <span id="vintageVal" className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                {vintageIntensity}%
              </span>
            </div>
            <input
              type="range"
              id="vintageIntensity"
              min="0"
              max="100"
              value={vintageIntensity}
              onChange={(e) => setVintageIntensity(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-blue-700"
            />
          </div>

          {/* Card 3: Top Curved / Header Arabic Text */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Top Text (Arabic {shape === 'rectangle' || shape === 'square' ? 'Header' : 'Curve'})
            </div>
            <input
              type="text"
              id="topText"
              value={topText}
              dir="rtl"
              onChange={(e) => setTopText(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white text-right font-arabic focus:border-blue-700 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <label htmlFor="topFontSize" className="text-xs font-semibold text-slate-700">
                Font Size
              </label>
              <span id="topSizeVal" className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                {topFontSize}px
              </span>
            </div>
            <input
              type="range"
              id="topFontSize"
              min="14"
              max="42"
              value={topFontSize}
              onChange={(e) => setTopFontSize(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-blue-700"
            />
          </div>

          {/* Card 4: Bottom Curved / Footer English Text */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Bottom Text (English {shape === 'rectangle' || shape === 'square' ? 'Footer' : 'Curve'})
            </div>
            <input
              type="text"
              id="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white focus:border-blue-700 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <label htmlFor="bottomFontSize" className="text-xs font-semibold text-slate-700">
                Font Size
              </label>
              <span id="bottomSizeVal" className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                {bottomFontSize}px
              </span>
            </div>
            <input
              type="range"
              id="bottomFontSize"
              min="12"
              max="36"
              value={bottomFontSize}
              onChange={(e) => setBottomFontSize(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-blue-700"
            />
          </div>

          {/* Card 5: Center Content Line 1 & Line 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Center Lines
            </div>
            <label htmlFor="centerLine1" className="text-xs font-semibold text-slate-700">
              Line 1 (e.g. P.O. BOX)
            </label>
            <input
              type="text"
              id="centerLine1"
              value={centerLine1}
              onChange={(e) => setCenterLine1(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white focus:border-blue-700 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <label htmlFor="centerLine1Size" className="text-xs font-semibold text-slate-700">
                Line 1 Size
              </label>
              <span id="line1SizeVal" className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                {centerLine1Size}px
              </span>
            </div>
            <input
              type="range"
              id="centerLine1Size"
              min="16"
              max="50"
              value={centerLine1Size}
              onChange={(e) => setCenterLine1Size(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-blue-700"
            />

            <label htmlFor="centerLine2" className="text-xs font-semibold text-slate-700 mt-1">
              Line 2 (e.g. City/Country)
            </label>
            <input
              type="text"
              id="centerLine2"
              value={centerLine2}
              onChange={(e) => setCenterLine2(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white focus:border-blue-700 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <label htmlFor="centerLine2Size" className="text-xs font-semibold text-slate-700">
                Line 2 Size
              </label>
              <span id="line2SizeVal" className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                {centerLine2Size}px
              </span>
            </div>
            <input
              type="range"
              id="centerLine2Size"
              min="16"
              max="50"
              value={centerLine2Size}
              onChange={(e) => setCenterLine2Size(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-blue-700"
            />
          </div>

          {/* Card 6: Side Separators */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Side Separators
            </div>
            <div className="flex items-center justify-between gap-2.5">
              <label htmlFor="starSymbol" className="text-xs font-semibold text-slate-700">
                Left/Right Symbol
              </label>
              <input
                type="text"
                id="starSymbol"
                value={starSymbol}
                onChange={(e) => setStarSymbol(e.target.value)}
                className="w-[60px] text-center p-2 border border-slate-300 rounded text-[13px] bg-white focus:border-blue-700 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="starSize" className="text-xs font-semibold text-slate-700">
                Symbol Size
              </label>
              <span id="starSizeVal" className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                {starSize}px
              </span>
            </div>
            <input
              type="range"
              id="starSize"
              min="12"
              max="40"
              value={starSize}
              onChange={(e) => setStarSize(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-blue-700"
            />
          </div>
        </div>

        {/* Actions Footer */}
        <div id="sidebar-actions" className="p-4 bg-white border-t border-slate-300 flex gap-2.5 shrink-0">
          <button
            id="download-png-btn"
            onClick={exportPNG}
            className="flex-1 py-3 px-2 bg-[#0b32a4] hover:bg-[#082476] text-white rounded-md font-bold text-[13px] transition duration-200 cursor-pointer shadow-sm text-center"
          >
            Download High-Res PNG
          </button>
          <button
            id="download-svg-btn"
            onClick={exportSVG}
            className="flex-1 py-3 px-2 bg-[#334155] hover:bg-[#1e293b] text-white rounded-md font-bold text-[13px] transition duration-200 cursor-pointer shadow-sm text-center"
          >
            Download SVG
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* PREVIEW STAGE (Dot grid + White Card Container) */}
      {/* ------------------------------------------------------------- */}
      <main
        id="preview-stage"
        className="flex-grow flex items-center justify-center overflow-auto p-4"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          id="stamp-card-container"
          className="bg-white p-6 sm:p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center max-w-full"
        >
          <svg
            ref={svgRef}
            id="stampSvg"
            width="500"
            height="500"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            className="block max-w-full max-h-[75vh] w-auto h-auto select-none"
          >
            <defs>
              {/* Ink Grunge Texture Filter */}
              <filter id="grungeFilter" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  id="feTurb"
                  baseFrequency={freq}
                  numOctaves="3"
                  result="noise"
                />
                <feColorMatrix
                  type="matrix"
                  id="feMatrix"
                  values={colorMatrixValues}
                  result="distress"
                />
                <feComposite in="SourceGraphic" in2="distress" operator="in" />
              </filter>
            </defs>

            {/* Stamp Content Group with Grunge Filter */}
            <g id="stampGroup" filter={vintageIntensity > 0 ? 'url(#grungeFilter)' : undefined}>
              {renderStampContent()}
            </g>
          </svg>
        </div>
      </main>
    </div>
  );
}
