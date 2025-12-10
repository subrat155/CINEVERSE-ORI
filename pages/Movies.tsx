import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { Star, Filter } from 'lucide-react';
import FadeIn from '../components/FadeIn';

interface MoviesProps {
  movies: Movie[];
  searchQuery: string;
}

const CATEGORIES = [
  { id: 'All', label: 'All Movies' },
  { id: 'Horror', label: 'Horror' },
  { id: 'Entertainment', label: 'Entertainment' },
  { id: 'Romance', label: 'Romance' },
  { id: 'True Life-Story', label: 'True Life-Story' }
];

const Movies: React.FC<MoviesProps> = ({ movies, searchQuery }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredMovies = movies.filter(movie => {
    // 1. Check Search Query
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          movie.genre.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Check Category Filter
    let matchesCategory = true;
    const genre = movie.genre.toLowerCase();

    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Horror') {
        matchesCategory = genre.includes('horror') || genre.includes('thriller');
      } else if (selectedCategory === 'Romance') {
        matchesCategory = genre.includes('romance') || genre.includes('romcom') || genre.includes('love');
      } else if (selectedCategory === 'True Life-Story') {
        matchesCategory = genre.includes('historical') || genre.includes('biography') || genre.includes('mythology');
      } else if (selectedCategory === 'Entertainment') {
        // Catch-all for typical commercial cinema (Comedy, Action, Family, Musical)
        // that isn't strictly historical or horror-only (though Horror can be entertainment, we separate for the specific filter request)
        matchesCategory = genre.includes('comedy') || genre.includes('action') || genre.includes('family') || genre.includes('musical') || genre.includes('drama');
      }
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h2 className="text-3xl font-bold">Browse Movies</h2>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
           {CATEGORIES.map(category => (
             <button
               key={category.id}
               onClick={() => setSelectedCategory(category.id)}
               className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                 selectedCategory === category.id 
                   ? 'bg-[#007BFF] text-white shadow-lg shadow-blue-500/30' 
                   : 'bg-[#2A2E36] text-gray-400 hover:text-white hover:bg-[#3A3F47] border border-[#3A3F47]'
               }`}
             >
               {category.label}
             </button>
           ))}
        </div>
      </div>
      
      {filteredMovies.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-[#2A2E36] rounded-xl border border-dashed border-[#3A3F47]">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
             <Filter size={32} />
          </div>
          <p className="text-xl font-semibold">No movies found</p>
          <p className="text-sm mt-2">Try adjusting your filters or search query.</p>
          <button 
             onClick={() => setSelectedCategory('All')} 
             className="mt-4 text-[#007BFF] hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredMovies.map((movie, index) => (
            <FadeIn key={movie.id} delay={index * 50}>
               <div 
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-[#2A2E36] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group border border-[#3A3F47] hover:border-[#007BFF]"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                     <button className="bg-[#007BFF] text-white px-6 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                       View Details
                     </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md">
                    <Star size={10} fill="black" /> {movie.rating}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg truncate flex-1 pr-2 text-white group-hover:text-[#007BFF] transition-colors">{movie.title}</h3>
                  </div>
                  <p className="text-[#B0B3B8] text-sm mb-1">{movie.genre}</p>
                  <p className="text-gray-500 text-xs">{movie.duration} • {movie.releaseDate}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;