const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth.js");
const User  = require("../models/user.js");
const bcrypt = require("bcrypt");
const ConnectionRequests = require("../models/connectionRequest.js");
const User_Safe_Data = "firstname lastname email photoUrl age gender About ";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequests.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", User_Safe_Data);
    // .populate("fromUserId", ["firstname", "lastname", "email");

    res.json({
      messaage: " Data fetched succesfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionsRequest = await ConnectionRequests.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", User_Safe_Data)
    .populate("toUserId", User_Safe_Data);

    const data = connectionsRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data: data });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // A person shoud not see in his feed include
    // 1.Card of his own
    // card of people whom he sent request already
    // Card of people who rejected or accepted his request
    // 4.card of people who sent request to him but he rejected or acceted
    // 5.his connections

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequests.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hidenUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hidenUsersFromFeed.add(req.fromUserId.toString());
      hidenUsersFromFeed.add(req.toUserId.toString());
    });
    // console.log("hidenUsersFromFeed", hidenUsersFromFeed);

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hidenUsersFromFeed) } },
      ],
    })
      .select(User_Safe_Data)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/feed/seed", async (req, res) => {
  try {
    const seedProfiles = [
      {
        firstname: "Aarav",
        lastname: "Sharma",
        email: "aarav.sharma@example.com",
        password: "Password@123",
        gender: "male",
        age: 23,
        photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        About: "Frontend Architect who loves building clean React interfaces with Tailwind and Framer Motion.",
        skills: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
      },
      {
        firstname: "Isha",
        lastname: "Patel",
        email: "isha.patel@example.com",
        password: "Password@123",
        gender: "female",
        age: 25,
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        About: "Full Stack Engineer passionate about Rust, Node.js backend systems, and distributed caching.",
        skills: ["Node.js", "Rust", "Redis", "GraphQL"],
      },
      {
        firstname: "Kabir",
        lastname: "Mehta",
        email: "kabir.mehta@example.com",
        password: "Password@123",
        gender: "male",
        age: 28,
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        About: "Machine Learning Researcher. Teaching LLMs how to code better. Python is my mother tongue.",
        skills: ["Python", "PyTorch", "Hugging Face", "Scikit-Learn"],
      },
      {
        firstname: "Ananya",
        lastname: "Sen",
        email: "ananya.sen@example.com",
        password: "Password@123",
        gender: "female",
        age: 22,
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        About: "UI/UX enthusiast turned Web3 Developer. Building decentralized apps on Ethereum.",
        skills: ["Solidity", "Ethers.js", "Web3.js", "React"],
      },
      {
        firstname: "Rohan",
        lastname: "Das",
        email: "rohan.das@example.com",
        password: "Password@123",
        gender: "male",
        age: 26,
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        About: "DevOps Engineer. Automating the cloud one pipeline at a time. Kubernetes is my playground.",
        skills: ["Docker", "Kubernetes", "AWS", "GitHub Actions"],
      }
    ];

    let seedCount = 0;
    for (const profile of seedProfiles) {
      const existingUser = await User.findOne({ email: profile.email });
      if (!existingUser) {
        const passwordHash = await bcrypt.hash(profile.password, 10);
        const newUser = new User({
          ...profile,
          password: passwordHash,
        });
        await newUser.save();
        seedCount++;
      }
    }

    res.json({
      message: "Database seeded successfully!",
      seededUsersCount: seedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Seeding failed: " + error.message });
  }
});

module.exports = userRouter;
