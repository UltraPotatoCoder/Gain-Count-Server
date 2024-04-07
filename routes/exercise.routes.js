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

router.get('/exercises/:workoutId', async (req, res, next) => {
  const workoutId = req.params.workoutId;

  try {
    const workout = await Workout.findById(workoutId).populate('exercises');

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const exercises = workout.exercises;

    res.status(200).json(exercises);
  } catch (error) {
    next(error);
  }
});

//? ------------ ROUTE TO UPDATE A CERTAIN EXERCISE INFORMATION ------------ //

router.put('/exercise/:exerciseId', async (req, res, next) => {
  const exerciseId = req.params.exerciseId;
  const { name, sets, reps, weight, notes, duration } = req.body;

  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      {
        name,
        sets,
        reps,
        weight,
        notes,
        duration,
      },
      { new: true }
    );

    if (!updatedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.status(204).json(updatedExercise);
  } catch (error) {
    next(error);
  }
});

//! ------------ ROUTE TO DELETE AN EXERCISE FORM THE WORKOUT ------------ //

router.delete('/exercise/:workoutId/:exerciseId', async (req, res, next) => {
  const workoutId = req.params.workoutId;
  const exerciseId = req.params.exerciseId;

  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const index = workout.exercises.indexOf(exerciseId);
    if (index === -1) {
      return res
        .status(404)
        .json({ message: 'Exercise not found for this workout' });
    }

    workout.exercises.splice(index, 1);
    await workout.save();

    await Exercise.findByIdAndDelete(exerciseId);

    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
