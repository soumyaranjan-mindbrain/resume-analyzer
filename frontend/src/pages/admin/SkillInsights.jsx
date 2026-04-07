import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  Target, 
  Layers, 
  ChevronRight, 
  MapPin, 
  Cpu, 
  BarChart2, 
  Globe
} from 'lucide-react';

const SkillInsights = () => {
  const missingSkills = [
    { skill: 'Cloud Architecture (AWS)', frequency: '72%', demand: 'High', suggested: 'AWS Solutions Architect Cert' },
    { skill: 'React Hooks & Context', frequency: '45%', demand: 'Critical', suggested: 'Advanced React Patterns Course' },
    { skill: 'System Design', frequency: '68%', demand: 'High', suggested: 'Grokking System Design' },
    { skill: 'Cybersecurity Fundamentals', frequency: '31%', demand: 'Medium', suggested: 'CompTIA Security+' },
    { skill: 'CI/CD Pipelines (Github Actions)', frequency: '52%', demand: 'High', suggested: 'DevOps Lifecycle Training' },
  ];

  return (
    <div className="space-y-12">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/10 rounded-[3rem] p-12"
      >
        <div className="flex items-center gap-6 mb-4">
           <Cpu className="w-12 h-12 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
           <div>
              <h3 className="text-xl font-black text-white tracking-tight">AI Skill Gap Analysis</h3>
              <p className="text-[13px] text-gray-400 font-bold">Deep insights into missing technologies cross-referenced with market demand.</p>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-8">
         {/* Top Missing Skills */}
         <div className="col-span-8 bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 shadow-2xl shadow-black/20">
            <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-10">Most Frequently Missing Skills</h4>
            <div className="space-y-6">
               {missingSkills.map((skill, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white/[0.01] border border-white/[0.02] hover:border-purple-500/20 rounded-2xl p-5 flex items-center transition-all cursor-default"
                  >
                     <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                           <span className="text-[15px] font-black text-white tracking-tight">{skill.skill}</span>
                           <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${skill.demand === 'Critical' ? 'text-red-500 bg-red-500/10' : 'text-blue-500 bg-blue-500/10'}`}>
                              {skill.demand}
                           </span>
                        </div>
                        <p className="text-[12px] text-gray-600 font-bold italic">Suggested: <span className="text-gray-400">{skill.suggested}</span></p>
                     </div>
                     
                     <div className="flex items-center gap-12">
                        <div className="text-right">
                           <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest mb-1">FREQUENCY</p>
                           <p className="text-lg font-black text-white">{skill.frequency}</p>
                        </div>
                        <div className="h-10 w-px bg-white/[0.04]" />
                        <button className="p-3 bg-white/[0.02] text-gray-600 hover:text-white transition-all rounded-xl">
                           <ChevronRight className="w-5 h-5" />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Market Supply vs Demand */}
         <div className="col-span-4 space-y-8">
            <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 relative overflow-hidden group hover:border-[#00D2FF]/10 transition-all">
               <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-10">Market Supply vs Demand</h4>
               <div className="h-64 flex flex-col justify-between">
                  {['React', 'Node.js', 'Python', 'AWS'].map(tech => (
                     <div key={tech} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black text-white px-1">
                           <span>{tech}</span>
                           <span className="text-gray-600 uppercase">72% Gap</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden flex">
                           <div className="h-full bg-[#00D2FF] w-[30%]" /> {/* Student availability */}
                           <div className="h-full bg-white/[0.08] w-[70%]" /> {/* Demand gap */}
                        </div>
                     </div>
                  ))}
               </div>
               <Globe className="absolute -right-8 -bottom-8 w-24 h-24 text-white/[0.02]" />
            </div>

            <div className="bg-gradient-to-br from-[#00D2FF]/5 to-transparent border border-white/[0.04] rounded-[3rem] p-10 flex flex-col items-center text-center">
                <Target className="w-12 h-12 text-[#00D2FF] mb-6 drop-shadow-[0_0_10px_rgba(0,210,255,0.3)]" />
                <h4 className="text-[15px] font-black text-white mb-2 tracking-tight">Focus Batch '24</h4>
                <p className="text-[12px] text-gray-600 font-bold mb-8">Priority: Java + Spring Boot Mastery needed for upcoming placements.</p>
                <button className="w-full py-4 bg-[#00D2FF] text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">Launch Special Training</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SkillInsights;
