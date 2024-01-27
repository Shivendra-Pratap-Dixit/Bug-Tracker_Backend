const express = require('express');
const router = express.Router();
const Bug = require('../Model/bug.model');

// GET all bugs
router.get('/bugs', async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.status(200).send(bugs);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// GET bug by ID
router.get('/bugs/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).send({ message: 'Bug not found' });
    }
    res.status(200).send(bug);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// POST create a new bug
router.post('/bugs', async (req, res) => {
  const { title, description, source, severity, raised_by } = req.body;

  try {
    const newBug = new Bug({
      title,
      description,
      source,
      severity,
      raised_by,
    });
    const savedBug = await newBug.save();
    res.status(201).send(savedBug);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// PUT/PATCH update a bug by ID
router.put('/bugs/:id', async (req, res) => {
  const { title, description, source, severity } = req.body;

  try {
    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        source,
        severity,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!updatedBug) {
      return res.status(404).send({ message: 'Bug not found' });
    }

    res.status(200).send(updatedBug);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// DELETE a bug by ID
router.delete('/bugs/:id', async (req, res) => {
  try {
    const deletedBug = await Bug.findByIdAndDelete(req.params.id);

    if (!deletedBug) {
      return res.status(404).send({ message: 'Bug not found' });
    }

    res.status(200).send({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
