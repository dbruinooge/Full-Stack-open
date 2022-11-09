import { useState } from 'react'

const Button = ({callback, text}) => {
  return (
    <button onClick={callback}>{text}</button>
  )
}

const StatisticLine = ({name, number}) => (
  <>
    <tr>
      <td>{name}</td>
      <td>{number}</td>
    </tr>
  </>
)



const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad;

  if (all === 0) return <p>No feedback given</p>;

  let average = ((good - bad) / all) || 0;
  average = Math.round(average * 10) / 10;
  let positive = (good / all * 100) || 0;
  positive = Math.round(positive * 10) / 10;
  positive = String(positive) + ' %';

  return (
    <table>
      <tbody>
        <StatisticLine name='good' number={good} />
        <StatisticLine name='neutral' number={neutral} />
        <StatisticLine name='bad' number={bad} />
        <StatisticLine name='all' number={all} />
        <StatisticLine name='average' number={average} />
        <StatisticLine name='positive' number={positive} />
      </tbody>
    </table>
  )
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>

      <Button callback={() => setGood(good + 1)} text='good' />
      <Button callback={() => setNeutral(neutral + 1)} text='neutral' />
      <Button callback={() => setBad(bad + 1)} text='bad' />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App