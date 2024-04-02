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

//? ------------ ROUTE TO DELETE A WORKOUT FOR A USER ------------ //

module.exports = router;
