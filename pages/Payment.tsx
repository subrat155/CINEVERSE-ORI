
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Booking, User } from '../types';
import { CheckCircle, Lock, CreditCard, Loader2, ShieldAlert, Play, Copy, Tag, Percent, X, Download, Ticket } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { api } from '../services/api';

interface PaymentProps {
  user: User | null;
}

interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

const Payment: React.FC<PaymentProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // bookingData can be standard booking, rental, or live show
  const bookingData = location.state;

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Rental specific success state
  const [watchLink, setWatchLink] = useState('');
  
  // Live Show/Movie specific success state
  const [ticketId, setTicketId] = useState('');
  
  // Form State
  const [email, setEmail] = useState(user?.email || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');

  // Coupon State
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

  // Generate Random Coupons on Mount
  useEffect(() => {
    const prefixes = ['CINE', 'MOVIE', 'WATCH', 'BLOCKBUSTER', 'PROMO', 'LIVE'];
    const generateRandomCoupon = (): Coupon => {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const discount = Math.floor(Math.random() * 16) + 5; // 5% to 20%
      return {
        code: `${prefix}${discount}`,
        discountPercent: discount,
        description: `Get flat ${discount}% off on this booking`
      };
    };

    setAvailableCoupons([
      generateRandomCoupon(),
      generateRandomCoupon(),
      generateRandomCoupon()
    ]);
  }, []);

  if (!bookingData) return null;

  // Calculate Finals
  const originalTotal = bookingData.total;
  const discountAmount = appliedCoupon ? (originalTotal * appliedCoupon.discountPercent) / 100 : 0;
  const finalTotal = Math.floor(originalTotal - discountAmount);
  
  // ADMIN RESTRICTION CHECK
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#1C1F26]">
        <div className="max-w-md w-full bg-[#2A2E36] p-8 rounded-2xl border border-[#3A3F47] text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Admin Access Restricted</h2>
          <p className="text-gray-400 mb-8">
            Administrators are not authorized to make bookings or payments. Please log in as a regular user to book tickets.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/admin')}
              className="w-full bg-[#007BFF] hover:bg-[#0056D2] text-white py-3 rounded-lg font-bold transition"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-[#1A1D23] hover:bg-[#22252B] text-gray-300 py-3 rounded-lg font-medium transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 4) return;
    if (raw.length >= 2) {
      const mm = parseInt(raw.substring(0, 2));
      if (mm === 0 || mm > 12) return;
    }
    if (raw.length >= 4) {
       const yy = parseInt(raw.substring(2, 4));
       if (yy > 31) return; 
    }
    let formatted = raw;
    if (raw.length >= 3) {
      formatted = raw.slice(0, 2) + ' / ' + raw.slice(2, 4);
    }
    setExpiry(formatted);
  };

  const toggleCoupon = (coupon: Coupon) => {
    if (appliedCoupon?.code === coupon.code) {
      setAppliedCoupon(null); // Remove if clicked again
    } else {
      setAppliedCoupon(coupon);
    }
  };

  const saveBooking = async () => {
    // If it's a rental
    if (bookingData.isRental) {
       const limit = bookingData.rentalDetails.viewers;
       const token = Math.random().toString(36).substr(2, 12);
       const link = `/watch?title=${encodeURIComponent(bookingData.movie.title)}&limit=${limit}&token=${token}`;
       setWatchLink(link);
       setSuccess(true);
       setIsLoading(false);
       return;
    }

    const paymentId = `py_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newBooking: Booking = {
      id: paymentId,
      userId: user?.id || 'guest',
      userName: user?.name || cardName || 'Guest',
      movieId: bookingData.movie.id,
      movieTitle: bookingData.movie.title,
      movieImage: bookingData.movie.image,
      hall: bookingData.hall.name,
      date: bookingData.date,
      time: bookingData.time,
      seats: bookingData.seats,
      totalAmount: finalTotal,
      status: 'Confirmed',
      bookedAt: new Date().toISOString(),
      type: bookingData.isLiveShow ? 'live' : 'movie'
    };
    
    try {
      await api.addBooking(newBooking);
      setTicketId(paymentId);
      setSuccess(true);
    } catch (e) {
      console.error("Booking save error", e);
      alert("Payment successful but booking save failed. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !bookingData.isRental) {
      alert("Please login to complete payment");
      navigate('/login');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      saveBooking();
    }, 2500);
  };

  const downloadTicket = () => {
    const ticketContent = `
      CINEVERSE TICKET
      --------------------------
      Event: ${bookingData.movie.title}
      Date: ${bookingData.date}
      Time: ${bookingData.time}
      Location: ${bookingData.hall.name}
      --------------------------
      Booking ID: ${ticketId}
      Seats/Persons: ${bookingData.isLiveShow ? bookingData.ticketCount : bookingData.seats.join(', ')}
      Amount Paid: ₹${finalTotal}
      --------------------------
      Show this code at entry for verification.
    `;
    
    const element = document.createElement("a");
    const file = new Blob([ticketContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Ticket_${ticketId}.txt`; // Simulating PDF download with text file for demo
    document.body.appendChild(element);
    element.click();
    
    // Also trigger browser print as it's a better "PDF" simulation
    window.print();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1C1F26]">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Order Summary */}
        <div className="bg-[#2A2E36] p-8 rounded-2xl border border-[#3A3F47] shadow-xl h-full flex flex-col justify-between order-2 md:order-1">
          <div>
            <div className="flex items-center gap-2 mb-8 text-gray-400">
               <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">C</div>
               <span className="font-semibold text-white">CineVerse Inc.</span>
            </div>

            <div className="text-gray-400 text-sm mb-2">Pay CINEVERSE</div>
            <div className="flex items-end gap-3 mb-8">
              <div className="text-4xl font-bold text-white">₹{finalTotal.toLocaleString()}</div>
              {appliedCoupon && (
                <div className="text-lg text-gray-400 line-through mb-1">₹{originalTotal.toLocaleString()}</div>
              )}
            </div>

            <div className="space-y-6">
               <div className="flex gap-4">
                  <img src={bookingData.movie.image} alt="poster" className="w-20 h-28 object-cover rounded-lg shadow-md" />
                  <div>
                     <h3 className="font-bold text-lg text-white">{bookingData.movie.title}</h3>
                     <p className="text-gray-400 text-sm">{bookingData.hall.name}</p>
                     <p className="text-gray-400 text-sm">{bookingData.date} • {bookingData.time}</p>
                     {bookingData.isLiveShow && <span className="text-xs bg-purple-600 px-2 py-0.5 rounded text-white mt-1 inline-block">LIVE SHOW</span>}
                  </div>
               </div>
               
               {/* COUPONS SECTION */}
               <div className="border-t border-[#3A3F47] pt-4">
                 <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                   <Tag size={16} className="text-[#007BFF]"/> Coupons for you
                 </h4>
                 
                 <div className="space-y-3 mb-2">
                   {availableCoupons.map((coupon) => {
                     const isApplied = appliedCoupon?.code === coupon.code;
                     return (
                       <div 
                         key={coupon.code}
                         onClick={() => toggleCoupon(coupon)}
                         className={`relative border border-dashed rounded-lg p-3 cursor-pointer transition-all ${isApplied ? 'bg-[#007BFF]/10 border-[#007BFF]' : 'border-gray-600 hover:border-gray-400 hover:bg-[#1A1D23]'}`}
                       >
                         <div className="flex justify-between items-center">
                           <div>
                             <p className={`font-bold text-sm ${isApplied ? 'text-[#007BFF]' : 'text-white'}`}>{coupon.code}</p>
                             <p className="text-xs text-gray-400">{coupon.description}</p>
                           </div>
                           {isApplied ? (
                             <CheckCircle size={18} className="text-[#007BFF]" />
                           ) : (
                             <div className="text-xs font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">APPLY</div>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>

               {/* Price Breakdown */}
               <div className="border-t border-[#3A3F47] pt-4">
                  <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-400">
                       {bookingData.isRental ? 'Subtotal' : bookingData.isLiveShow ? `Tickets (${bookingData.ticketCount})` : `Seats (${bookingData.seats.length})`}
                     </span>
                     <span className="text-white">₹{originalTotal}</span>
                  </div>
                  {appliedCoupon && (
                     <div className="flex justify-between text-sm mb-2 text-green-400">
                       <span>Coupon Discount ({appliedCoupon.code})</span>
                       <span>- ₹{Math.floor(discountAmount)}</span>
                    </div>
                  )}
               </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#3A3F47] flex justify-between items-center text-xs text-gray-500">
            <span>Powered by <strong className="text-white font-bold text-sm tracking-wide ml-0.5">stripe</strong></span>
            <div className="flex gap-2">
              <span className="hover:underline cursor-pointer">Terms</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>

        {/* Payment Form / Success Screen */}
        <div className="relative order-1 md:order-2">
          {!success ? (
            <FadeIn>
              <div className="bg-[#2A2E36] p-8 rounded-2xl border border-[#3A3F47] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#635BFF] to-[#00D4FF]"></div>
                
                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                  <CreditCard size={20} className="text-[#635BFF]"/> Pay with card
                </h2>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* ... (Existing Form Fields remain same) ... */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full bg-[#1A1D23] border border-[#3A3F47] rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all"
                      placeholder="user@example.com"
                    />
                  </div>

                   {/* Card Information Group */}
                   <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Card Information</label>
                    <div className="bg-[#1A1D23] border border-[#3A3F47] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#635BFF] transition-all">
                       <div className="flex items-center border-b border-[#3A3F47] px-3">
                          <CreditCard size={18} className="text-gray-500 mr-2" />
                          <input 
                            type="text" 
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 1234 5678"
                            className="w-full bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
                          />
                       </div>
                       <div className="flex divide-x divide-[#3A3F47]">
                          <div className="w-1/2 px-3">
                             <input 
                               type="text" 
                               required
                               value={expiry}
                               onChange={handleExpiryChange}
                               placeholder="MM / YY"
                               className="w-full bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
                             />
                          </div>
                          <div className="w-1/2 px-3 flex items-center">
                             <input 
                               type="password" 
                               required
                               maxLength={4}
                               value={cvc}
                               onChange={(e) => setCvc(e.target.value)}
                               placeholder="CVC"
                               className="w-full bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
                             />
                             <Lock size={14} className="text-gray-500"/>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Name on card</label>
                    <input 
                      type="text" 
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="block w-full bg-[#1A1D23] border border-[#3A3F47] rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#635BFF] hover:bg-[#5851E2] text-white py-3.5 rounded-lg font-bold shadow-lg shadow-[#635BFF]/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{finalTotal.toLocaleString()}.00
                      </>
                    )}
                  </button>
                </form>
              </div>
            </FadeIn>
          ) : (
            <div className="bg-[#2A2E36] p-8 rounded-2xl border border-[#3A3F47] shadow-2xl flex flex-col items-center justify-center text-center h-full animate-in zoom-in duration-300">
               <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                 <CheckCircle size={40} className="text-white"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-2">Payment Successful</h2>
               
               {bookingData.isRental ? (
                 <>
                   <p className="text-gray-400 mb-6">You have successfully rented <strong>{bookingData.movie.title}</strong>.</p>
                   <div className="bg-[#1C1F26] p-4 rounded-lg w-full mb-6 text-left">
                     <p className="text-xs text-gray-500 mb-1">Your Watch Link</p>
                     <div className="flex gap-2 items-center bg-[#1A1D23] p-2 rounded border border-[#3A3F47]">
                       <code className="text-[#007BFF] text-xs truncate flex-1">{window.location.origin}/#{watchLink}</code>
                       <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/#${watchLink}`)} className="text-gray-400 hover:text-white">
                         <Copy size={16}/>
                       </button>
                     </div>
                   </div>
                   <button onClick={() => navigate(watchLink)} className="w-full bg-[#007BFF] hover:bg-[#0056D2] text-white py-3 rounded-lg font-bold shadow-lg transition flex items-center justify-center gap-2">
                     <Play size={18} fill="white"/> Watch Now
                   </button>
                 </>
               ) : (
                 <div className="w-full">
                    <p className="text-gray-400 mb-6">You're going to <strong>{bookingData.movie.title}</strong>!</p>
                    
                    {/* Visual Ticket */}
                    <div className="bg-[#1C1F26] border-2 border-dashed border-[#3A3F47] rounded-xl p-4 mb-6 relative overflow-hidden text-left">
                       <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#2A2E36] rounded-full"></div>
                       <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#2A2E36] rounded-full"></div>
                       
                       <div className="flex justify-between items-start mb-4">
                         <div>
                           <h3 className="font-bold text-white text-lg">{bookingData.movie.title}</h3>
                           <p className="text-purple-400 text-xs uppercase font-bold">{bookingData.isLiveShow ? 'Live Show Ticket' : 'Movie Ticket'}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-xs text-gray-400">Booking ID</p>
                           <p className="font-mono font-bold text-white">{ticketId}</p>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-500 text-xs">Date</p>
                            <p className="text-white">{bookingData.date}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Time</p>
                            <p className="text-white">{bookingData.time}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Location</p>
                            <p className="text-white truncate">{bookingData.hall.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Admit/Seats</p>
                            <p className="text-white">{bookingData.isLiveShow ? `${bookingData.ticketCount} Person(s)` : bookingData.seats.join(', ')}</p>
                          </div>
                       </div>
                       
                       <div className="bg-white p-2 flex justify-center rounded">
                          <p className="text-black text-[10px] font-mono tracking-widest">{ticketId}</p>
                       </div>
                    </div>

                    <button 
                      onClick={downloadTicket}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold shadow-lg transition flex items-center justify-center gap-2 mb-3"
                    >
                      <Download size={18}/> Download PDF Ticket
                    </button>
                    <button onClick={() => navigate('/')} className="w-full text-gray-400 hover:text-white text-sm py-2">
                       Return to Home
                    </button>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
