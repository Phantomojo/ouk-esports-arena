import React from 'react';
import { Trophy, Medal, Star, TrendingUp, User, Users } from 'lucide-react';

import { supabase, isConfigured } from './supabase';

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

        if (isConfigured) {
            fetchLeaders();
        } else {
            console.warn('[Leaderboard] Skipping fetch - Supabase not configured');
            setLoading(false);
        }
    }, []);
    return (
        <div className="container animate-fade-in" style={{ padding: '120px 20px 80px' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '15px' }}>
                    <Users size={24} />
                    <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 600 }}>OUK Community</span>
                </div>
                <h1>Arena Roster</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Meet the players shaping the OUK competitive scene. Ranks will activate once official tournaments commence.
                </p>
            </header>

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', maxWidth: '1000px', margin: '0 auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '20px' }}>Player</th>
                            <th style={{ padding: '20px' }}>Tier</th>
                            <th style={{ padding: '20px' }}>Battle Stations</th>
                            <th style={{ padding: '20px' }}>Entry Type</th>
                            <th style={{ padding: '20px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                                    <div className="animate-pulse">Retrieving elite roster...</div>
                                </td>
                            </tr>
                        ) : leaders.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                                    <Users size={32} style={{ marginBottom: '15px', opacity: 0.5 }} />
                                    <p>Intel gathering in progress. No players found yet.</p>
                                </td>
                            </tr>
                        ) : leaders.map((player) => (
                            <tr key={player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row-hover">
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={20} color="var(--accent-primary)" />
                                        </div>
                                        <div>
                                            <div
                                                style={{ fontWeight: 700, color: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                                                onClick={() => window.location.href = `/profile/${player.id}`}
                                            >
                                                {player.full_name}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{player.selected_games[0]}{player.selected_games.length > 1 ? ` +${player.selected_games.length - 1}` : ''}</div>
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
                                <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {player.device_ids?.map((id: string) => (
                                            <span key={id} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                                                {id.toUpperCase()}
                                            </span>
                                        ))}
                                        {(!player.device_ids || player.device_ids.length === 0) && <span style={{ fontSize: '0.75rem' }}>{player.device_id?.toUpperCase() || 'N/A'}</span>}
                                    </div>
                                </td>
                                <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>
                                    {player.entry_type}
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)', fontSize: '0.9rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-secondary)', boxShadow: '0 0 10px var(--accent-secondary)' }}></div>
                                        Active
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    * Official rankings will be calculated based on tournament performance.
                </p>
            </div>
        </div>
    );
}
