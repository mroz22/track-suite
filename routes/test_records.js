const express = require('express');
const router = express.Router();

const TestRecord = require('../models/test_record');

// READ (ALL)
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
  console.log(req.body);
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
