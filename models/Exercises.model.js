const { Schema, model } = require('mongoose');

const exerciseSchema = new Schema(
  {
    workout: {
      type: Schema.Types.ObjectId,
      ref: 'Workout',
    },
    name: {
      type: String,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Exercise = model('Exercise', exerciseSchema);

module.exports = Exercise;
