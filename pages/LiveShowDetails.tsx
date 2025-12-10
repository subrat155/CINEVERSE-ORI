
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LiveShow } from '../types';
import { Clock, MapPin, Calendar, ArrowLeft, Users } from 'lucide-react';

interface LiveShowDetailsProps {
  shows: LiveShow[];
}

const LiveShowDetails: React.FC<LiveShowDetailsProps> = ({ shows }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const show = shows.find(s => s.id === id);
  const [tickets, setTickets] = useState(1);

  if (!show) return <div className="text-center py-20">Show not found</div>;

  const totalAmount = show.price * tickets;

  const handleBook = () => {
    navigate('/payment', { 
      state: { 
        isLiveShow: true,
        movie: {
          id: show.id,
          title: show.title,
          image: show.image,
        },
        hall: { name: show.location },
        date: show.date,
        time: show.time,
        seats: [`${tickets} Ticket(s)`],
        ticketCount: tickets,
        total: totalAmount 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[#1C1F26] text-white">
      {/* Hero */}
      <div className="relative h-[50vh]">
        <img src={show.image} className="w-full h-full object-cover opacity-40 blur-sm" alt="bg"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F26] to-transparent"></div>
        <div className="absolute inset-0 flex items-end justify-center pb-12">
           <div className="flex flex-col md:flex-row items-end gap-8 max-w-5xl w-full px-4">
              <img src={show.image} className="w-48 rounded-lg shadow-2xl border-4 border-[#2A2E36]" alt={show.title}/>
              <div className="mb-2">
                 <h1 className="text-4xl font-bold mb-2">{show.title}</h1>
                 <p className="text-[#007BFF] font-bold text-lg mb-2">{show.category} Event</p>
                 <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1"><Calendar size={16}/> {show.date}</span>
                    <span className="flex items-center gap-1"><Clock size={16}/> {show.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={16}/> {show.location}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
           <h2 className="text-2xl font-bold mb-4 border-l-4 border-[#007BFF] pl-3">About the Event</h2>
           <p className="text-gray-300 leading-relaxed mb-8 text-lg">{show.description}</p>
        </div>

        <div className="bg-[#2A2E36] p-6 rounded-xl border border-[#3A3F47] h-fit shadow-xl">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Book Tickets</h3>
           
           <div className="mb-6">
             <label className="block text-sm text-gray-400 mb-2">Number of Persons</label>
             <div className="relative">
               <Users className="absolute left-3 top-3 text-gray-500" size={18}/>
               <input 
                 type="number"
                 min="1"
                 max="10"
                 value={tickets}
                 onChange={(e) => setTickets(Math.max(1, parseInt(e.target.value) || 1))}
                 className="w-full bg-[#1C1F26] border border-[#3A3F47] rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#007BFF]"
               />
             </div>
           </div>

           <div className="border-t border-[#3A3F47] py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Price per person</span>
                <span>₹{show.price}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-[#007BFF] mt-4 pt-4 border-t border-[#3A3F47] border-dashed">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
           </div>

           <div className="flex gap-3">
             <button onClick={() => navigate(-1)} className="px-4 py-3 rounded-lg border border-[#3A3F47] hover:bg-white/5 transition">
                <ArrowLeft size={20} />
             </button>
             <button onClick={handleBook} className="flex-1 bg-[#007BFF] hover:bg-[#0056D2] text-white py-3 rounded-lg font-bold shadow-lg transition transform hover:scale-[1.02]">
               Proceed to Pay
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveShowDetails;
