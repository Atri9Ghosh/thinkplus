import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Users, CheckCircle, Play, BookOpen, FileText } from 'lucide-react';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { isSignedIn, userId } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourse(id);
      setCourse(data.course);
      
      // Check if enrolled
      if (isSignedIn && userId) {
        try {
          // Get MongoDB userId first
          const profileData = await userService.getUserProfile(userId);
          const mongoUserId = profileData.user?._id;
          
          if (mongoUserId) {
            const enrolledData = await courseService.getEnrolledCourses(mongoUserId);
            const enrolled = enrolledData.courses?.some(c => c._id === id);
            setIsEnrolled(enrolled);
          }
        } catch (error) {
          console.error('Failed to check enrollment:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isSignedIn || !userId) {
      toast.error('Please sign in to enroll');
      return;
    }

    try {
      setEnrolling(true);
      await courseService.enrollInCourse(id);
      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      console.error('Failed to enroll:', error);
      toast.error(error.response?.data?.error || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton variant="rectangular" className="h-96 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-8 mb-4" />
              <Skeleton className="h-4 mb-2 w-3/4" />
            </div>
            <div>
              <Skeleton variant="rectangular" className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background py-12 text-center">
        <p className="text-text-secondary text-lg">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="primary">{course.examType}</Badge>
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-warning text-warning mr-1" />
              <span className="font-medium">{course.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-text-secondary ml-2">
                ({course.reviews?.length || 0} reviews)
              </span>
            </div>
            <div className="flex items-center text-text-secondary">
              <Users className="h-5 w-5 mr-1" />
              {course.enrolledCount || 0} students
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-text-secondary mb-6">{course.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Curriculum */}
            {course.curriculum && course.curriculum.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold mb-6">Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((module, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h3 className="font-bold text-lg mb-2">{module.moduleName}</h3>
                      <ul className="space-y-1">
                        {module.topics?.map((topic, i) => (
                          <li key={i} className="flex items-center text-text-secondary">
                            <CheckCircle className="h-4 w-4 text-success mr-2" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Instructor */}
            {course.instructor && (
              <Card>
                <h2 className="text-2xl font-bold mb-6">Instructor</h2>
                <div className="flex items-start gap-4">
                  {course.instructor.image && (
                    <img
                      src={course.instructor.image}
                      alt={course.instructor.name}
                      className="w-20 h-20 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold mb-2">{course.instructor.name}</h3>
                    <p className="text-text-secondary">{course.instructor.bio}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Reviews */}
            {course.reviews && course.reviews.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                <div className="space-y-4">
                  {course.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-warning text-warning'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-text-secondary">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-text-secondary">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-24">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-primary">
                      ₹{course.discountedPrice?.toLocaleString() || course.price.toLocaleString()}
                    </span>
                    {course.discountedPrice && (
                      <span className="text-text-secondary line-through ml-2">
                        ₹{course.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-text-secondary mb-6">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration: {course.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {course.videos?.length || 0} Video Lectures
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    {course.materials?.length || 0} Study Materials
                  </div>
                </div>
              </div>

              {isEnrolled ? (
                <Link to={`/learn/${id}`}>
                  <Button variant="primary" className="w-full mb-4">
                    <Play className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  className="w-full mb-4"
                  onClick={handleEnroll}
                  loading={enrolling}
                  disabled={!isSignedIn}
                >
                  {isSignedIn ? 'Enroll Now' : 'Sign In to Enroll'}
                </Button>
              )}

              {!isSignedIn && (
                <p className="text-sm text-text-secondary text-center">
                  <Link to="/sign-in" className="text-primary hover:underline">
                    Sign in
                  </Link>{' '}
                  to enroll in this course
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;



