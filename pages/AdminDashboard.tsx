import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Movie, Hall, Booking, RentableMovie, LiveShow, UpcomingMovie } from '../types';
import { Trash2, Plus, DollarSign, Film, MapPin, Calendar, Clock, PlayCircle, Mic2, Search, CheckCircle, XCircle, Upload, Image as ImageIcon } from 'lucide-react';

interface AdminDashboardProps {
  onDataChange: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onDataChange }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'halls' | 'rentals' | 'liveshows' | 'upcoming'>('overview');
  const [revenue, setRevenue] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [rentals, setRentals] = useState<RentableMovie[]>([]);
  const [liveShows, setLiveShows] = useState<LiveShow[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Verification State
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState<{status: 'valid' | 'invalid', booking?: Booking} | null>(null);

  // Movie Form states
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({});

  // Hall Form states
  const [showAddHall, setShowAddHall] = useState(false);
  const [newHallName, setNewHallName] = useState('');
  const [newHallTimes, setNewHallTimes] = useState('');
  const [newHallImage, setNewHallImage] = useState('');

  // Rental Form states
  const [showAddRental, setShowAddRental] = useState(false);
  const [newRental, setNewRental] = useState<Partial<RentableMovie>>({});
  const [rentalCastInput, setRentalCastInput] = useState('');
  
  // Live Show Form states
  const [showAddLive, setShowAddLive] = useState(false);
  const [newLive, setNewLive] = useState<Partial<LiveShow>>({});

  // Upcoming Form
  const [showAddUpcoming, setShowAddUpcoming] = useState(false);
  const [newUpcoming, setNewUpcoming] = useState<Partial<UpcomingMovie>>({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Force fetch latest data
      const [rev, bks, mvs, hls, rnts, lvs, upc] = await Promise.all([
        api.getTotalRevenue(),
        api.getBookings(),
        api.getMovies(),
        api.getHalls(),
        api.getRentals(),
        api.getLiveShows(),
        api.getUpcoming()
      ]);
      setRevenue(rev);
      setBookings(bks);
      setMovies(mvs);
      setHalls(hls);
      setRentals(rnts);
      setLiveShows(lvs);
      setUpcoming(upc);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const booking = bookings.find(b => b.id === verifyId.trim());
    if (booking) {
      setVerifyResult({ status: 'valid', booking });
    } else {
      setVerifyResult({ status: 'invalid' });
    }
  };

  // --- DELETE HANDLERS (Optimistic Update + Global Sync) ---
  
  const handleDeleteMovie = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      // 1. Optimistic Update (Immediate Feedback)
      setMovies(prev => prev.filter(m => m.id !== id));
      
      // 2. Perform API delete
      try {
        await api.deleteMovie(id);
        // 3. Sync Global State so Website updates
        onDataChange();
      } catch (error) {
        console.error("Delete failed", error);
        fetchData(); // Revert on error
      }
    }
  };

  const handleDeleteHall = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this hall?")) {
      setHalls(prev => prev.filter(h => h.id !== id));
      try {
        await api.deleteHall(id);
        onDataChange();
      } catch (error) {
        console.error("Delete failed", error);
        fetchData();
      }
    }
  };

  const handleDeleteRental = async (id: string) => {
    if (window.confirm("Delete this rental movie?")) {
      setRentals(prev => prev.filter(r => r.id !== id));
      try {
        await api.deleteRental(id);
        onDataChange();
      } catch (error) {
        console.error("Delete failed", error);
        fetchData();
      }
    }
  };

  const handleDeleteLive = async (id: string) => {
     if (window.confirm("Cancel this live show?")) {
      setLiveShows(prev => prev.filter(s => s.id !== id));
      try {
        await api.deleteLiveShow(id);
        onDataChange();
      } catch (error) {
        console.error("Delete failed", error);
        fetchData();
      }
    }
  };

  const handleDeleteUpcoming = async (id: string) => {
    if (window.confirm("Remove this upcoming movie?")) {
      setUpcoming(prev => prev.filter(u => u.id !== id));
      try {
        await api.deleteUpcoming(id);
        onDataChange();
      } catch (error) {
        console.error("Delete failed", error);
        fetchData();
      }
    }
  };

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewHallImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ADD HANDLERS ---
  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.image) return;
    
    const movie: Movie = {
      id: Date.now().toString(),
      title: newMovie.title,
      description: newMovie.description || '',
      image: newMovie.image,
      rating: parseFloat(newMovie.rating?.toString() || '0'),
      genre: newMovie.genre || '',
      duration: newMovie.duration || '2h',
      releaseDate: newMovie.releaseDate || 'Coming Soon',
      cast: [],
      reviews: []
    };

    await api.addMovie(movie);
    setShowAddMovie(false);
    setNewMovie({});
    await fetchData();
    onDataChange();
  };

  const handleAddHall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHallName || !newHallTimes) return;
    const timesArray = newHallTimes.split(',').map(t => t.trim()).filter(t => t !== '');
    
    // Use the uploaded image or a fallback
    const imageToUse = newHallImage || 'https://images.unsplash.com/photo-1517604931442-71053e3e2c28?auto=format&fit=crop&q=80&w=1000';

    const hall: Hall = {
      id: `h_${Date.now()}`,
      name: newHallName,
      times: timesArray.length > 0 ? timesArray : ['10:00 AM', '06:00 PM'],
      image: imageToUse
    };
    await api.addHall(hall);
    setShowAddHall(false);
    setNewHallName('');
    setNewHallTimes('');
    setNewHallImage('');
    await fetchData();
    onDataChange();
  };

  const handleAddRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newRental.title || !newRental.image) return;
    const rental: RentableMovie = {
      id: `r_${Date.now()}`,
      title: newRental.title,
      year: newRental.year || '2010',
      genre: newRental.genre || 'Drama',
      cast: rentalCastInput.split(',').map(s => s.trim()).filter(s => s !== ''),
      description: newRental.description || '',
      image: newRental.image,
      priceSingle: Number(newRental.priceSingle) || 199,
      priceCouple: Number(newRental.priceCouple) || 349,
      validityHours: Number(newRental.validityHours) || 24
    };
    await api.addRental(rental);
    setShowAddRental(false);
    setNewRental({});
    setRentalCastInput('');
    await fetchData();
    onDataChange();
  };

  const handleAddLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newLive.title || !newLive.image) return;
    const show: LiveShow = {
      id: `l_${Date.now()}`,
      title: newLive.title,
      date: newLive.date || 'TBD',
      time: newLive.time || '07:00 PM',
      location: newLive.location || 'Main Hall',
      price: Number(newLive.price) || 499,
      image: newLive.image,
      description: newLive.description || '',
      category: newLive.category || 'Event'
    };
    await api.addLiveShow(show);
    setShowAddLive(false);
    setNewLive({});
    await fetchData();
    onDataChange();
  };

  const handleAddUpcoming = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newUpcoming.title || !newUpcoming.image) return;
    const movie: UpcomingMovie = {
      id: `up_${Date.now()}`,
      title: newUpcoming.title,
      releaseDate: newUpcoming.releaseDate || 'Coming Soon',
      genre: newUpcoming.genre || 'TBA',
      image: newUpcoming.image
    };
    await api.addUpcoming(movie);
    setShowAddUpcoming(false);
    setNewUpcoming({});
    await fetchData();
    onDataChange();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full bg-green-500 ${isLoading ? 'animate-ping' : 'animate-pulse'}`}></div>
           <span className="text-sm text-gray-400">{isLoading ? 'Updating...' : 'System Online'}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#2A2E36] p-6 rounded-xl border border-[#3A3F47] shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{revenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#2A2E36] p-6 rounded-xl border border-[#3A3F47] shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <h3 className="text-2xl font-bold">{bookings.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#2A2E36] p-6 rounded-xl border border-[#3A3F47] shadow-lg">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
              <Film size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Movies</p>
              <h3 className="text-2xl font-bold">{movies.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#2A2E36] p-6 rounded-xl border border-[#3A3F47] shadow-lg">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500">
              <PlayCircle size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Rentals/Live</p>
              <h3 className="text-2xl font-bold">{rentals.length + liveShows.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700 pb-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'text-[#007BFF] border-b-2 border-[#007BFF]' : 'text-gray-400 hover:text-white'}`}
        >
          Overview
        </button>
        <button 
           onClick={() => setActiveTab('movies')}
           className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'movies' ? 'text-[#007BFF] border-b-2 border-[#007BFF]' : 'text-gray-400 hover:text-white'}`}
        >
          Movies
        </button>
        <button 
           onClick={() => setActiveTab('upcoming')}
           className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'upcoming' ? 'text-[#007BFF] border-b-2 border-[#007BFF]' : 'text-gray-400 hover:text-white'}`}
        >
          Upcoming
        </button>
        <button 
           onClick={() => setActiveTab('liveshows')}
           className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'liveshows' ? 'text-[#007BFF] border-b-2 border-[#007BFF]' : 'text-gray-400 hover:text-white'}`}
        >
          Live Shows
        </button>
        <button 
           onClick={() => setActiveTab('halls')}
           className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'halls' ? 'text-[#007BFF] border-b-2 border-[#007BFF]' : 'text-gray-400 hover:text-white'}`}
        >
          Halls
        </button>
        <button 
           onClick={() => setActiveTab('rentals')}
           className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'rentals' ? 'text-[#007BFF] border-b-2 border-[#007BFF]' : 'text-gray-400 hover:text-white'}`}
        >
          Rentals
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Verification Tool */}
          <div className="bg-[#2A2E36] rounded-xl overflow-hidden shadow-lg border border-[#3A3F47] p-6 h-fit">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Search size={20}/> Verify Ticket</h3>
             <form onSubmit={handleVerifyTicket} className="space-y-4">
               <div>
                  <label className="text-xs text-gray-400 block mb-1">Enter Booking/Ticket ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. PY_X9J2..."
                    value={verifyId}
                    onChange={(e) => { setVerifyId(e.target.value); setVerifyResult(null); }}
                    className="w-full bg-[#1C1F26] border border-[#3A3F47] rounded p-2 text-white font-mono"
                  />
               </div>
               <button type="submit" className="w-full bg-[#007BFF] hover:bg-[#0056D2] text-white py-2 rounded font-bold">
                 Check Status
               </button>
             </form>

             {verifyResult && (
               <div className={`mt-4 p-4 rounded-lg border ${verifyResult.status === 'valid' ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                  {verifyResult.status === 'valid' ? (
                    <div className="flex items-start gap-3">
                       <CheckCircle className="text-green-500 shrink-0" size={24} />
                       <div>
                         <p className="text-green-500 font-bold">Valid Ticket</p>
                         <p className="text-sm text-gray-300 font-bold mt-1">{verifyResult.booking?.movieTitle}</p>
                         <p className="text-xs text-gray-400">User: {verifyResult.booking?.userName}</p>
                         <p className="text-xs text-gray-400">Date: {verifyResult.booking?.date}</p>
                         <p className="text-xs text-gray-400">Seats/Qty: {verifyResult.booking?.seats.join(', ')}</p>
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <XCircle className="text-red-500" size={24} />
                      <p className="text-red-500 font-bold">Invalid or Not Found</p>
                    </div>
                  )}
               </div>
             )}
          </div>

          {/* Recent Bookings List */}
          <div className="lg:col-span-2 bg-[#2A2E36] rounded-xl overflow-hidden shadow-lg border border-[#3A3F47]">
            <div className="p-6 border-b border-[#3A3F47]">
              <h3 className="font-bold text-lg">All Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1C1F26] text-gray-400 text-sm">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Event/Movie</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Details</th>
                    <th className="px-6 py-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3A3F47]">
                  {bookings.length === 0 ? (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-500">No bookings yet.</td></tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-[#32363e] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{booking.id.slice(0,8)}...</td>
                        <td className="px-6 py-4 font-medium">{booking.movieTitle}</td>
                        <td className="px-6 py-4 text-sm">{booking.userName}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {booking.date}<br/>{booking.seats.length > 3 ? `${booking.seats.length} tickets` : booking.seats.join(', ')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                            booking.type === 'live' ? 'bg-purple-500/20 text-purple-500' :
                            booking.type === 'rental' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {booking.type || 'Movie'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'movies' && (
        <div>
          <div className="flex justify-between mb-6">
             <h3 className="text-xl font-bold">Manage Movies</h3>
             <button 
              onClick={() => setShowAddMovie(true)}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
            >
              <Plus size={16} /> Add Movie
            </button>
          </div>

          {showAddMovie && (
            <div className="bg-[#2A2E36] p-6 rounded-xl mb-8 border border-[#3A3F47] animate-in slide-in-from-top-4">
              <h4 className="font-bold mb-4">Add New Movie</h4>
              <form onSubmit={handleAddMovie} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Movie Title" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newMovie.title || ''} onChange={e => setNewMovie({...newMovie, title: e.target.value})} />
                  <input required placeholder="Image URL" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newMovie.image || ''} onChange={e => setNewMovie({...newMovie, image: e.target.value})} />
                  <input placeholder="Genre" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newMovie.genre || ''} onChange={e => setNewMovie({...newMovie, genre: e.target.value})} />
                  <input placeholder="Rating (0-10)" type="number" step="0.1" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newMovie.rating || ''} onChange={e => setNewMovie({...newMovie, rating: parseFloat(e.target.value)})} />
                  <input placeholder="Duration (e.g. 2h 30m)" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newMovie.duration || ''} onChange={e => setNewMovie({...newMovie, duration: e.target.value})} />
                  <input placeholder="Release Date" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newMovie.releaseDate || ''} onChange={e => setNewMovie({...newMovie, releaseDate: e.target.value})} />
                </div>
                <textarea placeholder="Description" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full h-24" value={newMovie.description || ''} onChange={e => setNewMovie({...newMovie, description: e.target.value})} />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddMovie(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold">Save Movie</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movies.map(movie => (
              <div key={movie.id} className="relative group">
                 <div className="aspect-[2/3] rounded-lg overflow-hidden border border-[#3A3F47] shadow-lg">
                   <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => handleDeleteMovie(movie.id)}
                       className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 shadow-lg transform hover:scale-110 transition"
                       title="Delete Movie"
                     >
                       <Trash2 size={20} />
                     </button>
                   </div>
                 </div>
                 <p className="mt-2 text-sm font-bold truncate">{movie.title}</p>
                 <p className="text-xs text-gray-400">{movie.genre}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div>
          <div className="flex justify-between mb-6">
             <h3 className="text-xl font-bold">Manage Upcoming</h3>
             <button 
              onClick={() => setShowAddUpcoming(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
            >
              <Plus size={16} /> Add Upcoming
            </button>
          </div>

          {showAddUpcoming && (
            <div className="bg-[#2A2E36] p-6 rounded-xl mb-8 border border-[#3A3F47] animate-in slide-in-from-top-4">
              <h4 className="font-bold mb-4">Add Upcoming Movie</h4>
              <form onSubmit={handleAddUpcoming} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Movie Title" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newUpcoming.title || ''} onChange={e => setNewUpcoming({...newUpcoming, title: e.target.value})} />
                  <input required placeholder="Image URL" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newUpcoming.image || ''} onChange={e => setNewUpcoming({...newUpcoming, image: e.target.value})} />
                  <input placeholder="Genre" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newUpcoming.genre || ''} onChange={e => setNewUpcoming({...newUpcoming, genre: e.target.value})} />
                  <input placeholder="Release Date" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newUpcoming.releaseDate || ''} onChange={e => setNewUpcoming({...newUpcoming, releaseDate: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddUpcoming(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold">Save Upcoming</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {upcoming.map(movie => (
              <div key={movie.id} className="relative group">
                 <div className="aspect-[2/3] rounded-lg overflow-hidden border border-[#3A3F47] shadow-lg">
                   <img src={movie.image} alt={movie.title} className="w-full h-full object-cover opacity-80" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => handleDeleteUpcoming(movie.id)}
                       className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 shadow-lg transform hover:scale-110 transition"
                       title="Delete Upcoming"
                     >
                       <Trash2 size={20} />
                     </button>
                   </div>
                 </div>
                 <p className="mt-2 text-sm font-bold truncate">{movie.title}</p>
                 <p className="text-xs text-green-400">{movie.releaseDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'halls' && (
        <div>
          <div className="flex justify-between mb-6">
             <h3 className="text-xl font-bold">Manage Halls</h3>
             <button 
              onClick={() => setShowAddHall(true)}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
            >
              <Plus size={16} /> Add Hall
            </button>
          </div>

          {showAddHall && (
            <div className="bg-[#2A2E36] p-6 rounded-xl mb-8 border border-[#3A3F47] animate-in slide-in-from-top-4 max-w-2xl">
              <h4 className="font-bold mb-4">Add New Hall</h4>
              <form onSubmit={handleAddHall} className="space-y-4">
                <input required placeholder="Hall Name (e.g. INOX)" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newHallName} onChange={e => setNewHallName(e.target.value)} />
                <input required placeholder="Show Times (comma separated, e.g. 10:00 AM, 01:00 PM)" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newHallTimes} onChange={e => setNewHallTimes(e.target.value)} />
                
                {/* Image Upload Input */}
                <div className="border border-dashed border-gray-600 rounded p-4 text-center hover:bg-[#1C1F26] transition relative">
                   <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                   <div className="flex flex-col items-center gap-2 text-gray-400">
                      {newHallImage ? (
                        <>
                           <img src={newHallImage} alt="Preview" className="h-20 object-contain rounded" />
                           <span className="text-xs text-green-400">Image Selected</span>
                        </>
                      ) : (
                        <>
                           <Upload size={24} />
                           <span className="text-sm">Click to upload 3D Hall Image</span>
                        </>
                      )}
                   </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddHall(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold">Save Hall</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {halls.map(hall => (
              <div key={hall.id} className="bg-[#2A2E36] p-6 rounded-xl border border-[#3A3F47] shadow-lg flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2 text-white">{hall.name}</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {hall.times.map(t => (
                      <span key={t} className="bg-[#1C1F26] text-xs px-2 py-1 rounded border border-gray-600 text-gray-300">{t}</span>
                    ))}
                  </div>
                  {hall.image && (
                     <div className="mt-2 flex items-center gap-1 text-xs text-blue-400">
                        <ImageIcon size={12}/> Has 3D Image
                     </div>
                  )}
                </div>
                <button onClick={() => handleDeleteHall(hall.id)} className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rentals' && (
        <div>
          <div className="flex justify-between mb-6">
             <h3 className="text-xl font-bold">Manage Rentals</h3>
             <button 
              onClick={() => setShowAddRental(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
            >
              <Plus size={16} /> Add Rental
            </button>
          </div>

          {showAddRental && (
            <div className="bg-[#2A2E36] p-6 rounded-xl mb-8 border border-[#3A3F47] animate-in slide-in-from-top-4">
              <h4 className="font-bold mb-4">Add New Rental Movie</h4>
              <form onSubmit={handleAddRental} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Movie Title" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newRental.title || ''} onChange={e => setNewRental({...newRental, title: e.target.value})} />
                  <input required placeholder="Image URL" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newRental.image || ''} onChange={e => setNewRental({...newRental, image: e.target.value})} />
                  <input placeholder="Year" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newRental.year || ''} onChange={e => setNewRental({...newRental, year: e.target.value})} />
                  <input placeholder="Genre" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newRental.genre || ''} onChange={e => setNewRental({...newRental, genre: e.target.value})} />
                  <input placeholder="Price (1 Viewer)" type="number" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newRental.priceSingle || ''} onChange={e => setNewRental({...newRental, priceSingle: Number(e.target.value)})} />
                  <input placeholder="Price (2 Viewers)" type="number" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newRental.priceCouple || ''} onChange={e => setNewRental({...newRental, priceCouple: Number(e.target.value)})} />
                  <input placeholder="Validity (Hours)" type="number" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newRental.validityHours || ''} onChange={e => setNewRental({...newRental, validityHours: Number(e.target.value)})} />
                  <input placeholder="Cast (comma separated)" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={rentalCastInput} onChange={e => setRentalCastInput(e.target.value)} />
                </div>
                <textarea placeholder="Description" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full h-24" value={newRental.description || ''} onChange={e => setNewRental({...newRental, description: e.target.value})} />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddRental(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold">Save Rental</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {rentals.map(rental => (
              <div key={rental.id} className="relative group">
                 <div className="aspect-[2/3] rounded-lg overflow-hidden border border-[#3A3F47] shadow-lg">
                   <img src={rental.image} alt={rental.title} className="w-full h-full object-cover opacity-80" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => handleDeleteRental(rental.id)}
                       className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 shadow-lg transform hover:scale-110 transition"
                       title="Delete Rental"
                     >
                       <Trash2 size={20} />
                     </button>
                   </div>
                 </div>
                 <p className="mt-2 text-sm font-bold truncate">{rental.title}</p>
                 <p className="text-xs text-yellow-500 font-bold">₹{rental.priceSingle} / ₹{rental.priceCouple}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'liveshows' && (
        <div>
          <div className="flex justify-between mb-6">
             <h3 className="text-xl font-bold">Manage Live Shows</h3>
             <button 
              onClick={() => setShowAddLive(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
            >
              <Plus size={16} /> Add Show
            </button>
          </div>

          {showAddLive && (
             <div className="bg-[#2A2E36] p-6 rounded-xl mb-8 border border-[#3A3F47] animate-in slide-in-from-top-4">
              <h4 className="font-bold mb-4">Add New Live Show</h4>
              <form onSubmit={handleAddLive} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Show Title" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newLive.title || ''} onChange={e => setNewLive({...newLive, title: e.target.value})} />
                  <input required placeholder="Image URL" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newLive.image || ''} onChange={e => setNewLive({...newLive, image: e.target.value})} />
                  <input placeholder="Category (Comedy, Music...)" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newLive.category || ''} onChange={e => setNewLive({...newLive, category: e.target.value})} />
                  <input placeholder="Date (YYYY-MM-DD)" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newLive.date || ''} onChange={e => setNewLive({...newLive, date: e.target.value})} />
                  <input placeholder="Time (e.g. 07:00 PM)" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newLive.time || ''} onChange={e => setNewLive({...newLive, time: e.target.value})} />
                  <input placeholder="Location" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newLive.location || ''} onChange={e => setNewLive({...newLive, location: e.target.value})} />
                  <input placeholder="Price" type="number" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full" value={newLive.price || ''} onChange={e => setNewLive({...newLive, price: Number(e.target.value)})} />
                </div>
                <textarea placeholder="Description" className="bg-[#1C1F26] p-3 rounded border border-gray-600 w-full h-24" value={newLive.description || ''} onChange={e => setNewLive({...newLive, description: e.target.value})} />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddLive(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold">Save Show</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {liveShows.map(show => (
              <div key={show.id} className="bg-[#2A2E36] rounded-xl overflow-hidden border border-[#3A3F47] group hover:border-purple-500 transition-all relative">
                <div className="aspect-video relative">
                  <img src={show.image} className="w-full h-full object-cover"/>
                  <button 
                       onClick={() => handleDeleteLive(show.id)}
                       className="absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 shadow-lg"
                       title="Cancel Show"
                     >
                       <Trash2 size={16} />
                     </button>
                </div>
                <div className="p-4">
                  <h4 className="font-bold truncate">{show.title}</h4>
                  <p className="text-xs text-purple-400 font-bold mb-2">{show.category}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> {show.date}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={12}/> {show.location}</p>
                  <p className="text-lg font-bold text-white mt-2">₹{show.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;