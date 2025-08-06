import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnterApp }) => {
  const teamMembers = [
    { 
      name: "Dr. Rajesh Kumar", 
      role: "Principal Investigator & Project Lead", 
      initials: "RK",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
      expertise: "Planetary Science, Lunar Geology"
    },
    { 
      name: "Dr. Priya Sharma", 
      role: "Senior Data Scientist", 
      initials: "PS",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format",
      expertise: "Machine Learning, Spectral Analysis"
    },
    { 
      name: "Arjun Patel", 
      role: "3D Visualization Specialist", 
      initials: "AP",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
      expertise: "Computer Graphics, WebGL"
    },
    { 
      name: "Sneha Gupta", 
      role: "Frontend Developer", 
      initials: "SG",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
      expertise: "React, UI/UX Design"
    }
  ];

  const researchPapers = [
    {
      title: "Advanced Spectroscopic Analysis of Lunar Mare Basalts: Insights from Chandrayaan-3 Data",
      authors: "Kumar, R., Sharma, P., Desai, A., et al.",
      journal: "Nature Astronomy",
      year: "2024",
      doi: "10.1038/s41550-024-001",
      abstract: "Comprehensive analysis of lunar surface composition using advanced spectroscopic techniques."
    },
    {
      title: "Real-time 3D Visualization Framework for Planetary Surface Data",
      authors: "Patel, A., Singh, V., Mehta, R., et al.",
      journal: "IEEE Transactions on Visualization and Computer Graphics",
      year: "2024",
      doi: "10.1109/TVCG.2024.001",
      abstract: "Novel approaches to interactive 3D rendering of large-scale planetary datasets."
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="highlight">Moon Explorer</span>
            </h1>
            <h2 className="hero-subtitle">ISRO-IIT Bombay Collaborative Research Initiative</h2>
            <p className="hero-description">
              Explore the lunar surface through advanced 2D and 3D visualization tools, 
              powered by Chandrayaan mission data and cutting-edge research analysis. 
              Discover mineral compositions, topographical features, and geological formations 
              of our celestial neighbor.
            </p>
            <button className="cta-button" onClick={onEnterApp}>
              <span>Explore Moon Data</span>
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div className="hero-visual">
            <div className="moon-animation">
              <div className="moon-sphere"></div>
              <div className="orbit-ring"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mode Section */}
      <section id="interactive" className="interactive-section">
        <div className="container">
          <h2 className="section-title">Interactive Exploration Modes</h2>
          <div className="mode-cards">
            <div className="mode-card">
              <div className="mode-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <h3>2D Mapping</h3>
              <p>Explore detailed lunar surface maps with layered data visualization and interactive overlays.</p>
            </div>
            <div className="mode-card">
              <div className="mode-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>3D Visualization</h3>
              <p>Immerse yourself in three-dimensional lunar terrain with real-time data overlays and navigation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Papers Section */}
      <section id="research" className="research-section">
        <div className="container">
          <h2 className="section-title">Research Publications</h2>
          <div className="papers-grid">
            {researchPapers.map((paper, index) => (
              <div key={index} className="paper-card">
                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-authors">{paper.authors}</p>
                <div className="paper-details">
                  <span className="paper-journal">{paper.journal}</span>
                  <span className="paper-year">({paper.year})</span>
                </div>
                <p className="paper-abstract">{paper.abstract}</p>
                <div className="paper-doi">DOI: {paper.doi}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <div className="container">
          <h2 className="section-title">Our Team</h2>
          
          {/* Team Photo */}
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-photo">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="member-initials" style={{display: 'none'}}>
                    {member.initials}
                  </div>
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-expertise">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>Moon Explorer</h3>
              <p>ISRO-IIT Bombay Collaborative Research Initiative</p>
            </div>
            <div className="footer-links">
              <a href="#research">Publications</a>
              <a href="#team">Team</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 IIT Bombay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;