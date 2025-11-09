import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Test from '../models/Test.js';
import Announcement from '../models/Announcement.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Test.deleteMany({});
    await Announcement.deleteMany({});

    // Create admin user (you'll need to sync this with Clerk)
    const adminUser = await User.create({
      clerkId: 'admin_clerk_id_placeholder',
      email: 'admin@thinkplus.com',
      name: 'Admin User',
      role: 'admin',
    });

    // Create sample student users
    const students = await User.create([
      {
        clerkId: 'student1_clerk_id_placeholder',
        email: 'student1@thinkplus.com',
        name: 'Rahul Sharma',
        role: 'student',
      },
      {
        clerkId: 'student2_clerk_id_placeholder',
        email: 'student2@thinkplus.com',
        name: 'Priya Patel',
        role: 'student',
      },
    ]);

    // Create courses
    const courses = await Course.create([
      {
        title: 'Complete IPMAT Preparation Course',
        description: 'Comprehensive course for IIM Indore and IIM Rohtak IPMAT entrance exam. Covers Quantitative Ability, Verbal Ability, and Logical Reasoning.',
        examType: 'IPMAT',
        duration: '6 months',
        price: 14999,
        discountedPrice: 9999,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        curriculum: [
          {
            moduleName: 'Quantitative Ability',
            topics: ['Arithmetic', 'Algebra', 'Geometry', 'Number Systems', 'Data Interpretation'],
          },
          {
            moduleName: 'Verbal Ability',
            topics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Para Jumbles', 'Critical Reasoning'],
          },
          {
            moduleName: 'Logical Reasoning',
            topics: ['Analytical Reasoning', 'Logical Puzzles', 'Syllogisms', 'Blood Relations', 'Direction Sense'],
          },
        ],
        instructor: {
          name: 'Dr. Amit Kumar',
          bio: 'IIM Indore graduate with 10+ years of experience in teaching IPMAT preparation',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
        },
        videos: [
          {
            title: 'Introduction to IPMAT',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 1200,
            order: 1,
            module: 'Quantitative Ability',
          },
          {
            title: 'Arithmetic Basics',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 1800,
            order: 2,
            module: 'Quantitative Ability',
          },
          {
            title: 'Reading Comprehension Strategies',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 1500,
            order: 3,
            module: 'Verbal Ability',
          },
        ],
        materials: [
          {
            title: 'IPMAT Syllabus PDF',
            type: 'pdf',
            url: 'https://example.com/syllabus.pdf',
          },
          {
            title: 'Quantitative Ability Notes',
            type: 'pdf',
            url: 'https://example.com/qa-notes.pdf',
          },
        ],
        enrolledCount: 250,
        rating: 4.5,
        reviews: [
          {
            userId: students[0]._id,
            rating: 5,
            comment: 'Excellent course! Helped me crack IPMAT.',
            date: new Date(),
          },
        ],
        isPublished: true,
      },
      {
        title: 'CAT 2024 Complete Preparation',
        description: 'Master CAT with expert guidance and proven strategies. Comprehensive coverage of all sections with extensive practice material.',
        examType: 'CAT',
        duration: '8 months',
        price: 19999,
        discountedPrice: 14999,
        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        curriculum: [
          {
            moduleName: 'Quantitative Aptitude',
            topics: ['Number Systems', 'Algebra', 'Geometry', 'Trigonometry', 'Modern Math'],
          },
          {
            moduleName: 'Data Interpretation & Logical Reasoning',
            topics: ['Tables', 'Graphs', 'Charts', 'Logical Puzzles', 'Seating Arrangements'],
          },
          {
            moduleName: 'Verbal Ability & Reading Comprehension',
            topics: ['RC Passages', 'Para Jumbles', 'Para Summary', 'Grammar', 'Vocabulary'],
          },
        ],
        instructor: {
          name: 'Prof. Neha Singh',
          bio: 'IIM Ahmedabad graduate, 15+ years of CAT coaching experience',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
        },
        videos: [
          {
            title: 'CAT Exam Overview',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 1800,
            order: 1,
            module: 'Quantitative Aptitude',
          },
          {
            title: 'Number Systems Fundamentals',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 2400,
            order: 2,
            module: 'Quantitative Aptitude',
          },
        ],
        materials: [
          {
            title: 'CAT Previous Year Papers',
            type: 'pdf',
            url: 'https://example.com/cat-papers.pdf',
          },
        ],
        enrolledCount: 500,
        rating: 4.8,
        reviews: [
          {
            userId: students[1]._id,
            rating: 5,
            comment: 'Best CAT preparation course!',
            date: new Date(),
          },
        ],
        isPublished: true,
      },
      {
        title: 'CLAT 2024 Comprehensive Course',
        description: 'Ace CLAT with comprehensive law entrance preparation. Covers all sections with detailed explanations and practice tests.',
        examType: 'CLAT',
        duration: '7 months',
        price: 17999,
        discountedPrice: 12999,
        thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
        curriculum: [
          {
            moduleName: 'English Language',
            topics: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Para Jumbles'],
          },
          {
            moduleName: 'Current Affairs & General Knowledge',
            topics: ['Current Events', 'History', 'Geography', 'Polity', 'Economics'],
          },
          {
            moduleName: 'Legal Reasoning',
            topics: ['Legal Principles', 'Case Laws', 'Legal Maxims', 'Constitutional Law'],
          },
          {
            moduleName: 'Logical Reasoning',
            topics: ['Analytical Reasoning', 'Logical Puzzles', 'Syllogisms'],
          },
          {
            moduleName: 'Quantitative Techniques',
            topics: ['Basic Math', 'Data Interpretation', 'Statistics'],
          },
        ],
        instructor: {
          name: 'Adv. Rajesh Verma',
          bio: 'NLSIU graduate, practicing lawyer with 12+ years of CLAT coaching experience',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
        },
        videos: [
          {
            title: 'CLAT Exam Pattern',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 1500,
            order: 1,
            module: 'English Language',
          },
        ],
        materials: [
          {
            title: 'CLAT Study Material',
            type: 'pdf',
            url: 'https://example.com/clat-material.pdf',
          },
        ],
        enrolledCount: 300,
        rating: 4.6,
        isPublished: true,
      },
    ]);

    // Create sample tests
    await Test.create([
      {
        courseId: courses[0]._id,
        title: 'IPMAT Mock Test 1',
        description: 'Full-length mock test for IPMAT preparation',
        questions: [
          {
            question: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: 1,
            marks: 1,
            explanation: 'Basic arithmetic: 2 + 2 = 4',
          },
          {
            question: 'What is the capital of India?',
            options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
            correctAnswer: 1,
            marks: 1,
            explanation: 'New Delhi is the capital of India',
          },
        ],
        duration: 120,
        totalMarks: 2,
        passingMarks: 1,
        isActive: true,
      },
    ]);

    // Create announcements
    await Announcement.create([
      {
        title: 'Welcome to ThinkPlus!',
        content: 'We are excited to have you on board. Start your learning journey today!',
        targetAudience: 'all',
        priority: 'high',
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'New Course Added',
        content: 'Check out our new CAT 2024 preparation course with expert faculty.',
        targetAudience: 'students',
        priority: 'medium',
        isActive: true,
        createdBy: adminUser._id,
      },
    ]);

    console.log('✅ Seed data created successfully!');
    console.log(`- ${students.length} students created`);
    console.log(`- ${courses.length} courses created`);
    console.log(`- 1 test created`);
    console.log(`- 2 announcements created`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();




