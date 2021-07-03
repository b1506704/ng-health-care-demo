import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "express";
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

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use(express.static("./client/dist/ng-health-care-demo"));

app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "./client/dist/ng-health-care-demo" });
});

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

const dbUri = process.env.MONGODB_URI;

mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server is running on port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} cannot connect`));

mongoose.set("useFindAndModify", false);
