import { connect } from 'react-redux';
import { changeFilter } from '../reducers/filterReducer';

const Filter = (props) => {
  const onChange = (event) => {
    props.changeFilter(event.target.value.toLowerCase());
  };

  return (
    <>
      filter <input type="text" onChange={onChange}/>
    </>
  );
}

export default connect(null, { changeFilter })(Filter);