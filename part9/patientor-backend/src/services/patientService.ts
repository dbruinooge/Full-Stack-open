import { NonSensitivePatient, Patient, NewPatient } from '../types';
import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';

export const getPatients = (): Array<Patient> => {
  return patients;
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
