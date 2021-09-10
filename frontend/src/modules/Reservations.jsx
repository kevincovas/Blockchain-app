import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React , { useEffect, useState } from 'react';
import * as api from '../api/Reservations';
import * as constnt from '../config/const';

function Reservations()
{
	// Calendar Status
	const [state, setState] = useState({selectedDay: new Date() });
	const [disabledDays, setDisabledDays] = useState();
	
	// Hairdresser
	const [employee, setEmployee] = useState("");
	const [employeeList, setEmployeeList] = useState([]);
	
	// Services Availables
	const [service , setService] = useState("0");
	const [servicesList, setServicesList] = useState([]);
		
	// Services Contracted
	const [servicesContracted , setServicesContracted] = useState([]);
		
	// Timeframes
	const [timeframe, setTimeFrame] = useState("");
	const [timeframeList , setTimeFrameList] = useState([]);

// USE EFECTS ////////////////////////////////////////////////////////////////////////////////////
// Valores Iniciales
	useEffect(() => {  
	
	// Peluqueros
	loadEmployeeList();

	// Servicios
	loadServicesList();
		
	// Disabled Days (Weekend + Full days)
	setDisabledDays( [ 
	{ daysOfWeek: [0] } ,

{
                   before: new Date(),
        }

	] );
		
	}, []);
			
	// Effects to Restart Calendar and Read Availability
	useEffect(() => { 

	// Load Available Schedules on this day
	loadAvailability();

    }, [state.selectedDay , employee , servicesContracted ]);

// USE EFECTS ////////////////////////////////////////////////////////////////////////////////////


// FILL LISTS ////////////////////////////////////////////////////////////////////////////////////
		
	// Read From Database
	// Hairdresser
	let listEmployee= null;
    if (employeeList.length == 0 )
    listEmployee = <div>Loading employees...</div>
    else {
    listEmployee = <select onChange={(e) => setEmployee(e.target.value)}  > <option key="0" value="0"></option>
    {employeeList.map(employee =>  <option key={employee.id} value={employee.id}>{employee.name + ' ' + employee.surname_1 }</option> )}
    </select>
    }
	
	// Services Available
	let listServices= null;
    if (servicesList.length == 0 )
    listServices = <div>Loading available services...</div>
    else {
    listServices = <select onChange={(e) => setService(e.target.value)}  > <option key="0" value="0"></option>
    {
		servicesList.map(service =>  <option key={service.id} value={service.id}>{service.name}</option> )
	}
				
    </select>
	
    }	
	
	// Services Selected
	let listServicesContracted = null;
    if (servicesContracted.length == 0)
    listServicesContracted = <div>Ningún servicio seleccionado</div>;
    else {
    listServicesContracted = <ul>
    {
		servicesContracted.map(service =>  <li key={service} > { servicesList.filter(serviceFilter => serviceFilter.id == service )[0].name }
		<button value={service} onClick={removeService}>-</button></li> )
	}			
    </ul>
	}	
	
	// Availability
	let listAvailability = null;	
	if ( timeframeList.length == 0 )
	listAvailability = <div>Loading available times...</div>
	else
	{
		
		
	listAvailability = <ul> { timeframeList.map( timeFrame => <li key={timeFrame} >{timeFrame}</li>)  } </ul>;
		
	}
	

	
// FILL LISTS ////////////////////////////////////////////////////////////////////////////////////


// API CALLS ////////////////////////////////////////////////////////////////////////////////////	
	
	// Employee
  const loadEmployeeList = async () => {
    const employeeList = await api.getHairdressers(constnt.HOST);
    setEmployeeList(employeeList);
  }	
    
  // Service
  const loadServicesList = async () => {
	  const servicesList = await api.getServices(constnt.HOST);
	  setServicesList(servicesList);
  }
  
	// Availability
	const loadAvailability = async() => {
			
		if(state.selectedDay !== null && state.selectedDay !== undefined ) 
		{

		// Get Available timetables
		await api.getAvailability(constnt.HOST , state.selectedDay.toISOString().slice(0, 10) ).then( result => createTimeTable(result) );

		}
			
	}	

// API CALLS ////////////////////////////////////////////////////////////////////////////////////

// GENERAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////
function getTotalTime()
{
	// Create Temporal Total Time
	let total_time = 0;
	
	// Add Time by Service
	servicesContracted.map( service => total_time += servicesList.filter(serviceFilter => serviceFilter.id == service )[0].duration );
	
	// Return Total Time
	return total_time;
}

function createTimeTable(result)
{
	// console.log( "result",result );
	// console.log( "servicescontracted",servicesContracted );
	// console.log( getTotalTime() );
	// console.log("employee",employee);
	
	// setTimeFrameList( ['1','2'] );
	
	
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
		console.log("Submit");
	}
	
	// TODO Acciones al cambiar inputs
	function handleChange()
	{
	
	}
	
	function addService()
	{
		// Not submit all form
		event.preventDefault();
	
	// Lo Pongo a los Servicios Contratados (si no lo he contratado aún)
	if(  servicesContracted.filter(serviceFilter => serviceFilter == service ).length <= 0 )
	// Sólo si valor != 0
	if (service !== "0")
	setServicesContracted( prevState => [...prevState , service] );

	}
		
		function removeService()
		{
			// Not submit form
			event.preventDefault();

			// Remove Service
			setServicesContracted(   prevState => prevState.filter(item => item !== event.target.value)   );
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

<button onClick={addService}>
+
</button>

</label>

<br />

{ 

servicesList.filter(serviceFilter => serviceFilter.id == service )[0]
            ?  servicesList.filter(serviceFilter => serviceFilter.id == service )[0].description
            : 'Selecciona un servicio'

}
<br />
{ 

servicesList.filter(serviceFilter => serviceFilter.id == service )[0]
            ?  "Duración: " + servicesList.filter(serviceFilter => serviceFilter.id == service )[0].duration + " minutos"
            : 'Duración: '

}

<br />

<label>

Servicios contratados:

</label>

{listServicesContracted}


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

{listAvailability}

      </div>

<p> <input type="submit" value="Submit" /> </p>


</form>

</div>

	);
}

export default Reservations;