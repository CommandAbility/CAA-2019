/**
 * Theme Reducer
 *
 * Change the current theme.
 */

import { TOGGLE_THEME } from '../types';
import { DARK, LIGHT } from '../../modules/theme-ids';

const initialState = {
  currentTheme: DARK,
};

const toggleTheme = state => {
  if (state.currentTheme === DARK) {
    return {
      ...state,
      currentTheme: LIGHT,
    };
  } else {
    return {
      ...state,
      currentTheme: DARK,
    };
  }
};

export const getTheme = state => {
  return state.currentTheme;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return toggleTheme(state);
    default:
      return state;
  }
};