export const courses = [
  { title: 'Crisis management and problem-solving strategies', category: 'Management', rating: '4.88', reviews: '210', lessons: 6, enrolled: '8k', price: 'Free', image: 'photo-1552664730-d307ca884978' },
  { title: 'Advanced Photoshop techniques for designers', category: 'Design', rating: '5.00', reviews: '1.2k', lessons: 8, enrolled: '25k', price: 'Free', image: 'photo-1626785774573-4b799315345d' },
  { title: 'Operations management and process improvement', category: 'Finance', rating: '5.00', reviews: '812', lessons: 12, enrolled: '23k', price: 'Free', image: 'photo-1454165804606-c3d57bc86b40' },
  { title: 'Database integration with MongoDB', category: 'Development', rating: '4.49', reviews: '756', lessons: 10, enrolled: '7k', price: '$59', image: 'photo-1518770660439-4636190af475' },
  { title: 'Risk management and business continuity', category: 'Management', rating: '4.88', reviews: '210', lessons: 3, enrolled: '8k', price: '$49', image: 'photo-1454165804606-c3d57bc86b40' },
  { title: 'Full-stack development with the MERN stack', category: 'Development', rating: '5.00', reviews: '985', lessons: 12, enrolled: '22k', price: '$72', image: 'photo-1498050108023-c5249f4df085' },
  { title: 'Design systems and pattern libraries', category: 'Design', rating: '5.00', reviews: '1.2k', lessons: 8, enrolled: '25k', price: '$99', image: 'photo-1558655146-9f40138edfeb' },
  { title: 'Learn interactive web design by building real projects', category: 'Design', rating: '4.49', reviews: '756', lessons: 12, enrolled: '23k', price: '$79', image: 'photo-1545235617-9465d2a55698' },
  { title: 'Building single page applications with Angular', category: 'Development', rating: '5.00', reviews: '328', lessons: 8, enrolled: '12k', price: 'Free', image: 'photo-1555066931-4365d14bab8c' },
  { title: 'Grow your brand and reach your audience', category: 'Management', rating: '4.88', reviews: '210', lessons: 10, enrolled: '8k', price: '$49', image: 'photo-1553877522-43269d4ea984' },
  { title: 'The complete guide to personal and business finance', category: 'Finance', rating: '4.88', reviews: '210', lessons: 10, enrolled: '8k', price: '$99', image: 'photo-1460925895917-afdab827c52f' },
  { title: 'Understanding corporate finance and investments', category: 'Finance', rating: '4.88', reviews: '210', lessons: 10, enrolled: '8k', price: 'Free', image: 'photo-1460925895917-afdab827c52f' },
];

export const crisisCourseLessons = [
  { title: 'Introduction to crisis management and problem-solving', videoId: 'setu9Ir1miY' },
  { title: 'Coaching and mentoring for developing future leaders', videoId: 'PcFXt8o7uGg' },
  { title: 'Crisis management and preparing for the unexpected', videoId: 'EFHoH15i4Zg' },
  { title: 'Project management essentials tools and methodologies', videoId: 'pLgPFfFdpDs' },
  { title: 'Marketing management and understanding market dynamics', videoId: 'pLgPFfFdpDs' },
  { title: 'Negotiation skills and finding win-win solutions', videoId: null },
];

export const photoshopCourseLessons = [
  { videoId: 'setu9Ir1miY' },
  { videoId: 'PcFXt8o7uGg' },
  { videoId: 'EFHoH15i4Zg' },
  { videoId: 'De2unauLBks' },
  { videoId: 'pLgPFfFdpDs' },
  { videoId: null },
  { videoId: null },
  { videoId: null },
];

export const financeCourseLessons = [
  { videoId: 'setu9Ir1miY' },
  { videoId: 'PcFXt8o7uGg' },
  { videoId: 'EFHoH15i4Zg' },
  { videoId: 'De2unauLBks' },
  { videoId: 'pLgPFfFdpDs' },
  { videoId: null },
  { videoId: null },
  { videoId: null },
  { videoId: null },
  { videoId: null },
];

export const angularCourseLessons = [
  { videoId: 'setu9Ir1miY' },
  { videoId: 'PcFXt8o7uGg' },
  { videoId: 'EFHoH15i4Zg' },
  { videoId: 'De2unauLBks' },
  { videoId: 'pLgPFfFdpDs' },
  { videoId: 'Gp8A55gZnBU' },
  { videoId: 'QjDQlD3jUQk' },
  { videoId: 'EcIEiuzvJgo' },
];

export const operationsCourseLessons = Array.from({ length: 12 }, () => ({ videoId: null }));

export const imageUrl = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
