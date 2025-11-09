import Test from '../models/Test.js';
import Progress from '../models/Progress.js';

// Get all tests for a course
export const getCourseTests = async (req, res) => {
  try {
    const { courseId } = req.params;
    const tests = await Test.find({ courseId, isActive: true })
      .select('title description duration totalMarks passingMarks createdAt');

    res.json({ tests });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

// Get single test
export const getTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id).select('-questions.correctAnswer');

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json({ test });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ error: 'Failed to fetch test' });
  }
};

// Create test (admin only)
export const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({ test });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({ error: 'Failed to create test' });
  }
};

// Update test (admin only)
export const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json({ test });
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({ error: 'Failed to update test' });
  }
};

// Delete test (admin only)
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByIdAndDelete(id);

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({ error: 'Failed to delete test' });
  }
};

// Submit test
export const submitTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user.userId;

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Calculate score
    let score = 0;
    const detailedAnswers = answers.map((answer, index) => {
      const question = test.questions[index];
      const isCorrect = answer === question.correctAnswer;
      if (isCorrect) {
        score += question.marks;
      }
      return {
        questionIndex: index,
        selectedAnswer: answer,
        isCorrect,
      };
    });

    // Save attempt
    test.attempts.push({
      userId,
      score,
      answers: detailedAnswers,
      timeTaken: timeTaken || 0,
      submittedAt: new Date(),
    });

    await test.save();

    // Update progress
    if (test.courseId) {
      let progress = await Progress.findOne({
        userId,
        courseId: test.courseId,
      });

      if (progress) {
        progress.quizScores.push({
          quizId: test._id,
          score,
          totalMarks: test.totalMarks,
          attemptDate: new Date(),
        });
        await progress.save();
      }
    }

    res.json({
      score,
      totalMarks: test.totalMarks,
      percentage: Math.round((score / test.totalMarks) * 100),
      passed: score >= test.passingMarks,
      answers: detailedAnswers,
      correctAnswers: test.questions.map(q => q.correctAnswer),
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
};

// Get test results
export const getTestResults = async (req, res) => {
  try {
    const { userId, testId } = req.params;
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const attempt = test.attempts.find(
      a => a.userId.toString() === userId.toString()
    );

    if (!attempt) {
      return res.status(404).json({ error: 'No attempt found' });
    }

    res.json({
      attempt,
      test: {
        title: test.title,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        questions: test.questions,
      },
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};

// Get test analytics (admin only)
export const getTestAnalytics = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const totalAttempts = test.attempts.length;
    const averageScore = totalAttempts > 0
      ? test.attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
      : 0;
    const passCount = test.attempts.filter(a => a.score >= test.passingMarks).length;
    const passRate = totalAttempts > 0 ? (passCount / totalAttempts) * 100 : 0;

    res.json({
      totalAttempts,
      averageScore: Math.round(averageScore * 100) / 100,
      passCount,
      passRate: Math.round(passRate * 100) / 100,
      attempts: test.attempts,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};




