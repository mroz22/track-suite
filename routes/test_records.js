const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');

const TestRecord = require('../models/test_record');

// Attempt to limit spam post requests for inserting data
const minutes = 5; 
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs 
  delayMs: 0, // Disable delaying - full speed until the max limit is reached 
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
  }
});

// READ (ALL)
router.get('/', (req, res) => {
  console.log('read all');
  TestRecord.find({})
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE
router.post('/', postLimiter, (req, res) => {
  // Validate the age
  let newRecord = new TestRecord(req.body);
  newRecord.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.errors) {
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

module.exports = router;
