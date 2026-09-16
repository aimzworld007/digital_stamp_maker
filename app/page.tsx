'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import {
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Type,
  Layers,
  Palette,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  RefreshCw,
  Shield,
  Star,
  FileCheck,
  Award,
  Stamp as StampIcon,
  CircleDot,
  Square,
  Bookmark,
} from 'lucide-react';

// Shape Types
type StampShape = 'circle' | 'oval' | 'rectangle' | 'square';
type InnerRingStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
type CenterIconType = 'star' | 'shield' | 'award' | 'check' | 'crescent' | 'dots' | 'none';

interface StampPreset {
  id: string;
  name: string;
  nameAr: string;
  shape: StampShape;
  topText: string;
  topFontFamily: string;
  topFontSize: number;
  bottomText: string;
  bottomFontFamily: string;
  bottomFontSize: number;
  centerLine1: string;
  centerLine1Size: number;
  centerLine2: string;
  centerLine2Size: number;
  separatorSymbol: string;
  separatorSize: number;
  inkColor: string;
  distress: number;
  outerRingWidth: number;
  innerRingStyle: InnerRingStyle;
  innerRingWidth: number;
  innerRingOffset: number;
  centerIcon: CenterIconType;
  showDividers: boolean;
  rotation: number;
}

const PRESETS: StampPreset[] = [
  {
    id: 'dubai-official',
    name: 'Dubai Commercial Seal',
    nameAr: 'ختم تجاري - دبي',
    shape: 'circle',
    topText: 'دائرة التنمية الاقتصادية - دبي',
    topFontFamily: 'Cairo',
    topFontSize: 24,
    bottomText: 'DEPARTMENT OF ECONOMIC DEVELOPMENT',
    bottomFontFamily: 'Roboto Condensed',
    bottomFontSize: 19,
    centerLine1: 'P.O. BOX: 2235',
    centerLine1Size: 18,
    centerLine2: 'DUBAI - U.A.E',
    centerLine2Size: 17,
    separatorSymbol: '★',
    separatorSize: 18,
    inkColor: '#1e3a8a',
    distress: 35,
    outerRingWidth: 6,
    innerRingStyle: 'double',
    innerRingWidth: 2,
    innerRingOffset: 12,
    centerIcon: 'shield',
    showDividers: true,
    rotation: -2,
  },
  {
    id: 'saudi-cr',
    name: 'Riyadh Official Notary',
    nameAr: 'السجل التجاري - الرياض',
    shape: 'circle',
    topText: 'المملكة العربية السعودية - السجل التجاري',
    topFontFamily: 'Cairo',
    topFontSize: 23,
    bottomText: 'KINGDOM OF SAUDI ARABIA - C.R.',
    bottomFontFamily: 'Oswald',
    bottomFontSize: 20,
    centerLine1: 'C.R. NO: 1010482910',
    centerLine1Size: 17,
    centerLine2: 'AUTHORIZED BRANCH - RIYADH',
    centerLine2Size: 15,
    separatorSymbol: '✦',
    separatorSize: 20,
    inkColor: '#991b1b',
    distress: 45,
    outerRingWidth: 7,
    innerRingStyle: 'dashed',
    innerRingWidth: 2.5,
    innerRingOffset: 14,
    centerIcon: 'award',
    showDividers: true,
    rotation: 1.5,
  },
  {
    id: 'certified-true',
    name: 'Certified True Copy',
    nameAr: 'طبق الأصل معتمد',
    shape: 'oval',
    topText: 'صورة طبق الأصل معتمدة ورسمية',
    topFontFamily: 'Cairo',
    topFontSize: 22,
    bottomText: 'CERTIFIED TRUE COPY & OFFICIAL',
    bottomFontFamily: 'Roboto Condensed',
    bottomFontSize: 18,
    centerLine1: 'VERIFIED DOCUMENT',
    centerLine1Size: 18,
    centerLine2: 'VALID FOR LEGAL USE',
    centerLine2Size: 15,
    separatorSymbol: '❖',
    separatorSize: 18,
    inkColor: '#065f46',
    distress: 30,
    outerRingWidth: 6,
    innerRingStyle: 'solid',
    innerRingWidth: 2,
    innerRingOffset: 10,
    centerIcon: 'check',
    showDividers: true,
    rotation: -1,
  },
  {
    id: 'quality-pass',
    name: 'Inspection & QC Pass',
    nameAr: 'مراقبة الجودة والاعتماد',
    shape: 'rectangle',
    topText: 'إدارة الجودة والمواصفات المعتمدة',
    topFontFamily: 'Cairo',
    topFontSize: 21,
    bottomText: 'QUALITY ASSURANCE & QC PASSED',
    bottomFontFamily: 'Oswald',
    bottomFontSize: 19,
    centerLine1: 'INSPECTION ID: QC-9481',
    centerLine1Size: 18,
    centerLine2: 'BATCH VERIFIED 2026',
    centerLine2Size: 16,
    separatorSymbol: '✔',
    separatorSize: 20,
    inkColor: '#18181b',
    distress: 40,
    outerRingWidth: 8,
    innerRingStyle: 'double',
    innerRingWidth: 2,
    innerRingOffset: 12,
    centerIcon: 'shield',
    showDividers: true,
    rotation: 0.5,
  },
  {
    id: 'company-seal-square',
    name: 'Executive Corporate Seal',
    nameAr: 'ختم تنفيذي للمؤسسة',
    shape: 'square',
    topText: 'المؤسسة العامة للخدمات والاستشارات',
    topFontFamily: 'Cairo',
    topFontSize: 22,
    bottomText: 'GENERAL CONSULTING SERVICES EST.',
    bottomFontFamily: 'Roboto Condensed',
    bottomFontSize: 18,
    centerLine1: 'REGISTERED TRADEMARK',
    centerLine1Size: 17,
    centerLine2: 'MANAGEMENT APPROVAL',
    centerLine2Size: 15,
    separatorSymbol: '●',
    separatorSize: 14,
    inkColor: '#581c87',
    distress: 25,
    outerRingWidth: 7,
    innerRingStyle: 'dotted',
    innerRingWidth: 3,
    innerRingOffset: 14,
    centerIcon: 'star',
    showDividers: true,
    rotation: -1.5,
  },
];

const INK_PALETTE = [
  { name: 'Royal Navy', hex: '#1e3a8a' },
  { name: 'Carmine Red', hex: '#991b1b' },
  { name: 'Emerald Green', hex: '#065f46' },
  { name: 'Charcoal Black', hex: '#18181b' },
  { name: 'Imperial Violet', hex: '#581c87' },
  { name: 'Vintage Rust', hex: '#78350f' },
  { name: 'Teal Blue', hex: '#0e7490' },
  { name: 'Warm Crimson', hex: '#b91c1c' },
];

export default function BilingualStampMaker() {
  // Unique Filter ID for SVG to avoid clashes
  const filterId = useId().replace(/:/g, '');

  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [shape, setShape] = useState<StampShape>('circle');

  // Ring & Border System
  const [outerRingWidth, setOuterRingWidth] = useState<number>(6);
  const [innerRingStyle, setInnerRingStyle] = useState<InnerRingStyle>('double');
  const [innerRingWidth, setInnerRingWidth] = useState<number>(2);
  const [innerRingOffset, setInnerRingOffset] = useState<number>(12);

  // Bilingual Typography
  const [topText, setTopText] = useState<string>('دائرة التنمية الاقتصادية - دبي');
  const [topFontFamily, setTopFontFamily] = useState<string>('Cairo');
  const [topFontSize, setTopFontSize] = useState<number>(24);
  const [topLetterSpacing, setTopLetterSpacing] = useState<number>(0);

  const [bottomText, setBottomText] = useState<string>('DEPARTMENT OF ECONOMIC DEVELOPMENT');
  const [bottomFontFamily, setBottomFontFamily] = useState<string>('Roboto Condensed');
  const [bottomFontSize, setBottomFontSize] = useState<number>(19);
  const [bottomLetterSpacing, setBottomLetterSpacing] = useState<number>(1);

  // Center Content
  const [centerLine1, setCenterLine1] = useState<string>('P.O. BOX: 2235');
  const [centerLine1Size, setCenterLine1Size] = useState<number>(18);
  const [centerLine2, setCenterLine2] = useState<string>('DUBAI - U.A.E');
  const [centerLine2Size, setCenterLine2Size] = useState<number>(17);
  const [centerIcon, setCenterIcon] = useState<CenterIconType>('shield');
  const [showDividers, setShowDividers] = useState<boolean>(true);

  // Separators
  const [separatorSymbol, setSeparatorSymbol] = useState<string>('★');
  const [separatorSize, setSeparatorSize] = useState<number>(18);

  // Vintage Ink Distress & Color
  const [distress, setDistress] = useState<number>(35);
  const [noiseSeed, setNoiseSeed] = useState<number>(124);
  const [inkColor, setInkColor] = useState<string>('#1e3a8a');
  const [inkOpacity, setInkOpacity] = useState<number>(94);
  const [rotation, setRotation] = useState<number>(-2);

  // Canvas Stage Controls
  const [backgroundType, setBackgroundType] = useState<'transparent' | 'white'>('white');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  // Accordion open states
  const [openSections, setOpenSections] = useState({
    presets: true,
    shapes: true,
    typography: true,
    center: false,
    rings: false,
    ink: true,
    canvas: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Apply Preset
  const applyPreset = (preset: StampPreset) => {
    setShape(preset.shape);
    setTopText(preset.topText);
    setTopFontFamily(preset.topFontFamily);
    setTopFontSize(preset.topFontSize);
    setBottomText(preset.bottomText);
    setBottomFontFamily(preset.bottomFontFamily);
    setBottomFontSize(preset.bottomFontSize);
    setCenterLine1(preset.centerLine1);
    setCenterLine1Size(preset.centerLine1Size);
    setCenterLine2(preset.centerLine2);
    setCenterLine2Size(preset.centerLine2Size);
    setSeparatorSymbol(preset.separatorSymbol);
    setSeparatorSize(preset.separatorSize);
    setInkColor(preset.inkColor);
    setDistress(preset.distress);
    setOuterRingWidth(preset.outerRingWidth);
    setInnerRingStyle(preset.innerRingStyle);
    setInnerRingWidth(preset.innerRingWidth);
    setInnerRingOffset(preset.innerRingOffset);
    setCenterIcon(preset.centerIcon);
    setShowDividers(preset.showDividers);
    setRotation(preset.rotation);
    setNoiseSeed((prev) => prev + 1);
  };

  // -------------------------------------------------------------
  // DISTRESS FILTER PARAMETERS CALCULATION
  // -------------------------------------------------------------
  // Base frequency scales from 0.04 to 0.16
  const baseFreq = 0.04 + (distress / 100) * 0.12;
  // Displacement scale from 0 to 8.5
  const dispScale = (distress / 100) * 8.5;
  // Color matrix alpha erosion: when distress is high, alpha is thresholded and eroded
  // matrix: [R G B A Offset]
  const alphaMult = 1.0 + (distress / 100) * 0.5;
  const alphaShift = -0.18 * (distress / 100);
  const matrixValues = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alphaMult.toFixed(2)} ${alphaShift.toFixed(2)}`;

  // -------------------------------------------------------------
  // PATH GENERATION FOR TOP & BOTTOM TEXT
  // Center is (250, 250) in 500x500 viewport
  // -------------------------------------------------------------
  const cx = 250;
  const cy = 250;

  // Geometry calculations based on shape
  const getStampGeometry = () => {
    switch (shape) {
      case 'oval': {
        const outerRx = 226;
        const outerRy = 168;
        const innerRx = outerRx - innerRingOffset;
        const innerRy = outerRy - innerRingOffset;
        const textRx = innerRx - 24;
        const textRy = innerRy - 20;

        // Top arc: left-to-right clockwise over top
        // start angle ~195deg to -15deg (in radians)
        const rad1 = (195 * Math.PI) / 180;
        const rad2 = (-15 * Math.PI) / 180;
        const x1 = cx + textRx * Math.cos(rad1);
        const y1 = cy + textRy * Math.sin(rad1);
        const x2 = cx + textRx * Math.cos(rad2);
        const y2 = cy + textRy * Math.sin(rad2);
        const topArc = `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${textRx.toFixed(1)} ${textRy.toFixed(1)} 0 1 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;

        // Bottom arc: left-to-right through bottom, sweep 0 for upright text
        const bRad1 = (165 * Math.PI) / 180;
        const bRad2 = (15 * Math.PI) / 180;
        const bx1 = cx + textRx * Math.cos(bRad1);
        const by1 = cy + textRy * Math.sin(bRad1);
        const bx2 = cx + textRx * Math.cos(bRad2);
        const by2 = cy + textRy * Math.sin(bRad2);
        const bottomArc = `M ${bx1.toFixed(1)} ${by1.toFixed(1)} A ${textRx.toFixed(1)} ${textRy.toFixed(1)} 0 0 0 ${bx2.toFixed(1)} ${by2.toFixed(1)}`;

        return {
          outerRx,
          outerRy,
          innerRx,
          innerRy,
          textRx,
          textRy,
          topArc,
          bottomArc,
          leftSep: { x: cx - textRx + 12, y: cy },
          rightSep: { x: cx + textRx - 12, y: cy },
        };
      }
      case 'rectangle': {
        const width = 450;
        const height = 310;
        const x = (500 - width) / 2;
        const y = (500 - height) / 2;
        const innerX = x + innerRingOffset;
        const innerY = y + innerRingOffset;
        const innerW = width - innerRingOffset * 2;
        const innerH = height - innerRingOffset * 2;

        // Straight paths for rectangle top and bottom
        const topArc = `M ${innerX + 25} ${innerY + 38} L ${innerX + innerW - 25} ${innerY + 38}`;
        const bottomArc = `M ${innerX + 25} ${innerY + innerH - 24} L ${innerX + innerW - 25} ${innerY + innerH - 24}`;

        return {
          width,
          height,
          x,
          y,
          innerX,
          innerY,
          innerW,
          innerH,
          topArc,
          bottomArc,
          leftSep: { x: innerX + 28, y: cy },
          rightSep: { x: innerX + innerW - 28, y: cy },
        };
      }
      case 'square': {
        const size = 430;
        const x = (500 - size) / 2;
        const y = (500 - size) / 2;
        const innerX = x + innerRingOffset;
        const innerY = y + innerRingOffset;
        const innerSize = size - innerRingOffset * 2;

        const topArc = `M ${innerX + 25} ${innerY + 44} L ${innerX + innerSize - 25} ${innerY + 44}`;
        const bottomArc = `M ${innerX + 25} ${innerY + innerSize - 28} L ${innerX + innerSize - 25} ${innerY + innerSize - 28}`;

        return {
          size,
          x,
          y,
          innerX,
          innerY,
          innerSize,
          topArc,
          bottomArc,
          leftSep: { x: innerX + 28, y: cy },
          rightSep: { x: innerX + innerSize - 28, y: cy },
        };
      }
      case 'circle':
      default: {
        const outerR = 222;
        const innerR = outerR - innerRingOffset;
        const textR = innerR - 26;

        // Top arc (clockwise over top from ~195deg to -15deg)
        const rad1 = (198 * Math.PI) / 180;
        const rad2 = (-18 * Math.PI) / 180;
        const x1 = cx + textR * Math.cos(rad1);
        const y1 = cy + textR * Math.sin(rad1);
        const x2 = cx + textR * Math.cos(rad2);
        const y2 = cy + textR * Math.sin(rad2);
        const topArc = `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${textR.toFixed(1)} ${textR.toFixed(1)} 0 1 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;

        // Bottom arc (sweep 0 from left to right along bottom, so text sits upright)
        const bRad1 = (162 * Math.PI) / 180;
        const bRad2 = (18 * Math.PI) / 180;
        const bx1 = cx + textR * Math.cos(bRad1);
        const by1 = cy + textR * Math.sin(bRad1);
        const bx2 = cx + textR * Math.cos(bRad2);
        const by2 = cy + textR * Math.sin(bRad2);
        const bottomArc = `M ${bx1.toFixed(1)} ${by1.toFixed(1)} A ${textR.toFixed(1)} ${textR.toFixed(1)} 0 0 0 ${bx2.toFixed(1)} ${by2.toFixed(1)}`;

        return {
          outerR,
          innerR,
          textR,
          topArc,
          bottomArc,
          leftSep: { x: cx - textR - 1, y: cy },
          rightSep: { x: cx + textR + 1, y: cy },
        };
      }
    }
  };

  const geo = getStampGeometry();

  // Helper for stroke dash array
  const getDashArray = (style: InnerRingStyle) => {
    switch (style) {
      case 'dashed':
        return '8 5';
      case 'dotted':
        return '2 5';
      default:
        return undefined;
    }
  };

  // -------------------------------------------------------------
  // EXPORT ENGINE (SVG & 1500x1500px 300DPI PNG)
  // -------------------------------------------------------------
  const generateSvgString = () => {
    if (!svgRef.current) return '';
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgRef.current);

    // Ensure XML namespace
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return svgString;
  };

  const handleDownloadSvg = () => {
    const svgData = generateSvgString();
    if (!svgData) return;

    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bilingual-stamp-${shape}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = async () => {
    if (!svgRef.current) return;
    setExporting(true);

    try {
      // Ensure web fonts are completely loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      const svgData = generateSvgString();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URLObj = window.URL || window.webkitURL || window;
      const blobURL = URLObj.createObjectURL(svgBlob);

      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        const canvas = document.createElement('canvas');
        // Ultra-high resolution: 1500x1500px (3x scale of 500x500 SVG)
        const exportSize = 1500;
        canvas.width = exportSize;
        canvas.height = exportSize;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Background fill if white card mode is chosen
          if (backgroundType === 'white') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, exportSize, exportSize);
          } else {
            ctx.clearRect(0, 0, exportSize, exportSize);
          }

          ctx.drawImage(image, 0, 0, exportSize, exportSize);

          canvas.toBlob((blob) => {
            if (blob) {
              const dlUrl = URLObj.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = dlUrl;
              link.download = `bilingual-stamp-1500dpi-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URLObj.revokeObjectURL(dlUrl);
            }
            setExporting(false);
          }, 'image/png');
        } else {
          setExporting(false);
        }
        URLObj.revokeObjectURL(blobURL);
      };

      image.onerror = () => {
        console.error('Failed to load SVG into image for canvas export.');
        setExporting(false);
        URLObj.revokeObjectURL(blobURL);
      };

      image.src = blobURL;
    } catch (err) {
      console.error('Error exporting PNG:', err);
      setExporting(false);
    }
  };

  const handleCopySvg = async () => {
    const svgData = generateSvgString();
    if (!svgData) return;
    try {
      await navigator.clipboard.writeText(svgData);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  // Center Icon rendering helper
  const renderCenterIcon = () => {
    const iconSize = 28;
    const yPos = centerLine1 || centerLine2 ? cy - 42 : cy;

    switch (centerIcon) {
      case 'shield':
        return (
          <g transform={`translate(${cx - iconSize / 2}, ${yPos - iconSize / 2})`}>
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              fill="none"
              stroke={inkColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`scale(${iconSize / 24})`}
            />
          </g>
        );
      case 'star':
        return (
          <g transform={`translate(${cx - iconSize / 2}, ${yPos - iconSize / 2})`}>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={inkColor}
              transform={`scale(${iconSize / 24})`}
            />
          </g>
        );
      case 'award':
        return (
          <g transform={`translate(${cx - iconSize / 2}, ${yPos - iconSize / 2})`}>
            <circle cx="12" cy="8" r="7" fill="none" stroke={inkColor} strokeWidth="2.5" transform={`scale(${iconSize / 24})`} />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="none" stroke={inkColor} strokeWidth="2.5" transform={`scale(${iconSize / 24})`} />
          </g>
        );
      case 'check':
        return (
          <g transform={`translate(${cx - iconSize / 2}, ${yPos - iconSize / 2})`}>
            <circle cx="12" cy="12" r="10" fill="none" stroke={inkColor} strokeWidth="2.5" transform={`scale(${iconSize / 24})`} />
            <polyline points="7 12 11 16 17 8" fill="none" stroke={inkColor} strokeWidth="2.5" transform={`scale(${iconSize / 24})`} />
          </g>
        );
      case 'crescent':
        return (
          <g transform={`translate(${cx - iconSize / 2}, ${yPos - iconSize / 2})`}>
            <path
              d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
              fill={inkColor}
              transform={`scale(${iconSize / 24})`}
            />
          </g>
        );
      case 'dots':
        return (
          <g transform={`translate(${cx}, ${yPos})`}>
            <circle cx="-16" cy="0" r="3" fill={inkColor} />
            <circle cx="0" cy="0" r="4.5" fill={inkColor} />
            <circle cx="16" cy="0" r="3" fill={inkColor} />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  return (
    <div id="bilingual-stamp-app" className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION / HEADER */}
      {/* ------------------------------------------------------------- */}
      <header id="stamp-maker-header" className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
            <StampIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Bilingual Stamp Maker
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  صانع الأختام
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Precision SVG Vector & Realistic Vintage Ink Distress Engine
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            id="copy-svg-btn"
            onClick={handleCopySvg}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-xs font-medium text-slate-300 transition shadow-sm cursor-pointer"
            title="Copy SVG to clipboard"
          >
            {copiedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden md:inline">{copiedStatus ? 'Copied!' : 'Copy SVG'}</span>
          </button>

          <button
            id="download-svg-btn"
            onClick={handleDownloadSvg}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white text-xs font-medium text-slate-200 transition shadow-sm cursor-pointer"
            title="Download Vector SVG"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>SVG</span>
          </button>

          <button
            id="download-png-btn"
            disabled={exporting}
            onClick={handleDownloadPng}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Export 1500x1500px 300 DPI High-Res PNG"
          >
            {exporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export PNG (300 DPI)</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT WORKSPACE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT CONTROLS SIDEBAR (380px fixed on desktop) */}
        {/* ========================================================= */}
        <aside
          id="stamp-controls-sidebar"
          className="w-full lg:w-[390px] xl:w-[410px] shrink-0 border-r border-slate-800 bg-slate-950/95 overflow-y-auto max-h-[calc(100vh-4rem)] p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700"
        >
          {/* SECTION 1: PRESET TEMPLATES */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <button
              id="accordion-presets-toggle"
              onClick={() => toggleSection('presets')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 text-left hover:bg-slate-850 transition cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-slate-200">Official Presets & Templates</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.presets ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.presets && (
              <div className="p-3 space-y-2 border-t border-slate-800/80 bg-slate-950/40">
                <p className="text-[11px] text-slate-400 mb-2">
                  Select a pre-designed bilingual seal to load standard government, notary, or corporate formats:
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      id={`preset-btn-${preset.id}`}
                      onClick={() => applyPreset(preset)}
                      className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 text-left transition group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: preset.inkColor }}
                        />
                        <div>
                          <div className="text-xs font-medium text-slate-200 group-hover:text-blue-400">
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-sans" dir="rtl">
                            {preset.nameAr}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider">
                        {preset.shape}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: SHAPE & GEOMETRY */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <button
              id="accordion-shapes-toggle"
              onClick={() => toggleSection('shapes')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 text-left hover:bg-slate-850 transition cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <CircleDot className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-slate-200">Stamp Shape & Outline</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.shapes ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.shapes && (
              <div className="p-4 space-y-4 border-t border-slate-800/80 bg-slate-950/40">
                {/* Shape Switcher */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-2">Stamp Geometry</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'circle', label: 'Circle' },
                      { id: 'oval', label: 'Oval' },
                      { id: 'rectangle', label: 'Rect' },
                      { id: 'square', label: 'Square' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        id={`shape-btn-${item.id}`}
                        onClick={() => setShape(item.id as StampShape)}
                        className={`px-2 py-2 rounded-lg text-xs font-medium border transition cursor-pointer flex flex-col items-center gap-1 ${
                          shape === item.id
                            ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {item.id === 'circle' && <div className="w-4 h-4 rounded-full border border-current" />}
                        {item.id === 'oval' && <div className="w-5 h-3 rounded-full border border-current" />}
                        {item.id === 'rectangle' && <div className="w-5 h-3 rounded-sm border border-current" />}
                        {item.id === 'square' && <div className="w-4 h-4 rounded-sm border border-current" />}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outer Ring Border Stroke Width */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Outer Ring Width</label>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                      {outerRingWidth}px
                    </span>
                  </div>
                  <input
                    id="outer-ring-width-slider"
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={outerRingWidth}
                    onChange={(e) => setOuterRingWidth(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1px (Fine)</span>
                    <span>8px</span>
                    <span>15px (Heavy)</span>
                  </div>
                </div>

                {/* Stamp Rotation Angle */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Stamp Press Rotation</label>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                      {rotation}°
                    </span>
                  </div>
                  <input
                    id="rotation-slider"
                    type="range"
                    min="-15"
                    max="15"
                    step="0.5"
                    value={rotation}
                    onChange={(e) => setRotation(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>-15°</span>
                    <button
                      onClick={() => setRotation(0)}
                      className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                    >
                      Reset (0°)
                    </button>
                    <span>+15°</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: INNER RING BORDER SYSTEM */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <button
              id="accordion-rings-toggle"
              onClick={() => toggleSection('rings')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 text-left hover:bg-slate-850 transition cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-slate-200">Inner Ring Borders</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.rings ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.rings && (
              <div className="p-4 space-y-4 border-t border-slate-800/80 bg-slate-950/40">
                {/* Inner Ring Line Style */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-2">Inner Line Style</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { id: 'solid', label: 'Solid' },
                      { id: 'dashed', label: 'Dashed' },
                      { id: 'dotted', label: 'Dotted' },
                      { id: 'double', label: 'Double' },
                      { id: 'none', label: 'Hidden' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        id={`inner-style-${item.id}`}
                        onClick={() => setInnerRingStyle(item.id as InnerRingStyle)}
                        className={`px-1.5 py-1.5 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                          innerRingStyle === item.id
                            ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {innerRingStyle !== 'none' && (
                  <>
                    {/* Inner Ring Stroke Width */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-300">Inner Stroke Width</label>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                          {innerRingWidth}px
                        </span>
                      </div>
                      <input
                        id="inner-ring-width-slider"
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={innerRingWidth}
                        onChange={(e) => setInnerRingWidth(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Inner Ring Inset Offset */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-300">Ring Offset Gap</label>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                          {innerRingOffset}px
                        </span>
                      </div>
                      <input
                        id="inner-ring-offset-slider"
                        type="range"
                        min="6"
                        max="26"
                        step="1"
                        value={innerRingOffset}
                        onChange={(e) => setInnerRingOffset(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* SECTION 4: BILINGUAL TYPOGRAPHY ENGINE */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <button
              id="accordion-typography-toggle"
              onClick={() => toggleSection('typography')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 text-left hover:bg-slate-850 transition cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">Bilingual Curved Text</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.typography ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.typography && (
              <div className="p-4 space-y-5 border-t border-slate-800/80 bg-slate-950/40">
                {/* TOP ARC TEXT (ARABIC SCRIPT RTL) */}
                <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Top Arc Text (Arabic RTL)
                    </span>
                    <span className="text-[10px] text-slate-500 font-arabic">النص العلوي</span>
                  </div>

                  <div>
                    <input
                      id="top-arc-text-input"
                      type="text"
                      dir="rtl"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      placeholder="أدخل النص العربي العلوي..."
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white font-arabic focus:outline-none focus:border-emerald-500 transition text-right"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Font Family */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Font Family</label>
                      <select
                        id="top-font-family-select"
                        value={topFontFamily}
                        onChange={(e) => setTopFontFamily(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Cairo">Cairo (Arabic)</option>
                        <option value="Arial">Arial</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="sans-serif">System Sans</option>
                      </select>
                    </div>

                    {/* Font Size */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Font Size</span>
                        <span className="font-mono text-emerald-400">{topFontSize}px</span>
                      </div>
                      <input
                        id="top-font-size-slider"
                        type="range"
                        min="14"
                        max="42"
                        value={topFontSize}
                        onChange={(e) => setTopFontSize(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* BOTTOM ARC TEXT (ENGLISH UPPERCASE LTR) */}
                <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Bottom Arc Text (English)
                    </span>
                    <span className="text-[10px] text-slate-500">Curved Upright</span>
                  </div>

                  <div>
                    <input
                      id="bottom-arc-text-input"
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value.toUpperCase())}
                      placeholder="ENTER BOTTOM TEXT..."
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Font Family */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Font Family</label>
                      <select
                        id="bottom-font-family-select"
                        value={bottomFontFamily}
                        onChange={(e) => setBottomFontFamily(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Roboto Condensed">Roboto Condensed</option>
                        <option value="Oswald">Oswald</option>
                        <option value="Arial">Arial</option>
                        <option value="sans-serif">System Sans</option>
                      </select>
                    </div>

                    {/* Font Size */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Font Size</span>
                        <span className="font-mono text-blue-400">{bottomFontSize}px</span>
                      </div>
                      <input
                        id="bottom-font-size-slider"
                        type="range"
                        min="12"
                        max="36"
                        value={bottomFontSize}
                        onChange={(e) => setBottomFontSize(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: CENTER TEXT LINES & SEPARATORS */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <button
              id="accordion-center-toggle"
              onClick={() => toggleSection('center')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 text-left hover:bg-slate-850 transition cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-slate-200">Center Text & Separators</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.center ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.center && (
              <div className="p-4 space-y-4 border-t border-slate-800/80 bg-slate-950/40">
                {/* Center Line 1 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">Center Line 1</label>
                    <span className="text-xs font-mono text-purple-400">{centerLine1Size}px</span>
                  </div>
                  <input
                    id="center-line1-input"
                    type="text"
                    value={centerLine1}
                    onChange={(e) => setCenterLine1(e.target.value)}
                    placeholder="e.g. P.O. BOX: 2235"
                    className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white mb-2"
                  />
                  <input
                    id="center-line1-size-slider"
                    type="range"
                    min="10"
                    max="32"
                    value={centerLine1Size}
                    onChange={(e) => setCenterLine1Size(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Center Line 2 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">Center Line 2</label>
                    <span className="text-xs font-mono text-purple-400">{centerLine2Size}px</span>
                  </div>
                  <input
                    id="center-line2-input"
                    type="text"
                    value={centerLine2}
                    onChange={(e) => setCenterLine2(e.target.value)}
                    placeholder="e.g. DUBAI - U.A.E"
                    className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white mb-2"
                  />
                  <input
                    id="center-line2-size-slider"
                    type="range"
                    min="10"
                    max="32"
                    value={centerLine2Size}
                    onChange={(e) => setCenterLine2Size(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Decorative Dividers & Center Emblem */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-300">Center Emblem</label>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDividers}
                        onChange={(e) => setShowDividers(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                      />
                      <span>Dividing Bars</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'shield', label: 'Shield' },
                      { id: 'star', label: 'Star' },
                      { id: 'award', label: 'Award' },
                      { id: 'check', label: 'Check' },
                      { id: 'crescent', label: 'Crescent' },
                      { id: 'dots', label: 'Dots' },
                      { id: 'none', label: 'None' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        id={`center-icon-${item.id}`}
                        onClick={() => setCenterIcon(item.id as CenterIconType)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                          centerIcon === item.id
                            ? 'border-purple-500 bg-purple-600/20 text-purple-300'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Side Separators (Left & Right) */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Side Separator Symbol</label>
                    <span className="text-xs font-mono text-purple-400">{separatorSize}px</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      id="separator-symbol-input"
                      type="text"
                      maxLength={3}
                      value={separatorSymbol}
                      onChange={(e) => setSeparatorSymbol(e.target.value)}
                      className="w-16 px-2 py-1.5 text-center text-base bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                    <div className="flex gap-1 flex-1 overflow-x-auto py-1">
                      {['★', '✦', '❖', '✪', '●', '◆', '✔', '🛡️'].map((sym) => (
                        <button
                          key={sym}
                          onClick={() => setSeparatorSymbol(sym)}
                          className="w-8 h-8 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-purple-400 text-xs text-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    id="separator-size-slider"
                    type="range"
                    min="10"
                    max="30"
                    value={separatorSize}
                    onChange={(e) => setSeparatorSize(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: REALISTIC VINTAGE INK DISTRESS & COLOR */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <button
              id="accordion-ink-toggle"
              onClick={() => toggleSection('ink')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 text-left hover:bg-slate-850 transition cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-semibold text-slate-200">Vintage Ink & Color</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.ink ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.ink && (
              <div className="p-4 space-y-4 border-t border-slate-800/80 bg-slate-950/40">
                {/* Distress Intensity Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <span>Vintage Ink Wear</span>
                      <span className="text-[10px] text-slate-500">(feTurbulence)</span>
                    </label>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-slate-700">
                      {distress}%
                    </span>
                  </div>
                  <input
                    id="distress-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={distress}
                    onChange={(e) => setDistress(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                    <span>0% (Crisp Vector)</span>
                    <button
                      id="randomize-noise-seed-btn"
                      onClick={() => setNoiseSeed(Math.floor(Math.random() * 9999))}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      title="Generate new organic rubber distress grain"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Randomize Grain</span>
                    </button>
                    <span>100% (Aged)</span>
                  </div>
                </div>

                {/* Primary Ink Color */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-2">Ink Color Palette</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {INK_PALETTE.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setInkColor(c.hex)}
                        className={`h-8 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                          inkColor === c.hex ? 'border-white ring-2 ring-blue-500/50' : 'border-slate-800 hover:border-slate-600'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {inkColor === c.hex && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>

                  {/* Custom Hex Picker */}
                  <div className="flex items-center space-x-2">
                    <input
                      id="ink-color-picker"
                      type="color"
                      value={inkColor}
                      onChange={(e) => setInkColor(e.target.value)}
                      className="w-9 h-8 rounded border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
                    />
                    <input
                      id="ink-color-hex-input"
                      type="text"
                      value={inkColor.toUpperCase()}
                      onChange={(e) => setInkColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 uppercase"
                    />
                  </div>
                </div>

                {/* Ink Opacity */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Ink Translucency</label>
                    <span className="text-xs font-mono text-slate-400">{inkOpacity}%</span>
                  </div>
                  <input
                    id="ink-opacity-slider"
                    type="range"
                    min="60"
                    max="100"
                    value={inkOpacity}
                    onChange={(e) => setInkOpacity(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ========================================================= */}
        {/* INTERACTIVE STAGE (Dot-Grid Canvas Preview Area) */}
        {/* ========================================================= */}
        <main
          id="stamp-canvas-stage"
          className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 relative overflow-auto bg-slate-950 min-h-[500px]"
          style={{
            backgroundImage: `radial-gradient(circle, #334155 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Top Stage Tool Bar */}
          <div className="w-full max-w-[620px] flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Background:</span>
              <button
                id="bg-toggle-white"
                onClick={() => setBackgroundType('white')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                  backgroundType === 'white'
                    ? 'border-blue-500 bg-white text-slate-900 font-semibold'
                    : 'border-slate-800 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                White Card
              </button>
              <button
                id="bg-toggle-transparent"
                onClick={() => setBackgroundType('transparent')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                  backgroundType === 'transparent'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300 font-semibold'
                    : 'border-slate-800 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Checkerboard
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1.5">
              <button
                id="zoom-out-btn"
                onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.1))}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-slate-300 w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                id="zoom-in-btn"
                onClick={() => setZoomLevel((prev) => Math.min(1.5, prev + 0.1))}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                id="zoom-reset-btn"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Centered Canvas Container */}
          <div className="flex-1 flex items-center justify-center w-full py-4">
            <div
              id="stamp-card-container"
              className={`transition-all duration-200 rounded-2xl shadow-2xl relative flex items-center justify-center p-6 border ${
                backgroundType === 'white'
                  ? 'bg-white border-slate-200 shadow-slate-950/40'
                  : 'border-slate-800'
              }`}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                ...(backgroundType === 'transparent'
                  ? {
                      backgroundImage: `
                        linear-gradient(45deg, #1e293b 25%, transparent 25%), 
                        linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #1e293b 75%), 
                        linear-gradient(-45deg, transparent 75%, #1e293b 75%)
                      `,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }
                  : {}),
              }}
            >
              {/* ===================================================== */}
              {/* PURE SVG STAMP GRAPHIC ENGINE (500x500 Viewport) */}
              {/* ===================================================== */}
              <svg
                ref={svgRef}
                id="stamp-vector-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 500"
                width="500"
                height="500"
                className="select-none overflow-visible"
                style={{
                  opacity: inkOpacity / 100,
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <defs>
                  {/* Google Fonts import embedded into SVG for vector export portability */}
                  <style type="text/css">
                    {`
                      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;900&family=Oswald:wght@700&family=Roboto+Condensed:wght@700&display=swap');
                      .stamp-text {
                        user-select: none;
                      }
                    `}
                  </style>

                  {/* REALISTIC VINTAGE INK DISTRESS FILTER */}
                  {distress > 0 && (
                    <filter
                      id={`distress-filter-${filterId}`}
                      x="-15%"
                      y="-15%"
                      width="130%"
                      height="130%"
                      filterUnits="userSpaceOnUse"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency={baseFreq.toFixed(3)}
                        numOctaves="4"
                        seed={noiseSeed}
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale={dispScale.toFixed(2)}
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="displaced"
                      />
                      <feColorMatrix
                        type="matrix"
                        values={matrixValues}
                        result="distressedAlpha"
                      />
                      <feComposite in="distressedAlpha" in2="SourceGraphic" operator="in" />
                    </filter>
                  )}

                  {/* Dynamic Arc Paths for Text Anchoring */}
                  <path id={`top-arc-${filterId}`} d={geo.topArc} fill="none" />
                  <path id={`bottom-arc-${filterId}`} d={geo.bottomArc} fill="none" />
                </defs>

                {/* Filtered Group container holding all stamp vectors */}
                <g
                  id="stamp-elements-group"
                  filter={distress > 0 ? `url(#distress-filter-${filterId})` : undefined}
                >
                  {/* 1. OUTER RING BORDER */}
                  {shape === 'circle' && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={(geo as any).outerR}
                      fill="none"
                      stroke={inkColor}
                      strokeWidth={outerRingWidth}
                    />
                  )}

                  {shape === 'oval' && (
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={(geo as any).outerRx}
                      ry={(geo as any).outerRy}
                      fill="none"
                      stroke={inkColor}
                      strokeWidth={outerRingWidth}
                    />
                  )}

                  {shape === 'rectangle' && (
                    <rect
                      x={(geo as any).x}
                      y={(geo as any).y}
                      width={(geo as any).width}
                      height={(geo as any).height}
                      rx="16"
                      ry="16"
                      fill="none"
                      stroke={inkColor}
                      strokeWidth={outerRingWidth}
                    />
                  )}

                  {shape === 'square' && (
                    <rect
                      x={(geo as any).x}
                      y={(geo as any).y}
                      width={(geo as any).size}
                      height={(geo as any).size}
                      rx="16"
                      ry="16"
                      fill="none"
                      stroke={inkColor}
                      strokeWidth={outerRingWidth}
                    />
                  )}

                  {/* 2. INNER RING BORDER(S) */}
                  {innerRingStyle !== 'none' && (
                    <>
                      {/* Standard or primary inner ring */}
                      {shape === 'circle' && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={(geo as any).innerR}
                          fill="none"
                          stroke={inkColor}
                          strokeWidth={innerRingWidth}
                          strokeDasharray={getDashArray(innerRingStyle)}
                        />
                      )}

                      {shape === 'oval' && (
                        <ellipse
                          cx={cx}
                          cy={cy}
                          rx={(geo as any).innerRx}
                          ry={(geo as any).innerRy}
                          fill="none"
                          stroke={inkColor}
                          strokeWidth={innerRingWidth}
                          strokeDasharray={getDashArray(innerRingStyle)}
                        />
                      )}

                      {shape === 'rectangle' && (
                        <rect
                          x={(geo as any).innerX}
                          y={(geo as any).innerY}
                          width={(geo as any).innerW}
                          height={(geo as any).innerH}
                          rx="10"
                          ry="10"
                          fill="none"
                          stroke={inkColor}
                          strokeWidth={innerRingWidth}
                          strokeDasharray={getDashArray(innerRingStyle)}
                        />
                      )}

                      {shape === 'square' && (
                        <rect
                          x={(geo as any).innerX}
                          y={(geo as any).innerY}
                          width={(geo as any).innerSize}
                          height={(geo as any).innerSize}
                          rx="10"
                          ry="10"
                          fill="none"
                          stroke={inkColor}
                          strokeWidth={innerRingWidth}
                          strokeDasharray={getDashArray(innerRingStyle)}
                        />
                      )}

                      {/* Optional Secondary Ring for 'Double' style */}
                      {innerRingStyle === 'double' && (
                        <>
                          {shape === 'circle' && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={(geo as any).innerR - 5}
                              fill="none"
                              stroke={inkColor}
                              strokeWidth={Math.max(1, innerRingWidth - 0.5)}
                            />
                          )}
                          {shape === 'oval' && (
                            <ellipse
                              cx={cx}
                              cy={cy}
                              rx={(geo as any).innerRx - 5}
                              ry={(geo as any).innerRy - 5}
                              fill="none"
                              stroke={inkColor}
                              strokeWidth={Math.max(1, innerRingWidth - 0.5)}
                            />
                          )}
                          {shape === 'rectangle' && (
                            <rect
                              x={(geo as any).innerX + 5}
                              y={(geo as any).innerY + 5}
                              width={(geo as any).innerW - 10}
                              height={(geo as any).innerH - 10}
                              rx="6"
                              ry="6"
                              fill="none"
                              stroke={inkColor}
                              strokeWidth={Math.max(1, innerRingWidth - 0.5)}
                            />
                          )}
                          {shape === 'square' && (
                            <rect
                              x={(geo as any).innerX + 5}
                              y={(geo as any).innerY + 5}
                              width={(geo as any).innerSize - 10}
                              height={(geo as any).innerSize - 10}
                              rx="6"
                              ry="6"
                              fill="none"
                              stroke={inkColor}
                              strokeWidth={Math.max(1, innerRingWidth - 0.5)}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* 3. BILINGUAL TOP ARC TEXT (ARABIC RTL) */}
                  <text
                    className="stamp-text"
                    fill={inkColor}
                    fontFamily={topFontFamily}
                    fontSize={topFontSize}
                    fontWeight="bold"
                    letterSpacing={topLetterSpacing}
                  >
                    <textPath
                      href={`#top-arc-${filterId}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {topText}
                    </textPath>
                  </text>

                  {/* 4. BILINGUAL BOTTOM ARC TEXT (ENGLISH UPPERCASE LTR) */}
                  <text
                    className="stamp-text"
                    fill={inkColor}
                    fontFamily={bottomFontFamily}
                    fontSize={bottomFontSize}
                    fontWeight="bold"
                    letterSpacing={bottomLetterSpacing}
                  >
                    <textPath
                      href={`#bottom-arc-${filterId}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {bottomText}
                    </textPath>
                  </text>

                  {/* 5. SIDE SEPARATORS (LEFT & RIGHT) */}
                  {separatorSymbol && (
                    <>
                      <text
                        x={geo.leftSep.x}
                        y={geo.leftSep.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={inkColor}
                        fontSize={separatorSize}
                        fontWeight="bold"
                      >
                        {separatorSymbol}
                      </text>
                      <text
                        x={geo.rightSep.x}
                        y={geo.rightSep.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={inkColor}
                        fontSize={separatorSize}
                        fontWeight="bold"
                      >
                        {separatorSymbol}
                      </text>
                    </>
                  )}

                  {/* 6. CENTER CONTENT (ICON, LINES, & DIVIDERS) */}
                  {renderCenterIcon()}

                  {/* Center Line 1 */}
                  {centerLine1 && (
                    <text
                      x={cx}
                      y={centerIcon !== 'none' ? cy - 3 : cy - 14}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={inkColor}
                      fontFamily="Roboto Condensed, Arial, sans-serif"
                      fontSize={centerLine1Size}
                      fontWeight="bold"
                      letterSpacing="1"
                    >
                      {centerLine1}
                    </text>
                  )}

                  {/* Center Line 2 */}
                  {centerLine2 && (
                    <text
                      x={cx}
                      y={centerIcon !== 'none' ? cy + 24 : cy + 16}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={inkColor}
                      fontFamily="Roboto Condensed, Arial, sans-serif"
                      fontSize={centerLine2Size}
                      fontWeight="bold"
                      letterSpacing="1.2"
                    >
                      {centerLine2}
                    </text>
                  )}

                  {/* Decorative Horizontal Dividers flanking center lines */}
                  {showDividers && (
                    <g stroke={inkColor} strokeWidth="1.5">
                      {/* Top Divider */}
                      <line
                        x1={cx - 110}
                        y1={centerIcon !== 'none' ? cy - 20 : cy - 32}
                        x2={cx + 110}
                        y2={centerIcon !== 'none' ? cy - 20 : cy - 32}
                      />
                      {/* Bottom Divider */}
                      <line
                        x1={cx - 110}
                        y1={centerIcon !== 'none' ? cy + 42 : cy + 34}
                        x2={cx + 110}
                        y2={centerIcon !== 'none' ? cy + 42 : cy + 34}
                      />
                    </g>
                  )}
                </g>
              </svg>
            </div>
          </div>

          {/* Bottom Stage Status Footer */}
          <div className="w-full max-w-[620px] flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive 500x500 SVG Engine</span>
            </div>
            <div className="flex items-center space-x-3 font-mono text-[10px]">
              <span>Shape: {shape.toUpperCase()}</span>
              <span>•</span>
              <span>Distress: {distress}%</span>
              <span>•</span>
              <span>DPI: 300 (1500px)</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
