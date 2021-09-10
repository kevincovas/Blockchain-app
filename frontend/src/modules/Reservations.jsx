import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React , { useEffect, useState } from 'react';
import * as api from '../api/Reservations';
import * as constnt from '../config/const';

function Reservations()
{
	// General Status
	const [state, setState] = useState({selectedDay: null});
	const [disabledDays, setDisabledDays] = useState();
	
	// Hairdresser
	const [employee, setEmployee] = useState("");
	const [employeeList, setEmployeeList] = useState([]);
	
	// Services
	const [servicesList, setServicesList] = useState([]);
	
	// Employee
  const loadEmployeeList = async () => {
    const employeeList = await api.getHairdressers(constnt.HOST);
    setEmployeeList(employeeList);
  }	
    
  // Service
  const loadServicesList = async () => {
	  const servicesList = await api.getServices();
	  setServicesList(servicesList);
  }
		
	// Read From Database
	// Variable Option Lists
	let listEmployee= null;
    if (employeeList === null) {
    listEmployee = <div>Loading options...</div>
    } else {
    listEmployee = <select onChange={(e) => setEmployee(e.target.value)}  > <option key="0" value="0"></option>
      {employeeList.map(employee =>  <option key={employee.peo_id} value={employee.peo_id}>{employee.peo_name + ' ' + employee.peo_surname_1 }</option> )}
    </select>
    }
  	
	// TODO Style ?
	  // On click a day, change state
  function handleDayClick(day, { selected }) {
   setState({
      selectedDay: selected ? undefined : day,
    });	
  }
	
	function handleSubmit()
	{
		// TODO Crear Cita por WS + check todos los campos correctos
		event.preventDefault();
	}
	
	// TODO Acciones al cambiar inputs
	function handleChange()
	{
	
	}
	
	// TODO Add more UseEffects
	// Effects to Restart Calendar
	useEffect(() => { /* Buscaré las citas disponibles ése día */ }, [state.selectedDay]);	
	
	// Valores Iniciales
	useEffect(() => {  
	
	// Peluqueros
	loadEmployeeList();

	// Servicios
	
	
	// Disabled Days (Weekend + Full days)
	setDisabledDays( [ 
	{ daysOfWeek: [0] } ,

{
                   before: new Date(),
        }

	] );
	
	
	}, []);
	
	
	return ( 

<div>

 <form onSubmit={handleSubmit}>

 <label>
          Peluquero:
 {listEmployee}          
		  		  
</label>
<br />
 <label>
          Servicios:
         
		 <select>
  <option value="Corte">Corte</option>
  <option value="Tinte">Tinte</option>
  <option value="Pestanas">Pestañas</option>
  <option value="Unas">Uñas</option>
</select>
		 
</label>

<div>

        <DayPicker
         
onDayClick={ handleDayClick }	  
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
		toMonth={new Date(  new Date().getFullYear(),  new Date().getMonth() + 2 )}
		
        />

		<p>{state.selectedDay
            ? state.selectedDay.toLocaleDateString()
            : 'Selecciona el día'}</p>


      </div>

<input type="submit" value="Submit" />


</form>

</div>

	);
}

export default Reservations;