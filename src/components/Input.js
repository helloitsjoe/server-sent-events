import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ id, label, hiddenLabel, value, onChange, placeholder }) => (
  <>
    <label htmlFor={id} hidden={hiddenLabel}>
      Name
    </label>
    <input
      id={id}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  </>
);

Input.propTypes = {
  id: PropTypes.string.isRequired,
  hiddenLabel: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
  hiddenLabel: false,
  placeholder: '',
};

export default Input;
