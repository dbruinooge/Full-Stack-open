import { NewPatient, Gender, Diagnosis, Entry, HospitalEntry,
         HealthCheckEntry, 
         OccupationalHealthcareEntry,
         } from './types';
import diagnoses from '../data/diagnoses';
import { v1 as uuid } from 'uuid';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseString = (stringValue: unknown): string => {
  if (!stringValue || !isString(stringValue)) {
    throw new Error('Incorrect or missing name');
  }

  return stringValue;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error ('Incorrect or missing gender: ' + gender);
  }

  return gender;
};

type EntryType = 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDiagnosisCode = (code: any): code is Diagnosis['code'] => {
  return diagnoses.some(diagnosis => diagnosis.code === code);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDiagnosisCodes = (codes: any): codes is Diagnosis['code'][] => {
  return (Array.isArray(codes) && codes.every(code => isDiagnosisCode(code)));
};

const parseDiagnosisCodes = (codes: unknown): Diagnosis['code'][] => {
  if (!isDiagnosisCodes(codes)) {
    throw new Error ('Incorrect diagnostic codes: ' + codes);
  }

  return codes;
};


type Fields = { 
  name: unknown, 
  dateOfBirth: unknown, 
  ssn: unknown, 
  gender: unknown,
  occupation: unknown,
};

export const toNewPatient = (
  { name, dateOfBirth, ssn, gender, occupation } : Fields
): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: [],
  };

  return newPatient;
};

export interface NewEntry {
  type: EntryType;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (newEntry: any): Entry => {
  if (!newEntry.description || !newEntry.date || !newEntry.specialist) {
    throw new Error ('Missing description, date, or specialist');
  }
  if (newEntry.diagnosisCodes) {
    parseDiagnosisCodes(newEntry.diagnosisCodes);
  }
  newEntry.id = uuid();
  switch (newEntry.type) {
    case 'Hospital':
      if (!newEntry.discharge) {
        throw new Error ('Discharge info missing');
      }
      return newEntry as HospitalEntry;
    case 'HealthCheck':
      if (!newEntry.healthCheckRating) {
        throw new Error ('Health care rating missing');
      }
      return newEntry as HealthCheckEntry;
    case 'OccupationalHealthcare':
      if (!newEntry.employerName) {
        throw new Error ('Employer name missing');
      }
      return newEntry as OccupationalHealthcareEntry;
    default:
      throw new Error ('Error: Incorrect entry type');
  }
};