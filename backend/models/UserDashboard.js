import mongoose from "mongoose";

const UserDashboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profile: {
      age: { type: Number },
      gender: { type: String, enum: ["male", "female", "other"] },
      height: { type: Number },
      fitnessGoals: [
        {
          type: String,
          enum: [
            "Weight Loss & Fat Reduction",
            "Muscle Gain & Toning",
            "Increasing Strength & Endurance",
            "Improving Flexibility & Mobility",
            "Overall Health & Wellness",
          ],
        },
      ],
      programs: [
        {
          type: String,
          enum: [
            "Cardio",
            "Weightlifting",
            "Zumba",
            "CrossFit",
            "Yoga",
            "Boxing",
            "HIIT",
            "Pilates",
            "Calisthenics",
            "Powerlifting",
            "Bodybuilding",
            "Olympic Weightlifting",
            "Kickboxing",
            "Spinning",
            "Athletic Conditioning",
            "Circuit Training",
            "Martial Arts",
            "Swimming",
            "Functional Training",
          ],
        },
      ],
      medicalConditions: { type: String },
      dietaryRestrictions: { type: String },
    },

    userDetails: {
      budget: { type: String },
      gymEnrolled: { type: Boolean, default: false },
      gymName: {
        type: String,
        validate: {
          validator: function (value) {
            return this.userDetails.gymEnrolled ? !!value : true;
          },
          message: "Gym name is required when gymEnrolled is true",
        },
      },
      location: { type: String },
    },

    monthlyData: [
      {
        date: { type: String, required: true },
        weight: { type: Number, required: true },
      },
    ],

    attendance: [
      {
        month: { type: String, required: true },
        daysPresent: [{ type: Number, min: 1, max: 31 }],
      },
    ],

    targetWeight: { type: Number, default: null },
    calorieTarget: { type: Number, default: null },
  },
  { timestamps: true }
);

const UserDashboard = mongoose.model("UserDashboard", UserDashboardSchema);

export default UserDashboard;
