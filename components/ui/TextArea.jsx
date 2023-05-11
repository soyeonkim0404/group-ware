import styled from 'styled-components';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const STextAreaStyled = styled.div`
  textarea {
    resize: none;
    width: 100%;
    padding: 20px;
    border: 2px solid ${(p) => p.theme.gray60};
    border-radius: 0;
    box-sizing: border-box;
    &::placeholder {
      color: ${(p) => p.theme.gray60};
    }
  }
`;

const TextArea = forwardRef(
  ({ placeholder, value, rows, name, onChange, length }, ref) => {
    return (
      <STextAreaStyled>
        <label htmlFor={name} />
        <textarea
          placeholder={placeholder}
          value={value}
          rows={rows}
          name={name}
          onChange={onChange}
          maxLength={length}
          ref={(el) => ref && ref(el)}
        />
      </STextAreaStyled>
    );
  }
);

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  value: PropTypes.string,
  rows: PropTypes.number,
  autoFocus: PropTypes.bool,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};

TextArea.defaultProps = {
  placeholder: '',
  name: '',
  rows: 5,
  onChange: () => {},
  onFocus: () => {},
};

export default TextArea;
