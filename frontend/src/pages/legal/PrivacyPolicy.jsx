import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-12">Last Updated: April 2026</p>

                    <div className="space-y-12 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">1. Information We Collect</h2>
                            <p className="mb-4">
                                At MindVista, we collect information to provide better services to our users. This includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Data:</strong> Name, email address, phone number, and professional profiles (LinkedIn/GitHub).</li>
                                <li><strong>Resume Content:</strong> All data contained within the documents you upload for analysis.</li>
                                <li><strong>Usage Data:</strong> Information about how you interact with our platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">2. How We Use Information</h2>
                            <p className="mb-4">
                                We use the collected information for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To provide personalized resume analysis and job matching.</li>
                                <li>To improve our AI algorithms and platform performance.</li>
                                <li>To communicate with you regarding your account and platform updates.</li>
                                <li>To ensure the security and integrity of our services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">3. Data Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your data. Your resumes are processed through secure neural nodes and encrypted at rest. We do not sell your personal information to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">4. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal data at any time through your Profile Settings. For any specific data requests, you can contact our support team.
                            </p>
                        </section>

                        <section className="pt-12 border-t border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please reach out to us at:
                                <br />
                                <span className="text-blue-600 font-bold">privacy@mindvista.ai</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
