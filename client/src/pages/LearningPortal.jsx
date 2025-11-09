import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle, BookOpen, FileText, Clock, ArrowLeft } from 'lucide-react';
import { courseService } from '../services/courseService';
import { progressService } from '../services/progressService';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast';

const LearningPortal = () => {
  const { courseId } = useParams();
  const { userId, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mongoUserId, setMongoUserId] = useState(null);

  useEffect(() => {
    if (courseId && userId) {
      loadCourse();
    }
  }, [courseId, userId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      if (!userId) {
        setLoading(false);
        return;
      }
      
      // Get MongoDB userId
      const profileData = await userService.getUserProfile(userId);
      const mongoUserId = profileData.user?._id;
      setMongoUserId(mongoUserId);

      if (mongoUserId) {
        const courseData = await courseService.getCourseContent(courseId);
        setCourse(courseData.course);

        // Load progress
        const progressData = await progressService.getProgress(mongoUserId, courseId);
        setProgress(progressData.progress);

        // Set first video as default
        if (courseData.course?.videos?.length > 0) {
          setSelectedVideo(courseData.course.videos[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error);
      toast.error('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const markVideoComplete = async (videoId) => {
    if (!mongoUserId) return;

    try {
      await progressService.markVideoComplete(mongoUserId, courseId, videoId);
      await loadCourse(); // Reload to update progress
      toast.success('Video marked as complete!');
    } catch (error) {
      console.error('Failed to mark video complete:', error);
      toast.error('Failed to update progress');
    }
  };

  const isVideoComplete = (videoId) => {
    return progress?.completedVideos?.includes(videoId) || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="md:col-span-3">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
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
        {/* Header */}
        <div className="mb-8">
          <Link to="/my-courses">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
              <div className="flex items-center gap-4">
                <Badge variant="primary">{course.examType}</Badge>
                <div className="flex items-center text-text-secondary">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
              </div>
            </div>
          </div>
          {progress && (
            <div className="mt-4">
              <ProgressBar progress={progress.overallProgress || 0} />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar - Course Content */}
          <div className="md:col-span-1">
            <Card>
              <h2 className="text-lg font-bold mb-4">Course Content</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {course.curriculum?.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="mb-4">
                    <h3 className="font-semibold text-sm mb-2 text-text-primary">
                      {module.moduleName}
                    </h3>
                    <div className="space-y-1">
                      {course.videos
                        ?.filter((v) => v.module === module.moduleName)
                        .map((video, videoIndex) => (
                          <button
                            key={videoIndex}
                            onClick={() => setSelectedVideo(video)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedVideo?.title === video.title
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-text-secondary'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center flex-1 min-w-0">
                                <Play className="h-3 w-3 mr-2 flex-shrink-0" />
                                <span className="truncate">{video.title}</span>
                              </div>
                              {isVideoComplete(video.url) && (
                                <CheckCircle className="h-4 w-4 ml-2 flex-shrink-0" />
                              )}
                            </div>
                            {video.duration && (
                              <div className="text-xs mt-1 opacity-75">
                                {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Study Materials */}
            {course.materials && course.materials.length > 0 && (
              <Card className="mt-4">
                <h2 className="text-lg font-bold mb-4">Study Materials</h2>
                <div className="space-y-2">
                  {course.materials.map((material, index) => (
                    <a
                      key={index}
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2 text-text-secondary" />
                      <span className="text-sm text-text-secondary">{material.title}</span>
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content - Video Player */}
          <div className="md:col-span-3">
            {selectedVideo ? (
              <Card>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-text-secondary">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedVideo.duration
                        ? `${Math.floor(selectedVideo.duration / 60)}:${(selectedVideo.duration % 60).toString().padStart(2, '0')}`
                        : 'N/A'}
                    </div>
                    {!isVideoComplete(selectedVideo.url) && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => markVideoComplete(selectedVideo.url)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </Button>
                    )}
                    {isVideoComplete(selectedVideo.url) && (
                      <Badge variant="success">Completed</Badge>
                    )}
                  </div>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <ReactPlayer
                    url={selectedVideo.url}
                    width="100%"
                    height="100%"
                    controls
                    playing={false}
                  />
                </div>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <BookOpen className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">Select a video to start learning</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPortal;



