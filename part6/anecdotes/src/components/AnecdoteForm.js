import { useSelector, useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const create = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    event.target.reset();
    dispatch(createAnecdote(content));
    dispatch(setNotification(`you added a new anecdote: '${content}'`, 2));
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={create}>
      <div><input name="content"/></div>
      <button>create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;