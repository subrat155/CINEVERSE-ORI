import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie, Hall } from '../types';
import { Clock, Calendar, Star, MapPin, Ticket } from 'lucide-react';

interface MovieDetailsProps {
  movies: Movie[];
  halls: Hall[];
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movies, halls }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find(m => m.id === id);
  const [selectedDate, setSelectedDate] = useState('Today');

  if (!movie) return <div className="text-center py-20 text-xl">Movie not found</div>;

  const dates = ['Today', 'Tomorrow', 'Oct 24', 'Oct 25'];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img src={movie.image} className="w-full h-full object-cover blur-sm opacity-30" alt="bg"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F26] via-[#1C1F26]/80 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-end pb-12 gap-8">
           <img src={movie.image} alt={movie.title} className="w-48 md:w-64 rounded-xl shadow-2xl border-4 border-[#2A2E36]" />
           <div className="pb-4">
             <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{movie.title}</h1>
             <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4 text-sm">
                <span className="bg-gray-700 px-2 py-1 rounded">{movie.genre}</span>
                <span className="flex items-center gap-1"><Clock size={16}/> {movie.duration}</span>
                <span className="flex items-center gap-1"><Calendar size={16}/> {movie.releaseDate}</span>
                <span className="flex items-center gap-1 text-[#F5C518] font-bold"><Star size={16} fill="#F5C518"/> {movie.rating}/10</span>
             </div>
             <p className="text-gray-300 max-w-2xl mb-6">{movie.description}</p>
             <button onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth'})} className="bg-[#007BFF] hover:bg-[#0056D2] text-white px-8 py-3 rounded-lg font-bold shadow-lg transition">
               Book Tickets
             </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Cast & Reviews */}
        <div className="lg:col-span-2 space-y-12">
          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 border-l-4 border-[#007BFF] pl-4">Cast</h2>
              <div className="flex gap-6 overflow-x-auto pb-4">
                {movie.cast.map((actor, idx) => (
                  <div key={idx} className="flex-none w-32 text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 border-gray-600">
                      <img src={actor.image} alt={actor.name} className="w-full h-full object-cover"/>
                    </div>
                    <p className="font-semibold text-sm">{actor.name}</p>
                    <p className="text-gray-500 text-xs">{actor.role}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-[#007BFF] pl-4">User Reviews</h2>
            <div className="space-y-4">
              {movie.reviews && movie.reviews.length > 0 ? movie.reviews.map((rev, idx) => (
                <div key={idx} className="bg-[#2A2E36] p-4 rounded-lg">
                   <div className="flex justify-between mb-2">
                     <span className="font-bold">{rev.user}</span>
                     <span className="flex text-[#F5C518]"><Star size={14} fill="#F5C518"/> {rev.rating}</span>
                   </div>
                   <p className="text-gray-400 text-sm">{rev.comment}</p>
                </div>
              )) : <p className="text-gray-500">No reviews yet.</p>}
            </div>
          </section>
        </div>

        {/* Right Column: Booking */}
        <div id="booking-section" className="bg-[#2A2E36] p-6 rounded-xl h-fit sticky top-24 shadow-2xl border border-[#3A3F47]">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Ticket size={20}/> Select Show</h3>
           
           {/* Date Selector */}
           <div className="flex gap-2 mb-6 overflow-x-auto">
             {dates.map(date => (
               <button 
                key={date} 
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${selectedDate === date ? 'bg-[#007BFF] text-white' : 'bg-[#1C1F26] text-gray-400 hover:text-white'}`}
               >
                 {date}
               </button>
             ))}
           </div>

           {/* Halls & Times */}
           <div className="space-y-4">
             {halls.map(hall => (
               <div key={hall.id} className="border-b border-gray-700 pb-4 last:border-0">
                 <div className="flex items-center gap-2 mb-3 text-sm text-gray-300">
                   <MapPin size={14} className="text-[#007BFF]"/> 
                   <span className="font-bold text-white">{hall.name}</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {hall.times.map(time => (
                     <button 
                       key={time}
                       onClick={() => navigate(`/seat-selection/${movie.id}/${hall.id}/${time}?date=${selectedDate}`)}
                       className="border border-[#3A3F47] hover:border-[#007BFF] hover:text-[#007BFF] hover:bg-[#007BFF]/10 text-xs px-3 py-1.5 rounded transition"
                     >
                       {time}
                     </button>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetails;