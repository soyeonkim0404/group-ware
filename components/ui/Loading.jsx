import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';

const SDim = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  z-index: 99999;
  overflow: hidden;
`;

const Loading = (props) => {
  return (
    <SDim>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          style={{
            color: '#dee2e6',
          }}
          size={40}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          style={{
            color: '#1976d2',
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            strokeLinecap: 'round',
          }}
          size={40}
          thickness={4}
          {...props}
        />
      </Box>
    </SDim>
  );
};

export default Loading;
