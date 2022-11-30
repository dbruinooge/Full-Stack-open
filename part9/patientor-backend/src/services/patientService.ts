import { NonSensitivePatient, Patient, NewPatient, Entry } from '../types';
import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';

export const getPatients = (): Array<Patient> => {
  return patients;
};

export const getPatient = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export const addPatient = ( patient: NewPatient ): Patient => {
    const id = uuid();  
    const newPatient = {
      id,
      ...patient,
    };

    patients.push(newPatient);
    return newPatient;
};

export const addEntry = ( newEntry: Entry, patientId: string ): Patient => {
  const patient = patients.find(patient => patient.id === patientId);
  if (!patient) {
    throw new Error ('No patient found with that id');
  }

  patient.entries.push(newEntry);
  return patient;
};
