require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db/dbConnect");
const routes = require("./routes");
const cookieParser = require("cookie-parser");


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


//routes
app.use("/v1", routes);

// Database Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5001;
http.createServer(app).listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
