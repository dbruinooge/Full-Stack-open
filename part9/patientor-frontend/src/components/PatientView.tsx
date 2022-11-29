import { useParams } from 'react-router-dom';
import { useStateValue } from '../state';
import { Patient, Entry, HealthCheckRating } from '../types';
import { apiBaseUrl } from "../constants";
import { updatePatient } from '../state';
import axios from "axios";

const PatientView = () => {
  const [{ fetchedPatients, diagnoses }, dispatch] = useStateValue();

  const fetchPatient = async (id: string) => {
    try {
      const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      const patient: Patient = response.data;
      dispatch(updatePatient(patient));
  
      return patient;
    } catch(e) {
      console.error(e);
    }   

  };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case 'Hospital':
        return (
          <>
            <li>Entry type: Hospital</li>
            <li>Discharged on {entry.discharge.date}: {entry.discharge.criteria}</li>
          </>
        );
      case 'OccupationalHealthcare':
        return (
          <>
            <li>Employer name: {entry.employerName}</li>
              {entry.sickLeave ?
                <li>
                Sick leave started {entry.sickLeave?.startDate}
                , ended {entry.sickLeave?.endDate}
                </li>
                : null
              }          
          </>
        );
      case 'HealthCheck':
        const rating = entry.healthCheckRating;
        return (
          <li>Health rating: {HealthCheckRating[rating]}</li>
        );
      default:
        return assertNever(entry);
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
        <h4>Entries:</h4>
        <ul>
          {patient.entries.map(entry => {
            return (
              <li key={entry.date}>{entry.date}
                <ul>
                  {EntryDetails({entry})}
                  <li>{entry.description}</li>
                  <li>Diagnosed by {entry.specialist}</li>
                  <li>Diagnoses:
                    <ul>
                      {entry.diagnosisCodes?.map(code => {
                        const diagnosis = diagnoses.find(diagnosis => diagnosis.code === code);
                        return <li key={code}>{code} {diagnosis?.name}</li>;
                      })}
                    </ul>
                  </li>
                </ul>
              </li>
            );            
          })}
        </ul>
      </div>
    );
  } else {
    fetchPatient(id).catch(e => console.error(e));
    return null;
  }

};

export default PatientView;