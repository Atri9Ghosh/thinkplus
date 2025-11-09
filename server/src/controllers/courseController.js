import Course from '../models/Course.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

// Get all courses with filters
export const getCourses = async (req, res) => {
  try {
    const { examType, priceRange, sort, search } = req.query;
    const query = { isPublished: true };

    if (examType) {
      query.examType = examType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      query.price = { $gte: min || 0, $lte: max || Infinity };
    }

    let sortOption = {};
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popular') sortOption = { enrolledCount: -1 };
    else sortOption = { createdAt: -1 };

    const courses = await Course.find(query).sort(sortOption);
    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get single course
export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Create course (admin only)
export const createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const course = await Course.create(courseData);
    res.status(201).json({ course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Update course (admin only)
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete course (admin only)
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

// Enroll in course
export const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(id)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(id);
    await user.save();

    course.enrolledCount += 1;
    await course.save();

    // Create progress entry
    await Progress.create({
      userId,
      courseId: id,
      overallProgress: 0,
    });

    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

// Get course content (enrolled users only)
export const getCourseContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(id)) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course content error:', error);
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
};

// Add course review
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is enrolled
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(id)) {
      return res.status(403).json({ error: 'Must be enrolled to review' });
    }

    // Remove existing review from same user
    course.reviews = course.reviews.filter(
      review => review.userId.toString() !== userId.toString()
    );

    // Add new review
    course.reviews.push({
      userId,
      rating,
      comment: comment || '',
      date: new Date(),
    });

    // Recalculate average rating
    const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.rating = totalRating / course.reviews.length;

    await course.save();

    res.json({ message: 'Review added successfully', course });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// Get enrolled courses
export const getEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ courses: user.enrolledCourses });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
};




