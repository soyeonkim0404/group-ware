import { combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import profile from './profile';
import toast from './toast';
import menu from './menu';
import auth from './auth';
import calendar from './calendar';

const reducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };

    default:
      return combineReducers({
        profile,
        toast,
        menu,
        auth,
        calendar,
      })(state, action);
  }
};

export default reducer;
