const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res, next) => {
  try {
    if (global.isDemoMode) {
      const project = global.mockProjects.find(p => p._id === req.params.projectId);
      if (!project) {
        res.status(404);
        throw new Error('Project not found');
      }

      // Verify if user belongs to the project (or is Admin)
      const projectMembers = project.members.map(m => m.toString());
      if (req.user.role !== 'Admin' && !projectMembers.includes(req.user._id.toString())) {
        res.status(403);
        throw new Error('Forbidden: You are not a member of this project');
      }

      const tasks = global.mockTasks.filter(t => t.project === req.params.projectId);
      const populatedTasks = tasks.map(task => {
        const assigneeId = task.assignee?._id || task.assignee;
        const assigneeUser = global.mockUsers.find(u => u._id === assigneeId);
        return {
          ...task,
          project: { _id: project._id, name: project.name },
          assignee: assigneeUser ? { _id: assigneeUser._id, name: assigneeUser.name, email: assigneeUser.email, role: assigneeUser.role } : null
        };
      });
      return res.json(populatedTasks);
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Verify if user belongs to the project (or is Admin)
    if (req.user.role !== 'Admin' && !project.members.includes(req.user._id.toString())) {
      res.status(403);
      throw new Error('Forbidden: You are not a member of this project');
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name email role')
      .populate('project', 'name');

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin Only)
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignee, priority, deadline } = req.body;

    if (!title || !project || !assignee || !deadline) {
      res.status(400);
      throw new Error('Title, project, assignee, and deadline are required');
    }

    if (global.isDemoMode) {
      const projectRecord = global.mockProjects.find(p => p._id === project);
      if (!projectRecord) {
        res.status(404);
        throw new Error('Associated project not found');
      }

      const userRecord = global.mockUsers.find(u => u._id === assignee);
      if (!userRecord) {
        res.status(404);
        throw new Error('Assignee user not found');
      }

      if (!projectRecord.members.includes(assignee)) {
        projectRecord.members.push(assignee);
      }

      const newTask = {
        _id: 'task-' + Date.now(),
        title,
        description: description || '',
        project,
        assignee: { _id: userRecord._id, name: userRecord.name, email: userRecord.email },
        status: 'Pending',
        priority: priority || 'Medium',
        deadline: new Date(deadline),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      global.mockTasks.push(newTask);
      return res.status(201).json({
        ...newTask,
        project: { _id: projectRecord._id, name: projectRecord.name }
      });
    }

    // Verify project exists
    const projectRecord = await Project.findById(project);
    if (!projectRecord) {
      res.status(404);
      throw new Error('Associated project not found');
    }

    // Verify assignee exists
    const userRecord = await User.findById(assignee);
    if (!userRecord) {
      res.status(404);
      throw new Error('Assignee user not found');
    }

    // Optionally ensure assignee is in the project members list
    if (!projectRecord.members.includes(assignee)) {
      projectRecord.members.push(assignee);
      await projectRecord.save();
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignee,
      priority: priority || 'Medium',
      deadline
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email role')
      .populate('project', 'name');

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (Admins edit all, Members edit status only for assigned tasks)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignee, status, priority, deadline } = req.body;

    if (global.isDemoMode) {
      const index = global.mockTasks.findIndex(t => t._id === req.params.id);
      if (index === -1) {
        res.status(404);
        throw new Error('Task not found');
      }

      const task = global.mockTasks[index];
      const taskAssigneeId = task.assignee?._id || task.assignee;

      if (req.user.role === 'Admin') {
        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.assignee = assignee || task.assignee;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.deadline = deadline ? new Date(deadline) : task.deadline;
      } else {
        if (taskAssigneeId.toString() !== req.user._id.toString()) {
          res.status(403);
          throw new Error('Forbidden: You can only update tasks assigned to you');
        }

        if (title || description || assignee || priority || deadline) {
          res.status(403);
          throw new Error('Forbidden: Members can only update the task status');
        }

        task.status = status || task.status;
      }

      task.updatedAt = new Date();
      global.mockTasks[index] = task;

      const projectRecord = global.mockProjects.find(p => p._id === task.project);
      const assigneeUser = global.mockUsers.find(u => u._id === (assignee || taskAssigneeId));

      return res.json({
        ...task,
        project: projectRecord ? { _id: projectRecord._id, name: projectRecord.name } : { _id: task.project, name: 'Project' },
        assignee: assigneeUser ? { _id: assigneeUser._id, name: assigneeUser.name, email: assigneeUser.email, role: assigneeUser.role } : null
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (req.user.role === 'Admin') {
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.assignee = assignee || task.assignee;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.deadline = deadline || task.deadline;
    } else {
      if (task.assignee.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Forbidden: You can only update tasks assigned to you');
      }

      if (title || description || assignee || priority || deadline) {
        res.status(403);
        throw new Error('Forbidden: Members can only update the task status');
      }

      task.status = status || task.status;
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignee', 'name email role')
      .populate('project', 'name');

    res.json(populatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin Only)
const deleteTask = async (req, res, next) => {
  try {
    if (global.isDemoMode) {
      const index = global.mockTasks.findIndex(t => t._id === req.params.id);
      if (index === -1) {
        res.status(404);
        throw new Error('Task not found');
      }
      global.mockTasks.splice(index, 1);
      return res.json({ message: 'Task deleted successfully' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/tasks/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    if (global.isDemoMode) {
      let filteredTasks = global.mockTasks;
      if (req.user.role !== 'Admin') {
        filteredTasks = global.mockTasks.filter(t => {
          const id = t.assignee?._id || t.assignee;
          return id === req.user._id;
        });
      }

      const totalTasks = filteredTasks.length;
      const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length;
      const pendingTasks = filteredTasks.filter(t => t.status === 'Pending').length;
      const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress').length;
      
      const now = new Date();
      const overdueTasks = filteredTasks.filter(t => t.status !== 'Completed' && new Date(t.deadline) < now).length;

      const sortedTasks = [...filteredTasks]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

      const recentActivities = sortedTasks.map(t => {
        const proj = global.mockProjects.find(p => p._id === t.project);
        const assigneeId = t.assignee?._id || t.assignee;
        const ass = global.mockUsers.find(u => u._id === assigneeId);
        return {
          _id: t._id,
          title: t.title,
          status: t.status,
          project: proj ? proj.name : 'Website Redesign',
          assignee: ass ? ass.name : 'Demo Member',
          updatedAt: t.updatedAt
        };
      });

      return res.json({
        totalTasks,
        completedTasks,
        pendingTasks: pendingTasks + inProgressTasks,
        overdueTasks,
        breakdown: {
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks
        },
        recentActivities
      });
    }

    let filter = {};
    if (req.user.role !== 'Admin') {
      filter.assignee = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('project', 'name');

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    
    const now = new Date();
    const overdueTasks = tasks.filter(t => t.status !== 'Completed' && new Date(t.deadline) < now).length;

    const recentActivities = await Task.find(filter)
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('assignee', 'name')
      .populate('project', 'name');

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks: pendingTasks + inProgressTasks,
      overdueTasks,
      breakdown: {
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks
      },
      recentActivities: recentActivities.map(activity => ({
        _id: activity._id,
        title: activity.title,
        status: activity.status,
        project: activity.project ? activity.project.name : 'Unknown Project',
        assignee: activity.assignee ? activity.assignee.name : 'Unassigned',
        updatedAt: activity.updatedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats
};
