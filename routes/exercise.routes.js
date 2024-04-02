const router = require('express').Router();
const Exercise = require('../models/Exercise.model');

router.post('/exercise', async (req, res, next) => {
  const { user, name, sets, reps, weight, notes } = req.body;

  try {
    const newExercise = await Exercise.create({
      user,
      name,
      sets,
      reps,
      weight,
      notes,
    });

    res.status(201).json(newExercise);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
