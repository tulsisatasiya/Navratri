
const express = require("express");
const route = express.Router();
const userRoute = require("./user.routes");
const CategoryRoute = require("./Category.routes");
const subcategoryRoute = require("./subcategory.routes");
const ticketRoute = require("./ticket.route");
const bookingRoute = require("./booking.routes");
const verifyRoutes = require("./verify.routes");
const ticketDetailsRoutes = require("./ticketDetails.routes");
const eventRoutes = require("./event.routes");

route.use("/user", userRoute);
route.use("/Category", CategoryRoute);
route.use("/subcategory", subcategoryRoute);
route.use("/ticket", ticketRoute);
route.use("/booking", bookingRoute);
route.use("/verify", verifyRoutes);
route.use("/ticketDetails", ticketDetailsRoutes);
route.use("/event", eventRoutes);


module.exports = route;
