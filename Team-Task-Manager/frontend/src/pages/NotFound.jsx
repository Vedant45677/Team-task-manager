import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
        <AlertCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-black text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Coordinates Not Found</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The operations dashboard you are looking for has been moved or does not exist in our workspaces database.
        </p>
        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-500/5 transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
