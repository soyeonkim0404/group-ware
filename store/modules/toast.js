const SUCCESS = 'toast/SUCCESS';
const ERROR = 'toast/ERROR';
const INFO = 'toast/INFO';
const WARNING = 'toast/WARNING';

export const success = () => ({ type: SUCCESS });
export const error = () => ({ type: ERROR });
export const info = () => ({ type: INFO });
export const warning = () => ({ type: WARNING });

export default function toastReducer(state = [], action) {
  switch (action.type) {
    case SUCCESS:
      return [
        ...state,
        {
          id: state.length + 1,
          title: 'Success',
          description: '석세스',
          backgroundColor: '#2e7d32',
        },
      ];
    case ERROR:
      return [
        ...state,
        {
          id: state.length + 1,
          title: 'ERROR',
          description: 'ERROR',
          backgroundColor: '#f03e3e',
        },
      ];
    case INFO:
      return [
        ...state,
        {
          id: state.length + 1,
          title: 'INFO',
          description: 'INFO',
          backgroundColor: '#1976d2',
        },
      ];
    case WARNING:
      return [
        ...state,
        {
          id: state.length + 1,
          title: 'WARNING',
          description: 'WARNING',
          backgroundColor: '#ed6c02',
        },
      ];
    default:
      return state;
  }
}
