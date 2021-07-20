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

let patientData;
let patientStatus;
const documents = {};
const randomInterval = setInterval(() => {
  patientData = {
    bloodPressure: random(70, 200),
    sweat: random(1, 100),
    bodyTemperature: random(10, 90),
    heartRate: random(0, 210),
  };
  if (patientData.heartRate >= 180) {
    patientStatus = "CRITICAL";
  } else if (patientData.heartRate >= 110) {
    patientStatus = "NORMAL";
  } else if (patientData.heartRate >= 60) {
    patientStatus = "HEALTHY";
  } else if (patientData.heartRate >= 20) {
    patientStatus = "DYING";
  } else if (patientData.heartRate === 0) {
    patientStatus = "DEAD";
  }
}, 1200);

io.on("connection", (socket) => {
  let previousId;

  const safeJoin = (currentId) => {
    socket.leave(previousId);
    socket.join(currentId, () =>
      console.log(`Socket ${socket.id} joined room ${currentId}`)
    );
    previousId = currentId;
  };

  socket.on("getDoc", (docId) => {
    safeJoin(docId);
    socket.emit("document", documents[docId]);
  });

  socket.on("addDoc", (doc) => {
    documents[doc.id] = doc;
    safeJoin(doc.id);
    io.emit("documents", Object.keys(documents));
    socket.emit("document", doc);
  });

  socket.on("editDoc", (doc) => {
    documents[doc.id] = doc;
    socket.to(doc.id).emit("document", doc);
  });

  io.emit("documents", Object.keys(documents));

  console.log(`Socket ${socket.id} has connected`);

  // ...
});

app.use(express.static("./client/dist/ng-health-care-demo"));

app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "./client/dist/ng-health-care-demo" });
});
