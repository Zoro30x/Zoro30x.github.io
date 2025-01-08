import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Middleware to get the userId from headers (for authenticated routes only)
const authenticateUser = (req, res, next) => {
  const userId = req.headers["user-id"]; // Get userId from headers
  if (!userId) {
    return res.status(401).json({ message: "User not logged in" });
  }
  req.userId = userId; // Assign userId to request object
  next(); // Continue to next route handler
};

// Register a new user (No authentication required)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Route (No authentication required)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Return the user ID upon successful login
    res.json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User Details (Requires Authentication)
router.get("/details", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Movie to Watchlist (Requires Authentication)
router.post("/watchlist/add", authenticateUser, async (req, res) => {
  const { category, movie } = req.body;

  if (
    ![
      "moviesFavourites",
      "moviesWatchlater",
      "tvFavourites",
      "tvWatchlater",
    ].includes(category)
  ) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user[category].some((item) => item.id === movie.id)) {
      user[category].push(movie);
      await user.save();
    }

    res.status(200).json({ message: "Movie/TV series added to the list!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add movie/TV series to list" });
  }
});

// Fetch Watchlist (Requires Authentication)
router.get("/watchlist", authenticateUser, async (req, res) => {
  const { type } = req.query;

  if (
    ![
      "moviesFavourites",
      "moviesWatchlater",
      "tvFavourites",
      "tvWatchlater",
    ].includes(type)
  ) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user[type] || []);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Movie from Watchlist (Requires Authentication)
router.delete(
  "/watchlist/:listType/:movieId",
  authenticateUser,
  async (req, res) => {
    const { listType, movieId } = req.params;

    if (
      ![
        "moviesFavourites",
        "moviesWatchlater",
        "tvFavourites",
        "tvWatchlater",
      ].includes(listType)
    ) {
      return res.status(400).json({ message: "Invalid list type" });
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user[listType] = user[listType].filter((m) => m.id !== movieId);
      await user.save();
      res.json({
        message: "Movie removed from the list",
        list: user[listType],
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update Movie List (Change Category) (Requires Authentication)
router.put("/watchlist/move", authenticateUser, async (req, res) => {
  const { movie, fromList, toList } = req.body;

  if (
    ![
      "moviesFavourites",
      "moviesWatchlater",
      "tvFavourites",
      "tvWatchlater",
    ].includes(fromList) ||
    ![
      "moviesFavourites",
      "moviesWatchlater",
      "tvFavourites",
      "tvWatchlater",
    ].includes(toList)
  ) {
    return res.status(400).json({ message: "Invalid list type" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user[fromList] = user[fromList].filter((m) => m.id !== movie.id);
    user[toList].push(movie);

    await user.save();
    res.json({
      message: "Movie moved successfully",
      fromList: user[fromList],
      toList: user[toList],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
