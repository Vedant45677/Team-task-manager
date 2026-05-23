const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get projects for logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    if (global.isDemoMode) {
      let filteredProjects;
      if (req.user.role === 'Admin') {
        filteredProjects = global.mockProjects;
      } else {
        filteredProjects = global.mockProjects.filter(p => p.members.includes(req.user._id));
      }

      const populated = filteredProjects.map(proj => {
        const creatorId = proj.creator?._id || proj.creator;
        const creatorUser = global.mockUsers.find(u => u._id === creatorId);
        const membersList = proj.members.map(memberId => global.mockUsers.find(u => u._id === memberId)).filter(Boolean);
        return {
          ...proj,
          creator: creatorUser ? { _id: creatorUser._id, name: creatorUser.name, email: creatorUser.email } : { _id: creatorId, name: 'Admin' },
          members: membersList.map(m => ({ _id: m._id, name: m.name, email: m.email, role: m.role }))
        };
      });
      return res.json(populated);
    }

    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find({})
        .populate('creator', 'name email')
        .populate('members', 'name email role');
    } else {
      projects = await Project.find({ members: req.user._id })
        .populate('creator', 'name email')
        .populate('members', 'name email role');
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin Only)
const createProject = async (req, res, next) => {
  try {
    const { name, description, members, deadline } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Project name is required');
    }

    if (global.isDemoMode) {
      const projectMembers = members || [];
      if (!projectMembers.includes(req.user._id.toString())) {
        projectMembers.push(req.user._id);
      }

      const newProj = {
        _id: 'proj-' + Date.now(),
        name,
        description,
        creator: req.user._id,
        members: projectMembers,
        deadline: deadline || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      global.mockProjects.push(newProj);
      
      const creatorUser = global.mockUsers.find(u => u._id === req.user._id);
      const membersList = projectMembers.map(memberId => global.mockUsers.find(u => u._id === memberId)).filter(Boolean);

      return res.status(201).json({
        ...newProj,
        creator: creatorUser ? { _id: creatorUser._id, name: creatorUser.name, email: creatorUser.email } : { _id: req.user._id, name: 'Admin' },
        members: membersList.map(m => ({ _id: m._id, name: m.name, email: m.email, role: m.role }))
      });
    }

    const projectMembers = members || [];
    if (!projectMembers.includes(req.user._id.toString())) {
      projectMembers.push(req.user._id);
    }

    const project = await Project.create({
      name,
      description,
      creator: req.user._id,
      members: projectMembers,
      deadline
    });

    const populatedProject = await Project.findById(project._id)
      .populate('creator', 'name email')
      .populate('members', 'name email role');

    res.status(201).json(populatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin Only)
const updateProject = async (req, res, next) => {
  try {
    const { name, description, members, deadline } = req.body;

    if (global.isDemoMode) {
      const index = global.mockProjects.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        res.status(404);
        throw new Error('Project not found');
      }

      const project = global.mockProjects[index];
      project.name = name || project.name;
      project.description = description !== undefined ? description : project.description;
      project.members = members || project.members;
      project.deadline = deadline || project.deadline;

      if (!project.members.includes(project.creator.toString())) {
        project.members.push(project.creator);
      }
      
      project.updatedAt = new Date();
      global.mockProjects[index] = project;

      const creatorUser = global.mockUsers.find(u => u._id === project.creator);
      const membersList = project.members.map(memberId => global.mockUsers.find(u => u._id === memberId)).filter(Boolean);

      return res.json({
        ...project,
        creator: creatorUser ? { _id: creatorUser._id, name: creatorUser.name, email: creatorUser.email } : { _id: project.creator, name: 'Admin' },
        members: membersList.map(m => ({ _id: m._id, name: m.name, email: m.email, role: m.role }))
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.members = members || project.members;
    project.deadline = deadline || project.deadline;

    if (!project.members.includes(project.creator.toString())) {
      project.members.push(project.creator);
    }

    const updatedProject = await project.save();
    const populatedProject = await Project.findById(updatedProject._id)
      .populate('creator', 'name email')
      .populate('members', 'name email role');

    res.json(populatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project and all associated tasks
// @route   DELETE /api/projects/:id
// @access  Private (Admin Only)
const deleteProject = async (req, res, next) => {
  try {
    if (global.isDemoMode) {
      const index = global.mockProjects.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        res.status(404);
        throw new Error('Project not found');
      }

      // Cascade delete tasks
      global.mockTasks = global.mockTasks.filter(t => t.project !== req.params.id);
      global.mockProjects.splice(index, 1);

      return res.json({ message: 'Project and all associated tasks deleted successfully' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await Task.deleteMany({ project: req.params.id });
    await project.deleteOne();

    res.json({ message: 'Project and all associated tasks deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
