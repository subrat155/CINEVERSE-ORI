
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import FadeIn from '../components/FadeIn';
import { TESTIMONIALS } from '../constants';
import { Movie, RentableMovie, LiveShow, UpcomingMovie } from '../types';
import { Star, ArrowRight, Play, Pause, Volume2, VolumeX, Mic2, MapPin, Calendar, Clock } from 'lucide-react';

interface HomeProps {
  movies: Movie[];
  rentals?: RentableMovie[];
  liveShows?: LiveShow[];
  upcoming?: UpcomingMovie[]; // New Prop
}

// Advertisement Data Sets (3 sets of 3 images)
const AD_SETS = [
  [
    { id: 1, img: 'https://picsum.photos/seed/ad1/400/250', title: '50% Off Popcorn' },
    { id: 2, img: 'https://picsum.photos/seed/ad2/400/250', title: 'Bank Offer' },
    { id: 3, img: 'https://picsum.photos/seed/ad3/400/250', title: 'Gift Cards' },
  ],
  [
    { id: 4, img: 'https://picsum.photos/seed/ad4/400/250', title: 'IMAX Upgrade' },
    { id: 5, img: 'https://picsum.photos/seed/ad5/400/250', title: 'Family Combo' },
    { id: 6, img: 'https://picsum.photos/seed/ad6/400/250', title: 'Late Night Show' },
  ],
  [
    { id: 7, img: 'https://picsum.photos/seed/ad7/400/250', title: 'Couple Seat' },
    { id: 8, img: 'https://picsum.photos/seed/ad8/400/250', title: 'Student Pass' },
    { id: 9, img: 'https://picsum.photos/seed/ad9/400/250', title: 'Weekend Bonanza' },
  ]
];

const Home: React.FC<HomeProps> = ({ movies, rentals = [], liveShows = [], upcoming = [] }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  // Advertisement State
  const [currentAdSetIndex, setCurrentAdSetIndex] = useState(0);

  // Rotate Ads every 3 seconds
  useEffect(() => {
    const adTimer = setInterval(() => {
      setCurrentAdSetIndex((prev) => (prev + 1) % AD_SETS.length);
    }, 3000);
    return () => clearInterval(adTimer);
  }, []);

  // Effect to play video for 5 seconds then pause
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Browser policy requires muted for autoplay
      video.muted = true;
      
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          // Stop after 5 seconds as requested
          setTimeout(() => {
            if (video && !video.paused) {
              video.pause();
              setIsPlaying(false);
            }
          }, 5000);
        }).catch(error => {
          console.log("Autoplay prevented:", error);
        });
      }
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-12 pb-12 transition-colors duration-300">
      <Carousel />

      {/* Movies in Halls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold border-l-4 border-[#007BFF] pl-4 text-theme-main">Movies in Halls</h2>
          <button 
            onClick={() => navigate('/movies')}
            className="text-[#007BFF] hover:text-theme-main flex items-center gap-2 transition"
          >
            See All <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.slice(0, 8).map((movie, index) => (
            <FadeIn key={movie.id} delay={index * 100}>
              <div 
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-theme-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group border border-theme"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-2 right-2 bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Star size={12} fill="black" /> {movie.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate text-theme-main group-hover:text-[#007BFF] transition">{movie.title}</h3>
                  <p className="text-theme-secondary text-sm mb-3 truncate">{movie.genre}</p>
                  <button className="w-full bg-[#007BFF] hover:bg-[#0056D2] text-white py-2 rounded-lg text-sm font-semibold transition">
                    Book Now
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* DYNAMIC ADVERTISEMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AD_SETS[currentAdSetIndex].map((ad, index) => (
            <div 
              key={`${currentAdSetIndex}-${index}`} // Key change triggers re-render animation
              className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer animate-in fade-in duration-700"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img 
                  src={ad.img} 
                  alt={ad.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                 <span className="text-[#F5C518] text-xs font-bold uppercase tracking-wider mb-1">Sponsored</span>
                 <h3 className="text-white font-bold text-lg">{ad.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UPCOMING MOVIES SECTION (NEW) */}
      {upcoming && upcoming.length > 0 && (
        <section className="py-12 bg-theme-footer border-y border-theme transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-theme-main border-l-4 border-green-500 pl-4">Coming Soon</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {upcoming.map((movie, index) => (
                <FadeIn key={movie.id} delay={index * 100}>
                  <div className="group relative rounded-xl overflow-hidden shadow-lg aspect-[2/3]">
                    <img src={movie.image} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 p-4 flex flex-col justify-end">
                      <h3 className="text-white font-bold text-lg">{movie.title}</h3>
                      <p className="text-gray-300 text-xs mt-1">{movie.genre}</p>
                      <p className="text-green-400 text-xs font-bold mt-2 uppercase tracking-wide">Releasing: {movie.releaseDate}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RENTALS SECTION */}
      {rentals && rentals.length > 0 && (
        <section className="bg-theme-card py-12 border-y border-theme transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold border-l-4 border-[#F5C518] pl-4 text-[#F5C518]">Buy Old Movies on Rent</h2>
                  <p className="text-theme-secondary mt-2 text-sm pl-5">Relive the classics. Watch instantly on your device.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {rentals.map((rental, index) => (
                   <FadeIn key={rental.id} delay={index * 100}>
                      <div className="bg-theme-main rounded-lg overflow-hidden border border-theme hover:border-[#F5C518] transition-all group shadow-md">
                         <div className="relative aspect-[2/3]">
                            <img src={rental.image} alt={rental.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-4">
                               <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight mb-1">{rental.title}</h3>
                               <p className="text-xs text-gray-300">{rental.year} • {rental.genre.split('/')[0]}</p>
                            </div>
                         </div>
                         <div className="p-3">
                            <div className="flex flex-wrap gap-1 mb-3 text-[10px] text-theme-secondary">
                               {rental.cast.slice(0,2).map(c => <span key={c}>{c},</span>)}
                            </div>
                            <button 
                              onClick={() => navigate(`/rent/${rental.id}`)}
                              className="w-full bg-[#F5C518] hover:bg-yellow-500 text-black py-2 rounded font-bold text-xs flex items-center justify-center gap-1 transition"
                            >
                              <Play size={12} fill="black"/> Rent @ ₹{rental.priceSingle}
                            </button>
                         </div>
                      </div>
                   </FadeIn>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* LIVE EVENTS SECTION */}
      {liveShows && liveShows.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold border-l-4 border-purple-500 pl-4 text-purple-400">Live Events & Shows</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {liveShows.map((show, index) => (
                <FadeIn key={show.id} delay={index * 100}>
                   <div className="bg-theme-card rounded-xl overflow-hidden shadow-xl border border-theme flex flex-col sm:flex-row h-full group hover:border-purple-500 transition-colors">
                      <div className="sm:w-2/5 relative">
                         <img src={show.image} alt={show.title} className="w-full h-full object-cover min-h-[200px]" />
                         <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {show.category}
                         </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                         <div>
                           <h3 className="text-xl font-bold mb-2 text-theme-main group-hover:text-purple-400 transition-colors">{show.title}</h3>
                           <p className="text-theme-secondary text-sm mb-4 line-clamp-2">{show.description}</p>
                           <div className="space-y-1 text-sm text-theme-secondary">
                              <div className="flex items-center gap-2"><Calendar size={14}/> {show.date}</div>
                              <div className="flex items-center gap-2"><Clock size={14}/> {show.time}</div>
                              <div className="flex items-center gap-2"><MapPin size={14}/> {show.location}</div>
                           </div>
                         </div>
                         <div className="mt-6 flex items-center justify-between">
                            <span className="text-2xl font-bold text-theme-main">₹{show.price}</span>
                            <button 
                              onClick={() => navigate(`/live-show/${show.id}`)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition flex items-center gap-2"
                            >
                               <Mic2 size={16}/> Book Ticket
                            </button>
                         </div>
                      </div>
                   </div>
                </FadeIn>
             ))}
          </div>
        </section>
      )}

      {/* Trailer Section */}
      <section className="bg-black py-16 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1F26] via-transparent to-[#1C1F26]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <h2 className="text-3xl font-bold mb-10 text-white border-l-4 border-[#007BFF] pl-4">Latest Trailers</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="space-y-8">
                   <h3 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
                     Catch the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-purple-500">Action</span> Before It Hits The Big Screen
                   </h3>
                   <p className="text-gray-300 text-lg leading-relaxed">
                     Get an exclusive sneak peek at the most anticipated releases of the year. From heart-pounding thrillers to emotional dramas, experience the magic of cinema.
                   </p>
                   <div className="flex flex-wrap gap-4">
                     <button onClick={() => navigate('/trailers')} className="bg-[#007BFF] hover:bg-[#0056D2] text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/30">
                        <Play size={20} fill="currentColor" /> Watch Full Trailer
                     </button>
                     <button onClick={() => navigate('/trailers')} className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold transition">
                        View All Trailers
                     </button>
                   </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={200}>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700 relative group aspect-video bg-black">
                   <video 
                     ref={videoRef}
                     className="w-full h-full object-cover"
                     src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                     playsInline
                     muted={isMuted}
                     onEnded={() => setIsPlaying(false)}
                   />
                   
                   {/* Custom Controls Overlay */}
                   <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                      <button 
                        onClick={togglePlay}
                        className="w-16 h-16 bg-[#007BFF]/90 hover:bg-[#007BFF] rounded-full flex items-center justify-center transition-transform transform hover:scale-110 backdrop-blur-sm"
                      >
                         {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1"/>}
                      </button>
                   </div>

                   {/* Mute Toggle */}
                   <button 
                     onClick={toggleMute}
                     className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
                   >
                     {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                   </button>
                </div>
                <p className="text-center text-gray-500 text-sm mt-3 italic">
                   * Preview auto-plays for 5 seconds
                </p>
              </FadeIn>
           </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="bg-theme-card py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-theme-main">Top Rated Movies Now</h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
             {movies.filter(m => m.rating > 8).map(movie => (
                <div key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)} className="flex-none w-60 cursor-pointer hover:opacity-80 transition">
                   <img src={movie.image} alt={movie.title} className="rounded-lg shadow-lg mb-2 w-full h-80 object-cover" />
                   <h4 className="font-bold text-theme-main">{movie.title}</h4>
                   <div className="flex text-[#F5C518] text-sm"><Star size={16} fill="#F5C518"/> {movie.rating}</div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* What Customers Say */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-theme-main">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review, index) => (
            <FadeIn key={review.id} delay={index * 150}>
              <div className="bg-theme-card p-6 rounded-xl border border-theme shadow-lg relative transition-colors duration-300">
                <div className="absolute -top-4 left-6 bg-[#007BFF] w-8 h-8 flex items-center justify-center rounded-full text-2xl font-serif text-white">"</div>
                <p className="text-theme-secondary italic mb-4 pt-2">"{review.comment}"</p>
                <div className="flex items-center justify-between border-t border-theme pt-4">
                  <span className="font-bold text-theme-main">{review.name}</span>
                  <div className="flex text-[#F5C518]">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="#F5C518" />)}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
