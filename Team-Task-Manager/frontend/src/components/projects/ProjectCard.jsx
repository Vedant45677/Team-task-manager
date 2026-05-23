import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Trash2, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, user, onDelete }) => {
  return (
    <div 
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
    >
      <div>
        {/* Project Header Info */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="overflow-hidden">
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight truncate">{project.name}</h3>
            <span className="text-[10px] text-slate-450 font-bold tracking-wider uppercase block mt-0.5">
              Created by {project.creator?.name || 'Admin'}
            </span>
          </div>
          {user?.role === 'Admin' && (
            <button
              onClick={() => onDelete(project._id)}
              className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all shrink-0 cursor-pointer"
              title="Delete Project Workspace"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        <p className="text-slate-600 text-sm line-clamp-3 mb-6">
          {project.description || 'No description provided for this project.'}
        </p>
      </div>

      <div>
        {/* Meta details */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4 text-xs font-semibold mb-5">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Users className="h-4 w-4 text-blue-600" />
            {project.members?.length || 1} Member{project.members?.length !== 1 ? 's' : ''}
          </span>
          {project.deadline && (
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="h-4 w-4 text-emerald-600" />
              {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Navigation Button */}
        <Link
          to={`/projects/${project._id}/tasks`}
          className="w-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-blue-600 hover:text-blue-700 border border-slate-200 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 group transition-all text-sm cursor-pointer shadow-sm"
        >
          Explore Task Board
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
