import React from 'react';
import { Award, Globe, BookOpen, GraduationCap, MapPin, Target, Users, Landmark } from 'lucide-react';

const About = () => {
    return (
        <div className="about-page fade-in">
            <div className="about-hero glass">
                <div className="hero-content">
                    <div className="hero-badge">NAAC A+ Accredited</div>
                    <GraduationCap size={56} className="hero-icon" />
                    <h1>GLA University, Mathura</h1>
                    <p className="hero-subtitle">Cultivating Excellence, Empowering Innovation Since 1998</p>
                </div>
            </div>

            <div className="about-grid">
                <section className="info-card glass">
                    <div className="card-header">
                        <Landmark size={24} />
                        <h2>Our Heritage</h2>
                    </div>
                    <div className="card-body">
                        <p>
                            GLA University's legacy began in 1998 with the vision of Shri Narayan Das Agrawal to provide quality technical education in the Braj region. 
                            Named in honor of Late Shri Ganeshi Lal Agrawal, the institution evolved from a standalone institute to a comprehensive University in 2010. 
                            Today, it stands as a testament to transformative education and academic rigor.
                        </p>
                    </div>
                </section>

                <section className="info-card glass">
                    <div className="card-header">
                        <Target size={24} />
                        <h2>Mission & Vision</h2>
                    </div>
                    <div className="card-body">
                        <p>
                            To be a pace-setting university committed to academic excellence, research, and development. 
                            We aim to cultivate a community of global professionals who are ethically sound and technically proficient, 
                            capable of driving positive social change and industrial innovation through lifelong learning.
                        </p>
                    </div>
                </section>
            </div>

            <div className="campus-stats-grid">
                <div className="impact-stat glass">
                    <span className="impact-num">110+</span>
                    <span className="impact-label">Acre Campus</span>
                </div>
                <div className="impact-stat glass">
                    <span className="impact-num">80+</span>
                    <span className="impact-label">Total Programs</span>
                </div>
                <div className="impact-stat glass">
                    <span className="impact-num">135+</span>
                    <span className="impact-label">Research Labs</span>
                </div>
                <div className="impact-stat glass">
                    <span className="impact-num">A+</span>
                    <span className="impact-label">NAAC Grade</span>
                </div>
            </div>

            <div className="accreditation-grid">
                <section className="accreditation-card glass">
                    <div className="card-header">
                        <Award size={24} />
                        <h2>Global Accreditations</h2>
                    </div>
                    <div className="accreditation-list">
                        <div className="acc-item">
                            <div className="check-box">✓</div>
                            <span>Approved by UGC - 12B Status</span>
                        </div>
                        <div className="acc-item">
                            <div className="check-box">✓</div>
                            <span>AICTE Approved Engineering Programs</span>
                        </div>
                        <div className="acc-item">
                            <div className="check-box">✓</div>
                            <span>Accredited with 'A+' Grade by NAAC</span>
                        </div>
                        <div className="acc-item">
                            <div className="check-box">✓</div>
                            <span>Member of Association of Indian Universities</span>
                        </div>
                    </div>
                </section>

                <section className="location-card glass">
                    <div className="card-header">
                        <MapPin size={24} />
                        <h2>Our Location</h2>
                    </div>
                    <div className="location-content">
                        <p>
                            Nestled in the spiritual heartland of Mathura, our campus provides an ideal environment for intellectual growth and personal development.
                        </p>
                        <div className="address-box">
                            <strong>GLA University</strong><br />
                            17km Stone, NH-2, Mathura-Delhi Road<br />
                            P.O. Chaumuhan, Mathura, U.P. 281406
                        </div>
                    </div>
                </section>
            </div>

            <style>{`
                .about-page {
                    display: flex;
                    flex-direction: column;
                    gap: 1.75rem;
                    padding-bottom: 2rem;
                }
                .about-hero {
                    padding: 4rem 2rem;
                    border-radius: var(--radius-xl);
                    text-align: center;
                    background-image: linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.3)), url('/assets/campus_4k.png');
                    background-size: cover;
                    background-position: center;
                }
                .hero-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .hero-badge {
                    background: var(--primary);
                    color: white;
                    padding: 4px 14px;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                .hero-icon { color: var(--primary); margin-bottom: 0.5rem; }
                .about-hero h1 { font-size: 2.75rem; color: var(--text-main); line-height: 1.1; }
                .hero-subtitle { font-size: 1.1rem; color: var(--text-muted); font-weight: 500; }

                .about-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .info-card { padding: 2rem; border-radius: var(--radius-xl); }
                .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; color: var(--primary); }
                .card-header h2 { font-size: 1.25rem; font-weight: 700; }
                .card-body p { line-height: 1.7; font-size: 0.95rem; color: var(--text-sub); }

                .campus-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }
                .impact-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1.75rem;
                    border-radius: var(--radius-lg);
                    text-align: center;
                }
                .impact-num {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--primary);
                    font-family: 'Outfit', sans-serif;
                    line-height: 1;
                }
                .impact-label {
                    margin-top: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .accreditation-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 1.5rem;
                }
                .accreditation-card, .location-card { padding: 2rem; border-radius: var(--radius-xl); }
                
                .accreditation-list { display: flex; flex-direction: column; gap: 1rem; }
                .acc-item { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.9rem; color: var(--text-main); }
                .check-box {
                    width: 22px; height: 22px; background: var(--success-bg); color: var(--success);
                    border-radius: 6px; display: flex; align-items: center; justify-content: center;
                    font-size: 0.8rem; flex-shrink: 0;
                }

                .location-content { display: flex; flex-direction: column; gap: 1.25rem; }
                .location-content p { font-size: 0.9rem; color: var(--text-sub); line-height: 1.6; }
                .address-box {
                    padding: 1rem; background: var(--bg-subtle); border-radius: var(--radius-md);
                    font-size: 0.85rem; color: var(--text-muted); border: 1px dashed var(--border-strong);
                }

                @media (max-width: 900px) {
                    .about-grid, .campus-stats-grid, .accreditation-grid { grid-template-columns: 1fr; }
                    .about-hero h1 { font-size: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default About;
