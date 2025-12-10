export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  image: string; // Used as the poster
  rating: number;
  genre: string;
  duration: string;
  releaseDate: string;
  cast: CastMember[];
  reviews: Review[];
}

export interface RentableMovie {
  id: string;
  title: string;
  year: string;
  genre: string;
  cast: string[];
  description: string;
  image: string;
  priceSingle: number; // Price for 1 viewer
  priceCouple: number; // Price for 2 viewers
  validityHours: number;
}

export interface LiveShow {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface UpcomingMovie {
  id: string;
  title: string;
  releaseDate: string;
  image: string;
  genre: string;
}

export interface CastMember {
  name: string;
  role: string;
  image: string;
}

export interface Review {
  user: string;
  comment: string;
  rating: number;
}

export interface Booking {
  id: string;
  userId: string; // Connect booking to user
  userName: string;
  movieId: string; // Acts as Show ID for live events
  movieTitle: string;
  movieImage: string;
  hall: string;
  date: string;
  time: string;
  seats: string[];
  totalAmount: number;
  status: 'Confirmed' | 'Pending';
  bookedAt: string;
  type?: 'movie' | 'rental' | 'live';
}

export interface Hall {
  id: string;
  name: string;
  times: string[];
  image?: string; // New field for 3D Hall Image
}