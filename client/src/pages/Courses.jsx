import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Users } from 'lucide-react';
import { courseService } from '../services/courseService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    examType: '',
    search: '',
    sort: 'popular',
  });

  useEffect(() => {
    loadCourses();
  }, [filters]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses(filters);
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const examTypes = ['IPMAT', 'CAT', 'CLAT'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Courses</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Choose from our comprehensive preparation courses designed by experts
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                icon={Search}
              />
            </div>
            <select
              value={filters.examType}
              onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Exam Types</option>
              {examTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters({ ...filters, examType: '' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.examType === ''
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-secondary hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {examTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilters({ ...filters, examType: type })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.examType === type
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton variant="rectangular" className="h-48 mb-4" />
                <Skeleton className="h-6 mb-2" />
                <Skeleton className="h-4 mb-4 w-3/4" />
                <Skeleton className="h-10" />
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">No courses found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary">{course.examType}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-warning text-warning mr-1" />
                      <span className="text-sm font-medium">{course.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-text-secondary mb-4 flex-grow line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mb-4 text-sm text-text-secondary">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.enrolledCount || 0} enrolled
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ₹{course.discountedPrice?.toLocaleString() || course.price.toLocaleString()}
                      </span>
                      {course.discountedPrice && (
                        <span className="text-text-secondary line-through ml-2">
                          ₹{course.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link to={`/courses/${course._id}`}>
                    <Button variant="primary" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;




