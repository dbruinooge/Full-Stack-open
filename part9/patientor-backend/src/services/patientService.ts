import { NonSensitivePatient, Patient } from '../types';
import patients from '../../data/patients';

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
