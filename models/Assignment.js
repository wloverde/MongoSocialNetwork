const { Schema, Types } = require("mongoose");
const moment = require("moment");

const reactionSchema = new Schema(
  // Schema for Reaction model
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (formatDate) =>
        moment(formatDate)
          .tz("America/Chicago")
          .format("MM[/]DD[/]YYYY, hh:mm A z"),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;
