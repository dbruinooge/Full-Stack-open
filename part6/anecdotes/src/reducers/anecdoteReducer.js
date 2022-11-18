import { getAll, createNew, vote } from "../services/anecdotes";
import { createSlice } from "@reduxjs/toolkit";

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    voteAnecdote(state, action) {
      const targetAnec = state.find(anec => anec.id === action.payload.id);
      const updatedAnec = {
        ...targetAnec,
        votes: targetAnec.votes + 1,
      };
      return state.map(anec => anec.id !== updatedAnec.id ? anec : updatedAnec);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    }  
  }
});

export const { setAnecdotes, appendAnecdote, voteAnecdote } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const addVote = (id) => {
  return async (dispatch) => {
    await vote(id);
    dispatch(voteAnecdote({ id }));
  }
}

export default anecdoteSlice.reducer;