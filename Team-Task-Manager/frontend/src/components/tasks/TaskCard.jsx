import React from 'react';
import { Trash2, User, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

const TaskCard = ({
  task,
  user,
  colStatus,
  handleDeleteTask,
  handleQuickStatusChange,
  openStatusModal
}) => {
  const isAssignedToMe = task.assignee?._id === user?._id;
  const canEditStatus = isAssignedToMe || user?.role === 'Admin';

  return (
    <div 
      className={`bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group
        ${colStatus === 'Completed' ? 'border-l-4 border-l-emerald-500' : 
          colStatus === 'In Progress' ? 'border-l-4 border-l-amber-500' : 
          'border-l-4 border-l-slate-400'}
      `}
    >
      {/* Task Card Header */}
      <div className="flex justify-between items-start gap-3 mb-2">
        <h4 className="font-extrabold text-slate-900 text-sm tracking-tight leading-snug line-clamp-2">
          {task.title}
        </h4>
        {user?.role === 'Admin' && (
          <button
            onClick={() => handleDeleteTask(task._id)}
            className="p-1 rounded text-slate-400 hover:text-red-655 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-normal">
          {task.description}
        </p>
      )}

      {/* Assignee Box */}
      <div className="flex items-center gap-2 mb-4 bg-slate-100/60 rounded-lg p-2 border border-slate-150">
        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-blue-600 font-bold">
          {task.assignee?.name ? task.assignee.name[0].toUpperCase() : <User className="h-3 w-3" />}
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] text-slate-800 font-bold block truncate leading-tight">
            {task.assignee?.name || 'Unassigned'}
          </span>
          <span className="text-[9px] text-slate-550 block truncate leading-tight mt-0.5">
            {task.assignee?.email}
          </span>
        </div>
      </div>

      {/* Card Footer Details */}
      <div className="flex items-center justify-between gap-3 text-[10px] font-bold mt-2 pt-3 border-t border-slate-150">
        {/* Priority Badge */}
        <span className={`px-2 py-0.5 rounded border uppercase tracking-wider
          ${task.priority === 'High' ? 'bg-red-50 text-red-750 border-red-200' : 
            task.priority === 'Medium' ? 'bg-amber-50 text-amber-755 border-amber-200' : 
            'bg-blue-50 text-blue-755 border-blue-200'}
        `}>
          {task.priority} Priority
        </span>

        {/* Deadline */}
        <span className="flex items-center gap-1 text-slate-500">
          <Calendar className="h-3.5 w-3.5 text-blue-600" />
          {new Date(task.deadline).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
        </span>
      </div>

      {/* Quick Action Progression Controls */}
      {canEditStatus && (
        <div className="flex items-center justify-end gap-1.5 mt-3 pt-2.5 border-t border-dashed border-slate-150">
          {colStatus !== 'Pending' && (
            <button 
              onClick={() => handleQuickStatusChange(task, colStatus === 'Completed' ? 'In Progress' : 'Pending')}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 transition-all border border-slate-200 cursor-pointer animate-none"
              title="Move Back"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          )}
          <button 
            onClick={() => openStatusModal(task)}
            className="px-2 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[10px] uppercase border border-slate-200 cursor-pointer shadow-sm"
          >
            Update Status
          </button>
          {colStatus !== 'Completed' && (
            <button 
              onClick={() => handleQuickStatusChange(task, colStatus === 'Pending' ? 'In Progress' : 'Completed')}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm cursor-pointer"
              title="Move Forward"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
