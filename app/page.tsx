'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Sparkles, Loader2, Upload, Image as ImageIcon, X } from 'lucide-react';

// Supported Stamp Shapes
export type StampShape = 'circle' | 'rectangle' | 'oval' | 'square';

// Control Modes
export type ControlMode = 'normal' | 'advanced';

// Border Styles
export type BorderStyle = 'double' | 'single' | 'dashed' | 'dotted';



export default function BilingualStampConstructor() {
  // Mode Switcher: Normal (Essential) vs Customize / Advanced
  const [controlMode, setControlMode] = useState<ControlMode>('normal');

  // Shape State
  const [shape, setShape] = useState<StampShape>('circle');


  // Basic (Normal Mode) Controls
  const [stampColor, setStampColor] = useState<string>('#0b32a4');
  const [arabicFont, setArabicFont] = useState<string>("'Cairo', sans-serif");
  const [englishFont, setEnglishFont] = useState<string>("'Roboto Condensed', sans-serif");
  const [vintageIntensity, setVintageIntensity] = useState<number>(0);

  // TEXT CONFIGURATION:
  // Top Text is English (Header/Top arc)
  // Bottom Text is Arabic (Footer/Bottom arc)
  const [topEnglishText, setTopEnglishText] = useState<string>('HALAWA TECHNICAL SERVICES EST.');
  const [topFontSize, setTopFontSize] = useState<number>(23);
  const [bottomArabicText, setBottomArabicText] = useState<string>('مؤسسة حلاوة للخدمات الفنية');
  const [bottomFontSize, setBottomFontSize] = useState<number>(27);

  // Auto-Translation State
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationStatus, setTranslationStatus] = useState<string>('');
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Center Content Lines
  const [centerLine1, setCenterLine1] = useState<string>('P.O. BOX: 2235');
  const [centerLine1Size, setCenterLine1Size] = useState<number>(32);
  const [centerLine2, setCenterLine2] = useState<string>('DUBAI - UAE');
  const [centerLine2Size, setCenterLine2Size] = useState<number>(30);

  // Optional Center Uploaded Logo / Graphic
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(70);
  const [logoOffsetY, setLogoOffsetY] = useState<number>(0);
  const [logoColorMode, setLogoColorMode] = useState<'stamp' | 'original'>('stamp');
  const [showCenterLinesWithLogo, setShowCenterLinesWithLogo] = useState<boolean>(true);
  const [isDraggingLogo, setIsDraggingLogo] = useState<boolean>(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setUploadedLogo(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoFile(e.target.files[0]);
    }
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  // Side Separators (Left & Right)
  const [starSymbol, setStarSymbol] = useState<string>('★');
  const [starSize, setStarSize] = useState<number>(26);
  // Auto-adjust side separators dynamically based on Top (English) & Bottom (Arabic) text
  const [autoAdjustSeparators, setAutoAdjustSeparators] = useState<boolean>(true);
  // Side Separators manual fine-tuning: Left to Right (spacing/offset) and Up to Down (vertical offset)
  const [starOffsetX, setStarOffsetX] = useState<number>(0); // -40 (closer/inward) to +40 (wider/outward)
  const [starOffsetY, setStarOffsetY] = useState<number>(0); // -50 (up) to +50 (down)

  // Auto-adjustment calculation based on Top Text (English) and Bottom Text (Arabic) length & font sizes
  const autoSeparatorOffsets = useMemo(() => {
    if (!autoAdjustSeparators) {
      return { autoX: 0, autoY: 0, topExtent: 0, bottomExtent: 0 };
    }

    const topChars = topEnglishText ? topEnglishText.trim().length : 0;
    const bottomChars = bottomArabicText ? bottomArabicText.trim().length : 0;

    // Approximate rendered arc length in pixels
    const topExtent = topChars * (topFontSize * 0.58);
    const bottomExtent = bottomChars * (bottomFontSize * 0.64);

    // Difference between top and bottom extent:
    // If top text is longer than bottom text, the visual gap shifts down (+Y)
    // If bottom text is longer than top text, the visual gap shifts up (-Y)
    const diff = topExtent - bottomExtent;
    const autoY = Math.round(Math.max(-28, Math.min(28, diff * 0.085)));

    // Perimeter occupied:
    const totalOccupied = topExtent + bottomExtent;
    let autoX = 0;
    if (totalOccupied > 460) {
      // Long text: push separators outward slightly to prevent overlapping text ends
      autoX = Math.round(Math.min(22, (totalOccupied - 460) * 0.065));
    } else if (totalOccupied < 260 && totalOccupied > 0) {
      // Short text: draw separators inward slightly for optimal aesthetic balance
      autoX = Math.round(Math.max(-16, (totalOccupied - 260) * 0.06));
    }

    return {
      autoX,
      autoY,
      topExtent: Math.round(topExtent),
      bottomExtent: Math.round(bottomExtent),
    };
  }, [autoAdjustSeparators, topEnglishText, topFontSize, bottomArabicText, bottomFontSize]);

  const effectiveOffsetX = autoSeparatorOffsets.autoX + starOffsetX;
  const effectiveOffsetY = autoSeparatorOffsets.autoY + starOffsetY;

  // -------------------------------------------------------------
  // ADVANCED / CUSTOMIZE MODE FEATURES (OPTIONAL)
  // -------------------------------------------------------------
  // Stamp Rotation Angle (-25° to +25°)
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  // Stamp Ink Opacity (30% to 100%)
  const [inkOpacity, setInkOpacity] = useState<number>(100);

  // Date Ribbon in Center (Optional)
  const [includeDate, setIncludeDate] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<string>('16 SEP 2026');
  const [dateFontSize, setDateFontSize] = useState<number>(20);

  // Border Style (Double, Single, Dashed, Dotted)
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('double');

  // Center Official Emblem (Optional)
  const [includeEmblem, setIncludeEmblem] = useState<boolean>(false);
  const [selectedEmblem, setSelectedEmblem] = useState<string>('eagle');

  // Inverted Stamp Mode (Solid filled stamp)
  const [invertStamp, setInvertStamp] = useState<boolean>(false);

  // Paper Document Mockup in Preview
  const [paperMockup, setPaperMockup] = useState<boolean>(false);

  // SVG ref for export
  const svgRef = useRef<SVGSVGElement | null>(null);

  // -------------------------------------------------------------
  // TRANSLATION & CONVERSION ENGINE: English -> Phonetic / Official Arabic
  // -------------------------------------------------------------
  const translateToOfficialArabic = async (textToTranslate: string) => {
    if (!textToTranslate.trim()) return;
    setIsTranslating(true);
    setTranslationStatus('Converting to Arabic...');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToTranslate }),
      });

      if (!res.ok) {
        throw new Error('Translation failed');
      }

      const data = await res.json();
      if (data.arabic) {
        setBottomArabicText(data.arabic);
        setTranslationStatus('Converted to Arabic');
        setTimeout(() => setTranslationStatus(''), 3000);
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslationStatus('Conversion error');
      setTimeout(() => setTranslationStatus(''), 3000);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle English input change with debounced auto-translation
  const handleEnglishChange = (value: string) => {
    setTopEnglishText(value);

    if (autoTranslateEnabled) {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
      translationTimeoutRef.current = setTimeout(() => {
        translateToOfficialArabic(value);
      }, 700);
    }
  };

  // Manual Trigger translation button
  const handleManualTranslate = () => {
    translateToOfficialArabic(topEnglishText);
  };


  // Quick Random Tilt
  const applyRandomTilt = () => {
    const angles = [-6, -4, -3, -2, 2, 3, 5, 7];
    const rand = angles[Math.floor(Math.random() * angles.length)];
    setRotationAngle(rand);
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

    if (document.fonts) {
      await document.fonts.ready;
    }

    const svgString = getSvgString();
    const canvas = document.createElement('canvas');
    const exportSize = 1200;
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

  // Helper for stroke-dasharray based on border style
  const getStrokeDash = () => {
    if (borderStyle === 'dashed') return '10, 6';
    if (borderStyle === 'dotted') return '3, 6';
    return undefined;
  };

  // Center Emblem SVG elements
  const renderEmblem = (cx: number, cy: number, scale: number = 1) => {
    if (!includeEmblem) return null;
    const color = invertStamp ? '#ffffff' : stampColor;
    return (
      <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        {selectedEmblem === 'eagle' && (
          // Official Falcon / Eagle Emblem
          <g fill={color} stroke={color} strokeWidth="0.5">
            <path d="M-18,-6 C-12,-16 0,-18 0,-18 C0,-18 12,-16 18,-6 C12,-8 4,-6 0,-2 C-4,-6 -12,-8 -18,-6 Z" />
            <path d="M-22,-2 C-14,4 -8,12 0,16 C8,12 14,4 22,-2 C16,4 10,8 0,8 C-10,8 -16,4 -22,-2 Z" />
            <circle cx="0" cy="-10" r="3" />
            <polygon points="-6,10 6,10 0,18" />
          </g>
        )}
        {selectedEmblem === 'scales' && (
          // Scales of Justice Emblem
          <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <line x1="0" y1="-16" x2="0" y2="16" />
            <line x1="-18" y1="-10" x2="18" y2="-10" />
            <line x1="-18" y1="-10" x2="-22" y2="0" />
            <line x1="-18" y1="-10" x2="-14" y2="0" />
            <path d="M-24,0 C-24,6 -12,6 -12,0 Z" fill={color} />
            <line x1="18" y1="-10" x2="14" y2="0" />
            <line x1="18" y1="-10" x2="22" y2="0" />
            <path d="M12,0 C12,6 24,6 24,0 Z" fill={color} />
            <line x1="-8" y1="16" x2="8" y2="16" strokeWidth="2" />
          </g>
        )}
        {selectedEmblem === 'shield' && (
          // Security Shield Emblem
          <g fill="none" stroke={color} strokeWidth="2">
            <path d="M-14,-14 L14,-14 C14,-14 16,4 0,18 C-16,4 -14,-14 -14,-14 Z" fill={color} fillOpacity="0.15" />
            <polyline points="-5,1 -1,5 7,-3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {selectedEmblem === 'palm' && (
          // Palm & Dual Swords Emblem
          <g stroke={color} strokeWidth="1.5" fill={color}>
            <path d="M-12,12 L12,4 M12,12 L-12,4" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,8 C0,-4 -12,-12 -12,-12 C-12,-12 -4,-8 0,0 C4,-8 12,-12 12,-12 C12,-12 0,-4 0,8 Z" />
          </g>
        )}
      </g>
    );
  };

  // Active ink fill/stroke color (handling negative inverted mode)
  const fgColor = invertStamp ? '#ffffff' : stampColor;
  const strokeDash = getStrokeDash();

  // -------------------------------------------------------------
  // SHAPE-BASED SVG GEOMETRIES
  // Top Text is English | Bottom Text is Arabic
  // -------------------------------------------------------------
  const renderStampContent = () => {
    const showSecondaryRing = borderStyle === 'double';

    // Arabic text on curved arc: permanently starts from the Right side and flows Right-to-Left in upright orientation
    const activeCurvedArabicText = bottomArabicText
      ? bottomArabicText.trim().split(/\s+/).reverse().join(' ')
      : '';

    switch (shape) {
      case 'oval':
        return (
          <>
            <defs>
              {/* Top Oval Arc for English (Clockwise) */}
              <path id="topOvalArc" d="M 60,250 A 190,125 0 0,1 440,250" fill="none" />
              {/* Bottom Oval Arc for Arabic (Permanently Upright Arc, Starts from Right side) */}
              <path id="bottomOvalArc" d="M 45,250 A 205,140 0 0,0 455,250" fill="none" />
            </defs>

            {/* Inverted Background fill if enabled */}
            {invertStamp && (
              <ellipse cx="250" cy="250" rx="232" ry="160" fill={stampColor} />
            )}

            {/* Outer Thick Oval */}
            <ellipse
              cx="250"
              cy="250"
              rx="232"
              ry="160"
              fill="none"
              stroke={fgColor}
              strokeWidth="5"
              strokeDasharray={strokeDash}
            />
            {/* Outer Thin Oval */}
            {showSecondaryRing && (
              <ellipse cx="250" cy="250" rx="222" ry="150" fill="none" stroke={fgColor} strokeWidth="2" />
            )}
            {/* Inner Oval */}
            <ellipse cx="250" cy="250" rx="160" ry="100" fill="none" stroke={fgColor} strokeWidth="3" />

            {/* Optional Emblem */}
            {renderEmblem(250, 185, 0.9)}

            {/* TOP TEXT: ENGLISH CURVE */}
            <text fontFamily={englishFont} fontWeight="bold" fill={fgColor} letterSpacing="1px">
              <textPath href="#topOvalArc" startOffset="50%" textAnchor="middle" fontSize={topFontSize}>
                {topEnglishText}
              </textPath>
            </text>

            {/* BOTTOM TEXT: ARABIC CURVE (Upright & Right-to-Left aligned) */}
            <text fontFamily={arabicFont} fontWeight="bold" fill={fgColor}>
              <textPath href="#bottomOvalArc" startOffset="50%" textAnchor="middle" fontSize={bottomFontSize}>
                {activeCurvedArabicText}
              </textPath>
            </text>

            {/* Side Stars */}
            <text
              x={68 - starOffsetX}
              y={258 + starOffsetY}
              fontFamily="Arial, sans-serif"
              fontSize={starSize}
              fill={fgColor}
              textAnchor="middle"
            >
              {starSymbol}
            </text>
            <text
              x={432 + starOffsetX}
              y={258 + starOffsetY}
              fontFamily="Arial, sans-serif"
              fontSize={starSize}
              fill={fgColor}
              textAnchor="middle"
            >
              {starSymbol}
            </text>

            {/* Center Content Lines */}
            <text
              x="250"
              y={includeEmblem ? 230 : 225}
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine1Size}
              fill={fgColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine1}
            </text>

            {includeDate ? (
              <g>
                <line x1="165" y1="248" x2="335" y2="248" stroke={fgColor} strokeWidth="1.5" strokeDasharray="4, 3" />
                <text
                  x="250"
                  y="266"
                  fontFamily={englishFont}
                  fontWeight="bold"
                  fontSize={dateFontSize}
                  fill={fgColor}
                  textAnchor="middle"
                  letterSpacing="1.5px"
                >
                  {dateValue}
                </text>
                <line x1="165" y1="274" x2="335" y2="274" stroke={fgColor} strokeWidth="1.5" strokeDasharray="4, 3" />
                <text
                  x="250"
                  y="298"
                  fontFamily={englishFont}
                  fontWeight="bold"
                  fontSize={centerLine2Size * 0.9}
                  fill={fgColor}
                  textAnchor="middle"
                  letterSpacing="1px"
                >
                  {centerLine2}
                </text>
              </g>
            ) : (
              <text
                x="250"
                y={includeEmblem ? 275 : 272}
                fontFamily={englishFont}
                fontWeight="bold"
                fontSize={centerLine2Size}
                fill={fgColor}
                textAnchor="middle"
                letterSpacing="1px"
              >
                {centerLine2}
              </text>
            )}
          </>
        );

      case 'rectangle':
        return (
          <>
            {invertStamp && (
              <rect x="25" y="80" width="450" height="340" rx="14" fill={stampColor} />
            )}

            {/* Outer Thick Rectangle */}
            <rect
              x="25"
              y="80"
              width="450"
              height="340"
              rx="14"
              fill="none"
              stroke={fgColor}
              strokeWidth="5"
              strokeDasharray={strokeDash}
            />
            {/* Outer Thin Rectangle */}
            {showSecondaryRing && (
              <rect x="35" y="90" width="430" height="320" rx="10" fill="none" stroke={fgColor} strokeWidth="2" />
            )}
            {/* Inner Border Box */}
            <rect x="55" y="110" width="390" height="280" rx="6" fill="none" stroke={fgColor} strokeWidth="2.5" />

            {/* Dividing Bars */}
            <line x1="55" y1="170" x2="445" y2="170" stroke={fgColor} strokeWidth="2" />
            <line x1="55" y1="330" x2="445" y2="330" stroke={fgColor} strokeWidth="2" />

            {/* TOP TEXT: ENGLISH HEADER */}
            <text
              x="250"
              y="148"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={topFontSize}
              fill={fgColor}
              textAnchor="middle"
              letterSpacing="0.8px"
            >
              {topEnglishText}
            </text>

            {/* Side Stars */}
            <text
              x={85 - starOffsetX}
              y={258 + starOffsetY}
              fontFamily="Arial, sans-serif"
              fontSize={starSize}
              fill={fgColor}
              textAnchor="middle"
            >
              {starSymbol}
            </text>
            <text
              x={415 + starOffsetX}
              y={258 + starOffsetY}
              fontFamily="Arial, sans-serif"
              fontSize={starSize}
              fill={fgColor}
              textAnchor="middle"
            >
              {starSymbol}
            </text>

            {/* Optional Emblem */}
            {renderEmblem(250, 195, 0.85)}

            {/* Center Content Lines */}
            <text
              x="250"
              y={includeEmblem ? 230 : (includeDate ? 210 : 230)}
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine1Size}
              fill={fgColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine1}
            </text>

            {includeDate ? (
              <g>
                <line x1="140" y1="235" x2="360" y2="235" stroke={fgColor} strokeWidth="1.5" strokeDasharray="4, 3" />
                <text
                  x="250"
                  y="256"
                  fontFamily={englishFont}
                  fontWeight="bold"
                  fontSize={dateFontSize}
                  fill={fgColor}
                  textAnchor="middle"
                  letterSpacing="1.5px"
                >
                  {dateValue}
                </text>
                <line x1="140" y1="266" x2="360" y2="266" stroke={fgColor} strokeWidth="1.5" strokeDasharray="4, 3" />
                <text
                  x="250"
                  y="295"
                  fontFamily={englishFont}
                  fontWeight="bold"
                  fontSize={centerLine2Size * 0.9}
                  fill={fgColor}
                  textAnchor="middle"
                  letterSpacing="1px"
                >
                  {centerLine2}
                </text>
              </g>
            ) : (
              <text
                x="250"
                y={includeEmblem ? 275 : 278}
                fontFamily={englishFont}
                fontWeight="bold"
                fontSize={centerLine2Size}
                fill={fgColor}
                textAnchor="middle"
                letterSpacing="1px"
              >
                {centerLine2}
              </text>
            )}

            {/* BOTTOM TEXT: ARABIC FOOTER */}
            <text
              x="250"
              y="370"
              fontFamily={arabicFont}
              fontWeight="bold"
              fontSize={bottomFontSize}
              fill={fgColor}
              textAnchor="middle"
              direction="rtl"
            >
              {bottomArabicText}
            </text>
          </>
        );

      case 'square':
        return (
          <>
            {invertStamp && (
              <rect x="35" y="35" width="430" height="430" rx="14" fill={stampColor} />
            )}

            {/* Outer Thick Square */}
            <rect
              x="35"
              y="35"
              width="430"
              height="430"
              rx="14"
              fill="none"
              stroke={fgColor}
              strokeWidth="5"
              strokeDasharray={strokeDash}
            />
            {/* Outer Thin Square */}
            {showSecondaryRing && (
              <rect x="45" y="45" width="410" height="410" rx="10" fill="none" stroke={fgColor} strokeWidth="2" />
            )}
            {/* Inner Border Box */}
            <rect x="68" y="68" width="364" height="364" rx="6" fill="none" stroke={fgColor} strokeWidth="2.5" />

            {/* Dividing Bars */}
            <line x1="68" y1="145" x2="432" y2="145" stroke={fgColor} strokeWidth="2" />
            <line x1="68" y1="355" x2="432" y2="355" stroke={fgColor} strokeWidth="2" />

            {/* TOP TEXT: ENGLISH HEADER */}
            <text
              x="250"
              y="118"
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={topFontSize}
              fill={fgColor}
              textAnchor="middle"
              letterSpacing="0.8px"
            >
              {topEnglishText}
            </text>

            {/* Side Stars */}
            <text
              x={96 - starOffsetX}
              y={258 + starOffsetY}
              fontFamily="Arial, sans-serif"
              fontSize={starSize}
              fill={fgColor}
              textAnchor="middle"
            >
              {starSymbol}
            </text>
            <text
              x={404 + starOffsetX}
              y={258 + starOffsetY}
              fontFamily="Arial, sans-serif"
              fontSize={starSize}
              fill={fgColor}
              textAnchor="middle"
            >
              {starSymbol}
            </text>

            {/* Optional Emblem */}
            {renderEmblem(250, 185, 0.9)}

            {/* Center Content Lines */}
            <text
              x="250"
              y={includeEmblem ? 228 : (includeDate ? 205 : 228)}
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine1Size}
              fill={fgColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine1}
            </text>

            {includeDate ? (
              <g>
                <line x1="130" y1="230" x2="370" y2="230" stroke={fgColor} strokeWidth="1.5" strokeDasharray="4, 3" />
                <text
                  x="250"
                  y="252"
                  fontFamily={englishFont}
                  fontWeight="bold"
                  fontSize={dateFontSize}
                  fill={fgColor}
                  textAnchor="middle"
                  letterSpacing="1.5px"
                >
                  {dateValue}
                </text>
                <line x1="130" y1="262" x2="370" y2="262" stroke={fgColor} strokeWidth="1.5" strokeDasharray="4, 3" />
                <text
                  x="250"
                  y="295"
                  fontFamily={englishFont}
                  fontWeight="bold"
                  fontSize={centerLine2Size * 0.9}
                  fill={fgColor}
                  textAnchor="middle"
                  letterSpacing="1px"
                >
                  {centerLine2}
                </text>
              </g>
            ) : (
              <text
                x="250"
                y={includeEmblem ? 280 : 280}
                fontFamily={englishFont}
                fontWeight="bold"
                fontSize={centerLine2Size}
                fill={fgColor}
                textAnchor="middle"
                letterSpacing="1px"
              >
                {centerLine2}
              </text>
            )}

            {/* BOTTOM TEXT: ARABIC FOOTER */}
            <text
              x="250"
              y="395"
              fontFamily={arabicFont}
              fontWeight="bold"
              fontSize={bottomFontSize}
              fill={fgColor}
              textAnchor="middle"
              direction="rtl"
            >
              {bottomArabicText}
            </text>
          </>
        );

      case 'circle':
      default:
        return (
          <>
            <defs>
              {/* Top Curve Path (Clockwise Arc for Top English) */}
              <path id="topArcPath" d="M 68,250 A 182,182 0 0,1 432,250" fill="none" />
              {/* Bottom Curve Path for Arabic (Permanently Upright Arc, Starts from Right side) */}
              <path id="bottomArcPath" d="M 45,250 A 205,205 0 0,0 455,250" fill="none" />
            </defs>

            {invertStamp && (
              <circle cx="250" cy="250" r="232" fill={stampColor} />
            )}

            {/* Outer Thick Ring */}
            <circle
              cx="250"
              cy="250"
              r="232"
              fill="none"
              stroke={fgColor}
              strokeWidth="5"
              strokeDasharray={strokeDash}
            />
            {/* Outer Thin Ring */}
            {showSecondaryRing && (
              <circle cx="250" cy="250" r="222" fill="none" stroke={fgColor} strokeWidth="2" />
            )}
            {/* Inner Ring */}
            <circle cx="250" cy="250" r="150" fill="none" stroke={fgColor} strokeWidth="3" />

            {/* Optional Emblem */}
            {renderEmblem(250, 180, 0.95)}

            {/* TOP CURVED ENGLISH TEXT */}
            <text fontFamily={englishFont} fontWeight="bold" fill={fgColor} letterSpacing="1px">
              <textPath href="#topArcPath" startOffset="50%" textAnchor="middle" id="svgTopText" fontSize={topFontSize}>
                {topEnglishText}
              </textPath>
            </text>

            {/* BOTTOM CURVED ARABIC TEXT (Upright & Right-to-Left aligned) */}
            <text fontFamily={arabicFont} fontWeight="bold" fill={fgColor}>
              <textPath href="#bottomArcPath" startOffset="50%" textAnchor="middle" id="svgBottomText" fontSize={bottomFontSize}>
                {activeCurvedArabicText}
              </textPath>
            </text>

            {/* SIDE SEPARATOR STARS */}
            <text
              id="starLeft"
              x={78 - starOffsetX}
              y={258 + starOffsetY}
              fontFamily="Arial, sans-serif"
              fontSize={starSize}
              fill={fgColor}
              textAnchor="middle"
            >
              {starSymbol}
            </text>
            <text
              id="starRight"
              x={422 + starOffsetX}
              y={258 + starOffsetY}
              fontFamily="Arial, sans-serif"
              fontSize={starSize}
              fill={fgColor}
              textAnchor="middle"
            >
              {starSymbol}
            </text>

            {/* CENTER CONTENT */}
            <text
              id="svgCenterLine1"
              x="250"
              y={includeEmblem ? 226 : (includeDate ? 204 : 225)}
              fontFamily={englishFont}
              fontWeight="bold"
              fontSize={centerLine1Size}
              fill={fgColor}
              textAnchor="middle"
              letterSpacing="1px"
            >
              {centerLine1}
            </text>

            {includeDate ? (
              <g>
                <line x1="160" y1="228" x2="340" y2="228" stroke={fgColor} strokeWidth="1.5" strokeDasharray="4, 3" />
                <text
                  x="250"
                  y="248"
                  fontFamily={englishFont}
                  fontWeight="bold"
                  fontSize={dateFontSize}
                  fill={fgColor}
                  textAnchor="middle"
                  letterSpacing="1.5px"
                >
                  {dateValue}
                </text>
                <line x1="160" y1="258" x2="340" y2="258" stroke={fgColor} strokeWidth="1.5" strokeDasharray="4, 3" />
                <text
                  x="250"
                  y="288"
                  fontFamily={englishFont}
                  fontWeight="bold"
                  fontSize={centerLine2Size * 0.9}
                  fill={fgColor}
                  textAnchor="middle"
                  letterSpacing="1px"
                >
                  {centerLine2}
                </text>
              </g>
            ) : (
              <text
                id="svgCenterLine2"
                x="250"
                y={includeEmblem ? 275 : 278}
                fontFamily={englishFont}
                fontWeight="bold"
                fontSize={centerLine2Size}
                fill={fgColor}
                textAnchor="middle"
                letterSpacing="1px"
              >
                {centerLine2}
              </text>
            )}
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
      {/* SIDEBAR CONTROL PANEL (380px fixed width)                     */}
      {/* ------------------------------------------------------------- */}
      <aside
        id="sidebar-panel"
        className="w-full md:w-[380px] bg-white border-r border-slate-300 flex flex-col h-full shrink-0 shadow-md z-10"
      >
        {/* Header */}
        <div id="sidebar-header" className="px-5 py-3.5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-base font-semibold tracking-tight">Bilingual Stamp Constructor</h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
              Pro Studio
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs: Normal vs Customize (Advanced) */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex bg-slate-200/80 p-1 rounded-lg">
            <button
              id="mode-normal-btn"
              onClick={() => setControlMode('normal')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                controlMode === 'normal'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Standard Mode</span>
            </button>
            <button
              id="mode-advanced-btn"
              onClick={() => setControlMode('advanced')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                controlMode === 'advanced'
                  ? 'bg-[#0b32a4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Customize (Advanced)</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${controlMode === 'advanced' ? 'bg-blue-900/60 text-blue-100' : 'bg-slate-300 text-slate-700'}`}>
                +7
              </span>
            </button>
          </div>
        </div>

        {/* Controls Body */}
        <div
          id="controls-body"
          className="p-4 overflow-y-auto flex-grow flex flex-col gap-3 scrollbar-thin scrollbar-thumb-slate-300"
        >
          {/* ========================================================= */}
          {/* COMMON: SHAPE & PRESETS (Available in both modes)         */}
          {/* ========================================================= */}
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


          {/* ========================================================= */}
          {/* NORMAL MODE: CORE ESSENTIAL CONTROLS                      */}
          {/* ========================================================= */}
          {controlMode === 'normal' && (
            <>
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
                  <label htmlFor="englishFont" className="text-xs font-semibold text-slate-700">
                    English Font (Top)
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

                <div className="flex items-center justify-between mt-1">
                  <label htmlFor="arabicFont" className="text-xs font-semibold text-slate-700">
                    Arabic Font (Bottom)
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

              {/* Card 3: Top Text (English) + Auto-Convert Trigger */}
              <div className="bg-slate-50 border border-blue-200/80 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                    Top Text (English)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] text-slate-600 font-medium cursor-pointer select-none">
                      Auto-Convert:
                    </label>
                    <input
                      type="checkbox"
                      checked={autoTranslateEnabled}
                      onChange={(e) => setAutoTranslateEnabled(e.target.checked)}
                      className="cursor-pointer accent-blue-700 w-3.5 h-3.5"
                    />
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="topEnglishText"
                    value={topEnglishText}
                    onChange={(e) => handleEnglishChange(e.target.value)}
                    placeholder="Type English company name (e.g. HALAWA)..."
                    className="w-full p-2 pr-20 border border-slate-300 rounded text-[13px] bg-white focus:border-blue-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleManualTranslate}
                    disabled={isTranslating || !topEnglishText.trim()}
                    className="absolute right-1.5 top-1.5 px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer disabled:cursor-not-allowed"
                    title="Convert English to Arabic (e.g. HALAWA -> حلاوة)"
                  >
                    {isTranslating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>{isTranslating ? 'Converting' : 'Convert'}</span>
                  </button>
                </div>

                {translationStatus && (
                  <div className="text-[10px] text-blue-700 font-medium flex items-center gap-1">
                    <span>• {translationStatus}</span>
                  </div>
                )}

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
                  min="12"
                  max="38"
                  value={topFontSize}
                  onChange={(e) => setTopFontSize(parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer accent-blue-700"
                />
              </div>

              {/* Card 4: Bottom Text (Arabic) */}
              <div className="bg-slate-50 border border-emerald-200/80 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                    Bottom Text (Arabic)
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                    Starts from Right • Upright
                  </span>
                </div>

                <input
                  type="text"
                  id="bottomArabicText"
                  value={bottomArabicText}
                  dir="rtl"
                  onChange={(e) => setBottomArabicText(e.target.value)}
                  placeholder="النص العربي الرسمي..."
                  className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white text-right font-arabic focus:border-emerald-700 focus:outline-none"
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
                  min="14"
                  max="42"
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
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Side Separators
                  </div>
                  {(starOffsetX !== 0 || starOffsetY !== 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStarOffsetX(0);
                        setStarOffsetY(0);
                      }}
                      className="text-[10px] text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
                    >
                      Reset Alignment
                    </button>
                  )}
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

                {/* Horizontal Alignment Adjust: Left to Right / Spacing */}
                <div className="pt-1 border-t border-slate-200 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="starOffsetX" className="text-xs font-semibold text-slate-700">
                      Align Left ↔ Right (Spacing)
                    </label>
                    <span id="starOffsetXVal" className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                      {starOffsetX === 0 ? 'Center (0)' : starOffsetX > 0 ? `+${starOffsetX} (Wider)` : `${starOffsetX} (Closer)`}
                    </span>
                  </div>
                  <input
                    type="range"
                    id="starOffsetX"
                    min="-40"
                    max="40"
                    step="1"
                    value={starOffsetX}
                    onChange={(e) => setStarOffsetX(parseInt(e.target.value, 10))}
                    className="w-full cursor-pointer accent-blue-700"
                    title="Move side separators inward or outward (Left to Right spacing)"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium px-0.5">
                    <span>← Inward</span>
                    <span>Centered</span>
                    <span>Outward →</span>
                  </div>
                </div>

                {/* Vertical Alignment Adjust: Up to Down */}
                <div className="pt-1 border-t border-slate-200 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="starOffsetY" className="text-xs font-semibold text-slate-700">
                      Align Up ↕ Down (Vertical)
                    </label>
                    <span id="starOffsetYVal" className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                      {starOffsetY === 0 ? 'Middle (0)' : starOffsetY > 0 ? `+${starOffsetY} (Down)` : `${starOffsetY} (Up)`}
                    </span>
                  </div>
                  <input
                    type="range"
                    id="starOffsetY"
                    min="-45"
                    max="45"
                    step="1"
                    value={starOffsetY}
                    onChange={(e) => setStarOffsetY(parseInt(e.target.value, 10))}
                    className="w-full cursor-pointer accent-blue-700"
                    title="Move side separators Up or Down"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium px-0.5">
                    <span>↑ Up</span>
                    <span>Middle</span>
                    <span>Down ↓</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* CUSTOMIZE (ADVANCED) MODE: OPTIONAL RICH FEATURES         */}
          {/* ========================================================= */}
          {controlMode === 'advanced' && (
            <>
              {/* Advanced 1: Physical Press Simulation (Angle & Opacity) */}
              <div className="bg-slate-50 border border-blue-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                    Physical Stamp Simulation
                  </div>
                  <button
                    onClick={applyRandomTilt}
                    className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    Random Tilt
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="rotationAngle" className="text-xs font-semibold text-slate-700">
                    Stamp Rotation Tilt
                  </label>
                  <span className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                    {rotationAngle}°
                  </span>
                </div>
                <input
                  type="range"
                  id="rotationAngle"
                  min="-25"
                  max="25"
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer accent-blue-700"
                />

                <div className="flex items-center justify-between mt-1">
                  <label htmlFor="inkOpacity" className="text-xs font-semibold text-slate-700">
                    Ink Opacity / Press Density
                  </label>
                  <span className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                    {inkOpacity}%
                  </span>
                </div>
                <input
                  type="range"
                  id="inkOpacity"
                  min="30"
                  max="100"
                  value={inkOpacity}
                  onChange={(e) => setInkOpacity(parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer accent-blue-700"
                />
              </div>

              {/* Advanced 2: Official Center Date Line */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Center Official Date
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDate}
                      onChange={(e) => setIncludeDate(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-700"></div>
                  </label>
                </div>

                {includeDate && (
                  <div className="flex flex-col gap-2 pt-1 border-t border-slate-200">
                    <input
                      type="text"
                      id="dateValueInput"
                      value={dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                      placeholder="e.g. 16 SEP 2026"
                      className="w-full p-2 border border-slate-300 rounded text-[13px] bg-white focus:border-blue-700 focus:outline-none font-mono"
                    />
                    <div className="flex gap-1">
                      {['16 SEP 2026', 'PAID', 'APPROVED', 'RECEIVED'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setDateValue(tag)}
                          className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 hover:bg-slate-300 rounded text-slate-700 cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <label htmlFor="dateFontSize" className="text-xs font-semibold text-slate-700">
                        Date Font Size
                      </label>
                      <span className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                        {dateFontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      id="dateFontSize"
                      min="14"
                      max="32"
                      value={dateFontSize}
                      onChange={(e) => setDateFontSize(parseInt(e.target.value, 10))}
                      className="w-full cursor-pointer accent-blue-700"
                    />
                  </div>
                )}
              </div>

              {/* Advanced 3: Official Center Emblem */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Official Center Emblem
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeEmblem}
                      onChange={(e) => setIncludeEmblem(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-700"></div>
                  </label>
                </div>

                {includeEmblem && (
                  <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-200">
                    {[
                      { id: 'eagle', label: 'Falcon' },
                      { id: 'scales', label: 'Justice' },
                      { id: 'shield', label: 'Shield' },
                      { id: 'palm', label: 'Palm' },
                    ].map((em) => (
                      <button
                        key={em.id}
                        onClick={() => setSelectedEmblem(em.id)}
                        className={`py-1.5 px-1 rounded text-xs font-semibold border transition cursor-pointer text-center ${
                          selectedEmblem === em.id
                            ? 'bg-[#0b32a4] text-white border-[#0b32a4]'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {em.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Advanced 4: Outer Ring Border Style */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Border Edge Style
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'double', label: 'Double' },
                    { id: 'single', label: 'Single' },
                    { id: 'dashed', label: 'Dashed' },
                    { id: 'dotted', label: 'Dotted' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBorderStyle(b.id as BorderStyle)}
                      className={`py-1.5 px-1 rounded text-xs font-semibold border transition cursor-pointer text-center ${
                        borderStyle === b.id
                          ? 'bg-[#0b32a4] text-white border-[#0b32a4]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced 5: Special Effects & Presentation */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Presentation & Styles
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-semibold text-slate-700">
                    Solid Fill / Negative Stamp
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invertStamp}
                      onChange={(e) => setInvertStamp(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-700"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">
                    Document Letterhead Mockup
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paperMockup}
                      onChange={(e) => setPaperMockup(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-700"></div>
                  </label>
                </div>
              </div>
            </>
          )}
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
      {/* PREVIEW STAGE (Dot grid + Paper Document Mockup Container)    */}
      {/* ------------------------------------------------------------- */}
      <main
        id="preview-stage"
        className="flex-grow flex items-center justify-center overflow-auto p-4 sm:p-8"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      >
        {paperMockup ? (
          /* Document Letterhead Simulation Container */
          <div
            id="document-mockup"
            className="bg-[#fcfbf9] w-[520px] max-w-full p-8 rounded-md shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-slate-200 flex flex-col relative overflow-hidden"
          >
            {/* Faux Official Document Header */}
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-200 mb-6">
              <div className="flex flex-col">
                <span className="font-bold text-xs uppercase tracking-widest text-slate-700">
                  OFFICIAL COMMERCIAL ATTESTATION
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  REF NO: UAE-DXB-2026/8941
                </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                UAE
              </div>
            </div>

            {/* Faux text lines */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="h-2.5 bg-slate-200/80 rounded w-full"></div>
              <div className="h-2.5 bg-slate-200/80 rounded w-11/12"></div>
              <div className="h-2.5 bg-slate-200/80 rounded w-4/5"></div>
              <div className="h-2.5 bg-slate-200/80 rounded w-9/12"></div>
            </div>

            {/* Stamp Positioned Over Document Signature Area */}
            <div className="flex justify-end items-center my-2">
              <div className="relative flex flex-col items-center">
                <div className="text-[11px] font-mono text-slate-400 mb-1">
                  [ AUTHORIZED SIGNATORY ]
                </div>
                <div
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    opacity: inkOpacity / 100,
                    transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
                  }}
                >
                  <svg
                    ref={svgRef}
                    id="stampSvg"
                    width="320"
                    height="320"
                    viewBox="0 0 500 500"
                    xmlns="http://www.w3.org/2000/svg"
                    className="block select-none"
                  >
                    <defs>
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
                    <g id="stampGroup" filter={vintageIntensity > 0 ? 'url(#grungeFilter)' : undefined}>
                      {renderStampContent()}
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between text-[9px] text-slate-400 font-mono">
              <span>SECURITY DOCUMENT GRADE A</span>
              <span>DUBAI - UNITED ARAB EMIRATES</span>
            </div>
          </div>
        ) : (
          /* Standard White Card Canvas Container */
          <div
            id="stamp-card-container"
            className="bg-white p-6 sm:p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center max-w-full transition-all"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              opacity: inkOpacity / 100,
              transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
            }}
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

              <g id="stampGroup" filter={vintageIntensity > 0 ? 'url(#grungeFilter)' : undefined}>
                {renderStampContent()}
              </g>
            </svg>
          </div>
        )}
      </main>
    </div>
  );
}
