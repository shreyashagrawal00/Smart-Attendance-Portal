import React from 'react';

const StatsCard = ({ title, value, icon, color, trend }) => {
    return (
        <div className="stats-card glass">
            <div className="stats-info">
                <span className="stats-title">{title}</span>
                <h2 className="stats-value">{value}</h2>
                {trend && (
                    <span className={`stats-trend ${trend.positive ? 'up' : 'down'}`}>
                        {trend.positive ? '+' : '-'}{trend.value}% vs last month
                    </span>
                )}
            </div>
            <div className="stats-icon" style={{ backgroundColor: `${color}15`, color: color }}>
                {icon}
            </div>
            <style>{`
                .stats-card {
                    padding: 1.5rem;
                    border-radius: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                }
                .stats-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                }
                .stats-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .stats-title {
                    font-size: 0.875rem;
                    color: var(--text-main);
                    opacity: 0.7;
                    font-weight: 500;
                }
                .stats-value {
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin: 2px 0;
                }
                .stats-trend {
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .stats-trend.up { color: var(--success); }
                .stats-trend.down { color: var(--danger); }
                .stats-icon {
                    width: 54px;
                    height: 54px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
};

export default StatsCard;
