import mongoose from "mongoose";

const UserDashboardSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    monthlyData: [{
      date: {
        type: String,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      }
    }],
    attendance: [{
      month: {
        type: String,
        required: true
      },
      daysPresent: [{
        type: Number,
        min: 1,
        max: 31
      }]
    }],
    targetWeight: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    calorieTarget: {
      type: Number,
      default: null
    },
    currentWeight: {
      type: Number,
      default: null
    }
  });
  
  const UserDashboard = mongoose.model('UserDashboard', UserDashboardSchema);
  
  export default UserDashboard;