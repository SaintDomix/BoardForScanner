import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { boardReducer, initialState } from "./boardReducer";
import { loadState, saveState } from "../lib/storage";

export const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, undefined, () => {
    return loadState() ?? initialState;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}
