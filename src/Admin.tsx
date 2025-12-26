import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
    Users,
    Search,
    Download,
    Filter,
    ArrowLeft,
    LogOut,
    Lock,
    Calendar,
    Contact,
    Gamepad2,
    Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Registration {
    id: string;
    full_name: string;
    contact: string;
    selected_games: string[];
    other_game: string;
    device_id: string;
    skill_level: string;
    entry_type: string;
    created_at: string;
}

export function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGame, setFilterGame] = useState('All');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'ouk-admin-2025') { // Static password for MVP
            setIsAuthenticated(true);
            fetchRegistrations();
        } else {
            alert('Access Denied: Incorrect Override Code.');
        }
    };

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data || []);
        } catch (err) {
            console.error('Error fetching registrations:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch = reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.contact.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterGame === 'All' || reg.selected_games.includes(filterGame);
        return matchesSearch && matchesFilter;
    });

    const exportData = () => {
        const dataStr = JSON.stringify(registrations, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'ouk_registrations.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    if (!isAuthenticated) {
        return (
            <div className="container animate-fade-in" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '40px' }}>
                    <div className="manifesto-card" style={{ marginBottom: '30px' }}>
                        <Lock size={40} color="var(--accent-primary)" style={{ margin: '0 auto' }} />
                    </div>
                    <h2 style={{ marginBottom: '10px' }}>Admin Access</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.9rem' }}>
                        Enter the OUK Override Code to access the command dashboard.
                    </p>
                    <form onSubmit={handleLogin}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <input
                                type="password"
                                placeholder="Enter Access Key"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ textAlign: 'center' }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Initiate Access</button>
                        <button
                            type="button"
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '10px', background: 'transparent', border: '1px solid var(--glass-border)' }}
                            onClick={() => navigate('/')}
                        >
                            Back to Base
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '5px' }}>
                        <Trophy size={20} />
                        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, fontSize: '0.8rem' }}>OUK Admin Dashboard</span>
                    </div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>Registration HQ</h1>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" onClick={exportData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                        <Download size={18} /> Export JSON
                    </button>
                    <button
                        className="btn-primary"
                        style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', color: '#ff4444' }}
                        onClick={() => setIsAuthenticated(false)}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ marginBottom: '30px', padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div className="form-group">
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search players..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '45px' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div style={{ position: 'relative' }}>
                            <Filter size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <select
                                value={filterGame}
                                onChange={(e) => setFilterGame(e.target.value)}
                                style={{ paddingLeft: '45px', width: '100%', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px 12px 12px 45px', borderRadius: '8px' }}
                            >
                                <option value="All">All Games</option>
                                <option value="FIFA 24">FIFA 24</option>
                                <option value="Call of Duty (CODM)">CODM</option>
                                <option value="PUBG Mobile">PUBG Mobile</option>
                                <option value="Valorant">Valorant</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '20px' }}><Users size={16} style={{ marginRight: '8px' }} /> Player</th>
                            <th style={{ padding: '20px' }}><Contact size={16} style={{ marginRight: '8px' }} /> Contact</th>
                            <th style={{ padding: '20px' }}><Gamepad2 size={16} style={{ marginRight: '8px' }} /> Games</th>
                            <th style={{ padding: '20px' }}>Skill</th>
                            <th style={{ padding: '20px' }}>Type</th>
                            <th style={{ padding: '20px' }}><Calendar size={16} style={{ marginRight: '8px' }} /> Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                    Intercepting player data...
                                </td>
                            </tr>
                        ) : filteredRegistrations.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                    No player files found matching these parameters.
                                </td>
                            </tr>
                        ) : (
                            filteredRegistrations.map(reg => (
                                <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row-hover">
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: 600 }}>{reg.full_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>{reg.device_id.toUpperCase()}</div>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>{reg.contact}</td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {reg.selected_games.map(game => (
                                                <span key={game} style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--accent-primary)', borderRadius: '4px', border: '1px solid rgba(0, 242, 255, 0.2)' }}>
                                                    {game}
                                                </span>
                                            ))}
                                            {reg.other_game && (
                                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(112, 0, 255, 0.1)', color: 'var(--accent-secondary)', borderRadius: '4px', border: '1px solid rgba(112, 0, 255, 0.2)' }}>
                                                    {reg.other_game}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            background: reg.skill_level === 'Elite' ? 'rgba(255, 171, 0, 0.1)' : 'rgba(255,255,255,0.05)',
                                            color: reg.skill_level === 'Elite' ? '#ffab00' : 'white',
                                            border: reg.skill_level === 'Elite' ? '1px solid #ffab00' : '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {reg.skill_level}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>{reg.entry_type}</td>
                                    <td style={{ padding: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(reg.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
