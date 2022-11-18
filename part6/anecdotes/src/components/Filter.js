import { useDispatch } from 'react-redux';

const Filter = () => {
  const dispatch = useDispatch();

  const onChange = (event) => {
    dispatch({
      type: 'filter/changeFilter',
      payload: event.target.value.toLowerCase(),
    });
  };

  return (
    <>
      filter <input type="text" onChange={onChange}/>
    </>
  );
}

export default Filter;