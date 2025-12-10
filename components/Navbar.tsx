import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Ticket, Film, Home as HomeIcon, LayoutDashboard, LogOut, MapPin, ChevronDown, Navigation, Check, Sun, Moon } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../App';

interface NavbarProps {
  user: User | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onLogout: () => void;
}

const POPULAR_CITIES = [
  "Mumbai", "Delhi-NCR", "Bengaluru", "Hyderabad", 
  "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Chandigarh", "Bhubaneswar"
];

const Navbar: React.FC<NavbarProps> = ({ user, searchQuery, setSearchQuery, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [location, setLocation] = useState('Mumbai');
  const [isDetecting, setIsDetecting] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== '') {
      navigate('/movies');
    }
  };

  const handleLiveLocation = () => {
    setIsDetecting(true);

    if (!('geolocation' in navigator)) {
      alert("Geolocation is not supported by your browser.");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
               headers: {
                 'User-Agent': 'CineVerse-App/1.0'
               }
            }
          );
          
          if (!response.ok) throw new Error("Failed to fetch location data");
          
          const data = await response.json();
          
          const addr = data.address;
          const detectedCity = addr.city || 
                               addr.town || 
                               addr.village || 
                               addr.state_district || 
                               addr.county ||
                               "Unknown Location";

          setLocation(detectedCity);
        } catch (error) {
          console.error("Error fetching city name:", error);
          setLocation("Lat: " + position.coords.latitude.toFixed(2));
        } finally {
          setIsDetecting(false);
          setShowLocationMenu(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleCitySelect = (city: string) => {
    setLocation(city);
    setShowLocationMenu(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-theme-card/80 border-b border-theme shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={isAdmin ? "/admin" : "/"} className="flex-shrink-0 flex items-center gap-2">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                 CV
               </div>
               <span className="font-bold text-2xl tracking-tight text-theme-main">Cine<span className="text-[#007BFF]">Verse</span></span>
            </Link>

            {/* Location Selector (Desktop) */}
            {!isAdmin && (
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setShowLocationMenu(!showLocationMenu)}
                  className="flex items-center gap-1 text-theme-secondary hover:text-theme-main transition-colors text-sm font-medium focus:outline-none"
                >
                  <MapPin size={16} className="text-[#007BFF]" />
                  <span className="truncate max-w-[100px]">{location}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showLocationMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Location Dropdown */}
                {showLocationMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLocationMenu(false)}></div>
                    <div className="absolute top-full left-0 mt-3 w-64 bg-theme-card border border-theme rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2 border-b border-theme">
                        <button 
                          onClick={handleLiveLocation}
                          disabled={isDetecting}
                          className="w-full flex items-center gap-3 text-[#007BFF] hover:bg-theme-main p-2 rounded-lg transition-colors text-sm font-semibold"
                        >
                          {isDetecting ? (
                            <div className="w-4 h-4 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Navigation size={16} />
                          )}
                          {isDetecting ? "Detecting..." : "Detect my location"}
                        </button>
                      </div>

                      <div className="p-2">
                        <p className="text-xs text-theme-secondary px-2 py-1 uppercase tracking-wider font-bold">Popular Cities</p>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          {POPULAR_CITIES.map(city => (
                            <button
                              key={city}
                              onClick={() => handleCitySelect(city)}
                              className="w-full text-left px-2 py-2 text-sm text-theme-secondary hover:bg-theme-main hover:text-theme-main rounded-lg flex items-center justify-between group transition-colors"
                            >
                              {city}
                              {location === city && <Check size={14} className="text-[#007BFF]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop Search - Hidden for Admin */}
          {!isAdmin && (
            <div className="hidden md:block flex-1 max-w-md">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#007BFF] transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-full leading-5 bg-theme-main text-theme-main placeholder-gray-500 focus:outline-none focus:bg-theme-card focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] sm:text-sm transition-all duration-300"
                  placeholder="Search for Movies, Events..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-theme-secondary hover:text-theme-main hover:bg-theme-main transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {!isAdmin && (
                <>
                  <Link to="/" className="flex items-center gap-1 text-theme-secondary hover:text-theme-main px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <HomeIcon size={18} /> Home
                  </Link>
                  <Link to="/movies" className="flex items-center gap-1 text-theme-secondary hover:text-theme-main px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <Film size={18} /> Movies
                  </Link>
                  <Link to="/bookings" className="flex items-center gap-1 text-theme-secondary hover:text-theme-main px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <Ticket size={18} /> Bookings
                  </Link>
                </>
              )}
              
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 text-[#007BFF] font-bold px-3 py-2 rounded-md text-sm transition-colors border border-[#007BFF]/30 bg-[#007BFF]/10">
                   <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-4">
                  {!isAdmin && (
                    <div className="text-right">
                      <span className="block text-[#007BFF] font-semibold text-sm">Hi, {user.name}</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={onLogout}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-[#007BFF] hover:bg-[#0056D2] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-[#007BFF]/30 transition-all transform hover:-translate-y-0.5">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden gap-2">
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-theme-secondary hover:text-theme-main hover:bg-theme-main transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-theme-card border-b border-theme">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAdmin && (
              <>
                <div className="px-3 pb-2 border-b border-gray-700 mb-2">
                   <div className="flex items-center justify-between text-theme-secondary mb-2">
                      <span className="text-sm font-bold flex items-center gap-2"><MapPin size={16} className="text-[#007BFF]"/> Location</span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-white">{location}</span>
                   </div>
                   <button 
                     onClick={handleLiveLocation}
                     className="w-full flex items-center justify-center gap-2 text-[#007BFF] bg-theme-main py-2 rounded-md text-sm font-medium mb-2"
                   >
                     {isDetecting ? (
                       <div className="w-4 h-4 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                       <Navigation size={14} /> 
                     )}
                     {isDetecting ? "Detecting..." : "Use Live Location"}
                   </button>
                   <select 
                     value={location}
                     onChange={(e) => setLocation(e.target.value)}
                     className="w-full bg-theme-main text-theme-main text-sm p-2 rounded-md border border-gray-600 focus:outline-none focus:border-[#007BFF]"
                   >
                     {POPULAR_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                   </select>
                </div>

                <div className="px-3 pb-2">
                  <input
                    type="text"
                    className="block w-full pl-3 pr-3 py-2 rounded-md leading-5 bg-theme-main text-theme-main placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#007BFF]"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              
                <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-main hover:bg-gray-700">Home</Link>
                <Link to="/movies" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-main hover:bg-gray-700">Movies</Link>
                <Link to="/bookings" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-main hover:bg-gray-700">Bookings</Link>
              </>
            )}

            {user ? (
               <div className="px-3 py-2 space-y-2 border-t border-gray-700 mt-2">
                 {!isAdmin && <div className="text-[#007BFF]">Logged in as {user.name}</div>}
                 
                 {isAdmin && (
                   <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-white font-semibold bg-[#007BFF] px-3 py-2 rounded text-center">
                     Admin Dashboard
                   </Link>
                 )}
                 <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left text-red-400 hover:bg-gray-700 py-2">Logout</button>
               </div>
            ) : (
               <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[#007BFF] hover:bg-gray-700">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;