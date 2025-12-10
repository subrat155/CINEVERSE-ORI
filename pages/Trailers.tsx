import React, { useState } from 'react';
import { Play, X, Clock, Info } from 'lucide-react';
import FadeIn from '../components/FadeIn';

interface Trailer {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
}

const TRAILERS: Trailer[] = [
  {
    id: 't1',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
    duration: '9:56'
  },
  {
    id: 't2',
    title: 'Sintel',
    description: 'A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when he is kidnapped by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Sintel_poster.jpg/800px-Sintel_poster.jpg',
    duration: '14:48'
  },
  {
    id: 't3',
    title: 'Tears of Steel',
    description: 'In an apocalyptic future, a group of warriors and scientists gather at the "Oude Kerk" in Amsterdam to stage a crucial event from the past in a desperate attempt to rescue the world from destructive robots.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Tears_of_Steel_poster.jpg/800px-Tears_of_Steel_poster.jpg',
    duration: '12:14'
  },
  {
    id: 't4',
    title: 'Elephant\'s Dream',
    description: 'The first open movie from Blender Foundation. Proog and Emo live in a surreal machine called the Machine that dominates their lives.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/ElephantsDreamPoster.jpg/800px-ElephantsDreamPoster.jpg',
    duration: '10:53'
  },
  {
    id: 't5',
    title: 'For Bigger Blazes',
    description: 'Experience high definition action sequences tailored for the big screen. A showcase of visual fidelity and sound design.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    duration: '0:15'
  },
  {
    id: 't6',
    title: 'For Bigger Escapes',
    description: 'Escape into a world of adventure. This trailer highlights the breathtaking landscapes and immersive environments of modern cinema.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    duration: '0:15'
  }
];

const Trailers = () => {
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);

  return (
    <div className="min-h-screen bg-[#1C1F26] pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">Latest Trailers</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Watch the newest trailers, teasers, and sneak peeks for upcoming blockbusters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRAILERS.map((trailer, index) => (
            <FadeIn key={trailer.id} delay={index * 100}>
              <div 
                onClick={() => setSelectedTrailer(trailer)}
                className="group bg-[#2A2E36] rounded-xl overflow-hidden shadow-lg border border-[#3A3F47] hover:border-[#007BFF] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#007BFF]/20"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={trailer.thumbnail} 
                    alt={trailer.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#007BFF]/90 rounded-full flex items-center justify-center pl-1 transform group-hover:scale-110 transition-transform shadow-lg backdrop-blur-sm">
                      <Play fill="white" size={32} />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                    <Clock size={12} /> {trailer.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#007BFF] transition-colors line-clamp-1">{trailer.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{trailer.description}</p>
                  
                  <div className="mt-4 flex items-center text-[#007BFF] text-sm font-semibold group-hover:underline">
                    Watch Now <Play size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedTrailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTrailer(null)}
          ></div>
          
          <div className="relative w-full max-w-5xl bg-[#1C1F26] rounded-2xl overflow-hidden shadow-2xl border border-[#3A3F47] animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#3A3F47] bg-[#2A2E36]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Play size={20} className="text-[#007BFF] fill-current" />
                {selectedTrailer.title}
              </h3>
              <button 
                onClick={() => setSelectedTrailer(null)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <video 
                src={selectedTrailer.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full"
              />
            </div>

            {/* Description */}
            <div className="p-6 bg-[#2A2E36]">
               <div className="flex items-start gap-3">
                 <Info className="text-[#007BFF] mt-1 shrink-0" size={20} />
                 <p className="text-gray-300 leading-relaxed">{selectedTrailer.description}</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trailers;