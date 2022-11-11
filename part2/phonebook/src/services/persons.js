import axios from 'axios'

const baseURL = 'http://localhost:3001';

const getPersons = () => {
  const request = axios.get(baseURL + '/persons');
  return request.then(response => response.data)
}

const addPerson = (newPerson) => {
  const request = axios.post(baseURL + '/persons', newPerson)
  return request.then(response => response.data);
}

const deletePerson = (id) => {
  return axios.delete(baseURL + '/persons/' + id);
}

const changeNumber = (id, updatedNumber) => {
  return axios.patch(baseURL + `/persons/` + id, updatedNumber);
}

export default { getPersons, addPerson, deletePerson, changeNumber }