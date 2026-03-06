import React, { forwardRef } from 'react';
import { SlideData, SlideTemplate } from '../types';

interface SlideRendererProps {
  data: SlideData;
  scale?: number;
  totalSlides: number;
  logo?: string | null;
  globalCategory?: string;
}

// Simple Icon Components for BPC Theme
const Icons: Record<string, React.FC<{ className?: string }>> = {
  activity: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  chart: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3v18h18"/>
      <path d="M18 17V9"/>
      <path d="M13 17V5"/>
      <path d="M8 17v-3"/>
    </svg>
  ),
  zap: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  target: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  alert: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" x2="12" y1="9" y2="13"/>
      <line x1="12" x2="12.01" y1="17" y2="17"/>
    </svg>
  ),
  'alert-triangle': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  check: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  'check-circle': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  battery: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
       <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
       <line x1="23" y1="13" x2="23" y2="11" />
    </svg>
  ),
  clock: ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
       <circle cx="12" cy="12" r="10" />
       <polyline points="12 6 12 12 16 14" />
     </svg>
  ),
};

const SlideRenderer = forwardRef<HTMLDivElement, SlideRendererProps>(({ data, scale = 1, totalSlides, logo, globalCategory }, ref) => {
  const { title, content, highlight, highlightLabel, icon, template, id, footerLeft, footerRight, category } = data;

  // Determine which category text to display: Slide specific > Global Setting > Default
  const displayCategory = category || globalCategory || "RAPPORT TECHNIQUE";

  // Base styles compliant with BPC Design System
  const containerStyle: React.CSSProperties = {
    width: '1080px',
    height: '1350px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    overflow: 'hidden',
  };

  // --- DYNAMIC FONT SIZING LOGIC ---

  // For H1 (Hook Title)
  const getHookTitleSize = (text: string) => {
    if (text.length > 50) return 'text-[58px] leading-[1.1]';
    if (text.length > 30) return 'text-[72px] leading-[1.1]';
    return 'text-[88px] leading-[1.1]';
  };

  // For H2 (Pillar/Conclusion Titles)
  const getStandardTitleSize = (text: string) => {
    if (text.length > 40) return 'text-[42px]';
    return 'text-[52px]';
  };

  // For Body Text (Pillars/Lists)
  const getBodySizeConfig = (itemCount: number, longestItemLength: number) => {
    if (itemCount > 7 || longestItemLength > 60) {
      return { size: 'text-[24px]', gap: 'gap-4', padding: 'p-[20px]' };
    }
    if (itemCount > 5) {
      return { size: 'text-[28px]', gap: 'gap-5', padding: 'p-[24px]' };
    }
    return { size: 'text-[34px]', gap: 'gap-6', padding: 'p-[28px]' };
  };

  // --- RENDERERS ---

  const renderHeader = () => (
    <div className="flex justify-between items-center w-full mb-8 relative z-10 shrink-0 h-[80px]">
      <div className="flex items-center gap-4">
        {logo ? (
           <img src={logo} alt="Brand Logo" className="h-16 w-auto object-contain" />
        ) : (
          <div className="w-12 h-12 bg-bpc-red rounded-full flex items-center justify-center font-montserrat font-bold text-white text-xl shrink-0">
            BPC
          </div>
        )}
        <span className="font-montserrat font-bold text-2xl tracking-widest text-bpc-white">TRIATHLON</span>
      </div>
      
      <div className="px-6 py-2 bg-bpc-charcoal border border-bpc-grey/25 rounded-full">
        <span className="font-inter font-medium text-[18px] text-bpc-grey uppercase tracking-wider">{displayCategory}</span>
      </div>

      <div className="font-inter font-bold text-2xl text-bpc-grey/50">
        {id.toString().padStart(2, '0')}/{totalSlides.toString().padStart(2, '0')}
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="absolute bottom-[80px] left-[80px] right-[80px] flex justify-between items-center z-10">
      <span className="font-inter font-medium text-[22px] text-bpc-grey">{footerLeft || "bpctriathlon.fr"}</span>
      <span className="font-inter font-medium text-[22px] text-bpc-grey opacity-60">{footerRight || "#BuildYourLegacy"}</span>
    </div>
  );

  const renderIcon = () => {
    if (!icon) return null;
    const IconComponent = Icons[icon.toLowerCase()];
    if (!IconComponent) return null;
    return (
      <div className="absolute top-0 right-0 p-8 text-bpc-red/20">
        <IconComponent className="w-32 h-32" />
      </div>
    );
  };

  // Template: HOOK
  const renderHook = () => {
    const subtitle = content.length > 0 && !content[0].startsWith('-') ? content[0] : null;
    const bodyContent = subtitle ? content.slice(1) : content;
    const titleClass = getHookTitleSize(title);
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center relative z-10 px-10 pb-20">
        <h1 className={`font-montserrat font-extrabold tracking-[-2px] text-bpc-white uppercase mb-8 ${titleClass}`}>
          {title}
        </h1>
        
        <div className="w-24 h-2 bg-bpc-red mb-12"></div>
        
        {subtitle && (
          <p className="font-inter text-[42px] font-medium text-white mb-10 max-w-4xl">
            {subtitle}
          </p>
        )}

        {bodyContent.map((line, i) => (
          <p key={i} className="font-inter text-[34px] text-bpc-grey leading-relaxed max-w-3xl">
            {line.replace(/^- /, '')}
          </p>
        ))}

        {highlight && (
          <div className="mt-16 bg-bpc-charcoal border-2 border-bpc-red/35 rounded-[28px] px-12 py-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <span className="font-montserrat font-bold text-[36px] text-bpc-red uppercase tracking-wide">
              {highlight}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Template: PILLAR
  const renderPillar = () => {
    // Calculate sizing config based on content volume
    const longestLine = Math.max(...content.map(c => c.length), 0);
    const config = getBodySizeConfig(content.length, longestLine);
    const titleClass = getStandardTitleSize(title);

    // Use specific layout logic to avoid large voids.
    // We use justify-between on the container to space Title, Grid, and Highlight evenly.
    return (
      <div className="flex flex-col h-full relative z-10 pt-4 pb-20 justify-between">
        {renderIcon()}
        
        <div className="shrink-0">
            <h2 className={`font-montserrat font-bold text-bpc-white uppercase border-l-8 border-bpc-red pl-8 ${titleClass}`}>
              {title}
            </h2>
        </div>
        
        <div className="flex flex-col justify-center grow py-8">
            <div className={`grid grid-cols-1 ${config.gap} w-full pr-10`}>
              {content.map((line, i) => {
                const isBullet = line.startsWith('-') || line.startsWith('•');
                const text = line.replace(/^[-•] /, '');
                return (
                  <div key={i} className={`bg-bpc-charcoal border-2 border-bpc-grey/20 rounded-[24px] ${config.padding} flex items-start gap-5 shadow-sm`}>
                    {isBullet && <div className="mt-3 w-3 h-3 rounded-full bg-bpc-red shrink-0" />}
                    <p className={`font-inter ${config.size} text-bpc-grey leading-relaxed`}>
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
        </div>

        {highlight && (
          <div className="shrink-0 w-full mt-4">
             <div className="bg-bpc-charcoal/90 border border-bpc-red rounded-[24px] p-8 flex items-center justify-between shadow-lg backdrop-blur-sm">
                <span className="font-inter text-bpc-grey text-2xl uppercase tracking-widest font-bold opacity-80">
                  {highlightLabel || "INSIGHT"}
                </span>
                <span className={`font-montserrat font-bold text-bpc-red text-right ${highlight.length > 50 ? 'text-[28px]' : 'text-[40px]'}`}>
                  {highlight}
                </span>
             </div>
          </div>
        )}
      </div>
    );
  };

  // Template: CONCLUSION
  const renderConclusion = () => {
    const titleClass = getStandardTitleSize(title);
    
    return (
      <div className="flex flex-col h-full relative z-10 pt-10 pb-20 justify-between">
        {renderIcon()}
        
        <h2 className={`font-montserrat font-bold text-bpc-white leading-tight ${titleClass}`}>
          {title}
        </h2>
        
        <div className="flex-grow flex flex-col justify-center gap-8">
          {content.map((line, i) => (
             <p key={i} className="font-inter text-[34px] text-bpc-grey">
               {line}
             </p>
          ))}
        </div>

        <div className="w-full shrink-0">
          <div className="bg-gradient-to-r from-bpc-charcoal to-bpc-black border-2 border-bpc-red/35 rounded-[28px] p-[36px] text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <h3 className="font-montserrat font-bold text-[42px] text-bpc-white uppercase mb-4">
                 NEXT STEP
              </h3>
              <p className="font-inter text-[28px] text-bpc-red font-medium">
                 {highlight || "READY TO PERFORM?"}
              </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={ref}
      id={`slide-node-${id}`}
      style={containerStyle}
      className="bg-bpc-gradient bg-bpc-grid relative flex flex-col p-[80px] shrink-0"
    >
      {renderHeader()}
      
      {/* Main Content Area - Expands to fill available space between header and footer zone */}
      <div className="flex-grow w-full">
        {template === SlideTemplate.HOOK && renderHook()}
        {template === SlideTemplate.PILLAR && renderPillar()}
        {template === SlideTemplate.CONCLUSION && renderConclusion()}
      </div>

      {renderFooter()}
    </div>
  );
});

SlideRenderer.displayName = 'SlideRenderer';

export default SlideRenderer;