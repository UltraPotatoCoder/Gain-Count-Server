const router = require('express').Router();
const Workout = require('../models/Workout.model');
const User = require('../models/User.model');

//? ------------ ROUTE TO POST A NEW WORKOUT ------------ //

router.post('/workout', async (req, res, next) => {
  const { user, date, time, duration, notes, exercises } = req.body;

  try {
    const newWorkout = await Workout.create({
      user,
      date,
      time,
      duration,
      notes,
      exercises,
    });

    res.status(201).json(newWorkout);
  } catch (error) {
    next(error);
  }
});

//? ------------ ROUTE TO GET ALL THE WORKOUTS FROM A USER ------------ //

router.get('/workout/:userId/workouts', async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const workouts = await Workout.find({ user: userId }).populate('exercises');
    res.json(workouts);
  } catch (error) {
    console.log('Error getting workouts for user', error);
    next(error);
  }
});

//? ------------ ROUTE TO DELETE A WORKOUT FOR A USER ------------ //

router.delete(
  '/workout/user/:userId/workouts/:workoutId',
  async (req, res, next) => {
    const userId = req.params.userId;
    const workoutId = req.params.workoutId;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const workout = await Workout.findOne({ _id: workoutId, user: userId });
      if (!workout) {
        return res
          .status(404)
          .json({ message: 'Workout not found for this user' });
      }

      await Workout.findByIdAndDelete(workoutId);

      res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
      console.log('Error deleting workout', error);
      next(error);
    }
  }
);

module.exports = router;
