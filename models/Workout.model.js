const { Schema, model } = require('mongoose');

const workoutSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    notes: String,
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workout = model('Workout', workoutSchema);

module.exports = Workout;
