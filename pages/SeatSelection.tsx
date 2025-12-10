import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Movie, Hall } from '../types';
import { ArrowLeft, Box } from 'lucide-react';
import HallView3D from '../components/HallView3D';

interface SeatSelectionProps {
  movies: Movie[];
  halls: Hall[];
}

const SEAT_PRICE = 200;
const ROWS = 8;
const COLS_PER_SIDE = 4;

const SeatSelection: React.FC<SeatSelectionProps> = ({ movies, halls }) => {
  const { movieId, hallId, time } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const date = new URLSearchParams(location.search).get('date') || 'Today';

  const movie = movies.find(m => m.id === movieId);
  const hall = halls.find(h => h.id === hallId);

  // Generate generic seats
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [show3DView, setShow3DView] = useState(false);
  
  // Fake occupied seats
  const occupiedSeats = ['B3', 'D4', 'D5', 'F1', 'F2'];

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    const total = selectedSeats.length * SEAT_PRICE;
    // Pass booking data to payment
    navigate('/payment', { 
      state: { 
        movie, 
        hall, 
        time, 
        date, 
        seats: selectedSeats, 
        total 
      } 
    });
  };

  if (!movie || !hall) return <div>Loading...</div>;

  const renderSeat = (row: number, col: number, side: 'left' | 'right') => {
    const rowChar = String.fromCharCode(65 + row);
    const seatNum = side === 'left' ? col + 1 : col + 1 + COLS_PER_SIDE;
    const seatId = `${rowChar}${seatNum}`;
    const isOccupied = occupiedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    return (
      <button
        key={seatId}
        disabled={isOccupied}
        onClick={() => toggleSeat(seatId)}
        className={`
          w-8 h-8 md:w-10 md:h-10 rounded-t-lg text-[10px] md:text-xs font-bold transition-all
          ${isOccupied ? 'bg-gray-600 cursor-not-allowed opacity-50' : 
            isSelected ? 'bg-[#007BFF] text-white shadow-[0_0_15px_#007BFF]' : 
            'bg-white text-black hover:bg-gray-200'}
        `}
      >
        {seatId}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#1C1F26] p-4 md:p-8 flex flex-col items-center">
      {/* 3D View Modal */}
      {show3DView && hall.image && (
        <HallView3D image={hall.image} onClose={() => setShow3DView(false)} />
      )}

      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2">
           <ArrowLeft size={20}/> Back
        </button>
        <div className="text-center">
           <h2 className="text-xl font-bold">{movie.title}</h2>
           <p className="text-sm text-gray-400">{hall.name} | {date} | {time}</p>
        </div>
        
        {/* 3D View Trigger */}
        <button 
          onClick={() => setShow3DView(true)}
          className="bg-[#2A2E36] hover:bg-[#3A3F47] text-[#007BFF] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold border border-[#007BFF]/30 transition shadow-lg shadow-blue-500/10"
        >
          <Box size={18} /> View Hall 3D
        </button>
      </div>

      {/* Screen */}
      <div className="w-full max-w-3xl mb-12 relative">
         <div className="h-2 bg-gradient-to-r from-transparent via-[#007BFF] to-transparent w-full opacity-50 shadow-[0_10px_30px_#007BFF]"></div>
         <p className="text-center text-xs text-gray-500 mt-4 uppercase tracking-widest">Screen this way</p>
      </div>

      {/* Seats Grid */}
      <div className="flex gap-8 md:gap-16 mb-12">
        {/* Left Side */}
        <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${COLS_PER_SIDE}, min-content)` }}>
          {Array.from({ length: ROWS }).map((_, r) => 
            Array.from({ length: COLS_PER_SIDE }).map((_, c) => renderSeat(r, c, 'left'))
          )}
        </div>
        {/* Right Side */}
        <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${COLS_PER_SIDE}, min-content)` }}>
          {Array.from({ length: ROWS }).map((_, r) => 
            Array.from({ length: COLS_PER_SIDE }).map((_, c) => renderSeat(r, c, 'right'))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm mb-8">
         <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white rounded-t-sm"></div> Available</div>
         <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#007BFF] rounded-t-sm"></div> Selected</div>
         <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-600 rounded-t-sm"></div> Sold</div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2A2E36] border-t border-[#3A3F47] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <div>
              <p className="text-gray-400 text-xs">Total Price</p>
              <p className="text-2xl font-bold text-white">₹{selectedSeats.length * SEAT_PRICE}</p>
              <p className="text-xs text-[#007BFF]">{selectedSeats.join(', ')}</p>
           </div>
           <button 
             onClick={handleContinue}
             disabled={selectedSeats.length === 0}
             className="bg-[#007BFF] hover:bg-[#0056D2] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold transition"
           >
             Continue
           </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;