import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const MyCourses = () => {
  const { userId, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadCourses();
    }
  }, [userId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      if (!userId) {
        setLoading(false);
        return;
      }
      
      // Get user profile to get MongoDB userId
      const profileData = await userService.getUserProfile(userId);
      const mongoUserId = profileData.user?._id;
      
      if (mongoUserId) {
        const enrolledData = await courseService.getEnrolledCourses(mongoUserId);
        setCourses(enrolledData.courses || []);

        const progressData = await userService.getUserProgress(mongoUserId);
        setProgress(progressData.progress || []);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 mb-8 w-64" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Courses</h1>
          <p className="text-text-secondary">
            Continue learning from where you left off
          </p>
        </div>

        {courses.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="h-16 w-16 text-text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No courses enrolled yet</h2>
            <p className="text-text-secondary mb-6">
              Start your learning journey by enrolling in a course
            </p>
            <Link to="/courses">
              <Button variant="primary" size="lg">
                Browse Courses
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              const courseProgress = progress.find(p => p.courseId._id === course._id);
              const progressValue = courseProgress?.overallProgress || 0;

              return (
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
                      <div className="flex items-center text-sm text-text-secondary">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-text-secondary mb-4 flex-grow line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-text-secondary">{Math.round(progressValue)}%</span>
                      </div>
                      <ProgressBar progress={progressValue} showLabel={false} />
                    </div>
                    <Link to={`/learn/${course._id}`}>
                      <Button variant="primary" className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        {progressValue > 0 ? 'Continue Learning' : 'Start Learning'}
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;



