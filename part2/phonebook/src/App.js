import { useState } from 'react'

const Filter = ({handleFilterChange, filter}) => (
  <>
    <div>
      filter shown with <input onChange={handleFilterChange} value={filter} />
    </div>
    <div>debug: {filter}</div>
  </>
)

const PersonForm = ({
  addName,
  handleNameChange,
  newName,
  handleNumberChange,
  newNumber}) => (
  <form onSubmit={addName}>
    <div>
      name: <input onChange={handleNameChange} value={newName} />
      <div>debug: {newName}</div>
    </div>
    <div>
      number: <input onChange={handleNumberChange} value={newNumber} />
      <div>debug: {newNumber}</div>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const ListPersons = ({persons}) => (
  <>
  {persons.map(person => <Person person={person} />)}
  </>
)

const Person = ({person}) => (
  <p key={person.name}>{person.name} {person.number}</p>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  let personsToShow = filter === '' ? persons : persons.filter(person => {
    return person.name.toLowerCase().includes(filter);
  });

  const addName = (event) => {
    event.preventDefault();

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat({
        name: newName,
        number: newNumber,
      }))

      setNewName('');
      setNewNumber('');
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <h3>add a new</h3>
      <PersonForm addName={addName}
                  handleNameChange={handleNameChange}
                  newName={newName}
                  handleNumberChange={handleNumberChange}
                  newNumber={newNumber} />
      <h3>Numbers</h3>
      <ListPersons persons={personsToShow}/>
    </div>
  )
}

export default App
