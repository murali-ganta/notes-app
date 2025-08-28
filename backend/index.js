require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

// Models import
const bcrypt = require("bcrypt");
const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticationToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  // fields validations
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  // DB Query - findOne
  const isUser = await User.findOne({ email: email });

  // Verifies User existence
  if (isUser) {
    return res.json({
      error: true,
      message: "User already exist",
    });
  }

  // Hash the password before saving
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Creation of NewUser if user is not available
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  // Saving the NewUser details to DB - save() method.
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  // Success Message
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Fields validations
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // // DB Query - findOne
  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  // Verifies the provided credentials with DB User Credentials
  const isMatch = await bcrypt.compare(password, userInfo.password);
  if (isMatch) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    // Success Message
    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    // Error Message
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }
});

// Get User
app.get("/get-user", authenticationToken, async (req, res) => {
  const { user } = req.user;

  // User Data with User Id
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  // User Details
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

// Add Note
app.post("/add-note", authenticationToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  // Field Validations
  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  // Add New Note
  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    // Saving note to DB
    await note.save();

    // Success Message
    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    // Error Message
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticationToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  //  No changes in Note
  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  // Find Note with Note ID and User ID
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    // Check if note exists or not
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // If Exists - Update Note
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    // Save Updated Note
    await note.save();

    // Success Message
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    // Error Message
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get All Notes
app.get("/get-all-notes", authenticationToken, async (req, res) => {
  // Fetching User details
  const { user } = req.user;

  // Retrieving all notes based on User ID
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    // Success Message
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    // Error Message
    return res.status(500).json({
      error: false,
      message: "Internal Server Error",
    });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticationToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    // Check if note exists or not
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // Delete the note
    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Update isPinned value
app.put(
  "/update-note-pinned/:noteId",
  authenticationToken,
  async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });

      if (!note) {
        return res.status(404).json({ erroe: true, message: "Note not found" });
      }

      // Updating isPinned Note value
      note.isPinned = isPinned;

      await note.save();

      // Success Message
      return res.json({
        error: false,
        note,
        message: "Note updated successfully",
      });
    } catch (error) {
      // Error Message
      return res.status(500).json({
        error: true,
        message: "Internal server Error",
      });
    }
  }
);

// Search Notes
app.get("/search-notes/", authenticationToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  // Query Parameters validation
  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    // Find Query
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      // Success Message
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    // Error Message
    return res
      .status(500)
      .json({ error: true, message: "Inernal Server Error" });
  }
});

app.listen(8000);

module.exports = app;
