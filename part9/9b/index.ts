import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

const isValidExercisesArray = (daily_exercises: []): boolean => {
  const areValidExercises = daily_exercises.some(hours => (
    !(typeof hours !== 'number') ||
    isNaN(Number(hours))
  ));
  return areValidExercises && Array.isArray(daily_exercises);
};

const isValidTarget = (target: number): boolean => {
  return (typeof target === 'number') && !isNaN(target);
};

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).send({error: 'malformatted parameters'});
  }

  const bmi = calculateBmi(height, weight);
  const result = { weight, height, bmi };
  return res.json(result);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    return res.status(400).send({error: 'missing parameters'});
  }

  if (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    !isValidExercisesArray(daily_exercises) || !isValidTarget(target)
  ) {
    return res.status(400).send({error: 'malformatted body'});
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(daily_exercises, target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});