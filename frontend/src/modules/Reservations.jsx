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
	
	// Services Availables
	const [service , setService] = useState("0");
	const [servicesList, setServicesList] = useState([]);
		
	// Services Contracted
	const [servicesContracted , setServicesContracted] = useState([]);
		
	// Timeframes
	const [timeframe, setTimeFrame] = useState("");
	const [timeframeList , setTimeFrameList] = useState([]);
	
	// Duration
	const [duration, setDuration] = useState(0);

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
	

    }, [state.selectedDay]);

// USE EFECTS ////////////////////////////////////////////////////////////////////////////////////


// FILL LISTS ////////////////////////////////////////////////////////////////////////////////////
		
	// Read From Database
	// Hairdresser
	let listEmployee= null;
    if (employeeList === null) {
    listEmployee = <div>Loading options...</div>
    } else {
    listEmployee = <select onChange={(e) => setEmployee(e.target.value)}  > <option key="0" value="0"></option>
    {employeeList.map(employee =>  <option key={employee.id} value={employee}>{employee.name + ' ' + employee.surname_1 }</option> )}
    </select>
    }
	
	// Services Available
	let listServices= null;
    if (servicesList === null) {
    listServices = <div>Loading options...</div>
    } else {
    listServices = <select onChange={(e) => setService(e.target.value)}  > <option key="0" value="0"></option>
    {
		servicesList.map(service =>  <option key={service.id} value={service.id}>{service.name}</option> )
	}
				
    </select>
	
    }	
	
	// Availability
	let listAvailability = null;	
	listAvailability = <div>Loading options...</div>	
	
	// Services Selected
	
	

	
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
			
		if(state.selectedDay !== null ) 
		{
		const availabilityList = await api.getAvailability(constnt.HOST);
			
		}
			
	}	

// API CALLS ////////////////////////////////////////////////////////////////////////////////////

// GENERAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////

	
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
		console.log("submit");
	}
	
	// TODO Acciones al cambiar inputs
	function handleChange()
	{
	
	}
	
	function addService()
	{
		// Not submit all form
		event.preventDefault();
	
	// Lo Pongo a los Servicios Contratados
	

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
            : ''

}

<br />

<label>

Servicios contratados:

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

{listAvailability}

      </div>

<p> <input type="submit" value="Submit" /> </p>


</form>

</div>

	);
}

export default Reservations;