import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { SAMPLE_INPUT, SAMPLE_JSON, SlideData } from '../types';
import { parseSlides } from '../utils/parser';
import SlideRenderer from './SlideRenderer';

export const SlideGenerator: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_INPUT);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [globalCategory, setGlobalCategory] = useState("RAPPORT TECHNIQUE");
  
  // Refs to store DOM elements for downloading
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setSlides(parseSlides(inputText));
  }, [inputText]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseJsonTemplate = () => {
    if (window.confirm("Replace current content with JSON template?")) {
      setInputText(SAMPLE_JSON);
    }
  };

  const handleDownload = async (index: number, silent = false) => {
    const element = slideRefs.current[index];
    if (!element) return;

    try {
      // High-fidelity capture settings
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution (Retina)
        useCORS: true,
        backgroundColor: null, // Transparent corners if rounded
        logging: false,
        onclone: (clonedDoc) => {
            // Find the cloned element by ID and reset its transform
            const clonedEl = clonedDoc.getElementById(`slide-node-${slides[index].id}`);
            if (clonedEl) {
                clonedEl.style.transform = 'scale(1)';
            }
        }
      });

      const link = document.createElement('a');
      link.download = `BPC-Slide-${slides[index].id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to download slide", err);
      if (!silent) alert("Error generating image.");
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    for (let i = 0; i < slides.length; i++) {
        await handleDownload(i, true);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B0D10] text-white">
      
      {/* Top Bar for Mobile / Global Controls */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-bpc-charcoal border-b border-gray-800 z-50 p-4 flex justify-between items-center">
         <span className="font-montserrat font-bold text-bpc-red">BPC GEN</span>
         <button 
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="bg-bpc-red text-white text-xs font-bold px-3 py-2 rounded uppercase disabled:opacity-50"
         >
            {isDownloading ? 'Processing...' : 'Download All'}
         </button>
      </div>

      {/* LEFT PANEL: INPUT */}
      <div className="w-full lg:w-1/3 bg-[#0B0D10] border-r border-gray-800 flex flex-col h-screen sticky top-0 pt-16 lg:pt-0">
        <div className="p-6 border-b border-gray-800 bg-[#141821]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-bpc-white">
                  <span className="text-bpc-red">BPC</span> Generator
              </h1>
              <p className="text-bpc-grey text-xs mt-1 font-inter opacity-70">
                  Format: Text or JSON
              </p>
            </div>
            {/* Desktop Download All */}
            <button 
              onClick={handleDownloadAll}
              disabled={isDownloading || slides.length === 0}
              className="hidden lg:block bg-bpc-red hover:bg-bpc-red-dark text-white font-montserrat font-bold text-sm px-6 py-3 rounded shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? 'SAVING...' : 'DOWNLOAD ALL SLIDES'}
            </button>
          </div>

          {/* Logo Upload & JSON Toggle Section */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-2">
                    <label htmlFor="logo-upload" className="cursor-pointer bg-bpc-charcoal border border-bpc-grey/30 hover:border-bpc-red/50 text-bpc-white px-4 py-2 rounded-lg font-inter text-xs font-medium uppercase tracking-wide transition-all flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                       {logo ? "Change Logo" : "Upload Logo"}
                    </label>
                    <input 
                       id="logo-upload" 
                       type="file" 
                       accept="image/*" 
                       onChange={handleLogoUpload} 
                       className="hidden" 
                    />
                    {logo && (
                        <button 
                          onClick={() => setLogo(null)}
                          className="text-bpc-grey hover:text-bpc-red text-xs underline"
                        >
                          Remove
                        </button>
                    )}
                </div>
                
                {/* JSON View Toggle */}
                <button 
                   onClick={() => setShowJson(!showJson)}
                   className={`text-xs font-mono px-2 py-1 rounded border ${showJson ? 'bg-bpc-red/20 border-bpc-red text-bpc-red' : 'border-gray-700 text-gray-500'}`}
                >
                   {showJson ? '{} Hide Output' : '{} Show Output'}
                </button>
             </div>

             {/* Global Category Selector */}
             <div>
                <label className="text-bpc-grey text-xs uppercase font-bold tracking-wider mb-2 block">
                    Global Badge Category
                </label>
                <input 
                    list="category-options" 
                    value={globalCategory}
                    onChange={(e) => setGlobalCategory(e.target.value)}
                    className="w-full bg-bpc-black border border-bpc-grey/30 text-white px-3 py-2 rounded text-sm font-inter focus:border-bpc-red focus:outline-none placeholder-gray-600"
                    placeholder="RAPPORT TECHNIQUE"
                />
                <datalist id="category-options">
                    <option value="RAPPORT TECHNIQUE" />
                    <option value="STAGES" />
                    <option value="OUTILS & TECHNOLOGIE" />
                    <option value="BÉNÉFICES CLIENTS" />
                    <option value="STORIES ATHLÈTES" />
                    <option value="SCIENCE & MÉTHODOLOGIE" />
                </datalist>
             </div>

             {/* Helper to insert JSON Template */}
             <div className="flex items-center justify-end mt-1">
                <button 
                    onClick={handleUseJsonTemplate}
                    className="text-[10px] text-bpc-grey hover:text-bpc-white underline font-inter"
                >
                    Insert JSON Template
                </button>
             </div>
          </div>
        </div>
        
        {showJson ? (
          <div className="flex-grow bg-zinc-950 p-6 overflow-auto">
             <pre className="text-xs text-green-500 font-mono whitespace-pre-wrap">
                {JSON.stringify(slides, null, 2)}
             </pre>
          </div>
        ) : (
          <textarea
            className="flex-grow bg-[#0B0D10] text-bpc-white font-mono p-6 resize-none focus:outline-none focus:ring-1 focus:ring-bpc-red text-sm leading-relaxed"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            spellCheck={false}
            placeholder="Paste your slide content (Text or JSON) here..."
          />
        )}
      </div>

      {/* RIGHT PANEL: PREVIEW */}
      <div className="w-full lg:w-2/3 bg-zinc-900 p-8 overflow-y-auto h-screen pt-20 lg:pt-8">
        <div className="max-w-[500px] mx-auto space-y-16 pb-20">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex flex-col items-center gap-4 group">
              
              <div className="flex justify-between w-full items-center px-1">
                <span className="font-montserrat font-bold text-bpc-grey text-xs tracking-widest">
                  SLIDE {index + 1} <span className="text-bpc-red">•</span> {slide.template}
                </span>
                <button
                  onClick={() => handleDownload(index)}
                  className="flex items-center gap-2 text-bpc-grey hover:text-white transition-colors text-xs font-medium uppercase tracking-wide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG
                </button>
              </div>

              {/* Wrapper for scaling */}
              <div 
                className="relative shadow-2xl overflow-hidden rounded-xl border border-gray-800 bg-black"
                style={{ width: 432, height: 540 }}
              >
                 <SlideRenderer 
                    ref={el => (slideRefs.current[index] = el)}
                    data={slide}
                    scale={0.4} // Scale down for preview
                    totalSlides={slides.length}
                    logo={logo}
                    globalCategory={globalCategory}
                 />
              </div>

              <button
                onClick={() => handleDownload(index)}
                className="w-full bg-[#141821] hover:bg-bpc-charcoal border border-gray-800 text-bpc-white font-inter text-sm font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 group-hover:border-bpc-red/50"
              >
                 Download Slide {index + 1}
              </button>

            </div>
          ))}
          
          {slides.length === 0 && (
             <div className="text-center text-bpc-grey py-20 font-inter">
               Start typing in the left panel to generate slides.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};