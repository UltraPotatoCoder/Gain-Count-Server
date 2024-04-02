const router = require('express').Router();
const Exercise = require('../models/Exercise.model');

router.post('/exercise', async (req, res, next) => {
  const { name, sets, reps, weight, notes, duration, workout } = req.body;

  try {
    const newExercise = await Exercise.create({
      name,
      sets,
      reps,
      weight,
      notes,
      duration,
      workout,
    });

    res.status(201).json(newExercise);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
