import db from "../config/connectDb.js";
const getAllReservations = async (req, res) => {
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
};

const getReservationByNumber = async (req, res) => {
  const { reservation_num } = req.params; // الحصول على رقم الحجز من الـ URL
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
        WHERE r.reservation_num = ?
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
    db.query(query, [reservation_num], (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      res.json(results[0]);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export default { getAllReservations, getReservationByNumber };
