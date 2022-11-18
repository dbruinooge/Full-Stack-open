import { useSelector, useDispatch } from 'react-redux';
// let interval;

const AnecdoteList = () => {
  const state = useSelector(state => state);

  const dispatch = useDispatch();

  const vote = (id) => {
    const content = state.anecdotes.find(anecdote => anecdote.id === id).content;
    dispatch({
      type: 'VOTE',
      payload: {
        id: id,
      },
    });

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
        message: `you voted '${content}'`,
      },
    });
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
                  <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
              </div>
        )
      }
    </>
  )
}

export default AnecdoteList;


