import React from 'react';
import { Newspaper, Bell, Calendar, Youtube, Terminal, ArrowRight } from 'lucide-react';

const MOCK_NEWS = [
    {
        id: '1',
        title: 'The Arena is Officially Live!',
        date: 'Dec 26, 2025',
        category: 'Announcement',
        content: 'Welcome to the new OUK Esports Command Center. Register now for the first wave of tournaments.',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'FIFA 24 Prize Pool Update',
        date: 'Dec 24, 2025',
        category: 'Tournament',
        content: 'The Summer Clash prize pool has been increased thanks to our new community sponsors!',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop'
    }
];

export function News() {
    return (
        <div className="container animate-fade-in" style={{ padding: '120px 20px 80px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                {/* News Feed */}
                <div style={{ gridColumn: 'span 2' }}>
                    <header style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '10px' }}>
                            <Newspaper size={24} />
                            <span style={{ textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 600 }}>Intel Feed</span>
                        </div>
                        <h1>Arena Updates</h1>
                    </header>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {MOCK_NEWS.map(post => (
                            <div key={post.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: '200px', height: 'auto', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '10px' }}>
                                        <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{post.category}</span>
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 style={{ marginBottom: '15px' }}>{post.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                                        {post.content}
                                    </p>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600 }}>
                                        Read Full Intel <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="glass-panel" style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-secondary)', marginBottom: '20px' }}>
                            <Youtube size={20} />
                            <h3 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase' }}>Live from the Pit</h3>
                        </div>

                        {/* Live Stream Placeholder */}
                        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                                    <div style={{ width: '0', height: '0', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid white', marginLeft: '5px' }}></div>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>STREAM OFFLINE</span>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Check back during match hours.</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '20px' }}>
                            <Calendar size={20} />
                            <h3 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase' }}>Upcoming Scrims</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>Tomorrow @ 20:00</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Apex Legends Open Scrims</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
