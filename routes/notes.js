const express = require("express");
const router = express.Router();
const fetchuser = require("../middelware/fetchuser");
const Notes = require("../model/Notes");
const { body, validationResult } = require("express-validator");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

router.post("/addnewnote",fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savnote = await note.save();
      res.json(savnote);
    } catch (error) {
      console.log(error);
      res.status(500).send("Some Error Occurd");
    }
  }
);

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  const newNote = {};
  if (title) {
    newNote.title = title
  }
  if (description) {
    newNote.description = description
  }
  if (tag) {
    newNote.tag = tag
  }
  try {
    // find note
    let note =await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("not allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.log(error);
    res.status(500).send("Some Error Occurd");
  }
});

router.delete("/delete/:id", fetchuser, async (req, res) => {
    try {
      let note =await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("not found");
      }
      if (note.user.toString() != req.user.id) {
        return res.status(401).send("not allowed");
      }
      note = await Notes.findByIdAndDelete(req.params.id)
      console.log(note);
      res.json("successfully deleted " +note );
    } catch (error) {
      console.log(error);
      res.status(500).send("Some Error Occurd");
    }
  });

module.exports = router;
