import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (newBlog) => {
  const headers = { Authorization: token };
  const response = await axios.post(baseUrl, newBlog, { headers });
  return response.data;
};

const like = async (blog) => {
  const response = await axios.put(baseUrl + "/" + blog.id);
  return response.data;
};

const remove = async (blog) => {
  const headers = { Authorization: token };
  const response = await axios.delete(baseUrl + "/" + blog.id, { headers });
  return response.data;
};

export default { setToken, getAll, createNew, like, remove };
