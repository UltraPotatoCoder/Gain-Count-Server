const router = require('express').Router();
const Workout = require('../models/Workout.model');
const User = require('../models/User.model');

//? ------------ ROUTE TO POST A NEW WORKOUT FOR ONE USER ------------ //

router.post('/workout', async (req, res, next) => {
  const { name, date, time, duration, notes, exercises, user } = req.body;

  try {
    const newWorkout = await Workout.create({
      name,
      date,
      time,
      duration,
      notes,
      exercises,
      user,
    });

    const updatedUser = await User.findById(user);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    updatedUser.workouts.push(newWorkout._id);

    await updatedUser.save();

    res.status(201).json(newWorkout);
  } catch (error) {
    next(error);
  }
});

//? ------------ ROUTE TO GET ALL THE WORKOUTS FROM A USER ------------ //

router.get('/workouts/:userId', async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('workouts');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const workouts = user.workouts;

    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
});

//! ------------ ROUTE TO DELETE A WORKOUT FOR A USER ------------ //

router.delete('/workouts/:userId/:workoutId', async (req, res, next) => {
  const userId = req.params.userId;
  const workoutId = req.params.workoutId;

  try {
    await Workout.findByIdAndDelete(workoutId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.workouts.indexOf(workoutId);
    if (index === -1) {
      return res
        .status(404)
        .json({ message: 'Workout not found for this user' });
    }

    user.workouts.splice(index, 1);
    await user.save();

    res.status(202).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
