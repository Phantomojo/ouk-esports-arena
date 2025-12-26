import React from 'react';
import { Trophy, Users, Calendar, ArrowRight, Gamepad2 } from 'lucide-react';

const MOCK_TOURNAMENTS: any[] = []; // Clear for launch

export function Tournaments() {
    return (
        <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
            <header style={{ marginBottom: '60px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '15px' }}>
                    <Trophy size={24} />
                    <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 600 }}>OUK Arena Events</span>
                </div>
                <h1>Active Tournaments</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
                    The road to OUK greatness starts here. Join an active bracket or view the results of past battles.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                {MOCK_TOURNAMENTS.length > 0 ? (
                    MOCK_TOURNAMENTS.map(trny => (
                        <div key={trny.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <span style={{
                                        background: 'rgba(0, 242, 255, 0.1)',
                                        color: 'var(--accent-primary)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        border: '1px solid rgba(0, 242, 255, 0.2)'
                                    }}>
                                        {trny.game}
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{trny.date}</span>
                                </div>

                                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{trny.title}</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                                        <Users size={18} />
                                        <span>{trny.enrolled}/{trny.maxPlayers} Players</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-secondary)' }}>
                                        <Trophy size={18} />
                                        <span>{trny.prize}</span>
                                    </div>
                                </div>

                                <div className="stat-bar-bg" style={{ marginBottom: '30px', height: '6px' }}>
                                    <div
                                        className="stat-bar-fill"
                                        style={{ width: `${(trny.enrolled / trny.maxPlayers) * 100}%`, height: '100%' }}
                                    ></div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-primary" style={{ flex: 2 }}>Enter Tournament</button>
                                    <button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                                        Brackets
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', gridColumn: '1 / -1' }}>
                        <Calendar size={48} color="var(--accent-primary)" style={{ marginBottom: '20px' }} />
                        <h3>No Active Tournaments</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>We are currently seeding matches based on registrations. Check back soon!</p>
                    </div>
                )}

                <div
                    className="glass-panel"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        minHeight: '300px',
                        borderStyle: 'dashed',
                        opacity: 0.7
                    }}
                >
                    <Gamepad2 size={48} style={{ marginBottom: '20px', color: 'var(--text-secondary)' }} />
                    <h3>Host Your Own?</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                        Got a community event idea? Contact OUK Admins to launch your tournament page.
                    </p>
                    <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>
                        Request Event
                    </button>
                </div>
            </div>
        </div>
    );
}
