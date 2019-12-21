import React, {useContext, useState, useEffect, useCallback} from 'react'
import Button from './Button'
import { gameContext } from '../context/game-context'

const GameSetting = () => {
  const [computedWords, setComputedWords] = useState([])
  const {state, setState, preference, setPreference} = useContext(gameContext)

  useEffect(() => {
    let longestWord = ''
    for(let word of state.allWords){
      if(word.length >= longestWord.length){
        longestWord = word
      }
    }
    setState(prevState=>{
      return{...prevState, maxLength :longestWord.length}
    })
  }, [setState, state.allWords])

  const availableWords = useCallback(() => {
    let myWords
    if(preference.characterLength){
      myWords = state.allWords.filter(word=>word.length === preference.characterLength)
      setComputedWords([...myWords])

    } else if(preference.sessionLength){
      myWords = state.allWords.filter(word=>word.length <= preference.sessionLength)
      setComputedWords([...myWords])

    }
  }, [preference.characterLength, preference.sessionLength, state.allWords])

  useEffect(()=>{
    availableWords()
  }, [availableWords])

  

  const handleSetting = e => {
    const {value, name} = e.target

    if(name === 'difficulty'){
      setPreference({...preference, difficulty: Number(value)})
    }else if(name === 'maxlength'){
      const characterLength = document.querySelector('input[name="characterLength"]')
      if(value <= state.maxLength){
        characterLength.disabled = true
        setPreference({...preference, characterLength: undefined, sessionLength: Number(value)})
      }
      if(!value){
        characterLength.disabled = false
      }
    }else if(name === 'characterLength'){
      const maxlength = document.querySelector('input[name="maxlength"]')
      
      // console.log(!value)
      if(value <= state.maxLength){
        maxlength.disabled = true
        setPreference({...preference, sessionLength: undefined, characterLength: Number(value)})
      }
      if(!value){
        maxlength.disabled = false
      }
    } else if(name === 'tryWords'){
      const maxlength = document.querySelector('input[name="maxlength"]')
      const characterLength = document.querySelector('input[name="characterLength"]')
      let myWords = []
      if(value <= computedWords.length){
        maxlength.disabled = true
        characterLength.disabled = true
        while(myWords.length < value) {
          const word = computedWords[Math.floor(Math.random()*computedWords.length)]
          if(myWords.indexOf(word) === -1 && myWords.length < value){
            myWords.push(word)
          }
        }
      }else{
        myWords = [...computedWords]
      }
      if(!value){
        maxlength.disabled = false
        characterLength.disabled = false
      }
      setPreference({...preference, preferredWords: [...myWords], totalWords: myWords.length})
    }
  }

  const defineGameSession = e =>{
    e.preventDefault()
    setPreference({...preference, sessionWords: [...preference.preferredWords]})
    setState({...state, playing: !state.playing})
  }

  return (
    <div> 
      <form onSubmit={defineGameSession}>
      <div>
        <label htmlFor="difficulty">Difficulty: </label>
        <select name="difficulty" value={preference.difficulty} onChange={handleSetting}>
          <option value={1}>default</option>
          <option value={2}>Level 2</option>
          <option value={3}>Level 3</option>
        </select>
      </div>
      <div>
        <label htmlFor="length">Max Word Length: </label>
        <input name="maxlength" type="number" min="1" max={state.maxLength} onChange={handleSetting} />
        <span> or </span>
        <label htmlFor="type"> Words </label>
        <input name="characterLength" type="number" min="1" max={state.maxLength} onChange={handleSetting} />
        <span> long</span>
      </div>
      <div>
        <label htmlFor="words">I want to try </label>
        <input name="tryWords" type="number" min="2" max={computedWords.length} onChange={handleSetting}/>
        <span> words </span><span>{preference.preferredWords.length} / {computedWords.length}</span>
      </div>
        <Button name={'Submit'}/>
      </form>
    </div>
  )
}

export default GameSetting
