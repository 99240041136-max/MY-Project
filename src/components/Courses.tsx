import React from 'react';
import { motion } from 'motion/react';
import { Book, Clock, Star, Play, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const courses = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    instructor: "Dr. Sarah Chen",
    duration: "12h 30m",
    rating: 4.8,
    students: "12.5k",
    image: "https://picsum.photos/seed/ml/400/250",
    category: "AI & Data Science"
  },
  {
    id: 2,
    title: "Web Accessibility Masterclass",
    instructor: "James Wilson",
    duration: "8h 45m",
    rating: 4.9,
    students: "8.2k",
    image: "https://picsum.photos/seed/a11y/400/250",
    category: "Design"
  },
  {
    id: 3,
    title: "Advanced React Patterns",
    instructor: "Michael Rivera",
    duration: "15h 20m",
    rating: 4.7,
    students: "15k",
    image: "https://picsum.photos/seed/react/400/250",
    category: "Development"
  },
  {
    id: 4,
    title: "Ethics in Artificial Intelligence",
    instructor: "Dr. Elena Rossi",
    duration: "6h 15m",
    rating: 4.9,
    students: "5.4k",
    image: "https://picsum.photos/seed/ethics/400/250",
    category: "AI & Philosophy"
  }
];

export const Courses = ({ 
  searchQuery = '', 
  onShowToast 
}: { 
  searchQuery?: string;
  onShowToast?: (msg: string) => void;
}) => {
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Explore Courses'}
          </h1>
          <p className="text-zinc-500 mt-1">
            {searchQuery 
              ? `Found ${filteredCourses.length} courses matching your search.`
              : 'Discover high-quality learning materials curated for you.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onShowToast?.('Filter functionality coming soon!')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-all"
          >
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={`course-${course.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl border border-zinc-200 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-900">
                    {course.category}
                  </span>
                </div>
                <button 
                  onClick={() => onShowToast?.(`Starting course: ${course.title}`)}
                  className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 group-hover:bg-zinc-900/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-900 shadow-xl">
                    <Play size={20} fill="currentColor" />
                  </div>
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold">
                    {course.instructor[0]}
                  </div>
                  <span className="text-xs text-zinc-500">{course.instructor}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4 line-clamp-1">{course.title}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Clock size={14} />
                      <span className="text-xs font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">{course.rating}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">{course.students} students</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-zinc-200">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <Book size={32} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No courses found</h3>
          <p className="text-zinc-500">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
};
