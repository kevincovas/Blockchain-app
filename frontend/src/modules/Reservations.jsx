import React, { useEffect, useState } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import * as api from "../api/Reservations";
import * as constnt from "../config/const";
import Dropdown from "./components/Dropdown/Dropdown";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";

import "./Reservations.css";

function Reservations() {
  // Calendar Status
  const [state, setState] = useState({ selectedDay: new Date() });

  // Employee
  const [employee, setEmployee] = useState("");
  const [employeeList, setEmployeeList] = useState([]);

  // Services Availables
  const [service, setService] = useState(null);
  const [servicesList, setServicesList] = useState([]);

  // Services Contracted
  const [servicesContracted, setServicesContracted] = useState([]);

  // Timeframes
  const [timeframe, setTimeFrame] = useState(null);
  const [timeframeList, setTimeFrameList] = useState([]);

  // Material UI
  const employeeIdDefaultHelperMessage =
    "Selecciona el peluquero si tienes preferencias.";
  const serviceIdDefaultHelperMessage = "Selecciona los servicios deseados.";
  const { enqueueSnackbar } = useSnackbar();
  const [employeeIdError, setEmployeeIdError] = useState(false);
  const [employeeIdHelperMessage, setEmployeeIdHelperMessage] = useState(
    employeeIdDefaultHelperMessage
  );
  const [serviceIdError, setServiceIdError] = useState(false);
  const [serviceIdHelperMessage, setServiceIdHelperMessage] = useState(
    serviceIdDefaultHelperMessage
  );
  const [open, setOpen] = useState(false);
  // View Alert
  const handleClickOpen = () => {
    setOpen(true);
  };
  // Dismiss or Continue
  const handleClose = (action) => {
    // Close Reservation
    if (action == 2) {
      setOpen(false);
      setTimeFrame(null);
    }
    // Continue with Reservation
    else handleSubmit();
  };

  // USE EFECTS ////////////////////////////////////////////////////////////////////////////////////
  // Valores Iniciales
  useEffect(() => {
    // Peluqueros
    loadEmployeeList();

    // Servicios
    loadServicesList();
  }, []);

  // Effects to Restart Calendar and Read Availability
  useEffect(() => {
    // Load Available Schedules on this day
    loadAvailability();
  }, [state.selectedDay, employee, servicesContracted]);

  // USE EFECTS ////////////////////////////////////////////////////////////////////////////////////

  // FILL LISTS ////////////////////////////////////////////////////////////////////////////////////

  // Read From Database
  // Services Selected
  let listServicesContracted = null;
  if (servicesContracted.length == 0) listServicesContracted = <div></div>;
  else {
    listServicesContracted = (
      <div>
        <label>Servicios contratados: (click para quitar servicios)</label>
        <List>
          {servicesContracted.map((service) => (
            <ListItem
              button
              key={service}
              onClick={(e) => removeService(`${service}`)}
            >
              <ListItemIcon>
                <RemoveShoppingCartIcon />
              </ListItemIcon>

              <ListItemText>
                {
                  servicesList.filter(
                    (serviceFilter) => serviceFilter.id == service
                  )[0].name
                }
              </ListItemText>
            </ListItem>
          ))}
        </List>

        <p>Duración total: {getTotalTime()} minutos</p>
        <p>Precio total: {getTotalPrice()} €</p>
      </div>
    );
  }

  // Availability
  let listAvailability = null;
  if (timeframeList.length != 0) {
    listAvailability = (
      <List style={{ maxHeight: "95%", overflow: "auto" }}>
        {timeframeList.map((timeFrame) => (
          <ListItem
            button
            key={timeFrame.id}
            onClick={(e) => setTimeTableButton(`${timeFrame.id}`)}
          >
            <ListItemText
              primary={
                pad(timeFrame.date_ini.getHours(), 2) +
                ":" +
                pad(timeFrame.date_ini.getMinutes(), 2) +
                " - " +
                pad(timeFrame.date_end.getHours(), 2) +
                ":" +
                pad(timeFrame.date_end.getMinutes(), 2)
              }
            />
          </ListItem>
        ))}
      </List>
    );
  }
  else
  {
     listAvailability = ( <p>No hay citas disponibles para éste día</p> )
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

  // Left Zeros Function
  function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
  }

  function getTotalPrice() {
    // Create Temporal Total Time
    let total_price = 0.0;

    // Add Time by Service
    servicesContracted.map(
      (service) => (
        (total_price += parseInt(
          servicesList.filter((serviceFilter) => serviceFilter.id == service)[0]
            .price
        )),
        10
      )
    );

    // Return Total Time
    return total_price;
  }

  function getAppointmentString() {
    if (timeframe != null) {
      return (
        pad(timeframe.date_ini.getUTCDate(), 2) +
        "/" +
        pad(timeframe.date_ini.getUTCMonth() + 1, 2) +
        "/" +
        timeframe.date_ini.getFullYear() +
        " de " +
        pad(timeframe.date_ini.getHours(), 2) +
        ":" +
        pad(timeframe.date_ini.getMinutes(), 2) +
        " a " +
        pad(timeframe.date_end.getHours(), 2) +
        ":" +
        pad(timeframe.date_end.getMinutes(), 2)
      );
    } else return "";
  }

  function createTimeTable(result) {
    // Horarios según configuración
    let horariosDisponibles = [];
    constnt.TIMETABLE.map(
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
    date_ini.setHours(
      horario,
      Number.isInteger(horario) ? 0 : (horario % 1) * 60,
      0
    );
    let date_end = new Date(date_ini.getTime() + tiempo * 60000);

    // If Dates Exceeds Store limits (break + closing time), not available to book
    if ( (date_end.getHours() >= constnt.CLOSING_TIME && date_end.getMinutes() > 0) || (date_end.getHours() > constnt.CLOSING_TIME && date_end.getMinutes() == 0) )
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
  function setTimeTableButton(timeframe_in) {
    // Set TimeFrame
    setTimeFrame(
      timeframeList.filter((prevState) => prevState.id == timeframe_in)[0]
    );
    // Open Dialog
    handleClickOpen();
  }

  // Submit Information to backed API
  const handleSubmit = async () => {

    // Close Dialog
    setOpen(false);

    // Call Booking API
    if (timeframe != null) {
      let person_id = 1;
      let booked_employee_id = 5;
      let created_by_id = 1;
      let date_ini = timeframe.date_ini;
      let date_end = timeframe.date_end;
      let booked_services = servicesContracted;

      // To Save in Database
      date_ini.setTime(
        date_ini.getTime() - date_ini.getTimezoneOffset() * 60 * 1000
      );
      date_end.setTime(
        date_end.getTime() - date_end.getTimezoneOffset() * 60 * 1000
      );

      // TODO Acabar llamada con person_id , booked_employee y created_by_id
      // Book Registration
      const inserted = await api.addReservation(
        constnt.HOST,
        person_id,
        booked_employee_id,
        created_by_id,
        date_ini,
        date_end,
        booked_services
      );

      // Load Time Zones again
      loadAvailability();
    }
  };

  // Add service to be booked
  function addService() {
    // Add to array only if possible service
    if (service == null || (service != null && service == 0)) {
      enqueueSnackbar("Selecciona algún servicio para reservar cita.", {
        variant: "error",
      });
      return;
    }
    // Service selected before
    else if (
      servicesContracted.filter((serviceFilter) => serviceFilter == service)
        .length != 0
    ) {
      enqueueSnackbar("Ya has seleccionado ése servicio.", {
        variant: "error",
      });
      return;
    }
    // Sólo si valor no es null ni repetido
    else setServicesContracted((prevState) => [...prevState, service]);
  }

  function removeService(service_in) {
    // Remove Service
    setServicesContracted((prevState) =>
      prevState.filter((item) => item.toString() !== service_in)
    );
  }

  // GENERAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////

  // Render
  return (
    <Container maxWidth="md">
      <Paper elevation={5} className="forms-container">
        <form onSubmit={(event) => event.preventDefault()}>
          <Paper elevation={2} className="forms-container">
            <Dropdown
              setIdError={setEmployeeIdError}
              setId={setEmployee}
              select={employeeList}
              error={employeeIdError}
              field="Peluquero"
              className={"form-employee-field"}
              setIdHelperMessage={setEmployeeIdHelperMessage}
              idHelperMessage={employeeIdHelperMessage}
              optionLabel={(option) =>
                `${option.name} ${option.surname_1} ${option.surname_2}`
              }
            />
          </Paper>
          <br />
          <Paper elevation={2} className="forms-container">
            <Dropdown
              setIdError={setServiceIdError}
              setId={setService}
              select={servicesList}
              idHelperMessage={serviceIdHelperMessage}
              field={"Servicio"}
              error={serviceIdError}
              className={"form-service-field"}
              setIdHelperMessage={setServiceIdHelperMessage}
              optionLabel={(option) => `${option.name}`}
            />

            {servicesList.filter(
              (serviceFilter) => serviceFilter.id == service
            )[0]
              ? servicesList.filter(
                  (serviceFilter) => serviceFilter.id == service
                )[0].description
              : ""}

            <p>
              {servicesList.filter(
                (serviceFilter) => serviceFilter.id == service
              )[0]
                ? "Duración: " +
                  servicesList.filter(
                    (serviceFilter) => serviceFilter.id == service
                  )[0].duration +
                  " minutos"
                : ""}
            </p>

            <p>
              {servicesList.filter(
                (serviceFilter) => serviceFilter.id == service
              )[0]
                ? "Precio: " +
                  servicesList.filter(
                    (serviceFilter) => serviceFilter.id == service
                  )[0].price +
                  " €"
                : ""}
            </p>

            <p>
              <Button variant="contained" color="primary" onClick={addService}>
                Añadir Servicio
              </Button>
            </p>

            {listServicesContracted}
          </Paper>
          <br />

          {servicesContracted.length != 0 ? (
            <Paper elevation={2} className="row">
              <div className="column">
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
                  disabledDays={[{ daysOfWeek: [0] }, { before: new Date() }]}
                  fromMonth={new Date()}
                  toMonth={
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 2
                    )
                  }
                />
              </div>

              <div className="column">{listAvailability}</div>
            </Paper>
          ) : (
            ""
          )}

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Está seguro de su reserva?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Fecha y Hora: {getAppointmentString()}
                <br />
                Precio total: {getTotalPrice()} €
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={(e) => handleClose(`2`)} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={(e) => handleClose(`1`)}
                color="primary"
                autoFocus
              >
                Aceptar
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </Paper>
    </Container>
  );
}

export default Reservations;
