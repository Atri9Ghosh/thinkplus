import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Course from '../models/Course.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId })
      .populate('enrolledCourses', 'title thumbnail examType price');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { name, phoneNumber, profileImage } = req.body;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get user progress
export const getUserProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const progress = await Progress.find({ userId: id })
      .populate('courseId', 'title thumbnail examType');

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

// Get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const enrolledCourses = await Course.find({ _id: { $in: user.enrolledCourses } })
      .select('title thumbnail examType price');

    const progress = await Progress.find({ userId: id })
      .populate('courseId', 'title');

    // Calculate stats
    const totalStudyHours = progress.reduce((sum, p) => {
      // Estimate: 1% progress = 1 hour (adjust based on your logic)
      return sum + (p.overallProgress / 100) * 10;
    }, 0);

    const testsAttempted = progress.reduce((sum, p) => sum + p.quizScores.length, 0);

    res.json({
      user,
      enrolledCourses,
      progress,
      stats: {
        totalCourses: enrolledCourses.length,
        totalStudyHours: Math.round(totalStudyHours),
        testsAttempted,
        averageProgress: progress.length > 0
          ? Math.round(progress.reduce((sum, p) => sum + p.overallProgress, 0) / progress.length)
          : 0,
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-__v');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};




