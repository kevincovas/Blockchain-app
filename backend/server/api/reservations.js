const db = require("../db/db_reservations");
const { Router } = require("express");
const router = new Router();
const okResult = (results) => ({ status: "OK", results });
const errorResult = (details) => ({ status: "ERROR", details });
const {
  sendEmail,
  from_mail,
  from_name,
  text_part,
  custom_id,
} = require("../utils/mail");

// Mail API
//const mailjet = require("../utils/mail");

// Get All Hairdressers
router.get("/hairdressers/", async (req, res) => {
  const { ok, found, data } = await db.getHairdressers();
  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    // If not hairdressers found
    return res.status(400).json(errorResult(`Hairdressers doesn't exist`));
  } else {
    //Si hay usuarios
    return res.json(okResult(data));
  }
});

// Get Services List
router.get("/services/", async (req, res) => {
  const { ok, found, data } = await db.getServices();
  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    // If not services found
    return res.status(400).json(errorResult(`Services doesn't exist`));
  } else {
    //Si hay usuarios
    return res.json(okResult(data));
  }
});

//Get Reservations in one Day
router.get("/check/:date/", async (req, res) => {
  const { ok, data } = await db.getReservationsByDay(req.params.date);
  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else {
    //If we have reservations
    return res.json(okResult(data));
  }
});

//Add Reservation
router.post("/add/", async (req, res) => {
  const {
    person_id,
    booked_employee_id,
    created_by_id,
    date_ini,
    date_end,
    booked_services,
    mail_content,
  } = req.body;

  // Add Reservation
  const { ok, data } = await db.addReservation(
    person_id,
    booked_employee_id,
    created_by_id,
    date_ini,
    date_end,
    booked_services
  );
  if (!ok) {
    return res.status(500).json(errorResult(data));
  } else {
    // Get Mail from User
    const { ok, data } = await db.getMailFromPerson(person_id);

    // Everything OK
    if (ok) {
      // TODO
      let subject = "Confirmación de reserva";

      // Send Mail via Mailjet
      await sendEmail(
        from_mail,
        from_name,
        data,
        "",
        subject,
        text_part,
        mail_content,
        custom_id
      );
    }
    return res.json(okResult(data));
  }
});

module.exports = router;
