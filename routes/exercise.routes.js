const router = require('express').Router();
const Exercise = require('../models/Exercise.model');
const Workout = require('../models/Workout.model');

//? ------------ ROUTE TO CREATE A NEW EXERCISE ON THE WORKOUT ------------ //

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

    const updatedWorkout = await Workout.findByIdAndUpdate(workout, {
      $push: { exercises: newExercise._id },
    });

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(201).json(newExercise);
  } catch (error) {
    next(error);
  }
});

//? ------------ ROUTE TO GET ALL OF THE EXERCISES FROM THE WORKOUT ------------ //

module.exports = router;
