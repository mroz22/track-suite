const mongoose = require('mongoose');

const TestRecordSchema = new mongoose.Schema({
  // project: {
  //   type: String,
  //   required: [true, 'project is required.'],
  // },
  record: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const TestRecord = module.exports = mongoose.model('test_record', TestRecordSchema);
