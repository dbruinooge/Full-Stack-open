import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';
import { connect } from 'react-redux';

const AnecdoteForm = (props) => {
  const create = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    event.target.reset();
    props.createAnecdote(content);
    props.setNotification(`you added a new anecdote: '${content}'`, 2);
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

const mapDispatchToProps = {
  createAnecdote,
  setNotification,
}

export default connect(null, mapDispatchToProps)(AnecdoteForm);