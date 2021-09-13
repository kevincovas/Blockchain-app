// Skeleton API
const { pool } = require("./db");
// Mail API
const mailjet = require("../utils/mail");

// Get Hairdressers by Role
const getHairdressersSQL = `select people.id , people.name , surname_1 , COALESCE(surname_2 , '') as surname_2 from users 
inner join people on people.id = users.id 
inner join user_roles on user_roles.user_id = users.id
inner join roles on roles.id = user_roles.role_id
where roles.name = 'hairdresser'; `;

// Get Products of type Service
const getServicesSQL = ` select id , name , description , duration from products where is_service = true `;

// Get Booked Services for one specific day
const getReservationsByDaySQL = ` select * from reservations where to_char(date_ini , 'YYYY-MM-DD') = $1 `;

// Add Reservation into Database
const addReservationSQL = ` insert into reservations ( person_id , booked_employee_id , created_by_id , date_ini , date_end )
values ( $1 , $2 , $3 , $4 , $5 ) returning id `;

// Add Booked Services into Database
const addBookedServicesSQL = `

insert into booked_services(reservation_id , product_id)
select
   $1, u.val
from
unnest($2::integer[]) as u(val);

`;

const getServices = async () => {
  try {
    const result = await pool.query(getServicesSQL);
    //Check if services
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //Services not found
    }
    return { ok: true, found: true, data: result.rows }; //Services found
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const getHairdressers = async () => {
  try {
    const result = await pool.query(getHairdressersSQL);
    //Check if employees
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //Employees not found
    }
    return { ok: true, found: true, data: result.rows }; //Employees found
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const getReservationsByDay = async (DATE) => {
  try {
    const result = await pool.query(getReservationsByDaySQL, [DATE]);
    //Check Reservations in one day
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //Not reservations this day
    }
    return { ok: true, found: true, data: result.rows }; //We have reservations this day
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

function sendMail()
{
  const mailjet = require("node-mailjet").connect(
    "d1280878f3cb52d5c406cc6c4009d1d3",
    "4e000ea74e8233bfbe68ee08770edbf4"
  );
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "aitor.java@gmail.com",
          Name: "Aitor",
        },
        To: [
          {
            Email: "aitor.java@gmail.com",
            Name: "Aitor",
          },
        ],
        Subject: "Greetings from Mailjet.",
        TextPart: "My first Mailjet email",
        HTMLPart:
          "<h3>Dear passenger 1, welcome to <a href='Mailjet - Email Delivery Service for Marketing & Developer Teams'>Mailjet</a>!</h3><br />May the delivery force be with you!",
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
}

// Add Reservation and obtain ID
const addReservation = async (
  person_id,
  booked_employee_id,
  created_by_id,
  date_ini,
  date_end,
  booked_services
) => {
  try {

    // Add Reservation
    const result = await pool.query(addReservationSQL, [
      person_id,
      booked_employee_id,
      created_by_id,
      date_ini,
      date_end,
    ]);

    // Add Booked Services
    const result2 = await pool.query(addBookedServicesSQL, [
      result.rows[0].id  ,
      booked_services
    ]);

  /*  console.log(mailjet);*/
  await mailjet.sendEmail()
  //  const test = await mailjet();

 //   sendMail();






    return { ok: true, data: result.rows[0].id };
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

// Add Services to Booked Reservation
const addBookedServices = async (reservation_id, booked_services) => {
  try {
    const result = await pool.query(addBookedServicesSQL, [booked_services]);
    return { ok: true, data: result };
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

module.exports = {
  getHairdressers,
  getServices,
  getReservationsByDay,
  addReservation,
  addBookedServices,
};
