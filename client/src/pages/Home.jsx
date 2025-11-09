import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Award, BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Accordion from '../components/ui/Accordion';
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, success: 0, rankers: 0, years: 0 });
  
  const handleGetStarted = () => {
    navigate('/sign-up');
  };

  useEffect(() => {
    // Animate counters
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const animateCounter = (key, target) => {
      let current = 0;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, interval);
    };

    animateCounter('students', 10000);
    animateCounter('success', 95);
    animateCounter('rankers', 500);
    animateCounter('years', 8);
  }, []);

  const courses = [
    {
      title: 'IPMAT Preparation',
      description: 'Comprehensive course for IIM Indore and IIM Rohtak IPMAT entrance',
      examType: 'IPMAT',
      price: 14999,
      discountedPrice: 9999,
      features: ['Live Classes', 'Mock Tests', 'Study Materials', 'Doubt Clearing'],
      icon: '🎯',
    },
    {
      title: 'CAT Preparation',
      description: 'Master CAT with expert guidance and proven strategies',
      examType: 'CAT',
      price: 19999,
      discountedPrice: 14999,
      features: ['Expert Faculty', 'Video Lectures', 'Test Series', 'Performance Analytics'],
      icon: '📚',
    },
    {
      title: 'CLAT Preparation',
      description: 'Ace CLAT with comprehensive law entrance preparation',
      examType: 'CLAT',
      price: 17999,
      discountedPrice: 12999,
      features: ['Legal Reasoning', 'Current Affairs', 'Mock Tests', 'Personalized Mentoring'],
      icon: '⚖️',
    },
  ];

  const features = [
    {
      icon: Users,
      title: 'Expert Faculty',
      description: 'Learn from IIM graduates and industry experts with years of experience',
    },
    {
      icon: Target,
      title: 'Personalized Learning',
      description: 'Customized study plans tailored to your strengths and weaknesses',
    },
    {
      icon: BookOpen,
      title: 'Mock Tests',
      description: 'Comprehensive test series with detailed analysis and performance tracking',
    },
    {
      icon: TrendingUp,
      title: 'Study Materials',
      description: 'Curated study materials, notes, and resources for effective preparation',
    },
    {
      icon: Clock,
      title: 'Doubt Clearing',
      description: '24/7 doubt clearing sessions with dedicated mentors and discussion forums',
    },
    {
      icon: Award,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics and insights',
    },
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      college: 'IIM Indore',
      score: '98.5%',
      quote: 'ThinkPlus helped me crack IPMAT with their structured approach and expert guidance.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    },
    {
      name: 'Priya Patel',
      college: 'IIM Ahmedabad',
      score: '99.2%',
      quote: 'The mock tests and personalized feedback were game-changers for my CAT preparation.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    },
    {
      name: 'Amit Kumar',
      college: 'NLSIU Bangalore',
      score: '97.8%',
      quote: 'CLAT preparation became much easier with ThinkPlus comprehensive course material.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    },
  ];

  const faqs = [
    {
      title: 'What courses do you offer?',
      content: 'We offer comprehensive preparation courses for IPMAT, CAT, and CLAT exams. Each course includes live classes, recorded lectures, study materials, mock tests, and doubt clearing sessions.',
    },
    {
      title: 'How do I enroll in a course?',
      content: 'You can enroll in any course by clicking on the "Enroll Now" button on the course page. You\'ll need to create an account and complete the payment process.',
    },
    {
      title: 'Are the classes live or recorded?',
      content: 'We offer both live classes and recorded lectures. Live classes are scheduled at specific times, while recorded lectures can be accessed anytime after enrollment.',
    },
    {
      title: 'What is the refund policy?',
      content: 'We offer a 7-day money-back guarantee if you\'re not satisfied with the course. Contact our support team for refund requests.',
    },
    {
      title: 'Can I access course materials offline?',
      content: 'Yes, you can download study materials and PDFs for offline access. However, video lectures require an internet connection.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-transparent"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Crack IPMAT, CAT, CLAT with
            <br />
            <span className="text-accent">Expert Guidance</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Join thousands of successful students who achieved their dream of getting into top institutes
            with ThinkPlus comprehensive preparation courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Link to="/sign-up">
                <Button variant="secondary" size="lg" className="!bg-white !text-primary hover:!bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg" className="!bg-white !text-primary hover:!bg-gray-100">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedIn>
            <Link to="/courses">
              <Button variant="outline" size="lg" className="!border-white !text-white hover:!bg-white/10">
                View Courses
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>IIM Graduates</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>10,000+ Students</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Students Taught', value: stats.students, suffix: '+' },
              { label: 'Success Rate', value: stats.success, suffix: '%' },
              { label: 'Top Rankers', value: stats.rankers, suffix: '+' },
              { label: 'Years of Experience', value: stats.years, suffix: '+' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Courses</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Comprehensive preparation courses designed by experts to help you ace your entrance exams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  <div className="text-5xl mb-4">{course.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                  <p className="text-text-secondary mb-4 flex-grow">{course.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {course.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-text-secondary">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">₹{course.discountedPrice.toLocaleString()}</span>
                      <span className="text-text-secondary line-through ml-2">₹{course.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link to={`/courses?examType=${course.examType}`}>
                    <Button variant="primary" className="w-full">
                      Enroll Now
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/courses">
              <Button variant="outline" size="lg">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ThinkPlus?</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need to succeed in your entrance exam preparation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="h-full">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-text-secondary">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Hear from our students who achieved their dreams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-text-secondary">{testimonial.college}</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                    <span className="ml-2 text-sm font-medium">{testimonial.score}</span>
                  </div>
                  <p className="text-text-secondary italic">"{testimonial.quote}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-text-secondary text-lg">
              Everything you need to know about our courses
            </p>
          </motion.div>

          <Accordion items={faqs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of students who are already preparing with ThinkPlus
            </p>
            <SignedOut>
              <Link to="/sign-up">
                <Button variant="secondary" size="lg" className="!bg-white !text-primary hover:!bg-gray-100">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg" className="!bg-white !text-primary hover:!bg-gray-100">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedIn>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;


