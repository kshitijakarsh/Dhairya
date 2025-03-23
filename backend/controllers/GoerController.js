import User from "../models/UserSchema.js";
import GymGoer from "../models/GoerSchema.js";
import GoerDashboard from "../models/GoerDashboardSchema.js";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const {
      age,
      gender,
      height,
      currentWeight,
      targetWeight,
      calorieTarget,
      fitnessGoals,
      programmes,
      gymEnrolled,
      gymName,
      budget,
    } = req.body;

    let gymGoer = await GymGoer.findOne({ user: userId });
    if (!gymGoer) {
      return res.status(404).json({ message: "GymGoer profile not found" });
    }

    if (gymGoer.userDashboard) {
      return res.status(400).json({ message: "Dashboard already exists" });
    }

    const weightEntry = {
      weight: parseFloat(currentWeight),
      date: new Date().toISOString(),
    };

    const dashboard = new GoerDashboard({
      userId,
      profile: {
        age,
        gender,
        height,
        fitnessGoals,
        programs: programmes,
      },
      userDetails: {
        gymEnrolled,
        gymName: gymEnrolled ? gymName : null,
        budget,
      },
      monthlyData: [weightEntry],
      targetWeight,
      calorieTarget,
    });

    await dashboard.save();

    gymGoer.userDashboard = dashboard._id;
    await gymGoer.save();

    res.status(201).json({
      message: "Profile created successfully",
      dashboard,
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({
      message: "Error creating profile",
      error: error.message,
    });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    let gymGoer = await GymGoer.findOne({ user: userId });
    if (!gymGoer) {
      return res.status(404).json({ message: "GymGoer profile not found" });
    }

    let dashboard_id = gymGoer.userDashboard;
    if(!dashboard_id){
      res.status(404).json("no dashboard present")
    }
    const dashboard = await GoerDashboard.findById(dashboard_id);
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard data missing. Please complete your profile setup." });
    }
    res.status(200).json({
      success: true,
      message: "Dashboard retrieved successfully",
      dashboard,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res
      .status(500)
      .json({ message: "Error fetching dashboard", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    let gymGoer = await GymGoer.findOne({ user: userId });
    if (!gymGoer) {
      return res.status(404).json({ message: "GymGoer profile not found" });
    }

    if (!gymGoer.userDashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    const dashboardId = gymGoer.userDashboard;
    const dashboard = await GoerDashboard.findById(dashboardId);

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard data missing." });
    }

    const updateOperations = {};
    const arrayFilters = [];

    if (updates.attendance) {
      const { month, day } = updates.attendance;

      const existingMonth = dashboard.attendance.find(
        (entry) => entry.month === month
      );

      if (existingMonth) {
        updateOperations.$addToSet = {
          "attendance.$[elem].daysPresent": day,
        };
        arrayFilters.push({ "elem.month": month });
      } else {
        updateOperations.$push = {
          attendance: {
            month: month,
            daysPresent: [day],
          },
        };
      }
    }

    if (updates.currentWeight) {
      updateOperations.$push = {
        monthlyData: {
          weight: updates.currentWeight,
          date: new Date().toISOString(),
        },
      };
    }

    if (updates.userDetails) {
      for (const key in updates.userDetails) {
        updateOperations.$set = updateOperations.$set || {};
        updateOperations.$set[`userDetails.${key}`] = updates.userDetails[key];
      }
    }

    updateOperations.$set = {
      ...updateOperations.$set,
      lastUpdated: Date.now(),
    };

    if (Object.keys(updateOperations).length > 0) {
      const updateOptions = {
        new: true,
        runValidators: true,
        arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined,
      };

      const updatedDashboard = await GoerDashboard.findByIdAndUpdate(
        dashboardId,
        updateOperations,
        updateOptions
      );

      console.log("✅ Dashboard update successful:", updatedDashboard);
      return res.json({
        message: "Dashboard updated successfully",
        dashboard: updatedDashboard,
      });
    }

    console.warn("⚠️ No valid updates provided");
    return res.status(400).json({ message: "No valid updates provided" });

  } catch (error) {
    console.error("🔥 Update error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// export const getUserEnrollments = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId).populate({
//       path: "memberships",
//       populate: {
//         path: "gym",
//         model: "Gym",
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ enrolledGyms: user.enrolledMemberships });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export default {
  createProfile,
  getUserDashboard,
  updateProfile,
};
