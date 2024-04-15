const express = require("express");
const router = express.Router();

const TestRecord = require("../models/test_record");

// READ (ALL)
router.get("/", (req, res) => {
  const { branch } = req.query;
  TestRecord.find({ branch })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

router.get("/branches", (req, res) => {
  TestRecord.distinct("branch")
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE
router.post("/", (req, res) => {
  let newRecord = new TestRecord({
    ...req.body,
    branch: req.body.branch.replaceAll("/", "-"),
  });
  newRecord
    .save()
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
        res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

module.exports = router;
