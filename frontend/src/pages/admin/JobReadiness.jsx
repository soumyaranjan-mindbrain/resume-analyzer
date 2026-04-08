import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '../../utils/cn';

const JobReadiness = () => {
  const readinessStats = [
    { label: 'Market Ready', value: '42%', color: 'emerald' },
    { label: 'Developing', value: '38%', color: 'blue' },
    { label: 'Critical Gap', value: '20%', color: 'orange' },
  ];

  const readyStudents = [
    { id: 1, name: 'Alex Rivera', role: 'Full Stack', match: 94, readiness: 'Ready' },
    { id: 2, name: 'Sarah Chen', role: 'Data Sci', match: 96, readiness: 'Ready' },
    { id: 3, name: 'Elena Vance', role: 'Product Design', match: 88, readiness: 'Ready' },
    { id: 4, name: 'Marcus Bell', role: 'Backend', match: 82, readiness: 'Developing' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {readinessStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden relative group">
             <div className={cn(
               "absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] -mr-4 -mt-4 transition-all opacity-10",
               stat.color === 'emerald' ? "bg-emerald-500 group-hover:opacity-20" :
               stat.color === 'blue' ? "bg-blue-500 group-hover:opacity-20" :
               "bg-orange-500 group-hover:opacity-20"
             )} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
             <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
             <div className="mt-6 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      stat.color === 'emerald' ? "bg-emerald-500" :
                      stat.color === 'blue' ? "bg-blue-500" : "bg-orange-500"
                    )} 
                    style={{ width: stat.value }}
                   />
                </div>
             </div>
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-xl font-black text-slate-900 tracking-tight">Top Candidates</h4>
               <button className="text-indigo-500 font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                  Full Pool <ArrowUpRight className="w-4 h-4" />
               </button>
            </div>
            
            <div className="space-y-6">
               {readyStudents.map((student) => (
                 <div key={student.id} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100/50 rounded-3xl hover:border-indigo-100 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 shadow-sm">
                          {student.name.charAt(0)}
                       </div>
                       <div>
                          <h5 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{student.name}</h5>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{student.role}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-lg font-black text-slate-900">{student.match}%</div>
                       <div className={cn(
                         "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border mt-1",
                         student.readiness === 'Ready' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                       )}>
                          {student.readiness}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-cyan-50 border border-cyan-100 rounded-[3rem] p-10 text-cyan-900 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 space-y-8 text-center lg:text-left">
               <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto lg:mx-0">
                  <Target className="w-8 h-8 text-indigo-400" />
               </div>
               <div>
                  <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none">Threshold Calibration</h3>
                  <p className="text-slate-400 font-medium text-lg max-w-md">Adjust the global job-readiness score to match current industry requirements.</p>
               </div>
               
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Current Threshold: 85%</span>
                     <span className="text-2xl font-black text-indigo-400">850 Students</span>
                  </div>
                  <input type="range" className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
               </div>

               <button className="w-full lg:w-fit px-10 py-5 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all">
                  Apply Global Threshold
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default JobReadiness;


