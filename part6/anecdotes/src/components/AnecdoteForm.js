import { useSelector, useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const create = (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const newAnecdote = createAnecdote(content);
    dispatch(newAnecdote);
    event.target.reset();

    clearTimeout(state.notification.timeout);

    const timeout = setTimeout(() => {
      dispatch({
        type: 'notification/removeNotification',
      })
    }, 5000)

    dispatch({
      type: 'notification/addNotification',
      payload: {
        timeout: timeout,
        message: `you added a new anecdote: '${content}'`,
      },
    });
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