import axios from 'axios'

const baseURL = '/api';

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

const changePerson = (id, updatedPerson) => {
  return axios.put(baseURL + `/persons/` + id, updatedPerson);
}

export default { getPersons, addPerson, deletePerson, changePerson }