
import React from 'react';

const BackgroundVideo: React.FC = () => {
  return (
    <>
      {/* Full screen video container */}
      <div className="fixed inset-0 -z-20 overflow-hidden w-full h-full pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=2000"
        >
          {/* Using a high-quality, stable medical/lab themed background video */}
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-scientist-working-in-a-laboratory-40660-large.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Dark gradient overlay to ensure text readability across all pages */}
      <div className="fixed inset-0 -z-10 bg-slate-900/60 backdrop-blur-[1px] pointer-events-none" />
    </>
  );
};

export default BackgroundVideo;
