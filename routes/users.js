const { Router } = require("express");
const app = Router();

const db = require("../prisma/db");
const { randomUUID } = require("crypto");

app.route("/:userId").get(async (req, res) => {
  if (req.headers?.type !== "admin") {
    return res
      .json({
        message: "Unauthorized",
      })
      .status(401);
  }

  const userId = req.params.userId;

  try {
    const user = await db.users.findFirst({
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        emailId: true,
        contactNumber: true,
        profileUrl: true,
        type: true,
      },
      where: { userId },
    });

    console.log("fetched");
    return res.json({ message: "fetched", user }).status(200);
  } catch (e) {
    console.log("ERROR: ", e.message);
    return res
      .json({
        message: "unable to fetch user",
      })
      .status(500);
  }
});

app.route("/signup").post(async (req, res) => {
  const payload = req.body;

  console.log(payload);

  try {
    const exist = await db.users.findFirst({
      select: {
        userId: true,
      },
      where: {
        emailId: payload?.emailId,
      },
    });

    if (exist) {
      return res
        .json({
          message: "Email id already exist, try different email id",
        })
        .status(409);
    }

    const bcrypt = require("bcrypt");
    const saltRounds = 18;

    const hash = await bcrypt.hash(payload?.password, saltRounds);

    const user = await db.users.create({
      data: {
        firstName: payload?.name.split(" ")[0],
        lastName: payload?.name.split(" ")[1],
        emailId: payload?.emailId,
        password: hash,
      },
    });

    console.log("fetched");
    return res.json({ message: "Account created successfully", userId: user.userId }).status(201);
  } catch (e) {
    console.log("ERROR: ", e.message);
    return res
      .json({ message: "Unable to signup", error: e.message })
      .status(400);
  }
});

app.route("/login").post(async (req, res) => {
  const payload = req.body;

  try {
    const existingUserByEmailId = await db.users.findFirst({
      where: {
        emailId: payload?.emailId,
      },
    });

    if (!existingUserByEmailId) {
      return res.json({ message: "Email id not found", data: null });
    }

    const bcrypt = require("bcrypt");

    const isPasswordCorrect = await bcrypt.compare(
      payload?.password,
      existingUserByEmailId?.password
    );

    if (!isPasswordCorrect) {
      return res.json({ message: "Password doesnt Match", data: null });
    }

    res
      .json({
        message: "user details fetched",
        data: { user: existingUserByEmailId },
      })
      .status(200);
  } catch (e) {
    console.log(e.message);
    return res.json({ message: "Something went wrong" }).status(500);
  }
});

module.exports = app;
