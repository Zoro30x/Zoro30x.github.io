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
    type: Array,
    default: [],
  },
  moviesWatchlater: {
    type: Array,
    default: [],
  },
  moviesWatched: {
    type: Array,
    default: [],
  },
  tvFavourites: {
    type: Array,
    default: [],
  },
  tvWatchlater: {
    type: Array,
    default: [],
  },
  tvWatched: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("User", userSchema);
