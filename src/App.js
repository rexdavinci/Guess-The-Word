import React, {useEffect, useContext} from 'react';
import './App.css';
import GameSetting from './components/GameSetting';
import { gameContext } from './context/game-context';
import GameSession from './components/GameSession';

const App = () => {
  const {state, setState} = useContext(gameContext)
  
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json')
    .then(response=>response.json())
    .then(words=>{
      setState(prevState=>{
        return {...prevState, allWords: [...Object.keys(words)]}
      })
    })
    .catch(error=>console.log(error))
  }, [setState])
  return !state.playing ? (
    <div>
      <GameSetting />
    </div>
  ) : (
    <div>
      <GameSession />
    </div>
  )
}

export default App;
