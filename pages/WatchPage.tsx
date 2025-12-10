import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, Play, AlertTriangle } from 'lucide-react';

const WatchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const title = query.get('title');
  const limit = query.get('limit');
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulatedError, setSimulatedError] = useState(false);

  useEffect(() => {
    if(!title) navigate('/');
  }, [title, navigate]);

  // Simulate DRM Check
  useEffect(() => {
    // Randomly simulate a "limit exceeded" error after 10 seconds for demo purposes 
    // if the limit is low, just to show the UI
    const timer = setTimeout(() => {
       // This is just for demonstration of the requested feature
       // In a real app, this would be a socket event
       // setSimulatedError(true); 
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      
      {simulatedError ? (
        <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-2xl max-w-md animate-pulse">
           <ShieldAlert size={64} className="text-red-500 mx-auto mb-4"/>
           <h2 className="text-2xl font-bold text-white mb-2">Playback Stopped</h2>
           <p className="text-red-300">⚠️ Viewing limit exceeded for this rental plan.</p>
           <p className="text-sm text-gray-400 mt-2">Maximum allowed devices: {limit}</p>
           <button onClick={() => setSimulatedError(false)} className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold">
             Retry Connection
           </button>
        </div>
      ) : (
        <div className="w-full max-w-6xl aspect-video bg-gray-900 relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 group">
          
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
               <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
               <button 
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 bg-[#007BFF] rounded-full flex items-center justify-center pl-2 hover:scale-110 transition shadow-[0_0_30px_#007BFF]"
               >
                 <Play size={40} fill="white" />
               </button>
               <div className="mt-8 flex items-center gap-2 text-green-400 text-sm bg-green-900/30 px-4 py-2 rounded-full border border-green-500/30">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 DRM Protection Active. Max Viewers: {limit}
               </div>
            </div>
          )}

          {isPlaying && (
            <video 
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" 
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          )}
          
          {/* Mock Watermark */}
          {isPlaying && (
            <div className="absolute top-4 right-4 text-white/20 font-bold text-xl pointer-events-none select-none">
              CINEVERSE RENTAL
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 text-gray-500 text-sm">
        Link valid for {limit} device(s). Do not share.
      </div>
    </div>
  );
};

export default WatchPage;