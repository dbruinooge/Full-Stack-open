interface BodyValues {
  height: number,
  weight: number,
}

const parseArguments = (args: string[]): BodyValues => {
  if (args.length < 4) throw new Error ('Not enough arguments');
  if (args.length > 4) throw new Error ('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

function calculateBmi(height: number, weight: number): string {
  const BMI = weight / ((height / 100)**2);
  if (BMI < 18) {
    return 'Underweight (unhealthy weight)';
  } else if (BMI < 25) {
    return 'Normal (healthy weight)';
  } else {
    return 'Overweight (unhealthy weight)';
  }
}

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export {};