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
  stage: [String],
  records: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
   capped: { size: 1024, max: 10, autoIndexId: true }
});

const TestRecord = module.exports = mongoose.model('test_record', TestRecordSchema);
