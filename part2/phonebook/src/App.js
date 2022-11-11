import { useEffect, useState } from 'react';
import axios from 'axios';
import personService from './services/persons.js';

const BACKEND = 'http://localhost:3001';

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

const ListPersons = ({persons, removePerson}) => (
  <>
  {persons.map(person => <Person key={person.name} person={person} removePerson={removePerson}/>)}
  </>
)

const Person = ({person, removePerson}) => (
  <>
    <p>{person.name} {person.number}</p>
    <button onClick={(() => removePerson(person.id))}>Delete</button>
  </>

)

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');



  useEffect(() => {
    console.log('effect');
    personService
      .getPersons()
      .then(data => setPersons(data));
  }, []);

  let personsToShow = filter === '' ? persons : persons.filter(person => {
    return person.name.toLowerCase().includes(filter);
  });

  const addName = (event) => {
    event.preventDefault();

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = persons.find(person => person.name === newName).id;
        console.log(id);
        personService
          .changeNumber(id, { number: newNumber })
          .then(() => {
            personService
              .getPersons()
              .then(data => setPersons(data));
          });
      }

    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      personService
        .addPerson(newPerson)
        .then(data => setPersons(persons.concat(data)))      

      setNewName('');
      setNewNumber('');
    }
  }

  const removePerson= id => {
    personService
      .deletePerson(id)
      .then(() => {
        personService
        .getPersons()
        .then(data => setPersons(data));
      })
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
      <ListPersons persons={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App
