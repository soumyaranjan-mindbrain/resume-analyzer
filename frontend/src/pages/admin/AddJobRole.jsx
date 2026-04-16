import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Briefcase,
  Building2,
  MapPin,
  Type,
  AlignLeft,
  Settings,
  Target,
  Loader2
} from 'lucide-react';
import { createJob, getJobById, updateJob } from '../../services/api';
import toast from 'react-hot-toast';

const AddJobRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    experience: '',
    description: '',
    requirements: '',
    responsibilities: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isEdit) {
      const loadJob = async () => {
        try {
          setFetching(true);
          const job = await getJobById(id);
          setFormData({
            title: job.title || '',
            company: job.company || '',
            location: job.location || '',
            type: job.type || 'Full-time',
            experience: job.experience || '',
            description: job.description || '',
            requirements: job.requirements || '',
            responsibilities: job.responsibilities || '',
            tags: job.tags || job.skillsRequired || []
          });
        } catch (error) {
          console.error('Error loading job:', error);
          toast.error('Failed to load job details');
          navigate('/admin/jobs');
        } finally {
          setFetching(false);
        }
      };
      loadJob();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateJob(id, formData);
        toast.success('Job role updated successfully');
      } else {
        await createJob(formData);
        toast.success('Job role created successfully');
      }
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error saving job role:', error);
      toast.error(isEdit ? 'Failed to update job role' : 'Failed to create job role');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      {/* Back Button & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/jobs')}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Job Role' : 'Add New Job Role'}</h2>
            <p className="text-slate-500 text-sm font-medium">
              {isEdit ? `Modifying role: ${formData.title}` : 'Define a new potential job match for students'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-blue-500" />
              Role Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Developer"
                    className="input-clay !pl-12 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the role and its impact..."
                  className="input-clay !p-4 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm min-h-[120px] w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="4"
                    placeholder="List key requirements..."
                    className="input-clay !p-4 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm min-h-[120px] w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Responsibilities</label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows="4"
                    placeholder="List core responsibilities..."
                    className="input-clay !p-4 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm min-h-[120px] w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              Skills & Tags
            </h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a skill tag (e.g. React, Python)"
                    className="input-clay !pl-12 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-6 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 text-xs font-bold uppercase tracking-wider">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {formData.tags.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Company Info
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Google"
                    className="input-clay !pl-12 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Mountain View, CA"
                    className="input-clay !pl-12 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Employment Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-clay !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm appearance-none w-full cursor-pointer"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Remote</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Experience Required</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5+ years"
                    className="input-clay !pl-12 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm w-full"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isEdit ? 'Update Job Role' : 'Save Job Role'}
                </button>
                <button
                  onClick={() => navigate('/admin/jobs')}
                  disabled={loading}
                  className="w-full px-8 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJobRole;
