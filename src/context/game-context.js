import React, { createContext, useState } from 'react'

export const gameContext = createContext()

const GameContextProvider = ({children}) => {
  const [state, setState] = useState({
    maxLength: null,
    allWords: [],
    playing: false,
    currentWord: null,
    currentQuestion: null,
    passOrFail: null,
    doneWith: 0,
    passed: 0,
    failed: 0
  })

  const [preference, setPreference] = useState({
    difficulty: 1,
    sessionLength: null,
    characterLength: null,
    sessionWords: [],
    totalWords: 0,
    preferredWords: []
  })

  return (
    <gameContext.Provider value={{state, setState, preference, setPreference}}>
      {children}
    </gameContext.Provider>
  )
}

export default GameContextProvider
