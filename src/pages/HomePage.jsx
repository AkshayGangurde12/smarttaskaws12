import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/planner');
  };

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Planning',
      description: 'Transform your goals into actionable tasks with intelligent AI assistance'
    },
    {
      icon: '📊',
      title: 'Visual Timeline',
      description: 'See your project timeline with beautiful Gantt charts and progress tracking'
    },
    {
      icon: '🎯',
      title: 'Smart Dependencies',
      description: 'Automatically identify task dependencies and critical paths'
    },
    {
      icon: '📈',
      title: 'Progress Analytics',
      description: 'Track your progress with detailed statistics and insights'
    },
    {
      icon: '🌙',
      title: 'Dark Mode',
      description: 'Work comfortably with full dark mode support'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Access your plans anywhere on any device'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Describe Your Goal',
      description: 'Simply type in what you want to achieve',
      icon: '✍️'
    },
    {
      step: '2',
      title: 'AI Generates Plan',
      description: 'Our AI breaks it down into actionable tasks',
      icon: '🤖'
    },
    {
      step: '3',
      title: 'Track Progress',
      description: 'Monitor your progress and complete tasks',
      icon: '✅'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section-home">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>AI-Powered Goal Planning</span>
          </div>
          
          <h1 className="hero-title">
            Transform Your Goals Into
            <span className="hero-title-gradient"> Actionable Plans</span>
          </h1>
          
          <p className="hero-description">
            Smart Task Planner uses advanced AI to break down your goals into 
            manageable tasks with timelines, dependencies, and progress tracking.
          </p>
          
          <div className="hero-actions">
            <Button
              variant="primary"
              size="large"
              icon="🚀"
              onClick={handleGetStarted}
              className="hero-cta"
            >
              Get Started Free
            </Button>
            <Button
              variant="secondary"
              size="large"
              icon="▶️"
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </div>

          <div className="hero-stats">
            <div className="stat-item-home">
              <div className="stat-value-home">10K+</div>
              <div className="stat-label-home">Plans Created</div>
            </div>
            <div className="stat-item-home">
              <div className="stat-value-home">50K+</div>
              <div className="stat-label-home">Tasks Generated</div>
            </div>
            <div className="stat-item-home">
              <div className="stat-value-home">95%</div>
              <div className="stat-label-home">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card card-1">
            <div className="card-icon">🎯</div>
            <div className="card-title">Launch Mobile App</div>
            <div className="card-progress">
              <div className="progress-bar-home">
                <div className="progress-fill-home" style={{ width: '75%' }}></div>
              </div>
              <span className="progress-text-home">75% Complete</span>
            </div>
          </div>
          
          <div className="visual-card card-2">
            <div className="card-icon">📊</div>
            <div className="card-title">8 Tasks</div>
            <div className="card-subtitle">3 days remaining</div>
          </div>
          
          <div className="visual-card card-3">
            <div className="card-icon">✅</div>
            <div className="card-title">Task Completed!</div>
            <div className="card-subtitle">Design UI Mockups</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-description">
            Everything you need to plan, track, and achieve your goals
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            Get started in three simple steps
          </p>
        </div>

        <div className="steps-container">
          {howItWorks.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.step}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < howItWorks.length - 1 && (
                <div className="step-connector">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Achieve Your Goals?</h2>
          <p className="cta-description">
            Join thousands of users who are turning their dreams into reality
          </p>
          <Button
            variant="primary"
            size="large"
            icon="🚀"
            onClick={handleGetStarted}
            className="cta-button"
          >
            Start Planning Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content-home">
          <div className="footer-brand">
            <div className="footer-logo-home">
              <span className="footer-logo-icon">🎯</span>
              <span className="footer-logo-text">Smart Task Planner</span>
            </div>
            <p className="footer-tagline">
              AI-powered goal planning made simple
            </p>
          </div>
          
          <div className="footer-links-home">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#" onClick={handleGetStarted}>Get Started</a>
          </div>
        </div>
        
        <div className="footer-bottom-home">
          <p>© 2025 Smart Task Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
