import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/hello", async (req, res) => {
  res.send({ greetings: "Hello" });
});

// error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Womp womp... something broke...");
});

// start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
