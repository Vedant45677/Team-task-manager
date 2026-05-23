import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../hooks/useAxios';
import PageWrapper from '../components/layout/PageWrapper';
import ProjectCard from '../components/projects/ProjectCard';
import AddProjectModal from '../components/projects/AddProjectModal';
import { 
  FolderPlus, 
  AlertTriangle,
  FileText
} from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data } = await useAxios.get('/api/projects');
      setProjects(data);
    } catch (err) {
      setError('Failed to retrieve project workspace');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await useAxios.get('/api/auth/users');
      setTeamUsers(data);
    } catch (err) {
      console.error('Failed to retrieve system users list', err);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const { data } = await useAxios.post('/api/projects', projectData);
      setProjects((prev) => [data, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error occurred creating project';
      alert(errMsg);
      throw err;
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('WARNING: Deleting this project will permanently remove ALL associated tasks! Are you sure?')) {
      return;
    }
    try {
      await useAxios.delete(`/api/projects/${projectId}`);
      setProjects((prev) => prev.filter(p => p._id !== projectId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting project');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-slate-400 text-sm">Synchronizing workspaces...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Workspaces</h2>
          <p className="text-slate-505 text-sm mt-0.5">Explore active team projects and operations board</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:shadow-blue-500/5 inline-flex items-center gap-2 group transition-all cursor-pointer"
          >
            <FolderPlus className="h-4.5 w-4.5" />
            New Project
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-750 p-4 rounded-2xl flex items-start gap-3 mb-6 text-sm">
          <AlertTriangle className="h-5 w-5 text-red-650 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid Layout */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              user={user} 
              onDelete={handleDeleteProject} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center bg-white border border-slate-200 rounded-3xl p-12 max-w-xl mx-auto mt-8 shadow-sm">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-black text-slate-900">No Workspaces Found</h4>
          <p className="text-slate-505 text-sm mt-1 mb-6">
            {user?.role === 'Admin' 
              ? 'You have not created any projects yet. Click "+ New Project" to get started!'
              : 'You have not been assigned to any project workspaces yet.'}
          </p>
          {user?.role === 'Admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-755 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-sm transition-all cursor-pointer"
            >
              Get Started
            </button>
          )}
        </div>
      )}

      {/* New Project Modal (Admin Only) */}
      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
        teamUsers={teamUsers}
      />
    </PageWrapper>
  );
};

export default Projects;
