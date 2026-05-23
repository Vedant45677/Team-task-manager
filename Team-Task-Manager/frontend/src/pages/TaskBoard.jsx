import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../hooks/useAxios';
import PageWrapper from '../components/layout/PageWrapper';
import { 
  Plus, 
  Clock,
  AlertTriangle,
  ArrowLeft,
  ClipboardList
} from 'lucide-react';
import TaskCard from '../components/tasks/TaskCard';
import AddTaskModal from '../components/tasks/AddTaskModal';
import UpdateStatusModal from '../components/tasks/UpdateStatusModal';

const TaskBoard = () => {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchProjectAndTasks();
    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [projectId, user]);

  const fetchProjectAndTasks = async () => {
    try {
      // 1. Fetch all projects first to locate this specific project metadata
      const projectRes = await useAxios.get('/api/projects');
      const foundProject = projectRes.data.find(p => p._id === projectId);
      setProject(foundProject);

      // 2. Fetch project tasks
      const taskRes = await useAxios.get(`/api/tasks/project/${projectId}`);
      setTasks(taskRes.data);
    } catch (err) {
      setError('Failed to fetch tasks for this project board');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await useAxios.get('/api/auth/users');
      setTeamUsers(data);
    } catch (err) {
      console.error('Failed to retrieve system users', err);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const { data } = await useAxios.post('/api/tasks', {
        ...taskData,
        project: projectId
      });
      setTasks((prev) => [...prev, data]);
      setIsTaskModalOpen(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error occurred creating task';
      alert(errMsg);
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to permanently delete this task?')) return;
    try {
      await useAxios.delete(`/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter(t => t._id !== taskId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting task');
    }
  };

  // Trigger quick status change (Admin or assigned Member)
  const handleQuickStatusChange = async (task, statusToSet) => {
    try {
      const { data } = await useAxios.put(`/api/tasks/${task._id}`, {
        status: statusToSet
      });
      setTasks((prev) => prev.map(t => t._id === task._id ? data : t));
    } catch (err) {
      alert(err.response?.data?.message || 'Unauthorized: Only the assignee can change task status.');
    }
  };

  const openStatusModal = (task) => {
    setSelectedTask(task);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      const { data } = await useAxios.put(`/api/tasks/${task._id}`, {
        status: newStatus
      });
      setTasks((prev) => prev.map(t => t._id === task._id ? data : t));
      setIsStatusModalOpen(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update task status';
      alert(errMsg);
      throw err;
    }
  };

  const filterTasks = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-500 text-sm">Organizing task columns...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const columns = [
    { title: 'Pending', status: 'Pending', border: 'border-t-slate-350', color: 'bg-slate-100 text-slate-700 border border-slate-200' },
    { title: 'In Progress', status: 'In Progress', border: 'border-t-amber-500', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { title: 'Completed', status: 'Completed', border: 'border-t-emerald-500', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
  ];

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 mb-2 transition-all">
            <ArrowLeft className="h-3 w-3" />
            Back to workspaces
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            {project ? project.name : 'Task Board'}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">{project?.description || 'Board task progression'}</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:shadow-blue-500/5 inline-flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            Add Task
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-2xl flex items-start gap-3 mb-6 text-sm">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = filterTasks(col.status);
          return (
            <div 
              key={col.status}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-h-[500px] flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${col.color}`}>
                    {col.title}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-150">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-4">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => (
                    <TaskCard 
                      key={task._id}
                      task={task}
                      user={user}
                      colStatus={col.status}
                      handleDeleteTask={handleDeleteTask}
                      handleQuickStatusChange={handleQuickStatusChange}
                      openStatusModal={openStatusModal}
                    />
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl text-center">
                    <Clock className="h-7 w-7 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500 font-semibold">No Tasks Here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal (Admin Only) */}
      <AddTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        teamUsers={teamUsers}
        onCreateTask={handleCreateTask}
      />

      {/* Task Status Modal (Admin & Assigned Members) */}
      <UpdateStatusModal 
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        task={selectedTask}
        onUpdateStatus={handleUpdateStatus}
      />
    </PageWrapper>
  );
};

export default TaskBoard;
