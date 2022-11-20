import { useState } from 'react';
import axios from 'axios';

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // ...

  const create = async (resource) => {
    await axios.post(baseUrl, resource);
    const response = await axios.get(baseUrl);
    setResources(response.data);
    return response.data
  }

  const getAll = async () => {
    const response = await axios.get(baseUrl);
    setResources(response.data);
    return response.data;
  }

  const service = {
    create,
    getAll
  }

  getAll();

  return [
    resources, service
  ]
}

export { useResource };