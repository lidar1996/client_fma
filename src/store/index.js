import { createStore } from "redux";
import rootReducer from "../Reducers/RootReducer";
import { loadState, saveState } from "./localStorage";
const persistedState = loadState();
export const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
  saveState(store.getState());
});
