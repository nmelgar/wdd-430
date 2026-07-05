const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uniqueValidatorPlugin = uniqueValidator.default || uniqueValidator;

const documentSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  children: [{ type: mongoose.Schema.Types.Mixed }],
});

documentSchema.plugin(uniqueValidatorPlugin);

module.exports = mongoose.model('Document', documentSchema);