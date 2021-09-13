const db = require("../db/db_reservations");
const { Router } = require("express");

const router = new Router();

const okResult = (results) => ({ status: "OK", results });
const errorResult = (details) => ({ status: "ERROR", details });

// Get All Hairdressers
router.get("/hairdressers", async (req, res) => {
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
router.get("/services", async (req, res) => {
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
router.get("/check/:date", async (req, res) => {
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
router.post("/add", async (req, res) => {
  const { person_id , booked_employee_id , created_by_id , date_ini , date_end , booked_services } = req.body;


  
  // TODO Double Check if Reservation available at the moment
  // Add Reservation
const {ok , data} = await db.addReservation( person_id , booked_employee_id , created_by_id , date_ini , date_end , booked_services);
if (!ok)
{
  return res.status(500).json(errorResult(data));
}
else
{
  return res.json(okResult(data));
}

});

module.exports = router;
