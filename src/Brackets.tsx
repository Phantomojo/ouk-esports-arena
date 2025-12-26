import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, ShieldCheck } from 'lucide-react';

interface BracketNode {
    id: string;
    player1: string;
    player2: string;
    score1?: number;
    score2?: number;
    winner?: 1 | 2;
    nextMatchId?: string;
}

const MOCK_BRACKET_DATA: { [key: string]: BracketNode[] } = {
    'qf': [],
    'sf': [],
    'f': []
};

export function Brackets() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="container animate-fade-in" style={{ padding: '120px 20px 80px' }}>
            <button
                onClick={() => navigate('/tournaments')}
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
                <ArrowLeft size={20} /> Back to Events
            </button>

            <header style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--accent-primary)', marginBottom: '10px' }}>
                    <Trophy size={32} />
                    <h1 style={{ margin: 0 }}>Tournament Brackets</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Live progress of the OUK FIFA 24 Summer Clash.</p>
            </header>

            <div className="bracket-container" style={{
                display: 'flex',
                gap: '40px',
                justifyContent: 'center',
                overflowX: 'auto',
                padding: '60px 0'
            }}>
                {MOCK_BRACKET_DATA.qf.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', maxWidth: '500px' }}>
                        <ShieldCheck size={48} color="var(--accent-secondary)" style={{ marginBottom: '20px' }} />
                        <h3>Bracket Generation Pending</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Matches will be generated once the registration enrollment window closes. Stay sharp.</p>
                    </div>
                ) : (
                    <>
                        {/* Quarter Finals */}
                        <div className="bracket-round">
                            <h3 className="round-title">Quarter-Finals</h3>
                            {MOCK_BRACKET_DATA.qf.map(match => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>

                        {/* Semi Finals */}
                        <div className="bracket-round" style={{ paddingTop: '50px' }}>
                            <h3 className="round-title">Semi-Finals</h3>
                            {MOCK_BRACKET_DATA.sf.map(match => (
                                <MatchCard key={match.id} match={match} isLarge />
                            ))}
                        </div>

                        {/* Finals */}
                        <div className="bracket-round" style={{ paddingTop: '120px' }}>
                            <h3 className="round-title">Grand Finals</h3>
                            {MOCK_BRACKET_DATA.f.map(match => (
                                <MatchCard key={match.id} match={match} isFinal />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function MatchCard({ match, isLarge, isFinal }: { match: BracketNode, isLarge?: boolean, isFinal?: boolean }) {
    return (
        <div className={`glass-panel match-card ${isFinal ? 'final-match' : ''}`} style={{
            width: '220px',
            padding: '0',
            marginBottom: isLarge ? '100px' : '30px',
            borderColor: isFinal ? 'var(--accent-secondary)' : 'var(--glass-border)',
            boxShadow: isFinal ? '0 0 30px rgba(112, 0, 255, 0.2)' : 'none'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 15px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: match.winner === 1 ? 'rgba(0, 242, 255, 0.05)' : 'none'
            }}>
                <span style={{ fontWeight: match.winner === 1 ? 700 : 400, color: match.winner === 1 ? 'var(--accent-primary)' : 'white' }}>
                    {match.player1}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{match.score1}</span>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 15px',
                background: match.winner === 2 ? 'rgba(0, 242, 255, 0.05)' : 'none'
            }}>
                <span style={{ fontWeight: match.winner === 2 ? 700 : 400, color: match.winner === 2 ? 'var(--accent-primary)' : 'white' }}>
                    {match.player2}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{match.score2}</span>
            </div>
            {isFinal && (
                <div style={{ padding: '8px', textAlign: 'center', background: 'var(--accent-secondary)', color: 'white', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Champion Decider
                </div>
            )}
        </div>
    );
}
