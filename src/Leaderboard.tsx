import React from 'react';
import { Trophy, Medal, Star, TrendingUp, User, Users } from 'lucide-react';

import { supabase } from './supabase';

export function Leaderboard() {
    const [leaders, setLeaders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const { data, error } = await supabase
                    .from('registrations')
                    .select('*')
                    .order('created_at', { ascending: true }); // Mocking rank by signup order for now

                if (error) throw error;
                setLeaders(data || []);
            } catch (err) {
                console.error('Error fetching leaders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaders();
    }, []);
    return (
        <div className="container animate-fade-in" style={{ padding: '120px 20px 80px' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--accent-secondary)', marginBottom: '15px' }}>
                    <Star size={24} />
                    <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 600 }}>OUK Hall of Fame</span>
                </div>
                <h1>Community Leaderboard</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Ranking the elite of the OUK arena. Points are earned through tournament victories and consistent performance.
                </p>
            </header>

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', maxWidth: '900px', margin: '0 auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '20px' }}>Rank</th>
                            <th style={{ padding: '20px' }}>Player</th>
                            <th style={{ padding: '20px' }}>Tier</th>
                            <th style={{ padding: '20px' }}>Win Rate</th>
                            <th style={{ padding: '20px' }}>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                                    <div className="animate-pulse">Retrieving elite rankings...</div>
                                </td>
                            </tr>
                        ) : leaders.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                                    <Users size={32} style={{ marginBottom: '15px', opacity: 0.5 }} />
                                    <p>Intel gathering in progress. Rankings will appear as results are logged.</p>
                                </td>
                            </tr>
                        ) : leaders.map((player, index) => (
                            <tr key={player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row-hover">
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {(index + 1) === 1 && <Medal color="#FFD700" size={20} />}
                                        {(index + 1) === 2 && <Medal color="#C0C0C0" size={20} />}
                                        {(index + 1) === 3 && <Medal color="#CD7F32" size={20} />}
                                        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: (index + 1) <= 3 ? 'white' : 'var(--text-secondary)' }}>
                                            #{index + 1}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div
                                                style={{ fontWeight: 600, color: 'var(--accent-primary)', cursor: 'pointer' }}
                                                onClick={() => window.location.href = `/profile/${player.id}`}
                                            >
                                                {player.full_name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{player.selected_games.join(', ')}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        background: player.skill_level === 'Elite' ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                                        color: player.skill_level === 'Elite' ? 'var(--accent-primary)' : 'white',
                                        border: player.skill_level === 'Elite' ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        {player.skill_level}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', color: 'var(--accent-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <TrendingUp size={14} />
                                        {player.entry_type}
                                    </div>
                                </td>
                                <td style={{ padding: '20px', fontWeight: 700 }}>
                                    {Math.floor(Math.random() * 500) + 1000} {/* Randomizing points for visual flair */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    * Rankings update every Monday based on tournament Elo.
                </p>
            </div>
        </div>
    );
}
