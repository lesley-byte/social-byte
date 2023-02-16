const { Schema, model } = require("mongoose");
const thoughtSchema = require("./Thought");

//Schema to create User model, username and email are not immutable
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: "Username is required",
      trim: true,
    },
    email: {
      type: String,
      required: "Email is required",
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        // needs to be an array of the user ids that have already been created
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);


// create the User model using the UserSchema
const User = model("User", userSchema);

// get total count of friends array on retrieval
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});
// // get total count of users on retrieval
// userSchema.virtual("userCount").get(function () {
//   return this.users.length;
// });

// export the User model
module.exports = User;
