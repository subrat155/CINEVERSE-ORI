import React, { useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

interface HallView3DProps {
  image: string;
  onClose: () => void;
}

const HallView3D: React.FC<HallView3DProps> = ({ image, onClose }) => {
  const [rotation, setRotation] = useState(0);
  
  // Auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
        >
          <X size={24} />
        </button>

        {/* 3D Viewport */}
        <div className="w-full h-full overflow-hidden relative perspective-1000">
           {/* Simulated 3D Cylinder/Panorama via CSS transform */}
           <div 
             className="w-[200%] h-full absolute top-0 left-0 transition-transform duration-[50ms] linear"
             style={{ 
               backgroundImage: `url(${image})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               transform: `translateX(-${rotation / 3.6}%) scale(1.1)` 
             }}
           ></div>
           
           {/* Overlay Vignette */}
           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none"></div>
           
           <div className="absolute bottom-8 left-0 right-0 text-center z-10">
              <p className="text-white text-lg font-bold drop-shadow-md flex items-center justify-center gap-2">
                <RotateCcw size={20} className="animate-spin-slow"/> 360° Panoramic View
              </p>
              <p className="text-gray-300 text-xs">Simulated interior view</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HallView3D;