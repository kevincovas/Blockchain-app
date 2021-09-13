import React, { useEffect, useState } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import * as api from "../api/Reservations";
import * as constnt from "../config/const";

function Reservations() {
  // Calendar Status
  const [state, setState] = useState({ selectedDay: new Date() });
  // TODO See Calendar with full days
  const [disabledDays, setDisabledDays] = useState();

  // Employee
  const [employee, setEmployee] = useState("");
  const [employeeList, setEmployeeList] = useState([]);

  // Services Availables
  const [service, setService] = useState("0");
  const [servicesList, setServicesList] = useState([]);

  // Services Contracted
  const [servicesContracted, setServicesContracted] = useState([]);

  // Timeframes
  const [timeframe, setTimeFrame] = useState(null);
  const [timeframeList, setTimeFrameList] = useState([]);

  // USE EFECTS ////////////////////////////////////////////////////////////////////////////////////
  // Valores Iniciales
  useEffect(() => {
    // Peluqueros
    loadEmployeeList();

    // Servicios
    loadServicesList();

    // TODO Disabled Days (Weekend + Full days)
    setDisabledDays([
      { daysOfWeek: [0] },
      {
        before: new Date(),
      },
    ]);
  }, []);

  // Effects to Restart Calendar and Read Availability
  useEffect(() => {
    // Load Available Schedules on this day
    loadAvailability();
  }, [state.selectedDay, employee, servicesContracted]);

  // USE EFECTS ////////////////////////////////////////////////////////////////////////////////////

  // FILL LISTS ////////////////////////////////////////////////////////////////////////////////////

  // Read From Database
  // Hairdresser
  let listEmployee = null;
  if (employeeList.length == 0) listEmployee = <div>Loading employees...</div>;
  else {
    listEmployee = (
      <select onChange={(e) => setEmployee(e.target.value)}>
        {" "}
        <option key="0" value="0"></option>
        {employeeList.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name + " " + employee.surname_1}
          </option>
        ))}
      </select>
    );
  }

  // Services Available
  let listServices = null;
  if (servicesList.length == 0)
    listServices = <div>Loading available services...</div>;
  else {
    listServices = (
      <select onChange={(e) => setService(e.target.value)}>
        {" "}
        <option key="0" value="0"></option>
        {servicesList.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>
    );
  }

  // Services Selected
  let listServicesContracted = null;
  if (servicesContracted.length == 0)
    listServicesContracted = <div>Ningún servicio seleccionado</div>;
  else {
    listServicesContracted = (
      <ul>
        {servicesContracted.map((service) => (
          <li key={service}>
            {" "}
            {
              servicesList.filter(
                (serviceFilter) => serviceFilter.id == service
              )[0].name
            }
            <button value={service} onClick={removeService}>
              -
            </button>
          </li>
        ))}
      </ul>
    );
  }

  // Availability
  let listAvailability = null;
  if (timeframeList.length == 0)
    listAvailability = <div>Loading available times...</div>;
  else {
    listAvailability = (
      <ul>
        {" "}
        {timeframeList.map((timeFrame) => (
          <li key={timeFrame.id}>
            <button value={timeFrame.id} onClick={setTimeTableButton}>
              {timeFrame.date_ini.getHours() +
                ":" +
                timeFrame.date_ini.getMinutes() +
                " - " +
                timeFrame.date_end.getHours() +
                ":" +
                timeFrame.date_end.getMinutes()}
            </button>
          </li>
        ))}{" "}
      </ul>
    );
  }

  // FILL LISTS ////////////////////////////////////////////////////////////////////////////////////

  // API CALLS ////////////////////////////////////////////////////////////////////////////////////

  // Employee
  const loadEmployeeList = async () => {
    const employeeList = await api.getHairdressers(constnt.HOST);
    setEmployeeList(employeeList);
  };

  // Service
  const loadServicesList = async () => {
    const servicesList = await api.getServices(constnt.HOST);
    setServicesList(servicesList);
  };

  // Availability
  const loadAvailability = async () => {
    // If Services Selected
    if (
      servicesContracted != null &&
      servicesContracted.length != 0 &&
      state.selectedDay != null
    ) {
      // If day selected
      // Get Available timetables
      await api
        .getAvailability(
          constnt.HOST,
          state.selectedDay.toISOString().slice(0, 10)
        )
        .then((result) => createTimeTable(result));
    } else {
      setTimeFrameList([]);
    }
  };

  // API CALLS ////////////////////////////////////////////////////////////////////////////////////

  // GENERAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////
  function getTotalTime() {
    // Create Temporal Total Time
    let total_time = 0;

    // Add Time by Service
    servicesContracted.map(
      (service) =>
        (total_time += servicesList.filter(
          (serviceFilter) => serviceFilter.id == service
        )[0].duration)
    );

    // Return Total Time
    return total_time;
  }

  function createTimeTable(result) {
    // TODO Horarios según configuración
    let horarios = [
      9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16,
      16.5, 17, 17.5, 18, 18.5,
    ];
    let horariosDisponibles = [];
    horarios.map(
      (horario) =>
        (horariosDisponibles = filterAvailability(
          horario,
          getTotalTime(),
          result,
          horariosDisponibles
        ))
    );

    // Set TimeFrame Component
    setTimeFrameList(horariosDisponibles);
  }

  // Function to add available time on array
  function filterAvailability(horario, tiempo, result, horariosDisponibles) {
    // Get Dates in Javascript Format
    let date_ini = new Date(state.selectedDay);
    date_ini.setHours(horario, Number.isInteger(horario) ? 0 : 30, 0);
    let date_end = new Date(date_ini.getTime() + tiempo * 60000);

    // TODO If Dates Exceeds Store limits (break + closing time), not available to book
    if (date_end.getHours() >= 19 && date_end.getMinutes() > 0)
      return horariosDisponibles;

    // Check if Horario available or blocked by another appointment
    let disponible = [];

    // Filter by Date
    if (result != null)
      disponible = result.filter(
        (horarioBlocked) =>
          /* Caso 1: Inicia cuando el peluquero está ocupado */
          (date_ini >= new Date(horarioBlocked.date_ini).getTime() &&
            date_ini < new Date(horarioBlocked.date_end).getTime()) ||
          /* Caso 2: Inicia antes que el peluquero esté ocupado */
          (date_ini < new Date(horarioBlocked.date_ini).getTime() &&
            date_end > new Date(horarioBlocked.date_ini).getTime())
      );

    // Filter by Employee
    if (employee !== "") {
      // Employee Available
      if (
        disponible.filter(
          (horarioBlocked) => horarioBlocked.booked_employee_id == employee
        ).length == 0
      ) {
        horariosDisponibles = [
          ...horariosDisponibles,
          { id: horario, date_ini, date_end },
        ];
      }
    }
    // Not Employee Selected
    // TODO (If anybody is available then not possible to book)
    else {
      horariosDisponibles = [
        ...horariosDisponibles,
        { id: horario, date_ini, date_end },
      ];
    }

    // Return values
    return horariosDisponibles;
  }

  // On click a day, change state
  function handleDayClick(day, { selected }) {
    setState({
      selectedDay: selected ? undefined : day,
    });
  }

  // Set State of Selected TimeTable
  function setTimeTableButton() {
    // Not submit form
    event.preventDefault();

    // Set TimeFrame
    setTimeFrame(
      timeframeList.filter((prevState) => prevState.id == event.target.value)[0]
    );
  }

  // TODO Insert by API backend
  const handleSubmit = async () => {
    // TODO Crear Cita por WS + check todos los campos correctos
    event.preventDefault();

    // TODO Call API
    if (timeframe != null) {
      let person_id = 1;
      let booked_employee_id = 5;
      let created_by_id = 1;
      let date_ini = timeframe.date_ini;
      let date_end = timeframe.date_end;
      let booked_services = servicesContracted;

      await api
        .addReservation(
          constnt.HOST,
          person_id,
          booked_employee_id,
          created_by_id,
          date_ini,
          date_end,
          booked_services
        )
        .then((result) => console.log(result));

// TDOO Change Time Again


    }
  };

  function addService() {
    // Not submit all form
    event.preventDefault();

    // Lo Pongo a los Servicios Contratados (si no lo he contratado aún)
    if (
      servicesContracted.filter((serviceFilter) => serviceFilter == service)
        .length <= 0
    )
      if (service !== "0")
        // Sólo si valor != 0
        setServicesContracted((prevState) => [...prevState, service]);
  }

  function removeService() {
    // Not submit form
    event.preventDefault();

    // Remove Service
    setServicesContracted((prevState) =>
      prevState.filter((item) => item !== event.target.value)
    );
  }

  // GENERAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////

  // Render
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Peluquero:
          {listEmployee}
        </label>

        <br />

        <label>
          Servicios disponibles:
          {listServices}
          <button onClick={addService}>+</button>
        </label>

        <br />

        {servicesList.filter((serviceFilter) => serviceFilter.id == service)[0]
          ? servicesList.filter(
              (serviceFilter) => serviceFilter.id == service
            )[0].description
          : "Selecciona un servicio"}
        <br />
        {servicesList.filter((serviceFilter) => serviceFilter.id == service)[0]
          ? "Duración: " +
            servicesList.filter(
              (serviceFilter) => serviceFilter.id == service
            )[0].duration +
            " minutos"
          : "Duración: "}

        <br />

        <label>Servicios contratados:</label>

        {listServicesContracted}

        <div>
          <DayPicker
            onDayClick={handleDayClick}
            locale="es"
            months={constnt.MONTHS}
            weekdaysLong={constnt.WEEKDAYS_LONG}
            weekdaysShort={constnt.WEEKDAYS_SHORT}
            firstDayOfWeek={1}
            showOutsideDays
            selectedDays={state.selectedDay}
            todayButton="Éste mes"
            disabledDays={disabledDays}
            fromMonth={new Date()}
            toMonth={
              new Date(new Date().getFullYear(), new Date().getMonth() + 2)
            }
          />

          {listAvailability}
        </div>

        <p>
          {" "}
          <input type="submit" value="Submit" />{" "}
        </p>
      </form>
    </div>
  );
}

export default Reservations;
