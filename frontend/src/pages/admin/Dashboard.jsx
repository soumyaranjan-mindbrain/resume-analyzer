import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-8 flex-1 relative overflow-hidden group hover:border-white/[0.08] transition-all"
  >
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-6`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-4">{title}</p>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-4xl font-black text-white tracking-tight">{value}</h3>
      </div>
      <p className="text-[12px] font-bold text-emerald-500/80 flex items-center gap-1">
        <TrendingUp className="w-3 h-3" /> {subtext}
      </p>
    </div>
    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.02] transition-colors" />
  </motion.div>
);

const Dashboard = () => {
  const recentActivities = [
    { student: "Elena Sokolov", action: "Analyzed Resume", score: "88%", time: "2 mins ago" },
    { student: "Marcus Lee", action: "Updated Profile", score: "N/A", time: "15 mins ago" },
    { student: "Jordan Dax", action: "Matched Job", score: "92%", time: "1 hour ago" },
    { student: "Sarah Jenkins", action: "Uploaded Resume", score: "Pending", time: "3 hours ago" },
  ];

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-8">
        <StatCard 
          title="Total Students" 
          value="1,240" 
          subtext="+12% this month" 
          icon={Users} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Resumes Analyzed" 
          value="4,850" 
          subtext="+18% this month" 
          icon={FileText} 
          color="bg-purple-600" 
        />
        <StatCard 
          title="Avg. ATS Score" 
          value="72%" 
          subtext="+4% improvement" 
          icon={Target} 
          color="bg-emerald-600" 
        />
        <StatCard 
          title="Job Ready" 
          value="312" 
          subtext="+24 new today" 
          icon={Zap} 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Performance Chart Placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-8 bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10"
        >
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Performance Trends</h3>
              <p className="text-[13px] text-gray-600 font-bold mt-1">Average ATS score over last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00D2FF]/40" />
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Active Batch</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-6 px-4">
            {[62, 65, 68, 70, 72, 75].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                  <span className="text-[10px] font-black text-[#00D2FF] bg-[#00D2FF]/10 px-2 py-1 rounded-lg">{val}%</span>
                </div>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  className="w-full bg-white/[0.03] border border-white/[0.04] rounded-2xl group-hover:bg-[#00D2FF]/20 group-hover:border-[#00D2FF]/30 transition-all cursor-pointer relative"
                />
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-4 bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase">Recent Activity</h3>
            <Activity className="w-4 h-4 text-gray-600" />
          </div>

          <div className="space-y-6">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:border-white/10 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[12px] font-black text-[#00D2FF]">
                  {activity.student[0]}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-white group-hover:text-[#00D2FF] transition-colors">{activity.student}</p>
                  <p className="text-[11px] text-gray-600 font-medium">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-black text-white">{activity.score}</p>
                  <p className="text-[10px] text-gray-700">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[11px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest">
            View All Activity
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
