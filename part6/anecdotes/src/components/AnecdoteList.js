import { useSelector, useDispatch } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { addVote } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
  const state = useSelector(state => state);

  const dispatch = useDispatch();

  const vote = (id, content) => {
    dispatch(addVote(id));
    dispatch(setNotification(`you voted '${content}'`, 3));
  };

  return (
    <>
      <h2>Anecdotes</h2>
      {state.anecdotes
            .filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
            .sort((a, b) => b.votes - a.votes)
            .map(anecdote =>
              <div key={anecdote.id}>
                <div>
                  {anecdote.content}
                </div>
                <div>
                  has {anecdote.votes}
                  <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
                </div>
              </div>
        )
      }
    </>
  )
}

export default AnecdoteList;


