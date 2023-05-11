import PropTypes from 'prop-types';

const InputWrapper = ({ label }) => {
  return (
    <div>
      <label>{label}</label>
      <input type="text"></input>
    </div>
  );
};

InputWrapper.propTypes = {
  label: PropTypes.string,
};

export default InputWrapper;
