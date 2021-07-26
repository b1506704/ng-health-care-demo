import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "express";
import random from "./middleware/RandomNumber.js";
import userRoutes from "./routes/users.js";
import roomRoutes from "./routes/rooms.js";
import billRoutes from "./routes/bills.js";
import medicineRoutes from "./routes/medicines.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import diseaseRoutes from "./routes/diseases.js";
import doctorRoutes from "./routes/doctors.js";
import imageRoutes from "./routes/images.js";
import scheduleRoutes from "./routes/schedules.js";
import medicalCheckupRoutes from "./routes/medical_checkups.js";
import customerRoutes from "./routes/customers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;
const dbUri = process.env.MONGODB_URI;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);
app.use("/bills", billRoutes);
app.use("/customers", customerRoutes);
app.use("/medicalCheckups", medicalCheckupRoutes);
app.use("/doctors", doctorRoutes);
app.use("/medicines", medicineRoutes);
app.use("/images", imageRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/diseases", diseaseRoutes);

mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => {}
    // app.listen(PORT, () =>
    //   console.log(`Server is running on port: http://localhost:${PORT}`)
    // )
  )
  .catch((error) => console.log(`${error} cannot connect`));

mongoose.set("useFindAndModify", false);

const server = app.listen(PORT, () =>
  console.log(`Server is running on port: http://localhost:${PORT}`)
);
const io = new Server(server, {
  cors: {
    origins: ["http://localhost:4200"],
  },
});

const conditions = {};
const messages = {};
const commands = {};

let isCo2 = true;
let isThermometer = true;
let isAneroid = true;
let isStethoscope = true;
let co2Switch = random(1, 100);
let thermometerSwitch = random(10, 90);
let aneroidSwitch = random(70, 200);
let stethoscopeSwitch = random(0, 210);
io.on("connection", (socket) => {
  let previousId;
  // to do: set interval these values

  const safeJoin = (currentId) => {
    socket.leave(previousId);
    socket.join(currentId, () =>
      console.log(`Socket ${socket.id} joined room ${currentId}`)
    );
    previousId = currentId;
  };

  socket.on("getCondition", (customerID) => {
    safeJoin(customerID);
    conditions[customerID] = {
      id: customerID,
      condition: {
        bloodPressure: aneroidSwitch,
        respiratoryRate: co2Switch,
        bodyTemperature: thermometerSwitch,
        heartRate: stethoscopeSwitch,
      },
    };
    io.to(customerID).emit("condition", conditions[customerID]);
  });

  socket.on("newCondition", (condition) => {
    conditions[condition.id] = condition;
    safeJoin(condition.id);
    io.emit("conditions", Object.keys(conditions));
    socket.emit("condition", condition);
  });

  socket.on("co2Switch", (power) => {
    isCo2 = power;
  });

  const co2Listener = () => {
    if (isCo2 === true) {
      co2Switch = random(1, 100);
    } else {
      co2Switch = 0;
    }
  };

  socket.on("co2", co2Listener);

  socket.on("thermometerSwitch", (power) => {
    isThermometer = power;
  });

  const thermometerListener = () => {
    if (isThermometer === true) {
      thermometerSwitch = random(10, 90);
    } else {
      thermometerSwitch = 0;
    }
  };

  socket.on("thermometer", thermometerListener);

  socket.on("aneroidSwitch", (power) => {
    isAneroid = power;
  });

  const aneroidListener = () => {
    if (isAneroid === true) {
      aneroidSwitch = random(70, 200);
    } else {
      aneroidSwitch = 0;
    }
  };

  socket.on("aneroid", aneroidListener);

  socket.on("stethoscopeSwitch", (power) => {
    isStethoscope = power;
  });

  const stethoscopeListener = () => {
    if (isStethoscope === true) {
      stethoscopeSwitch = random(0, 210);
    } else {
      stethoscopeSwitch = 0;
    }
  };

  socket.on("stethoscope", stethoscopeListener);

  socket.on("sendMessage", (message) => {
    console.log(message);
    io.to(previousId).emit("message", message);
  });

  socket.on("call", (command) => {
    console.log(command);
    io.to(previousId).emit("command", command);
  });

  io.emit("conditions", Object.keys(conditions));
  // chat history of system
  io.emit("messages", Object.keys(messages));

  console.log(`Socket ${socket.id} has connected`);
});

app.use(express.static("./client/dist/ng-health-care-demo"));

app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "./client/dist/ng-health-care-demo" });
});
