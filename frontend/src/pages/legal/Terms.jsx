import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Terms of Service</h1>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-12">Last Updated: April 2026</p>

                    <div className="space-y-12 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the MindVista platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">2. Description of Service</h2>
                            <p>
                                MindVista provides AI-driven resume analysis, career insights, and job matching services. We reserve the right to modify or discontinue any part of the service at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">3. User Obligations</h2>
                            <p className="mb-4">
                                You agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide accurate and complete information.</li>
                                <li>Maintain the security of your account credentials.</li>
                                <li>Not use the service for any illegal or unauthorized purpose.</li>
                                <li>Not attempt to reverse engineer our AI models.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">4. Intellectual Property</h2>
                            <p>
                                All content, logic, and AI models on the MindVista platform are the exclusive property of MindVista AI Technologies. Users retain ownership of their uploaded resumes but grant us a license to process them for analysis.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">5. Limitation of Liability</h2>
                            <p>
                                MindVista is provided "as is" without warranty of any kind. We are not liable for any career decisions, hiring outcomes, or data loss resulting from the use of our platform.
                            </p>
                        </section>

                        <section className="pt-12 border-t border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Questions?</h2>
                            <p>
                                If you have questions about these terms, please contact:
                                <br />
                                <span className="text-blue-600 font-bold">legal@mindvista.ai</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;
