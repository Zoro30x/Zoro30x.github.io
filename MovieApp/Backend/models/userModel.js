import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  moviesFavourites: {
    type: Array, // Changed from Object to Array
    default: [],
  },
  moviesWatchlater: {
    type: Array, // Changed from Object to Array
    default: [],
  },
  moviesWatched: {
    type: Array, // Changed from Object to Array
    default: [],
  },
  tvFavourites: {
    type: Array, // Changed from Object to Array
    default: [],
  },
  tvWatchlater: {
    type: Array, // Changed from Object to Array
    default: [],
  },
  tvWatched: {
    type: Array, // Changed from Object to Array
    default: [],
  },
});

export default mongoose.model("User", userSchema);
