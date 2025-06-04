// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { clubsApi } from './clubs';
import { eventsApi } from './events';
import { mainApi } from './main';
import type { Action } from 'redux';

const appReducer = combineReducers({
    [clubsApi.reducerPath]: clubsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [mainApi.reducerPath]: mainApi.reducer,
   
});


const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: Action) => {
    if (action.type === 'LOGOUT') {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
