const router = require('express').Router();
const Project = require('../models/Project.model');
const Task = require('../models/Task.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');

// Create a new project:

router.post('/projects', async (req, res, next) => {
  console.log(req.headers);
  const { title, description, imgUrl } = req.body;

  try {
    const newProject = await Project.create({
      title,
      description,
      imgUrl,
      tasks: [],
    });

    console.log('New project', newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.log('An error occured creating the project', error);
    next(error);
  }
});

// get all projects:

router.get('/projects', async (req, res, next) => {
  try {
    const allProjects = await Project.find({}).populate('tasks');

    console.log('All projects:', allProjects);
    res.status(200).json(allProjects);
  } catch (error) {
    console.log('Error retrieving all projects', error);
    next(error);
  }
});

// Gets project by Id:

router.get('/projects/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    // check if id is valid value in our DB:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const project = await Project.findById(id).populate('tasks');
    // check if there is a project or not, might be null or deleted:
    if (!project) {
      return res.status(404).json({ message: 'No project found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.log('There was an error getting the project', error);
    next(error);
  }
});

// Update project by Id:

router.put('/projects/:id', async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      {
        new: true,
      }
    ).populate('tasks');

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(202).json(updatedProject);
  } catch (error) {
    console.log('An error occured updating the project', error);
    next(error);
  }
});

// Delete a project by Id:

router.delete('/projects/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    // This step deletes the tasks associated to the project:
    await Task.deleteMany({ project: id });
    // This deletes the project:
    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: 'Project deleted sucessfully' });
  } catch (error) {
    console.log('An error occurred deleting the project', error);
    next(error);
  }
});

router.post('/upload', fileUploader.single('file'), (req, res) => {
  try {
    res.status(200).json({ imgUrl: req.file.path });
  } catch (error) {
    console.log('An error occured uploading the image');
    res.status(500).json({ message: 'An error occured' });
  }
});

module.exports = router;
