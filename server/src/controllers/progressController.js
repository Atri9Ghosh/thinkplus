import Progress from '../models/Progress.js';
import Course from '../models/Course.js';

// Get progress for specific course
export const getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    let progress = await Progress.findOne({ userId, courseId })
      .populate('courseId', 'title videos curriculum');

    if (!progress) {
      // Create initial progress if doesn't exist
      progress = await Progress.create({
        userId,
        courseId,
        overallProgress: 0,
      });
      progress = await Progress.findById(progress._id)
        .populate('courseId', 'title videos curriculum');
    }

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

// Update progress
export const updateProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { overallProgress, lastAccessed } = req.body;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        overallProgress: overallProgress || 0,
        lastAccessed: lastAccessed || new Date(),
      });
    } else {
      if (overallProgress !== undefined) progress.overallProgress = overallProgress;
      if (lastAccessed) progress.lastAccessed = lastAccessed;
      await progress.save();
    }

    res.json({ progress });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

// Mark video as complete
export const markVideoComplete = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { videoId } = req.body;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        completedVideos: [videoId],
        overallProgress: 0,
      });
    } else {
      if (!progress.completedVideos.includes(videoId)) {
        progress.completedVideos.push(videoId);
      }
    }

    // Calculate overall progress
    const course = await Course.findById(courseId);
    const totalVideos = course.videos.length;
    const completedCount = progress.completedVideos.length;
    progress.overallProgress = totalVideos > 0
      ? Math.round((completedCount / totalVideos) * 100)
      : 0;

    progress.lastAccessed = new Date();
    await progress.save();

    res.json({ progress });
  } catch (error) {
    console.error('Mark video complete error:', error);
    res.status(500).json({ error: 'Failed to mark video complete' });
  }
};

// Mark module as complete
export const markModuleComplete = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { moduleName } = req.body;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        completedModules: [moduleName],
        overallProgress: 0,
      });
    } else {
      if (!progress.completedModules.includes(moduleName)) {
        progress.completedModules.push(moduleName);
      }
    }

    // Calculate overall progress based on modules
    const course = await Course.findById(courseId);
    const totalModules = course.curriculum.length;
    const completedCount = progress.completedModules.length;
    progress.overallProgress = totalModules > 0
      ? Math.round((completedCount / totalModules) * 100)
      : 0;

    progress.lastAccessed = new Date();
    await progress.save();

    res.json({ progress });
  } catch (error) {
    console.error('Mark module complete error:', error);
    res.status(500).json({ error: 'Failed to mark module complete' });
  }
};




