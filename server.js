// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/connectDb.js"; // تأكد من أن لديك ملف الاتصال بقاعدة البيانات
import dotenv from "dotenv";
import moviesRoute from "./router/moviesRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route

// ---------------------------------
// Movies
// ---------------------------------
app.use("/api/movie", moviesRoute);

// ---------------------------------
// Tickets
// ---------------------------------
app.get("/reservations", async (req, res) => {
  const query = `
        SELECT 
            r.reservation_num, 
            a.auditorium_name, 
            m.title, 
            DATE_FORMAT(s.start_time, '%Y-%m-%d') AS start_date,  
            CONCAT(
                DATE_FORMAT(s.start_time, '%H:%i'), 
                '-', 
                DATE_FORMAT(DATE_ADD(s.start_time, INTERVAL m.play_time MINUTE), '%H:%i')
            ) AS time,  
            m.play_time,  
            GROUP_CONCAT(CONCAT('R',s2.seat_row, '-', s2.seat_num) ORDER BY s2.seat_row, s2.seat_num SEPARATOR ', ') AS seats,  
            CONCAT(COUNT(t.id), ' ', t.ticket_name) AS ticket_details,  
            SUM(t.price) AS total_price  
        FROM reservation r
        INNER JOIN reservation_ticket rt ON rt.reservation_id = r.id  
        JOIN ticket t ON t.id = rt.ticket_id
        JOIN screening s ON s.id = r.screening_id
        JOIN res_seat_screen rss ON s.id = rss.screening_id  
        JOIN seat s2 ON rss.seat_id = s2.id
        JOIN movie m ON m.id = s.movie_id
        JOIN auditorium a ON a.id = s.auditorium_id
        GROUP BY 
            r.reservation_num, 
            a.auditorium_name, 
            m.title, 
            DATE_FORMAT(s.start_time, '%Y-%m-%d'),
            time,
            m.play_time,  
            t.ticket_name;
    `;

  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// ---------------------------------
// Starting the server
// ---------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
