import { Movie, Hall, Booking, User, RentableMovie, LiveShow, UpcomingMovie } from '../types';
import { MOVIES as INITIAL_MOVIES, HALLS as INITIAL_HALLS, RENTAL_MOVIES as INITIAL_RENTALS, LIVE_SHOWS as INITIAL_LIVE_SHOWS, UPCOMING_MOVIES as INITIAL_UPCOMING } from '../constants';

// Keys for LocalStorage
const STORAGE_KEYS = {
  MOVIES: 'cineverse_db_movies',
  HALLS: 'cineverse_db_halls',
  BOOKINGS: 'cineverse_db_bookings',
  USERS: 'cineverse_db_users',
  RENTALS: 'cineverse_db_rentals',
  LIVE_SHOWS: 'cineverse_db_liveshows',
  UPCOMING: 'cineverse_db_upcoming',
  VERSION: 'cineverse_db_version_v2.9', // Bumped version for Hall images
};

// Initialize DB
const initializeDB = () => {
  const currentVersion = localStorage.getItem('cineverse_db_version_current');
  const targetVersion = '2.9'; 

  // Check version mismatch OR missing critical data
  if (currentVersion !== targetVersion || !localStorage.getItem(STORAGE_KEYS.MOVIES)) {
    console.log("Refreshing Catalog Data...");
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
    localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(INITIAL_HALLS));
    localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(INITIAL_RENTALS));
    localStorage.setItem(STORAGE_KEYS.LIVE_SHOWS, JSON.stringify(INITIAL_LIVE_SHOWS));
    localStorage.setItem(STORAGE_KEYS.UPCOMING, JSON.stringify(INITIAL_UPCOMING));
    localStorage.setItem('cineverse_db_version_current', targetVersion);
  }

  // Always preserve User & Booking data
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
};

initializeDB();

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- MOVIES ---
  getMovies: async (): Promise<Movie[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MOVIES) || '[]');
  },

  addMovie: async (movie: Movie): Promise<void> => {
    await delay(500);
    const movies = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOVIES) || '[]');
    movies.unshift(movie);
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  },

  deleteMovie: async (id: string): Promise<void> => {
    await delay(400);
    let movies = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOVIES) || '[]');
    movies = movies.filter((m: Movie) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  },

  // --- UPCOMING MOVIES ---
  getUpcoming: async (): Promise<UpcomingMovie[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.UPCOMING) || '[]');
  },

  addUpcoming: async (movie: UpcomingMovie): Promise<void> => {
    await delay(400);
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPCOMING) || '[]');
    list.push(movie);
    localStorage.setItem(STORAGE_KEYS.UPCOMING, JSON.stringify(list));
  },

  deleteUpcoming: async (id: string): Promise<void> => {
    await delay(300);
    let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPCOMING) || '[]');
    list = list.filter((m: UpcomingMovie) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.UPCOMING, JSON.stringify(list));
  },

  // --- LIVE SHOWS ---
  getLiveShows: async (): Promise<LiveShow[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_SHOWS) || '[]');
  },

  addLiveShow: async (show: LiveShow): Promise<void> => {
    await delay(400);
    const shows = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_SHOWS) || '[]');
    shows.push(show);
    localStorage.setItem(STORAGE_KEYS.LIVE_SHOWS, JSON.stringify(shows));
  },

  deleteLiveShow: async (id: string): Promise<void> => {
    await delay(300);
    let shows = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_SHOWS) || '[]');
    shows = shows.filter((s: LiveShow) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.LIVE_SHOWS, JSON.stringify(shows));
  },

  // --- RENTALS ---
  getRentals: async (): Promise<RentableMovie[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RENTALS) || '[]');
  },

  addRental: async (rental: RentableMovie): Promise<void> => {
    await delay(400);
    const rentals = JSON.parse(localStorage.getItem(STORAGE_KEYS.RENTALS) || '[]');
    rentals.push(rental);
    localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
  },

  deleteRental: async (id: string): Promise<void> => {
    await delay(300);
    let rentals = JSON.parse(localStorage.getItem(STORAGE_KEYS.RENTALS) || '[]');
    rentals = rentals.filter((r: RentableMovie) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
  },

  // --- HALLS ---
  getHalls: async (): Promise<Hall[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HALLS) || '[]');
  },

  addHall: async (hall: Hall): Promise<void> => {
    await delay(400);
    const halls = JSON.parse(localStorage.getItem(STORAGE_KEYS.HALLS) || '[]');
    halls.push(hall);
    localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(halls));
  },

  deleteHall: async (id: string): Promise<void> => {
    await delay(300);
    let halls = JSON.parse(localStorage.getItem(STORAGE_KEYS.HALLS) || '[]');
    halls = halls.filter((h: Hall) => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(halls));
  },
  

  // --- BOOKINGS ---
  getBookings: async (): Promise<Booking[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await delay(300);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    return all.filter((b: Booking) => b.userId === userId);
  },

  addBooking: async (booking: Booking): Promise<void> => {
    await delay(600);
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  // --- REVENUE ---
  getTotalRevenue: async (): Promise<number> => {
    const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    return bookings.reduce((sum: number, b: Booking) => sum + b.totalAmount, 0);
  },

  // --- USER AUTHENTICATION ---
  login: async (email: string, password: string): Promise<User> => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPass } = user;
    return userWithoutPass as User;
  },

  register: async (userData: any): Promise<User> => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    const existing = users.find((u: any) => u.email === userData.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      ...userData,
      id: `usr_${Date.now()}`,
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const { password: _, ...userWithoutPass } = newUser;
    return userWithoutPass as User;
  }
};