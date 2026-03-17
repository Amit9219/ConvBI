const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  columns: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['string', 'number', 'date', 'boolean', 'mixed'], required: true }
  }],
  data: [{ type: mongoose.Schema.Types.Mixed }] // Storing records natively
}, { timestamps: true });

module.exports = mongoose.model('Dataset', datasetSchema);
