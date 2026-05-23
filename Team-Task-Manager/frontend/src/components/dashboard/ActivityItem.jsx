import React from 'react';
import { Layers, Calendar } from 'lucide-react';

const ActivityItem = ({ activity }) => {
  return (
    <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-2xl flex items-center justify-between gap-4 text-sm hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0
          ${activity.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
            activity.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 
            'bg-slate-100 text-slate-500'}
        `}>
          <Layers className="h-4.5 w-4.5" />
        </div>
        <div className="overflow-hidden">
          <h4 className="font-semibold text-slate-800 truncate">{activity.title}</h4>
          <p className="text-xs text-slate-550 mt-0.5 truncate">
            Project: <span className="text-slate-700">{activity.project}</span> • Assignee: <span className="text-slate-700">{activity.assignee}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
          ${activity.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
            activity.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
            'bg-slate-100 text-slate-650 border border-slate-200'}
        `}>
          {activity.status}
        </span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(activity.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

export default ActivityItem;
