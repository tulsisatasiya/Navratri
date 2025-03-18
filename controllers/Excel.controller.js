const ExcelJS = require("exceljs");
const Booking = require("../models/booking.model");

const exportBookingsToExcel = async (req, res) => {
    try {
        console.log("Request received for exporting Excel file...");

        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("ticket", "name price")
            .exec();

        console.log("Exporting bookings:", bookings.length, "records found");

        if (!bookings || bookings.length === 0) {
            console.log("No bookings found");
            return res.status(404).json({ success: false, message: "No bookings found" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Bookings");

        worksheet.columns = [
            { header: "Booking ID", key: "_id", width: 25 },
            { header: "User Name", key: "userName", width: 20 },
            { header: "User Email", key: "userEmail", width: 25 },
            { header: "Ticket Name", key: "ticketName", width: 20 },
            { header: "Quantity", key: "quantity", width: 10 },
            { header: "Total Price", key: "totalPrice", width: 15 },
            { header: "Status", key: "status", width: 15 },
            { header: "Created At", key: "createdAt", width: 20 },
        ];

        bookings.forEach((booking) => {
            worksheet.addRow({
                _id: booking._id?.toString() || "N/A",
                userName: booking.user?.name || "N/A",
                userEmail: booking.user?.email || "N/A",
                ticketName: booking.ticket?.name || "N/A",
                quantity: booking.quantity || 0,
                totalPrice: booking.totalPrice || 0,
                status: booking.status || "N/A",
                createdAt: booking.createdAt ? booking.createdAt.toISOString() : "N/A",
            });
        });

        console.log("Workbook created successfully!");

        //  download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=bookings.xlsx");
        res.setHeader("Content-Transfer-Encoding", "binary");

       
        await workbook.xlsx.write(res);
        res.end();
        console.log("Excel file sent successfully!");

    } catch (error) {
        console.error("Error exporting bookings:", error);
        return res.status(500).json({ success: false, message: "Error exporting bookings", error: error.message });
    }
};


module.exports = { exportBookingsToExcel };




