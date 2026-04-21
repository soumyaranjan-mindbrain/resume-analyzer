import React from 'react';

/**
 * PIN-POINT ACCURACY CORPORATE BLUEPRINTS
 * Strictly A4: 210mm x 297mm
 * These templates follow industry-standard typography and layout conventions
 * for high-end professional and executive roles.
 */

// Global Typography Standards
const fonts = {
    serif: "'EB Garamond', 'Georgia', serif",
    sans: "'Inter', 'Helvetica', 'Arial', sans-serif",
};

// --- Template 1: The Global Executive (Traditional & Serif) ---
export const Template1 = ({ data }) => (
    <div
        className="bg-white mx-auto print:shadow-none print:border-none"
        style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '25mm 20mm',
            fontFamily: fonts.serif,
            color: '#1a1a1a',
            lineHeight: '1.4',
            position: 'relative',
            boxSizing: 'border-box'
        }}
    >
        {/* Header - Centered & Traditional */}
        <header style={{ textAlign: 'center', marginBottom: '8mm' }}>
            <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {data.fullName || 'YOUR NAME'}
            </h1>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '3mm' }}>
                {data.location} • {data.phone} • {data.email}
                {(data.linkedin || data.github) && (
                    <> • {data.linkedin} {data.github && `• ${data.github}`}</>
                )}
            </div>
            <div style={{ height: '0.5pt', backgroundColor: '#000', width: '100%' }} />
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
            {/* Summary */}
            <section>
                <p style={{ fontSize: '10pt', fontStyle: 'italic', textAlign: 'justify', margin: 0 }}>
                    {data.summary}
                </p>
            </section>

            {/* Experience */}
            <section>
                <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '0.5pt solid #000', marginBottom: '3mm', letterSpacing: '0.5px' }}>
                    Professional Experience
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5mm' }}>
                    {(data.experience || []).slice(0, 4).map((exp, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline', fontWeight: 'bold', fontSize: '10pt' }}>
                                <div style={{ flex: 1 }}>{exp.company}</div>
                                <div style={{ textAlign: 'right', fontStyle: 'italic' }}>{exp.startDate} – {exp.endDate}</div>
                            </div>
                            <div style={{ fontSize: '10pt', fontWeight: '600', marginBottom: '1.5mm' }}>{exp.role}</div>
                            <ul style={{ margin: 0, paddingLeft: '5mm', fontSize: '9.5pt', listStyleType: 'disc' }}>
                                {(exp.highlights || []).slice(0, 3).map((h, j) => (
                                    <li key={j} style={{ marginBottom: '0.8mm' }}>{h}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills */}
            <section>
                <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '0.5pt solid #000', marginBottom: '2mm', letterSpacing: '0.5px' }}>
                    Core Competencies
                </h2>
                <p style={{ fontSize: '9.5pt', margin: 0 }}>
                    {(data.skills || []).join(' • ')}
                </p>
            </section>

            {/* Education */}
            <section>
                <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '0.5pt solid #000', marginBottom: '2mm', letterSpacing: '0.5px' }}>
                    Education
                </h2>
                {(data.education || []).slice(0, 2).map((edu, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'between', fontSize: '10pt', marginBottom: '1mm' }}>
                        <div style={{ flex: 1 }}><strong>{edu.university}</strong>, {edu.degree}</div>
                        <div style={{ textAlign: 'right' }}>{edu.year}</div>
                    </div>
                ))}
            </section>
        </main>
    </div>
);

// --- Template 2: The Modern Corporate (Left-Aligned & Sans) ---
export const Template2 = ({ data }) => (
    <div
        className="bg-white mx-auto print:shadow-none print:border-none"
        style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            fontFamily: fonts.sans,
            color: '#1e293b',
            lineHeight: '1.5',
            boxSizing: 'border-box'
        }}
    >
        <header style={{ marginBottom: '10mm' }}>
            <h1 style={{ fontSize: '26pt', fontWeight: '900', color: '#0f172a', margin: '0 0 1mm 0', letterSpacing: '-0.5px' }}>
                {data.fullName}
            </h1>
            <p style={{ fontSize: '11pt', fontWeight: '600', color: '#3b82f6', margin: '0 0 4mm 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {data.targetRole}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4mm 2mm', fontSize: '9pt', color: '#64748b' }}>
                <span>{data.email}</span>
                <span>|</span>
                <span>{data.phone}</span>
                <span>|</span>
                <span>{data.location}</span>
                {data.linkedin && <><span>|</span><span>{data.linkedin}</span></>}
                {data.github && <><span>|</span><span>{data.github}</span></>}
            </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8mm' }}>
            <section>
                <h2 style={{ fontSize: '10pt', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', borderLeft: '4px solid #3b82f6', paddingLeft: '3mm', marginBottom: '4mm', letterSpacing: '1px' }}>
                    Executive Summary
                </h2>
                <p style={{ fontSize: '10pt', color: '#334155' }}>{data.summary}</p>
            </section>

            <section>
                <h2 style={{ fontSize: '10pt', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', borderLeft: '4px solid #3b82f6', paddingLeft: '3mm', marginBottom: '4mm', letterSpacing: '1px' }}>
                    Professional History
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
                    {(data.experience || []).slice(0, 3).map((exp, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
                                <span style={{ fontWeight: '800', fontSize: '11pt' }}>{exp.role}</span>
                                <span style={{ fontSize: '9pt', fontWeight: '700', color: '#64748b' }}>{exp.startDate} — {exp.endDate}</span>
                            </div>
                            <div style={{ fontWeight: '700', fontSize: '10pt', color: '#3b82f6', marginBottom: '2mm' }}>{exp.company}</div>
                            <ul style={{ margin: 0, paddingLeft: '4mm', listStyleType: 'square', color: '#475569', fontSize: '9.5pt' }}>
                                {(exp.highlights || []).slice(0, 3).map((h, j) => (
                                    <li key={j} style={{ marginBottom: '1mm' }}>{h}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8mm' }}>
                <section>
                    <h2 style={{ fontSize: '10pt', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', borderLeft: '4px solid #3b82f6', paddingLeft: '3mm', marginBottom: '4mm', letterSpacing: '1px' }}>
                        Expertise
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
                        {(data.skills || []).slice(0, 12).map((s, i) => (
                            <span key={i} style={{ fontSize: '8.5pt', fontWeight: '700', bg: '#f1f5f9', color: '#475569', padding: '1mm 3mm', borderRadius: '1mm', border: '1px solid #e2e8f0' }}>
                                {s}
                            </span>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 style={{ fontSize: '10pt', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', borderLeft: '4px solid #3b82f6', paddingLeft: '3mm', marginBottom: '4mm', letterSpacing: '1px' }}>
                        Education
                    </h2>
                    {(data.education || []).slice(0, 2).map((edu, i) => (
                        <div key={i} style={{ marginBottom: '3mm' }}>
                            <div style={{ fontWeight: '800', fontSize: '9.5pt' }}>{edu.degree}</div>
                            <div style={{ fontSize: '8.5pt', color: '#64748b' }}>{edu.university} • {edu.year}</div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    </div>
);

// --- Template 3: The Functional Clean (Sober & ATS Optimized) ---
export const Template3 = ({ data }) => (
    <div
        className="bg-white mx-auto print:shadow-none print:border-none"
        style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            fontFamily: fonts.sans,
            color: '#000',
            lineHeight: '1.4',
            boxSizing: 'border-box'
        }}
    >
        <header style={{ borderBottom: '2px solid #000', paddingBottom: '4mm', marginBottom: '6mm' }}>
            <h1 style={{ fontSize: '22pt', fontWeight: 'bold', margin: 0 }}>{data.fullName}</h1>
            <div style={{ fontSize: '10pt', marginTop: '2mm', display: 'flex', flexWrap: 'wrap', gap: '3mm' }}>
                <span>{data.location}</span>
                <span>|</span>
                <span>{data.phone}</span>
                <span>|</span>
                <span>{data.email}</span>
                {data.linkedin && <><span>|</span><span>{data.linkedin}</span></>}
                {data.github && <><span>|</span><span>{data.github}</span></>}
            </div>
        </header>

        <section style={{ marginBottom: '6mm' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2mm' }}>Professional Summary</h2>
            <p style={{ fontSize: '10pt', textAlign: 'justify' }}>{data.summary}</p>
        </section>

        <section style={{ marginBottom: '6mm' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '1mm', marginBottom: '3mm' }}>Work Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm' }}>
                {(data.experience || []).slice(0, 4).map((exp, i) => (
                    <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10pt' }}>
                            <span>{exp.company}</span>
                            <span>{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div style={{ fontStyle: 'italic', fontSize: '10pt', marginBottom: '1.5mm' }}>{exp.role}</div>
                        <ul style={{ margin: 0, paddingLeft: '5mm', fontSize: '9.5pt' }}>
                            {(exp.highlights || []).slice(0, 3).map((h, j) => (
                                <li key={j} style={{ marginBottom: '0.5mm' }}>{h}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>

        <section style={{ marginBottom: '6mm' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '1mm', marginBottom: '2mm' }}>Technical Skills</h2>
            <p style={{ fontSize: '10pt' }}><strong>Relevant Skills:</strong> {(data.skills || []).join(', ')}</p>
        </section>

        <section>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '1mm', marginBottom: '2mm' }}>Education</h2>
            {(data.education || []).slice(0, 2).map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', marginBottom: '1mm' }}>
                    <span><strong>{edu.university}</strong> — {edu.degree}</span>
                    <span>{edu.year}</span>
                </div>
            ))}
        </section>
    </div>
);

// --- Template 4: The Strategic Sidebar (Elite Alignment) ---
export const Template4 = ({ data }) => (
    <div
        className="bg-white mx-auto print:shadow-none print:border-none flex"
        style={{
            width: '210mm',
            minHeight: '297mm',
            fontFamily: fonts.sans,
            color: '#1a1a1a',
            boxSizing: 'border-box'
        }}
    >
        {/* Concise Sidebar */}
        <div style={{ width: '60mm', backgroundColor: '#f8fafc', padding: '20mm 8mm', borderRight: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '10mm' }}>
                <h2 style={{ fontSize: '9pt', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4mm' }}>Contact</h2>
                <div style={{ fontSize: '8.5pt', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '3mm' }}>
                    <p>{data.email}</p>
                    <p>{data.phone}</p>
                    <p>{data.location}</p>
                    {data.linkedin && <p style={{ wordBreak: 'break-all' }}>{data.linkedin}</p>}
                    {data.github && <p style={{ wordBreak: 'break-all' }}>{data.github}</p>}
                </div>
            </div>

            <div style={{ marginBottom: '10mm' }}>
                <h2 style={{ fontSize: '9pt', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4mm' }}>Expertise</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
                    {(data.skills || []).slice(0, 15).map((s, i) => (
                        <div key={i} style={{ fontSize: '8.5pt', color: '#1e293b', paddingLeft: '2mm', borderLeft: '2px solid #cbd5e1' }}>{s}</div>
                    ))}
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '9pt', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4mm' }}>Education</h2>
                {(data.education || []).slice(0, 2).map((edu, i) => (
                    <div key={i} style={{ marginBottom: '4mm' }}>
                        <p style={{ fontSize: '9pt', fontWeight: 'bold', color: '#0f172a' }}>{edu.degree}</p>
                        <p style={{ fontSize: '8pt', color: '#64748b' }}>{edu.university}</p>
                        <p style={{ fontSize: '8pt', fontWeight: 'bold', color: '#3b82f6', marginTop: '1mm' }}>{edu.year}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20mm 12mm' }}>
            <header style={{ marginBottom: '10mm' }}>
                <h1 style={{ fontSize: '28pt', fontWeight: '900', color: '#0f172a', margin: 0 }}>{data.fullName}</h1>
                <p style={{ fontSize: '12pt', fontWeight: '500', color: '#475569', marginTop: '1mm' }}>{data.targetRole}</p>
            </header>

            <section style={{ marginBottom: '8mm' }}>
                <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5mm', marginBottom: '3mm' }}>Executive Overview</h2>
                <p style={{ fontSize: '10pt', color: '#334155', lineHeight: '1.6' }}>{data.summary}</p>
            </section>

            <section>
                <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5mm', marginBottom: '4mm' }}>Professional Timeline</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
                    {(data.experience || []).slice(0, 4).map((exp, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
                                <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '11pt' }}>{exp.role}</span>
                                <span style={{ fontSize: '9pt', fontWeight: '600', color: '#94a3b8' }}>{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <div style={{ fontSize: '10pt', fontWeight: '700', color: '#3b82f6', marginBottom: '2mm' }}>{exp.company}</div>
                            <ul style={{ margin: 0, paddingLeft: '5mm', listStyleType: 'disc', color: '#475569', fontSize: '9.5pt' }}>
                                {(exp.highlights || []).slice(0, 3).map((h, j) => (
                                    <li key={j} style={{ marginBottom: '1mm' }}>{h}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </div>
);
