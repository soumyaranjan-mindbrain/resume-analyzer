import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Lightbulb, 
  GraduationCap, 
  ChevronRight, 
  Trophy, 
  AlertTriangle, 
  CheckCircle2,
  MoreVertical,
  BarChart,
  UserCheck,
  Send,
  Star
} from 'lucide-react';

const JobReadiness = () => {
  const readyStudents = [
    { name: 'Sarah Jenkins', score: 91, gap: 'Low (Missing: Scala)', branch: 'Software Engineering', recommended: true },
    { name: 'Elena Sokolov', score: 88, gap: 'None', branch: 'Computer Science', recommended: true },
    { name: 'Alex Rivera', score: 79, gap: 'Medium (Missing: Ruby on Rails)', branch: 'Cybersecurity', recommended: false },
    { name: 'Jordan Dax', score: 72, gap: 'High (Needs: React Hooks)', branch: 'Information Technology', recommended: false },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-12 shadow-2xl shadow-black/20">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Top Placement Ready Candidates</h3>
              <p className="text-[13px] text-gray-600 font-bold mt-1">Students with ATS scores above 75% threshold.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[#00D2FF]/10 rounded-xl text-[10px] font-black text-[#00D2FF] uppercase tracking-widest border border-[#00D2FF]/10">
                Target: 75%+
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {readyStudents.map((student, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.01] border border-white/[0.02] rounded-3xl p-6 flex items-center justify-between group hover:border-[#00D2FF]/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6 flex-1">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D2FF]/10 to-transparent flex items-center justify-center border border-white/[0.04]">
                      <GraduationCap className={`w-7 h-7 ${student.score > 85 ? 'text-[#00D2FF]' : 'text-gray-600'}`} />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3">
                         <span className="text-[16px] font-black text-white tracking-tight">{student.name}</span>
                         {student.recommended && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                      </div>
                      <p className="text-[12px] font-bold text-gray-600 uppercase tracking-widest">{student.branch}</p>
                   </div>
                </div>

                <div className="flex items-center gap-10">
                   <div className="text-center group-hover:scale-105 transition-transform">
                      <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest mb-1">ATS SCORE</p>
                      <p className="text-lg font-black text-white">{student.score}%</p>
                   </div>
                   <div className="min-w-[150px]">
                      <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest mb-1">SKILL GAP</p>
                      <p className={`text-[12px] font-bold ${student.gap === 'None' ? 'text-emerald-500' : student.gap.includes('Low') ? 'text-blue-500' : 'text-amber-500'}`}>{student.gap}</p>
                   </div>
                   <div className="flex gap-2">
                       <button className="p-3 bg-[#00D2FF] text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#00D2FF]/10">
                          <Send className="w-3.5 h-3.5" />
                       </button>
                       <button className="p-3 bg-white/[0.03] text-white rounded-xl hover:bg-white/5 transition-all">
                          <MoreVertical className="w-3.5 h-3.5" />
                       </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center text-[11px] font-black text-gray-700 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
            View Expanded Readiness Report
          </div>
        </div>

        <div className="col-span-4 space-y-10">
           <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 shadow-xl shadow-black/20 overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-10">Readiness Score Distribution</h4>
                <div className="space-y-10">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[12px] font-black text-white px-1">
                      <span>ELITE (90+)</span>
                      <span>42 Students</span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                    </div>
                  </div>
                   <div className="space-y-3">
                    <div className="flex justify-between text-[12px] font-black text-white px-1">
                      <span>COMPETITIVE (75-89)</span>
                      <span>156 Students</span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                       <div className="h-full bg-[#00D2FF] w-[85%] rounded-full shadow-[0_0_10px_rgba(0,210,255,0.3)]" />
                    </div>
                  </div>
                   <div className="space-y-3">
                    <div className="flex justify-between text-[12px] font-black text-white px-1">
                      <span>DEVELOPING (50-74)</span>
                      <span>420 Students</span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
                    </div>
                  </div>
                </div>
              </div>
              <BarChart className="absolute -right-8 -bottom-8 w-40 h-40 text-white/[0.01]" />
           </div>

           <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/10 rounded-[3rem] p-10 flex flex-col items-center text-center">
              <Trophy className="w-14 h-14 text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
              <h4 className="text-[18px] font-black text-white mb-2 tracking-tight">Top Performer Match</h4>
              <p className="text-[13px] text-gray-600 font-bold mb-8">Sarah Jenkins matched with 'Full Stack Engineer' at 91% precision.</p>
              <button className="w-full py-4 bg-amber-500 text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10">
                 Push Recommendation
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobReadiness;
