interface calculateExerciseInput {
  dailyHours: number[],
  target: number,
}

const parseArguments = (args: string[]): calculateExerciseInput => {
  if (args.length < 4) throw new Error ('Not enough arguments');
  const dailyHours: number[] = args.slice(3, args.length)
                       .map(hours => Number(hours));
  const target = Number(args[2]);

  if (dailyHours.every(hours => !isNaN(hours)) && !isNaN(target)) {
    return {
      dailyHours,
      target,
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}


interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: 1 | 2 | 3,
  ratingDescription: string,
  target: number,
  average: number,
}

type dailyHours = number[];

function calculateExercises(dailyHours: dailyHours, target: number): Result {
  const periodLength: number = dailyHours.length;
  const trainingDays: number = dailyHours.filter(hours => hours > 0).length;
  const average: number = dailyHours.reduce((sum, hours) => sum + hours, 0) / periodLength;
  const success: boolean = average >= target;
  let rating: 1 | 2 | 3;
  let ratingDescription: string;
  if (average / target < .8) {
    ratingDescription = 'Not good enough. Try harder next time';
    rating = 1;
  } else if (average / target < 1.2) {
    ratingDescription = 'Not too bad but could be better';
    rating = 2;
  } else {
    ratingDescription = 'Great job!!!';
    rating = 3;
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating: rating,
    ratingDescription,
    target,
    average,
  }
}

try {
  const { dailyHours, target } = parseArguments(process.argv);
  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}