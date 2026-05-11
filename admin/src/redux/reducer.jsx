import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userProfile", "token"]
};

const initialState = {};

const userProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_USER_PROFILE":
      return action.payload;
    case "REMOVE_USER_PROFILE":
      return initialState;
    case "LOGOUT_USER":
      return initialState;
    default:
      return state;
  }
};

const selectedPujasReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_SELECTED_PUJAS":
      return action.payload;
    default:
      return state;
  }
};

const tokenReducer = (state = null, action) => {
  switch (action.type) {
    case "UPDATE_TOKEN":
      return action.payload;
    case "LOGOUT_USER":
      return null;
    default:
      return state;
  }
};

const appReducer = combineReducers({
  userProfile: userProfileReducer,
  selectedPujas: selectedPujasReducer,
  token: tokenReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_USER") {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
