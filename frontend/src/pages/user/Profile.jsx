import React, { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  Camera,
  ChevronRight,
  Phone,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';

const TwitterIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  // Split user.name into firstName and lastName
  const getNameParts = (fullName) => {
    if (!fullName) return { first: '', last: '' };
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1) return { first: parts[0] || '', last: '' };
    return {
      first: parts[0],
      last: parts.slice(1).join(' ')
    };
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Sync formData when user context changes
  React.useEffect(() => {
    if (user) {
      const nameParts = getNameParts(user.name);
      setFormData({
        firstName: nameParts.first,
        lastName: nameParts.last,
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateProfile(user._id || user.id, {
        name: fullName,
        phone: formData.phone
      });
      await checkAuth(); // Refresh user context
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePic', file);

      await updateProfile(user._id || user.id, formData);
      await checkAuth(); // Refresh user context to show new image
      alert('Profile picture updated!');
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

          <div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 relative overflow-hidden flex flex-col items-center h-full">

            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="relative mb-6">
                <input
                  type="file"
                  id="profile-pic-input"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-slate-50 shadow-md bg-slate-50 flex items-center justify-center">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-medium text-blue-600">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => document.getElementById('profile-pic-input').click()}
                  disabled={loading}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-4 border-white disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">{user?.name}</h2>
              <p className="text-slate-500 font-normal text-[10px] uppercase tracking-widest mb-6">{user?.role || 'Student'}</p>

              <div className="flex gap-3 mb-8">
                {[GithubIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 relative flex flex-col h-full">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Account Settings</h3>

            <div className="grid sm:grid-cols-2 gap-6 flex-1">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium text-slate-400 cursor-not-allowed outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end pt-6 border-t border-slate-50">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium text-sm uppercase tracking-widest shadow-md hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Update Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
