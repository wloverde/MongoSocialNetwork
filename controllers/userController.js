const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user by id
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId)
        .select("-__v")
        .populate("friends")
        .populate("thoughts");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete a user by id
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "No user with this id!" });
      }
      // Remove a user's associated thoughts when deleted
      const thought = await Thought.deleteMany({ username: user.username });

      res.json({ message: "User successfully deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user by id
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // add a friend
  async addFriend(req, res) {
    try {
      const user1 = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      const user2 = await User.findByIdAndUpdate(
        req.params.friendId,
        { $addToSet: { friends: req.params.userId } },
        { runValidators: true, new: true }
      );

      if (!user1 || !user2) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      const display = [user1, user2];
      res.json(display);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete a friend
  async deleteFriend(req, res) {
    try {
      const user1 = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      const user2 = await User.findByIdAndUpdate(
        req.params.friendId,
        { $pull: { friends: req.params.userId } },
        { runValidators: true, new: true }
      );

      if (!user1 || !user2) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      const display = [user1, user2];
      res.json(display);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
