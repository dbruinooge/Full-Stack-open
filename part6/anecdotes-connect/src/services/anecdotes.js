import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

export const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
}

export const createNew = async (content) => {
  const anecdote = { content, votes: 0 }
  const response = await axios.post(baseUrl, anecdote);
  return response.data;
}

export const vote = async (id) => {
  const votes = await (await axios.get(baseUrl + '/' + id)).data.votes;
  const response = await axios.patch(baseUrl + '/' + id, {votes: Number(votes) + 1 });
  return response.data;
}