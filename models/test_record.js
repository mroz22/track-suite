const mongoose = require('mongoose');

const TestRecordSchema = new mongoose.Schema({
  jobUrl: {
    type: String,
  },
  jobId: {
    type: String,
  },
  branch: {
    type: String,
  },
  commitMessage: {
    type: String,
  },
  stage: [String],
  records: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
   capped: { size: 1000000, max: 200, autoIndexId: true }
});

const TestRecord = module.exports = mongoose.model('test_record', TestRecordSchema);
