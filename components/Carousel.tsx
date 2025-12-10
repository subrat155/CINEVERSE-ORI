import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOVIES } from '../constants';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  // Use first 5 movies for carousel
  const carouselMovies = MOVIES.slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselMovies.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselMovies.length]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center bg-[#1C1F26] py-8">
      <div className="w-full max-w-6xl relative h-full flex items-center justify-center">
        {carouselMovies.map((movie, index) => {
          // Calculate relative position
          let position = "hidden"; // Default hidden
          let zIndex = 0;
          let opacity = 0;
          let scale = "scale-75";
          let translateX = "translate-x-0";

          const len = carouselMovies.length;
          // Simple circular logic for prev, current, next
          const prevIndex = (currentIndex - 1 + len) % len;
          const nextIndex = (currentIndex + 1) % len;

          if (index === currentIndex) {
            position = "absolute";
            zIndex = 20;
            opacity = 1;
            scale = "scale-100";
            translateX = "translate-x-0";
          } else if (index === prevIndex) {
            position = "absolute";
            zIndex = 10;
            opacity = 0.6;
            scale = "scale-75";
            translateX = "-translate-x-[60%] md:-translate-x-[50%]";
          } else if (index === nextIndex) {
             position = "absolute";
             zIndex = 10;
             opacity = 0.6;
             scale = "scale-75";
             translateX = "translate-x-[60%] md:translate-x-[50%]";
          }

          if (position === "hidden") return null;

          return (
            <div
              key={movie.id}
              className={`transition-all duration-700 ease-in-out ${position} ${translateX} ${scale} z-${zIndex} w-[70%] md:w-[60%] h-full rounded-2xl shadow-2xl overflow-hidden`}
              style={{ opacity }}
            >
              <div className="relative w-full h-full">
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{movie.title}</h2>
                  <p className="text-gray-300 line-clamp-2 mb-4 hidden md:block">{movie.description}</p>
                  <button 
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="bg-[#007BFF] hover:bg-[#0056D2] text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold self-start transition-transform transform hover:scale-105 shadow-lg shadow-blue-500/30"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;