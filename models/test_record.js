const mongoose = require("mongoose");

const TestRecordSchema = new mongoose.Schema(
  {
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
    commitSha: {
      type: String,
    },
    stage: [String],
    records: {
      type: mongoose.Schema.Types.Mixed,
    },
    duration: {
      type: Number,
    },
    pipelineUrl: {
      type: String,
    },
  },
  {
    capped: { size: 2000000, max: 400, autoIndexId: true },
  }
);

const TestRecord = (module.exports = mongoose.model(
  "test_record",
  TestRecordSchema
));
