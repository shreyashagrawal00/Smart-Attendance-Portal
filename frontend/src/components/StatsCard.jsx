import React from 'react';

const StatsCard = ({ title, value, icon, color, trend }) => {
    return (
        <div className="stats-card">
            <div className="stats-top">
                <span className="stats-title">{title}</span>
                <div className="stats-icon-wrap" style={{ background: `${color}15`, color }}>
                    {icon}
                </div>
            </div>
            <div className="stats-bottom">
                <h2 className="stats-value">{value}</h2>
                {trend && (
                    <span className={`stats-trend ${trend.positive ? 'up' : 'down'}`}>
                        {trend.positive ? '↑' : '↓'} {trend.value}%&nbsp;
                        <span className="trend-label">vs last month</span>
                    </span>
                )}
            </div>

            <style>{`
                .stats-card {
                    background: var(--bg-card);
                    padding: 1.375rem 1.5rem;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    gap: 0.875rem;
                    transition: all 0.25s ease;
                    box-shadow: var(--shadow);
                }
                .stats-card:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--border-strong);
                }
                .stats-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .stats-title {
                    font-size: 0.825rem;
                    font-weight: 700;
                    color: var(--text-sub);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .stats-icon-wrap {
                    width: 42px;
                    height: 42px;
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .stats-bottom {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .stats-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-main);
                    line-height: 1;
                    font-family: 'Outfit', sans-serif;
                }
                .stats-trend {
                    font-size: 0.775rem;
                    font-weight: 600;
                }
                .stats-trend.up { color: var(--success); }
                .stats-trend.down { color: var(--danger); }
                .trend-label {
                    font-weight: 400;
                    color: var(--text-muted);
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
};

export default StatsCard;
