const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  name: { type: String, default: 'My Dashboard' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  charts: [{
    queryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Query' },
    layout: {
      x: Number,
      y: Number,
      w: Number,
      h: Number
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);
