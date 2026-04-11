import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Button from './ui/Button';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isHomePage = location.pathname === '/';

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/planner');
    } else {
      navigate('/signup');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Smart Task Planner</span>
          </div>
          <span className="tagline">AI-Powered Goal Planning</span>
        </div>
        
        <nav className="nav-menu">
          {isHomePage && (
            <>
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How It Works</a>
            </>
          )}
          {!isHomePage && (
            <a onClick={() => navigate('/')} className="nav-link" style={{ cursor: 'pointer' }}>
              Home
            </a>
          )}
          {isAuthenticated && user && (
            <span className="user-greeting">Hi, {user.name}!</span>
          )}
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {!isHomePage && (
                <Button variant="primary" size="medium" onClick={handleGetStarted}>
                  New Plan
                </Button>
              )}
              <Button variant="secondary" size="medium" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="medium" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="medium" onClick={handleGetStarted}>
                {isHomePage ? 'Get Started' : 'Sign Up'}
              </Button>
            </>
          )}
        </nav>

        <div className="mobile-actions">
          <ThemeToggle />
          <button className="mobile-menu-btn" aria-label="Menu">
            <span className="hamburger-icon">☰</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
