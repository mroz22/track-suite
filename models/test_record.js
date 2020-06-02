const mongoose = require('mongoose');

const TestRecordSchema = new mongoose.Schema({
  jobUrl: {
    type: String,
  },
  branch: {
    type: String,
  },
  stage: [String],
  records: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const TestRecord = module.exports = mongoose.model('test_record', TestRecordSchema);
