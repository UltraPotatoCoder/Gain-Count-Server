const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  title: String,
  description: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  imgUrl: String,
});

module.exports = model('Project', projectSchema);
