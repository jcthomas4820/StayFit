const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipeSchema = new Schema(
  {
    id: { type: Number, require: true },
    ingredients: { type: Array, require: true },
    instructions: { type: Array, require: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Recipe', recipeSchema);