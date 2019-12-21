import React, { useEffect, useContext, useCallback, createRef } from 'react'
import { gameContext } from '../context/game-context'

const GameSession = () => {
  const { preference, state, setState } = useContext(gameContext)
  const answerEl = createRef()

  const nextWord = useCallback(()=>{
    const nxtBtn = document.querySelector('.nxt-btn')
    if(preference.preferredWords.length>0){

      const word = preference.preferredWords[Math.floor(Math.random()*preference.preferredWords.length)]
      const wordSplit = word.split('')
      const questionArr = []
      if(preference.difficulty === 1){
        for(let letter of wordSplit){
          if(wordSplit.lastIndexOf(letter)%2 === 0){
            questionArr.push(letter)
          }else{
            questionArr.push('*')
          }
        }
      }else if(preference.difficulty === 2){
        for(let letter of wordSplit){
          if(wordSplit.lastIndexOf(letter)%2 === 0){
            questionArr.push('*')
          }else{
            questionArr.push(letter)
          }
        }
      }else if(preference.difficulty === 3){
        for(let letter of wordSplit){
          questionArr.push(letter)
          const position = questionArr.lastIndexOf(letter)+1
          questionArr[position] = '*'
          questionArr[position+1] = '*'
        }
      }
      preference.preferredWords.splice(preference.preferredWords.lastIndexOf(word), 1)
      setState(prevState=>{
        return {...prevState, currentWord: word, currentQuestion: questionArr.join(''), passOrFail: null}
      })
    }else{
      if(nxtBtn){
        nxtBtn.disabled = true
      }
    }
  },[preference, setState])
  
  useEffect(()=>{
    nextWord()
  }, [nextWord])
  
  const checkAnswer =(e)=>{
    e.preventDefault()
    const myAnswer = answerEl.current.value.toLowerCase()
    if(window.confirm(`Final answer "${myAnswer}"?`)){
      if(myAnswer === state.currentWord){
        setState(prevState=>{
          return {...prevState, passOrFail: 'Your last answer was correct', doneWith: prevState.doneWith+1, passed: prevState.passed+1}
        })
      }else{
        setState(prevState=>{
          return {...prevState, passOrFail: 'Your last answer was incorrect', doneWith: prevState.doneWith+1, failed: prevState.failed+1}
        })
      }
      setTimeout(()=>{
        nextWord()
      }, 5000)
    }
  }

  const reset = () => {
    window.location.reload()
  }

  return (
    <div>
      <p>Completed {state.doneWith} of {preference.totalWords} words</p>
      <h2>Score:- passed: {state.passed} | failed: {state.failed} </h2>
      <header>
        <p>Difficulty: {preference.difficulty}</p>
        {
          preference.sessionLength ? <p>Max Word Length: {preference.sessionLength} </p>:
          <p>Words {preference.characterLength} character(s) long </p>
        }
        <p>Total Words to try: {preference.totalWords}</p>
      </header>
      {state.passOrFail && <p>{state.passOrFail}. Correct answer is {state.currentWord}</p>}
      <main>
        <p>Question: {state.currentQuestion ? state.currentQuestion.toUpperCase() : null}</p>
        <form onSubmit={checkAnswer}>
          <div>
            <label htmlFor="Answer">My Guess:</label>
            <input type="text" ref={answerEl}/>
          </div>
          <button className="ans-btn">Answer / Skip</button>
          <div>
          </div>
        </form>
        <button className='nxt-btn' onClick={nextWord}>Next</button>
        <button onClick={reset}>Give up</button>
      </main>
    </div>
  )
}

export default GameSession
