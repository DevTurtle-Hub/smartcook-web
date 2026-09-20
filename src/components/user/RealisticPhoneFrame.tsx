import React from 'react';

interface RealisticPhoneFrameProps {
  imageSrc: string;
  altText: string;
  badgeText?: string;
  className?: string;
}

export const RealisticPhoneFrame: React.FC<RealisticPhoneFrameProps> = ({
  imageSrc,
  altText,
  badgeText,
  className = '',
}) => {
  return (
    <div className={`relative mx-auto select-none ${className}`}>
      {/* Dynamic Ambient Glow Behind Phone */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/25 via-amber-500/20 to-rose-500/20 rounded-[58px] blur-2xl opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none" />

      {/* Realistic Curved Android Phone Chassis */}
      <div className="relative w-[285px] sm:w-[310px] rounded-[50px] p-[10px] bg-gradient-to-b from-[#3a3d45] via-[#1c1f26] to-[#0f1115] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-white/10 transition-transform duration-500 group-hover:-translate-y-2">
        
        {/* Antenna / Metal Edge Highlight */}
        <div className="absolute inset-0 rounded-[50px] border border-white/20 pointer-events-none" />
        
        {/* Phone Volume & Power Buttons */}
        <div className="absolute -left-[13px] top-[105px] w-[3px] h-[34px] bg-[#4a4d56] rounded-l-md shadow-sm" />
        <div className="absolute -left-[13px] top-[148px] w-[3px] h-[34px] bg-[#4a4d56] rounded-l-md shadow-sm" />
        <div className="absolute -right-[13px] top-[125px] w-[3px] h-[48px] bg-[#4a4d56] rounded-r-md shadow-sm" />

        {/* Screen Bezel & Display Viewport */}
        <div className="relative rounded-[40px] overflow-hidden bg-black aspect-[9/19.5] shadow-inner flex flex-col justify-between">
          
          {/* Top Speaker / Punch-hole Camera */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
            {/* Punch hole camera */}
            <div className="w-3.5 h-3.5 rounded-full bg-[#080808] border border-slate-700/60 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#142036] opacity-80" />
            </div>
          </div>

          {/* Actual Pure Mobile Screen Image */}
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-full object-cover select-none"
              loading="lazy"
            />
            {/* Glossy Glass Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
          </div>

          {/* Android Gesture Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="w-28 h-1 bg-white/70 rounded-full backdrop-blur-md shadow-sm" />
          </div>

          {/* Optional Badge */}
          {badgeText && (
            <div className="absolute top-8 right-3 z-30 bg-orange-500/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg border border-white/30 backdrop-blur-md">
              {badgeText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
