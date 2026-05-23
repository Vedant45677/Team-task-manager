import React, { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';

const AddProjectModal = ({
  isOpen,
  onClose,
  teamUsers,
  onCreateProject
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleMemberToggle = (userId) => {
    setSelectedMembers((prev) => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await onCreateProject({
        name,
        description,
        deadline: deadline || undefined,
        members: selectedMembers
      });
      // Reset form state on success
      setName('');
      setDescription('');
      setDeadline('');
      setSelectedMembers([]);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-xl relative"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-blue-600" />
            Create New Project
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-750 rounded-lg hover:bg-slate-105 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Mobile Application Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-450 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              placeholder="Summarize the core requirements, goals, and team expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-455 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                Target Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Members Selection List */}
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              Assign Team Members
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-[160px] overflow-y-auto space-y-2">
              {teamUsers.length > 0 ? (
                teamUsers.map((member) => (
                  <label 
                    key={member._id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition-all select-none"
                  >
                    <div className="flex items-center gap-2.5">
                       <input 
                        type="checkbox"
                        checked={selectedMembers.includes(member._id)}
                        onChange={() => handleMemberToggle(member._id)}
                        className="rounded text-blue-600 focus:ring-blue-500 bg-white border-slate-300 h-4 w-4 cursor-pointer"
                      />
                      <span className="font-semibold">{member.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-200/50">
                      {member.role}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-slate-505 text-xs text-center py-4">No team users registered in database</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-750 hover:text-slate-900 font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-sm hover:shadow-md hover:shadow-blue-500/5 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
