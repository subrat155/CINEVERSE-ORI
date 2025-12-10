
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Trailers from './pages/Trailers';
import RentMovie from './pages/RentMovie';
import WatchPage from './pages/WatchPage';
import LiveShowDetails from './pages/LiveShowDetails'; 
import { api } from './services/api';
import { Movie, Hall, User, RentableMovie, LiveShow, UpcomingMovie } from './types';

// Theme Context
type Theme = 'dark' | 'light';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
export const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);
  return null;
};

// Protected Route for Admin
interface AdminRouteProps {
  user: User | null;
  children?: React.ReactNode;
}

const AdminRoute = ({ user, children }: AdminRouteProps) => {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cineverse_current_user_obj');
    return saved ? JSON.parse(saved) : null;
  });

  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('cineverse_theme') as Theme) || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('cineverse_theme', newTheme);
  };

  // Apply theme to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Global State for Movies & Halls (fetched from "backend")
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [rentals, setRentals] = useState<RentableMovie[]>([]);
  const [liveShows, setLiveShows] = useState<LiveShow[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingMovie[]>([]); // New State
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [fetchedMovies, fetchedHalls, fetchedRentals, fetchedLiveShows, fetchedUpcoming] = await Promise.all([
        api.getMovies(),
        api.getHalls(),
        api.getRentals(),
        api.getLiveShows(),
        api.getUpcoming()
      ]);
      setMovies(fetchedMovies);
      setHalls(fetchedHalls);
      setRentals(fetchedRentals);
      setLiveShows(fetchedLiveShows);
      setUpcoming(fetchedUpcoming);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Persist user whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('cineverse_current_user_obj', JSON.stringify(user));
    } else {
      localStorage.removeItem('cineverse_current_user_obj');
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cineverse_current_user_obj');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <div className="flex flex-col min-h-screen bg-theme-main text-theme-main transition-colors duration-300">
          <ScrollToTop />
          <Navbar 
            user={user} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onLogout={handleLogout}
          />
          <main className="flex-grow">
            {isLoading && movies.length === 0 ? (
              <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#007BFF]"></div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home movies={movies} rentals={rentals} liveShows={liveShows} upcoming={upcoming} />} />
                <Route path="/movies" element={<Movies movies={movies} searchQuery={searchQuery} />} />
                <Route path="/movie/:id" element={<MovieDetails movies={movies} halls={halls} />} />
                <Route path="/seat-selection/:movieId/:hallId/:time" element={<SeatSelection movies={movies} halls={halls} />} />
                <Route path="/payment" element={<Payment user={user} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/bookings" element={<MyBookings user={user} />} />
                <Route path="/trailers" element={<Trailers />} />
                
                {/* Rental & Live Routes */}
                <Route path="/rent/:id" element={<RentMovie rentals={rentals} />} />
                <Route path="/watch" element={<WatchPage />} />
                <Route path="/live-show/:id" element={<LiveShowDetails shows={liveShows} />} />
                
                <Route path="/admin" element={
                  <AdminRoute user={user}>
                    <AdminDashboard onDataChange={refreshData} />
                  </AdminRoute>
                } />
              </Routes>
            )}
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
