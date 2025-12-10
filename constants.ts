import { Movie, Hall, RentableMovie, LiveShow, UpcomingMovie } from './types';

export const COLORS = {
  bgMain: '#1C1F26',
  bgCard: '#2A2E36',
  bgFooter: '#22252B',
  primary: '#007BFF',
  primaryHover: '#0056D2',
  imdb: '#F5C518',
  textMain: '#FFFFFF',
  textSecondary: '#B0B3B8',
  border: '#3A3F47',
};

export const HALLS: Hall[] = [
  { 
    id: 'h1', 
    name: 'INOX', 
    times: ['10:00 AM', '01:00 PM', '04:00 PM', '09:00 PM'],
    image: 'https://images.unsplash.com/photo-1517604931442-71053e3e2c28?auto=format&fit=crop&q=80&w=1000' 
  },
  { 
    id: 'h2', 
    name: 'Maharaja', 
    times: ['11:00 AM', '02:00 PM', '06:00 PM'],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000'
  },
  { 
    id: 'h3', 
    name: 'PVR', 
    times: ['09:30 AM', '12:30 PM', '03:30 PM', '08:30 PM'],
    image: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd8?auto=format&fit=crop&q=80&w=1000'
  },
  { 
    id: 'h4', 
    name: 'Sriya', 
    times: ['10:30 AM', '01:30 PM', '05:00 PM'],
    image: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?auto=format&fit=crop&q=80&w=1000'
  },
  { 
    id: 'h5', 
    name: 'Veena', 
    times: ['12:00 PM', '03:00 PM', '07:00 PM'],
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&q=80&w=1000'
  },
];

export const UPCOMING_MOVIES: UpcomingMovie[] = [
  {
    id: 'up1',
    title: 'War 2',
    releaseDate: 'August 15, 2025',
    genre: 'Action / Thriller',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/War_2_poster.jpg/220px-War_2_poster.jpg' 
  },
  {
    id: 'up2',
    title: 'Bhool Bhulaiyaa 4',
    releaseDate: 'Diwali 2026',
    genre: 'Horror / Comedy',
    image: 'https://upload.wikimedia.org/wikipedia/en/2/22/Bhool_Bhulaiyaa_3_poster.jpg' 
  },
  {
    id: 'up3',
    title: 'Hera Pheri 3',
    releaseDate: 'December 2025',
    genre: 'Comedy',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Hera_Pheri_3_poster.jpg/220px-Hera_Pheri_3_poster.jpg'
  },
  {
    id: 'up4',
    title: 'Krrish 4',
    releaseDate: 'Late 2026',
    genre: 'Sci-Fi / Superhero',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Krrish_4_poster.jpg/220px-Krrish_4_poster.jpg'
  }
];

export const LIVE_SHOWS: LiveShow[] = [
  {
    id: 'l1',
    title: 'Standup Comedy Night',
    date: '2025-11-15',
    time: '07:00 PM',
    location: 'CineVerse Auditorium 1',
    price: 499,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=600',
    description: 'A night of laughter with top local comedians. Get ready to roll on the floor laughing!',
    category: 'Comedy'
  },
  {
    id: 'l2',
    title: 'Papu Show: The Magic',
    date: '2025-11-20',
    time: '06:00 PM',
    location: 'Open Air Theatre',
    price: 299,
    image: 'https://images.unsplash.com/photo-1598518619895-4632277d0793?auto=format&fit=crop&q=80&w=600',
    description: 'Experience mind-bending magic and illusions by the famous Papu.',
    category: 'Magic'
  },
  {
    id: 'l3',
    title: 'Badshah Live Concert',
    date: '2025-12-05',
    time: '08:00 PM',
    location: 'City Stadium',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=600',
    description: 'Groove to the beats of Badshah. The biggest musical event of the year!',
    category: 'Concert'
  },
  {
    id: 'l4',
    title: 'Dance India Dance Off',
    date: '2025-11-25',
    time: '05:00 PM',
    location: 'Grand Hall',
    price: 399,
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80&w=600',
    description: 'Witness the best dance crews battle it out for the championship title.',
    category: 'Dance'
  }
];

export const RENTAL_MOVIES: RentableMovie[] = [
  {
    id: 'r1',
    title: 'Zindagi Na Milegi Dobara',
    year: '2011',
    genre: 'Drama / Adventure',
    cast: ['Hrithik Roshan', 'Farhan Akhtar', 'Abhay Deol', 'Katrina Kaif'],
    description: 'Three friends decide to turn their fantasy vacation into reality after one of their friends gets engaged.',
    image: 'https://upload.wikimedia.org/wikipedia/en/3/3d/Zindaginamilegidobara.jpg',
    priceSingle: 199,
    priceCouple: 349,
    validityHours: 48
  },
  {
    id: 'r2',
    title: 'Rockstar',
    year: '2011',
    genre: 'Musical / Romance',
    cast: ['Ranbir Kapoor', 'Nargis Fakhri'],
    description: 'Janardhan Jakhar chases his dreams of becoming a big Rock star, during which he falls in love with Heer.',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/98/Rockstar_2011_film_poster.jpg',
    priceSingle: 199,
    priceCouple: 349,
    validityHours: 24
  },
  {
    id: 'r3',
    title: 'Barfi!',
    year: '2012',
    genre: 'Comedy / Drama',
    cast: ['Ranbir Kapoor', 'Priyanka Chopra', 'Ileana D\'Cruz'],
    description: 'Three young people learn that love can neither be defined nor contained by societys norms of normal and abnormal.',
    image: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Barfi%21_poster.jpg',
    priceSingle: 199,
    priceCouple: 349,
    validityHours: 48
  },
  {
    id: 'r4',
    title: 'Kahaani',
    year: '2012',
    genre: 'Thriller',
    cast: ['Vidya Balan', 'Parambrata Chatterjee'],
    description: 'A pregnant woman\'s search for her missing husband takes her from London to Kolkata, but everyone she questions denies having ever met him.',
    image: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Kahaani_Poster.jpg',
    priceSingle: 199,
    priceCouple: 349,
    validityHours: 24
  },
  {
    id: 'r5',
    title: 'Queen',
    year: '2014',
    genre: 'Comedy / Drama',
    cast: ['Kangana Ranaut', 'Rajkummar Rao'],
    description: 'A Delhi girl from a traditional family sets out on a solo honeymoon after her marriage gets cancelled.',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/45/QueenMoviePoster7thMarch.jpg',
    priceSingle: 199,
    priceCouple: 349,
    validityHours: 48
  },
  {
    id: 'r6',
    title: 'PK',
    year: '2014',
    genre: 'Comedy / Social',
    cast: ['Aamir Khan', 'Anushka Sharma', 'Sushant Singh Rajput'],
    description: 'A stranger in the city asks questions no one has asked before. Known only by his initials, P.K.\'s innocent questions and childlike curiosity will take him on a journey of love, laughter and letting go.',
    image: 'https://upload.wikimedia.org/wikipedia/en/c/c3/PK_poster.jpg',
    priceSingle: 199,
    priceCouple: 349,
    validityHours: 24
  }
];

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Kantara: A Legend Chapter 1',
    description: 'Originally a Kannada film, this folklore-based thriller has been dubbed in Hindi and has become a significant hit, surpassing even Dabangg 2 in box office performance.',
    image: 'https://picsum.photos/seed/kantara/300/450',
    rating: 9.3,
    genre: 'Thriller / Folklore',
    duration: '2h 28m',
    releaseDate: 'October 2025',
    cast: [
      { name: 'Rishab Shetty', role: 'Lead', image: 'https://picsum.photos/seed/actor1/100/100' },
      { name: 'Sapthami Gowda', role: 'Lead', image: 'https://picsum.photos/seed/actor2/100/100' }
    ],
    reviews: [
      { user: 'Rahul K.', rating: 5, comment: 'Absolute masterpiece! The visuals are stunning.' },
      { user: 'Sneha M.', rating: 4.5, comment: 'A thrill ride from start to finish.' }
    ]
  },
  {
    id: 'm2',
    title: 'De De Pyaar De 2',
    description: 'The sequel to the 2019 romantic comedy, starring Ajay Devgn, Rakul Preet Singh, and R. Madhavan, is set to release on November 14, 2025.',
    image: 'https://picsum.photos/seed/dede/300/450',
    rating: 7.8,
    genre: 'RomCom',
    duration: '2h 15m',
    releaseDate: 'November 14, 2025',
    cast: [
      { name: 'Ajay Devgn', role: 'Lead', image: 'https://picsum.photos/seed/ajay/100/100' },
      { name: 'Rakul Preet', role: 'Lead', image: 'https://picsum.photos/seed/rakul/100/100' },
      { name: 'R. Madhavan', role: 'Supporting', image: 'https://picsum.photos/seed/maddy/100/100' }
    ],
    reviews: [
      { user: 'Amit B.', rating: 4, comment: 'Hilarious and heartwarming.' }
    ]
  },
  {
    id: 'm3',
    title: '120 Bahadur',
    description: 'An action-packed historical drama featuring Farhan Akhtar, slated for release on November 21, 2025.',
    image: 'https://picsum.photos/seed/bahadur/300/450',
    rating: 8.5,
    genre: 'Historical Drama',
    duration: '2h 30m',
    releaseDate: 'November 21, 2025',
    cast: [
      { name: 'Farhan Akhtar', role: 'Lead', image: 'https://picsum.photos/seed/farhan/100/100' }
    ],
    reviews: []
  },
  {
    id: 'm4',
    title: 'Jolly LLB 3',
    description: 'The third installment in the popular courtroom comedy series, starring Akshay Kumar and Arshad Warsi, released on September 19, 2025.',
    image: 'https://picsum.photos/seed/jolly/300/450',
    rating: 8.1,
    genre: 'Comedy / Drama',
    duration: '2h 10m',
    releaseDate: 'September 19, 2025',
    cast: [
      { name: 'Akshay Kumar', role: 'Jolly 1', image: 'https://picsum.photos/seed/akshay/100/100' },
      { name: 'Arshad Warsi', role: 'Jolly 2', image: 'https://picsum.photos/seed/arshad/100/100' }
    ],
    reviews: [
      { user: 'Priya S.', rating: 4.5, comment: 'The duo is back with a bang!' }
    ]
  },
  {
    id: 'm5',
    title: 'Charidham',
    description: 'A film based on the Ramayana, featuring Kunal Kapoor, released on October 17, 2025.',
    image: 'https://picsum.photos/seed/charidham/300/450',
    rating: 7.5,
    genre: 'Mythology',
    duration: '2h 45m',
    releaseDate: 'October 17, 2025',
    cast: [
      { name: 'Kunal Kapoor', role: 'Lead', image: 'https://picsum.photos/seed/kunal/100/100' }
    ],
    reviews: []
  },
  {
    id: 'm6',
    title: 'Thamma',
    description: 'A family drama starring Ayushmann Khurrana and Rashmika Mandanna, releasing on October 21, 2025.',
    image: 'https://picsum.photos/seed/thamma/300/450',
    rating: 8.0,
    genre: 'Family Drama',
    duration: '2h 20m',
    releaseDate: 'October 21, 2025',
    cast: [
      { name: 'Ayushmann Khurrana', role: 'Lead', image: 'https://picsum.photos/seed/ayush/100/100' },
      { name: 'Rashmika Mandanna', role: 'Lead', image: 'https://picsum.photos/seed/rashmika/100/100' }
    ],
    reviews: []
  },
  {
    id: 'm7',
    title: 'Badass Ravi Kumar',
    description: 'A musical spoof action film and a spin-off from The Xposé universe, starring Himesh Reshammiya and Prabhu Deva, released in October 2025.',
    image: 'https://picsum.photos/seed/badass/300/450',
    rating: 6.5,
    genre: 'Action / Musical',
    duration: '2h 05m',
    releaseDate: 'October 2025',
    cast: [
      { name: 'Himesh Reshammiya', role: 'Ravi Kumar', image: 'https://picsum.photos/seed/himesh/100/100' },
      { name: 'Prabhu Deva', role: 'Antagonist', image: 'https://picsum.photos/seed/prabhu/100/100' }
    ],
    reviews: [
      { user: 'Taran A.', rating: 3, comment: 'Entertaining if you leave your brain at home.' }
    ]
  },
  {
    id: 'm8',
    title: 'Stree 2: Sarkata',
    description: 'The town of Chanderi is being haunted again. This time, women are mysteriously abducted by a headless entity.',
    image: 'https://picsum.photos/seed/stree/300/450',
    rating: 8.9,
    genre: 'Horror / Comedy',
    duration: '2h 15m',
    releaseDate: 'August 2025',
    cast: [
      { name: 'Shraddha Kapoor', role: 'Lead', image: 'https://picsum.photos/seed/shraddha/100/100' },
      { name: 'Rajkummar Rao', role: 'Lead', image: 'https://picsum.photos/seed/raj/100/100' }
    ],
    reviews: []
  }
];

export const TESTIMONIALS = [
  { id: 1, name: "Arjun Verma", comment: "CineVerse made booking tickets so easy. The QR payment is super fast!", rating: 5 },
  { id: 2, name: "Sarah Khan", comment: "Love the dark mode interface. Very sleek.", rating: 4 },
  { id: 3, name: "Mike Ross", comment: "Best platform for movie buffs.", rating: 5 }
];