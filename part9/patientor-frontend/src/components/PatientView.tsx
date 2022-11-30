import { useParams } from 'react-router-dom';
import { addEntry, useStateValue } from '../state';
import { Patient, Entry, HealthCheckRating } from '../types';
import { apiBaseUrl } from "../constants";
import { updatePatient } from '../state';
import axios from "axios";
import AddEntryModal from './AddEntryModal';
import { Button } from "@material-ui/core";
import React, { useEffect } from 'react';
import { EntryFormValues } from './AddEntryForm';

const PatientView = () => {
  const [{ patients, fetchedPatients, diagnoses }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const parseDischarge = (values: EntryFormValues) => {
    const { dischargeDate, dischargeReason } = values;
      if (dischargeDate && dischargeReason) {
        values.discharge = { date: dischargeDate, reason: dischargeReason };
      }
  };

  const parseSickLeave = (values: EntryFormValues) => {
    const { sickLeaveStart, sickLeaveEnd } = values;
    if (sickLeaveStart && sickLeaveEnd) {
      values.sickLeave = { startDate: sickLeaveStart, endDate: sickLeaveEnd };
    }
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      parseDischarge(values);
      parseSickLeave(values);
      console.log(values);
      const { data: patientWithAddedEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${values.id}/entries`,
        values
      );
      console.log(patientWithAddedEntry);
      dispatch(addEntry(patientWithAddedEntry));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

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

  useEffect(() => {
    void fetchPatient(id);
  }, [patients]);
  
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
              <li key={entry.id}>{entry.date}
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
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
          id={id}
        />
        <Button variant="contained" onClick={() => openModal()}>
          Add New Entry
        </Button>
        
      </div>
    );
  } else {
    fetchPatient(id).catch(e => console.error(e));
    return null;
  }

};

export default PatientView;