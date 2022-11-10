const Course = ({course}) => (
  <>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
  </>
)

const Header = ({course}) => {
  return (
    <h2>{course.name}</h2>
  )
}

const Part = (props) => (
  <p>{props.part} {props.exercises}</p>
)

const Content = ({course}) => (
  <>
    {course.parts.map(part => {
      return <Part key={part.id} part={part.name} exercises={part.exercises} />
    })}
  </>
)

const Total = ({course}) => {
  return (
    <p>
      <b>total of {course.parts.reduce((sum, part) => {
        return sum + part.exercises;
      }, 0)} exercises </b>
    </p>
  )
}

export default Course;