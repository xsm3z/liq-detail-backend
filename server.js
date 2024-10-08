const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const testJWTRouter = require("./controllers/jwt");
const usersRouter = require("./controllers/users");
const profilesRouter = require("./controllers/profiles");
const bookingsRouter = require("./controllers/bookings");
const vehiclesRouter = require("./controllers/vehicles");
const servicesRouter = require("./controllers/services");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

app.use(cors());

app.use("/jwt", testJWTRouter);
app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);
app.use("/bookings", bookingsRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/services", servicesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
