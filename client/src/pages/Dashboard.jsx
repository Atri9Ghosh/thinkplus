import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Award, Play, Calendar, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { userId, user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: { totalCourses: 0, totalStudyHours: 0, testsAttempted: 0, averageProgress: 0 },
    enrolledCourses: [],
    progress: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadDashboard();
    } else {
      // If no userId, just show empty dashboard
      setLoading(false);
    }
  }, [userId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      // Get user profile first to get MongoDB userId
      if (!userId) {
        // Show empty dashboard if no userId
        setDashboardData({
          stats: { totalCourses: 0, totalStudyHours: 0, testsAttempted: 0, averageProgress: 0 },
          enrolledCourses: [],
          progress: [],
        });
        setLoading(false);
        return;
      }
      
      try {
        const profileData = await userService.getUserProfile(userId);
        const mongoUserId = profileData.user?._id;
        
        if (mongoUserId) {
          try {
            const data = await userService.getDashboardData(mongoUserId);
            setDashboardData(data);
          } catch (dashboardError) {
            console.error('Failed to load dashboard data:', dashboardError);
            // Show empty dashboard on error
            setDashboardData({
              stats: { totalCourses: 0, totalStudyHours: 0, testsAttempted: 0, averageProgress: 0 },
              enrolledCourses: [],
              progress: [],
            });
          }
        } else {
          // If user doesn't exist in MongoDB yet, show empty dashboard
          setDashboardData({
            stats: { totalCourses: 0, totalStudyHours: 0, testsAttempted: 0, averageProgress: 0 },
            enrolledCourses: [],
            progress: [],
          });
        }
      } catch (profileError) {
        console.error('Failed to load profile:', profileError);
        // Show empty dashboard on error - don't show toast to avoid spam
        setDashboardData({
          stats: { totalCourses: 0, totalStudyHours: 0, testsAttempted: 0, averageProgress: 0 },
          enrolledCourses: [],
          progress: [],
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      // Set empty data on error - always show dashboard
      setDashboardData({
        stats: { totalCourses: 0, totalStudyHours: 0, testsAttempted: 0, averageProgress: 0 },
        enrolledCourses: [],
        progress: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton only briefly
  if (loading && !dashboardData?.stats) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 mb-8 w-64" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalCourses: 0,
    totalStudyHours: 0,
    testsAttempted: 0,
    averageProgress: 0,
  };

  const enrolledCourses = dashboardData?.enrolledCourses || [];
  const progress = dashboardData?.progress || [];

  // Mock chart data (replace with real data)
  const chartData = [
    { name: 'Week 1', progress: 20 },
    { name: 'Week 2', progress: 35 },
    { name: 'Week 3', progress: 50 },
    { name: 'Week 4', progress: 65 },
    { name: 'Week 5', progress: 75 },
    { name: 'Week 6', progress: 85 },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || 'Student'}! 👋
          </h1>
          <p className="text-text-secondary">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Enrolled Courses</p>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Study Hours</p>
                  <p className="text-3xl font-bold">{stats.totalStudyHours}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-success" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Tests Attempted</p>
                  <p className="text-3xl font-bold">{stats.testsAttempted}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-warning" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Avg. Progress</p>
                  <p className="text-3xl font-bold">{stats.averageProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Courses</h2>
                <Link to="/my-courses">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                  <p className="text-text-secondary mb-4">You haven't enrolled in any courses yet</p>
                  <Link to="/courses">
                    <Button variant="primary">Browse Courses</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.slice(0, 3).map((course) => {
                    const courseProgress = progress.find(p => p.courseId._id === course._id);
                    return (
                      <div
                        key={course._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                            <Badge variant="primary">{course.examType}</Badge>
                          </div>
                          <Link to={`/learn/${course._id}`}>
                            <Button variant="ghost" size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Continue
                            </Button>
                          </Link>
                        </div>
                        <ProgressBar
                          progress={courseProgress?.overallProgress || 0}
                          showLabel={false}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Performance Chart */}
            <Card>
              <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#667eea"
                    strokeWidth={2}
                    dot={{ fill: '#667eea' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link to="/courses">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/my-courses">
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="mr-2 h-4 w-4" />
                    My Courses
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Announcements</h2>
                <Bell className="h-5 w-5 text-text-secondary" />
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-1">New Course Added</p>
                  <p className="text-text-secondary text-xs">2 days ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">Mock Test Schedule</p>
                  <p className="text-text-secondary text-xs">5 days ago</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



