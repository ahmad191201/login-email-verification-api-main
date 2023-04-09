require("express-async-errors");
const dotenv = require("dotenv");
const express = require("express");

const app = express();
const cors = require('cors')

dotenv.config();
app.use(cors())
app.use(express.json());

const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");
const { sendOtp, verificationOtp } = require("./controllers/controller");

// routes
app.get("/", (req, res) => {
  res.send('OK');
});

app.get("/send-otp", sendOtp);
app.get("/verification", verificationOtp);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
