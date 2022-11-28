import express from 'express';
import { getNonSensitivePatients } from '../services/patientService';
const router = express.Router();

router.get('/', (_req, res) => {
  const patients = getNonSensitivePatients();
  res.json(patients);
});

export default router;