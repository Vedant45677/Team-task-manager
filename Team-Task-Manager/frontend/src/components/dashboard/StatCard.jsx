import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, shadow }) => {
  return (
    <div 
      className={`bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 ${shadow}`}
    >
      <div>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-slate-900">
          {value}
        </span>
      </div>
      <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatCard;
