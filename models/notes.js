const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema(
  {
    text: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), required: true},
    lastUpdated: {type: Date, required: true}
  });

const Notes = mongoose.model('Notes', NotesSchema);
module.exports = Notes;
