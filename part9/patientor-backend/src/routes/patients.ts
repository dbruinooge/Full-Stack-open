import express from 'express';
import { addPatient, getNonSensitivePatients, getPatient,
         addEntry } from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';
const router = express.Router();

router.post('/:id/entries', (req, res) => {
  try {
    const patientId = req.params.id;
    const newEntry = toNewEntry(req.body);
    const patientWithAddedEntry = addEntry(newEntry, patientId);
    res.json(patientWithAddedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.get('/:id', (req, res) => {
  const patient = getPatient(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(400).send({error: 'No patient found'});
  }
});

router.get('/', (_req, res) => {
  const patients = getNonSensitivePatients();
  res.json(patients);
});

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatient = toNewPatient(req.body);
    const addedPatient = addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;