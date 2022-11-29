import { Link, useParams } from 'react-router-dom';
import { useStateValue } from '../state';
import { Patient } from '../types';
import { apiBaseUrl } from "../constants";
import { updatePatient } from '../state';
import axios from "axios";

const PatientView = () => {
  const [{ fetchedPatients }, dispatch] = useStateValue();

  const fetchPatient = async (id: string) => {
    try {
      const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      const patient: Patient = response.data;

      // dispatch({ type: "UPDATE_PATIENT", payload: patient });
      dispatch(updatePatient(patient));
  
      return patient;
    } catch(e) {
      console.error(e);
    }   

  };

  const id: string = useParams().id ?? '';
  const patient = fetchedPatients[id];
  if (patient) {
    return (
      <div>
        <h3>{patient.name}</h3>
        <p>DOB: {patient.dateOfBirth}</p>
        <p>Occupation: {patient.occupation}</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  } else {
    fetchPatient(id).catch(e => console.error(e));
    return null;
  }

};

export default PatientView;