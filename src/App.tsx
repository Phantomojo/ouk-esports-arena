import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Gamepad2, Smartphone, Monitor, Trophy, CheckCircle2, BarChart3, Users, User, ShieldCheck, Home, Target, Settings, Newspaper } from 'lucide-react';
import { supabase } from './supabase';
import { Admin } from './Admin';
import { Tournaments } from './Tournaments';
import { Brackets } from './Brackets';
import { Leaderboard } from './Leaderboard';
import { News } from './News';
import { Profile } from './Profile';

const GAMES = [
  'Call of Duty (CODM)',
  'PUBG Mobile',
  'FIFA 24',
  'Free Fire',
  'League of Legends',
  'Mobile Legends',
  'Delta Force',
  'Counter-Strike 2',
  'Valorant',
  'Apex Legends',
  'Fortnite',
  'Other'
];

const DEVICES = [
  { id: 'mobile', name: 'Mobile Phone', icon: Smartphone },
  { id: 'pc', name: 'Gaming PC', icon: Monitor },
  { id: 'console', name: 'Console (PS/Xbox)', icon: Gamepad2 }
];

const SKILL_LEVELS = ['Amateur', 'Semi-Pro', 'Elite'];

interface RegistrationStats {
  game: string;
  count: number;
  percentage: number;
}

function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: 'auto',
      padding: '10px 30px',
      display: 'flex',
      gap: '30px',
      borderRadius: '50px',
      borderWidth: '1px'
    }}>
      <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: location.pathname === '/' ? 'var(--accent-primary)' : 'white', textDecoration: 'none', fontWeight: 600 }}>
        <Home size={18} /> Enrollment
      </Link>
      <Link to="/tournaments" className={`nav-link ${location.pathname.startsWith('/tournaments') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: location.pathname.startsWith('/tournaments') ? 'var(--accent-primary)' : 'white', textDecoration: 'none', fontWeight: 600 }}>
        <Target size={18} /> Tournaments
      </Link>
      <Link to="/leaderboard" className={`nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: location.pathname === '/leaderboard' ? 'var(--accent-primary)' : 'white', textDecoration: 'none', fontWeight: 600 }}>
        <BarChart3 size={18} /> Rankings
      </Link>
      <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: location.pathname === '/news' ? 'var(--accent-primary)' : 'white', textDecoration: 'none', fontWeight: 600 }}>
        <Newspaper size={18} /> Intel
      </Link>
      <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 10px' }}></div>
      <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: location.pathname === '/admin' ? 'var(--accent-primary)' : 'white', textDecoration: 'none', fontWeight: 600 }}>
        <Settings size={18} /> Admin
      </Link>
    </nav>
  );
}

function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    selectedGames: [] as string[],
    otherGame: '',
    deviceId: '',
    skillLevel: 'Amateur',
    entryType: 'Solo'
  });
  const [submitted, setSubmitted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [liveStats, setLiveStats] = useState<RegistrationStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('selected_games');

      if (error) throw error;

      if (data) {
        const gameCounts: { [key: string]: number } = {};
        let totalRegistrations = data.length;

        data.forEach(reg => {
          reg.selected_games.forEach((game: string) => {
            gameCounts[game] = (gameCounts[game] || 0) + 1;
          });
        });

        const statsArray = Object.entries(gameCounts)
          .map(([game, count]) => ({
            game,
            count,
            percentage: totalRegistrations > 0 ? (count / totalRegistrations) * 100 : 0
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setLiveStats(statsArray);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setShowStats(true);
        fetchStats();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const toggleGame = (game: string) => {
    setFormData(prev => {
      const newSelectedGames = prev.selectedGames.includes(game)
        ? prev.selectedGames.filter(g => g !== game)
        : [...prev.selectedGames, game];

      if (game === 'Other' && !newSelectedGames.includes('Other')) {
        return {
          ...prev,
          selectedGames: newSelectedGames,
          otherGame: ''
        };
      }

      return {
        ...prev,
        selectedGames: newSelectedGames
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedGames.length === 0 || !formData.deviceId) {
      alert('Please select at least one game and your device.');
      return;
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .insert([{
          full_name: formData.fullName,
          contact: formData.contact,
          selected_games: formData.selectedGames,
          other_game: formData.otherGame,
          device_id: formData.deviceId,
          skill_level: formData.skillLevel,
          entry_type: formData.entryType
        }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="container animate-fade-in" style={{ padding: '120px 20px 80px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <CheckCircle2 size={64} color="#00f2ff" style={{ marginBottom: '1.5rem' }} />
            <h2>GG, You're Registered!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Welcome to the OUK Esports Arena. Your intel has been logged.
            </p>
          </div>

          {showStats && (
            <div className="glass-panel animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: 'var(--accent-primary)' }}>
                <BarChart3 size={24} />
                <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Community Heatmap</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Real-time data from OUK players:
              </p>

              <div className="stats-container">
                {liveStats.length > 0 ? (
                  liveStats.map(stat => (
                    <div key={stat.game} className="stat-bar-wrapper">
                      <div className="stat-label">
                        <span>{stat.game}</span>
                        <span>{stat.count} Players</span>
                      </div>
                      <div className="stat-bar-bg">
                        <div className="stat-bar-fill" style={{ width: `${stat.percentage}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Calculating community trends...</p>
                )}
              </div>

              <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--accent-secondary)' }} />
                Matches are currently being seeded based on skill levels.
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '30px' }}
                onClick={() => { setSubmitted(false); setShowStats(false); }}
              >
                Back to Registration
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '120px 20px 80px' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '15px' }}>
          <Trophy size={24} />
          <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 600 }}>OUK Esports Arena</span>
        </div>
        <div className="manifesto-card">
          <p className="manifesto-text">
            "You asked for a better community and for tournaments. I heard you. Now, it's time that we as a community build what we want and need."
          </p>
        </div>
        <h1 style={{ marginTop: '30px' }}>Command Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Welcome to the foundation of the OUK competitive scene. Register your arsenal and help shape our future.
        </p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="glass-panel">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div className="form-group">
              <label>Full Player Name</label>
              <input
                type="text"
                placeholder="e.g. John 'Ghost' Doe"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>WhatsApp / Discord</label>
              <input
                type="text"
                placeholder="e.g. +254..."
                required
                value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div className="form-group">
              <label>Experience Level</label>
              <div className="skill-grid">
                {SKILL_LEVELS.map(level => (
                  <div
                    key={level}
                    className={`skill-option ${formData.skillLevel === level ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, skillLevel: level })}
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Tournament Entry</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <div
                  className={`glass-panel ${formData.entryType === 'Solo' ? 'active' : ''}`}
                  style={{
                    flex: 1, padding: '12px', textAlign: 'center', cursor: 'pointer',
                    borderColor: formData.entryType === 'Solo' ? 'var(--accent-primary)' : 'var(--glass-border)',
                    backgroundColor: formData.entryType === 'Solo' ? 'rgba(0, 242, 255, 0.1)' : 'var(--glass-bg)',
                  }}
                  onClick={() => setFormData({ ...formData, entryType: 'Solo' })}
                >
                  <User size={18} style={{ marginBottom: '5px' }} />
                  <div style={{ fontSize: '0.9rem' }}>Solo</div>
                </div>
                <div
                  className={`glass-panel ${formData.entryType === 'Team' ? 'active' : ''}`}
                  style={{
                    flex: 1, padding: '12px', textAlign: 'center', cursor: 'pointer',
                    borderColor: formData.entryType === 'Team' ? 'var(--accent-primary)' : 'var(--glass-border)',
                    backgroundColor: formData.entryType === 'Team' ? 'rgba(0, 242, 255, 0.1)' : 'var(--glass-bg)',
                  }}
                  onClick={() => setFormData({ ...formData, entryType: 'Team' })}
                >
                  <Users size={18} style={{ marginBottom: '5px' }} />
                  <div style={{ fontSize: '0.9rem' }}>Team</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '40px' }}>
            <label>Select Your Games</label>
            <div className="chip-container">
              {GAMES.map(game => (
                <div
                  key={game}
                  className={`chip ${formData.selectedGames.includes(game) ? 'active' : ''}`}
                  onClick={() => toggleGame(game)}
                >
                  {game}
                </div>
              ))}
            </div>

            {formData.selectedGames.includes('Other') && (
              <div className="custom-game-input">
                <input
                  type="text"
                  placeholder="Tell us what you play..."
                  value={formData.otherGame}
                  onChange={e => setFormData({ ...formData, otherGame: e.target.value })}
                  autoFocus
                />
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '40px' }}>
            <label>Your Battle Station</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              {DEVICES.map(device => {
                const Icon = device.icon;
                return (
                  <div
                    key={device.id}
                    className={`glass-panel ${formData.deviceId === device.id ? 'active' : ''}`}
                    style={{
                      padding: '20px', textAlign: 'center', cursor: 'pointer',
                      borderColor: formData.deviceId === device.id ? 'var(--accent-primary)' : 'var(--glass-border)',
                      backgroundColor: formData.deviceId === device.id ? 'rgba(0, 242, 255, 0.1)' : 'var(--glass-bg)',
                    }}
                    onClick={() => setFormData({ ...formData, deviceId: device.id })}
                  >
                    <Icon size={32} style={{ marginBottom: '10px', color: formData.deviceId === device.id ? 'var(--accent-primary)' : 'white' }} />
                    <div style={{ fontWeight: 600 }}>{device.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', maxWidth: '350px', fontSize: '1.2rem' }}>
              Confirm Enrollment
            </button>
          </div>
        </form>
      </main>

      <footer style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>© 2025 OUK Esports Community. Built for Champions.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/bracket/:id" element={<Brackets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/news" element={<News />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
