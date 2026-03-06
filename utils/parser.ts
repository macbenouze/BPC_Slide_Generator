import { SlideData, SlideTemplate } from '../types';

export const parseSlides = (input: string): SlideData[] => {
  const trimmed = input.trim();

  // Helper to guess label if not provided
  const guessLabel = (highlightText?: string): string => {
    if (!highlightText) return "INSIGHT";
    // If it contains a number digit, assume METRIC, otherwise INSIGHT
    return /\d/.test(highlightText) ? "METRIC" : "INSIGHT";
  };

  // 1. Try Parsing as JSON
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];
      
      return dataArray.map((item: any, index: number) => ({
        id: item.id || index + 1,
        title: item.title || "UNTITLED SLIDE",
        subtitle: item.subtitle,
        content: Array.isArray(item.content) ? item.content : [],
        highlight: item.highlight,
        highlightLabel: item.highlightLabel || guessLabel(item.highlight),
        icon: item.icon,
        footerLeft: item.footerLeft,
        footerRight: item.footerRight,
        category: item.category,
        template: (Object.values(SlideTemplate).includes(item.template)) 
          ? item.template 
          : SlideTemplate.PILLAR
      }));
    } catch (e) {
      console.warn("Input started with { or [ but failed JSON parsing. Falling back to text parser.", e);
    }
  }

  // 2. Fallback to Text Parsing
  const rawSlides = input.split(/SLIDE \d+:/i).filter(s => s.trim().length > 0);

  return rawSlides.map((raw, index) => {
    const lines = raw.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Default values
    let title = "UNTITLED SLIDE";
    let content: string[] = [];
    let highlight = undefined;
    let highlightLabel = "INSIGHT";
    
    if (lines.length > 0) {
      title = lines[0];
    }

    // Process remaining lines
    const remainingLines = lines.slice(1);
    content = remainingLines.filter(line => !line.toLowerCase().startsWith('metric:'));
    
    // Check for explicit metrics or highlights to extract
    const metricLine = remainingLines.find(line => line.toLowerCase().startsWith('metric:'));
    if (metricLine) {
      highlight = metricLine.replace(/metric:/i, '').trim();
      highlightLabel = guessLabel(highlight); // Auto-detect based on content
    }

    // Determine Template
    let template = SlideTemplate.PILLAR; // Default

    const isFirst = index === 0;
    const isLast = index === rawSlides.length - 1;
    const hasBullets = content.some(l => l.startsWith('-') || l.startsWith('•'));

    if (isFirst) {
      template = SlideTemplate.HOOK;
    } else if (isLast) {
      template = SlideTemplate.CONCLUSION;
    } else if (hasBullets) {
      template = SlideTemplate.PILLAR;
    }

    return {
      id: index + 1,
      title,
      content,
      highlight,
      highlightLabel,
      template
    };
  });
};