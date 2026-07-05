const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uniqueValidatorPlugin = uniqueValidator.default || uniqueValidator;

const contactSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  imageUrl: { type: String },
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
});

contactSchema.plugin(uniqueValidatorPlugin);

module.exports = mongoose.model('Contact', contactSchema);