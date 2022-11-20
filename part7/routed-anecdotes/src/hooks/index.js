import { useState } from 'react';

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const resetField = () => {
    setValue('');
  }

  const domProps = () => {
    return {
      type,
      value,
      onChange,
    }
  }

  return {
    type,
    value,
    onChange,
    resetField,
    domProps,
  }
}

export { useField };