import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Shield, Target, Trophy, ArrowLeft, Gamepad2, Smartphone, Monitor } from 'lucide-react';
import { supabase } from './supabase';

export function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setPlayer(data);
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
                <p>Retrieving player intel...</p>
            </div>
        );
    }

    if (!player) {
        return (
            <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
                <h2>Player Not Found</h2>
                <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '20px' }}>
                    Back to Arena
                </button>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '120px 20px 80px' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: '30px',
                    padding: 0,
                    fontSize: '1rem',
                    fontWeight: 600
                }}
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'var(--glass-bg)',
                        border: '2px solid var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0, 242, 255, 0.2)'
                    }}>
                        <User size={64} color="var(--accent-primary)" />
                    </div>

                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{player.full_name}</h1>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: 'rgba(112, 0, 255, 0.1)',
                                color: 'var(--accent-secondary)',
                                border: '1px solid var(--accent-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: 700
                            }}>
                                {player.skill_level}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>OUK Arena Combatant since {new Date(player.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
                    <div className="glass-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '20px' }}>
                            <Gamepad2 size={24} />
                            <h3 style={{ margin: 0 }}>Arsenal</h3>
                        </div>
                        <div className="chip-container">
                            {player.selected_games.map((game: string) => (
                                <div key={game} className="chip active">{game}</div>
                            ))}
                            {player.other_game && <div className="chip active">{player.other_game}</div>}
                        </div>
                    </div>

                    <div className="glass-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-secondary)', marginBottom: '20px' }}>
                            <Target size={24} />
                            <h3 style={{ margin: 0 }}>Battle Station</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(player.device_ids || [player.device_id]).map((id: string) => (
                                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                                    {id === 'pc' && <Monitor size={24} color="var(--accent-primary)" />}
                                    {id === 'mobile' && <Smartphone size={24} color="var(--accent-secondary)" />}
                                    {id === 'console' && <Gamepad2 size={24} color="var(--accent-primary)" />}
                                    <div>
                                        <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.9rem' }}>{id} Gaming</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tactically Optimized</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '20px' }}>
                        <Trophy size={24} />
                        <h3 style={{ margin: 0 }}>Tournament History</h3>
                    </div>
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <Shield size={48} style={{ opacity: 0.2, marginBottom: '15px' }} />
                        <p>No tournament records found yet. First event coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
