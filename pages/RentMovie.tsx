import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RentableMovie } from '../types';
import { Clock, Users, Calendar, ArrowLeft } from 'lucide-react';

interface RentMovieProps {
  rentals: RentableMovie[];
}

const RentMovie: React.FC<RentMovieProps> = ({ rentals }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = rentals.find(r => r.id === id);
  const [viewers, setViewers] = useState(1);

  if (!movie) return <div className="text-center py-20">Movie not found</div>;

  const calculatePrice = () => {
    if (viewers === 1) return movie.priceSingle;
    if (viewers === 2) return movie.priceCouple;
    // Extra viewers add standard overhead
    const extra = viewers - 2;
    return movie.priceCouple + (extra * 150);
  };

  const totalPrice = calculatePrice();

  const handleRent = () => {
    navigate('/payment', { 
      state: { 
        isRental: true,
        movie: {
          id: movie.id,
          title: movie.title,
          image: movie.image,
        },
        rentalDetails: {
          viewers: viewers,
          validity: movie.validityHours
        },
        hall: { name: 'Online Stream' }, // Mock structure for payment compatibility
        date: 'Instant Access',
        time: `${movie.validityHours} Hours Validity`,
        seats: [`${viewers} Device(s)`],
        total: totalPrice 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[#1C1F26] text-white">
      {/* Hero */}
      <div className="relative h-[50vh]">
        <img src={movie.image} className="w-full h-full object-cover opacity-40 blur-sm" alt="bg"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F26] to-transparent"></div>
        <div className="absolute inset-0 flex items-end justify-center pb-12">
           <div className="flex flex-col md:flex-row items-end gap-8 max-w-5xl w-full px-4">
              <img src={movie.image} className="w-48 rounded-lg shadow-2xl border-4 border-[#2A2E36]" alt={movie.title}/>
              <div className="mb-2">
                 <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                 <p className="text-gray-300 text-lg mb-4">{movie.year} • {movie.genre}</p>
                 <div className="flex gap-2 text-sm text-[#007BFF] font-bold">
                    <span>{movie.validityHours} Hours Rental Validity</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
           <h2 className="text-2xl font-bold mb-4 border-l-4 border-[#007BFF] pl-3">Synopsis</h2>
           <p className="text-gray-300 leading-relaxed mb-8">{movie.description}</p>
           
           <h2 className="text-2xl font-bold mb-4 border-l-4 border-[#007BFF] pl-3">Cast</h2>
           <div className="flex flex-wrap gap-2">
             {movie.cast.map(c => (
               <span key={c} className="bg-[#2A2E36] px-3 py-1 rounded-full text-sm border border-[#3A3F47]">{c}</span>
             ))}
           </div>
        </div>

        <div className="bg-[#2A2E36] p-6 rounded-xl border border-[#3A3F47] h-fit shadow-xl">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock size={20}/> Rent This Movie</h3>
           
           <div className="mb-6">
             <label className="block text-sm text-gray-400 mb-2">Number of Viewers / Devices</label>
             <div className="relative">
               <Users className="absolute left-3 top-3 text-gray-500" size={18}/>
               <select 
                 value={viewers}
                 onChange={(e) => setViewers(parseInt(e.target.value))}
                 className="w-full bg-[#1C1F26] border border-[#3A3F47] rounded-lg py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-[#007BFF]"
               >
                 <option value={1}>1 Person</option>
                 <option value={2}>2 People (Discount)</option>
                 <option value={3}>3 People</option>
                 <option value={4}>4 People</option>
                 <option value={5}>5 People</option>
               </select>
             </div>
             <p className="text-xs text-gray-500 mt-2">*Strictly monitored. Link works on selected number of devices only.</p>
           </div>

           <div className="border-t border-[#3A3F47] py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Base Price ({viewers === 1 ? 'Single' : 'Shared'})</span>
                <span>₹{viewers === 1 ? movie.priceSingle : movie.priceCouple}</span>
              </div>
              {viewers > 2 && (
                <div className="flex justify-between mb-2 text-sm text-gray-400">
                  <span>Extra Viewers ({viewers - 2} x ₹150)</span>
                  <span>+₹{(viewers - 2) * 150}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl text-[#007BFF] mt-4 pt-4 border-t border-[#3A3F47] border-dashed">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
           </div>

           <div className="flex gap-3">
             <button onClick={() => navigate(-1)} className="px-4 py-3 rounded-lg border border-[#3A3F47] hover:bg-white/5 transition">
                <ArrowLeft size={20} />
             </button>
             <button onClick={handleRent} className="flex-1 bg-[#007BFF] hover:bg-[#0056D2] text-white py-3 rounded-lg font-bold shadow-lg transition transform hover:scale-[1.02]">
               Continue to Payment
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RentMovie;