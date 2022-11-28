import { CoursePart } from '../types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.type) {
    case 'normal':
      return (
        <div>
          <h3>{part.name}</h3>
          <ul>
            <li>Type: {part.type}</li>
            <li>Exercise Count: {part.exerciseCount}</li>
            <li>Description: {part.description}</li>
          </ul>
        </div>
      );
    case 'groupProject':
      return (
        <div>
          <h3>{part.name}</h3>
          <ul>
            <li>Type: {part.type}</li>
            <li>Exercise Count: {part.exerciseCount}</li>
            <li>Group Project Count: {part.groupProjectCount}</li>
          </ul>
        </div>
      );
    case 'submission':
      return (
        <div>
          <h3>{part.name}</h3>
          <ul>
            <li>Type: {part.type}</li>
            <li>Exercise Count: {part.exerciseCount}</li>
            <li>Description: {part.description}</li>
            <li>Exercise Submission Link: {part.exerciseSubmissionLink}</li>
          </ul>
        </div>
      )
    case 'special':
      return (
        <div>
        <h3>{part.name}</h3>
        <ul>
          <li>Type: {part.type}</li>
          <li>Exercise Count: {part.exerciseCount}</li>
          <li>Description: {part.description}</li>
          <li>Requirements: 
            <ul>
              {part.requirements.map(requirement => <li key={requirement}>{requirement}</li>)}
            </ul>
          </li>
        </ul>
      </div>
      );
    default:
      assertNever(part);
      return <p></p>
  }
};

export default Part;