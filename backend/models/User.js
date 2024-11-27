const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (email) {
        const count = await mongoose.models.User.countDocuments({ email });
        return count === 0;
      },
      message: "Email déjà utilisé !",
    },
  },
});

module.exports = mongoose.model("User", userSchema);