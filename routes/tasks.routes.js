const router = require('express').Router();
const Task = require('../models/Task.model');
const Project = require('../models/Project.model');

// create a new task

router.post('/tasks', async (req, res, next) => {
  const { title, description, projectId } = req.body;

  try {
    const newTask = await Task.create({
      title,
      description,
      project: projectId,
    });

    // When we create a task, we add that task to the array of tasks in the specific project:
    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: newTask._id },
    });

    console.log('New Task', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.log('An error occured creating a new task', error);
    next(error);
  }
});

module.exports = router;
