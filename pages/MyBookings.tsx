import React, { useEffect, useState } from 'react';
import { Booking, User } from '../types';
import { Ticket, Loader2, Hash, Calendar, Clock, MapPin } from 'lucide-react';
import { api } from '../services/api';

interface MyBookingsProps {
  user: User | null;
}

const MyBookings: React.FC<MyBookingsProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getUserBookings(user.id).then(data => {
        setBookings(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-[70vh] items-center justify-center flex-col text-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-gray-400">You need to be logged in to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Ticket className="text-[#007BFF]" /> My Bookings
      </h2>

      {loading ? (
        <div className="flex justify-center py-20">
           <Loader2 className="animate-spin text-[#007BFF]" size={40} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-[#2A2E36] rounded-xl border border-[#3A3F47] border-dashed">
          <p className="text-gray-400 text-lg mb-4">No bookings found</p>
          <p className="text-sm text-gray-500">Go ahead and book your favorite movie now!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-[#2A2E36] rounded-xl overflow-hidden shadow-lg border border-[#3A3F47] flex flex-col md:flex-row group hover:border-[#007BFF] transition-all">
              <div className="w-full md:w-32 h-32 md:h-auto relative">
                 <img src={booking.movieImage} alt={booking.movieTitle} className="w-full h-full object-cover" />
                 <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20">
                    {booking.type === 'live' ? 'LIVE' : booking.type === 'rental' ? 'RENTAL' : 'MOVIE'}
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">{booking.movieTitle}</h3>
                    <div className="text-gray-400 text-sm space-y-1 mt-2">
                       <p className="flex items-center gap-2"><MapPin size={14}/> {booking.hall}</p>
                       <p className="flex items-center gap-2"><Calendar size={14}/> {booking.date}</p>
                       <p className="flex items-center gap-2"><Clock size={14}/> {booking.time}</p>
                    </div>
                  </div>
                  
                  {/* BOOKING ID BADGE */}
                  <div className="bg-[#1C1F26] border border-[#3A3F47] rounded-lg p-3 text-right min-w-[120px]">
                     <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center justify-end gap-1 mb-1">
                       <Hash size={10}/> Booking ID
                     </p>
                     <p className="text-[#007BFF] font-mono font-bold text-sm tracking-wide">
                       {booking.id}
                     </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between items-end border-t border-[#3A3F47] pt-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {booking.type === 'rental' ? 'Access' : 'Seats / Admit'}
                    </p>
                    <p className="text-white font-medium">
                      {booking.seats.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Paid</p>
                    <p className="text-xl font-bold text-white">₹{booking.totalAmount}</p>
                  </div>
                </div>
              </div>
              
              {/* Status Strip */}
              <div className="bg-green-500/10 w-full md:w-10 flex items-center justify-center border-t md:border-t-0 md:border-l border-[#3A3F47] py-2 md:py-0">
                <div className="md:-rotate-90 text-green-500 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                  {booking.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;