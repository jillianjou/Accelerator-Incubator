//REACT
import './App.css';
import { useState, useEffect } from 'react'

function Button() {
  const [value, setValue] = useState(0)

  useEffect(
    () => {
      console.log('rendered button')
    },
    [value]
  )

  return (
    <button
      onClick={() => setValue(value+1)}
    >
      you clicked the button {value} times
    </button>
  )
}

function Dog() {
  const [img, setImg] = useState(null)
  const [num, setNum] = useState(0)

  useEffect(
    () => {
      fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(data => {
        setImg(data.message)
      });
    },
    [num]
  )

  function handleButtonClick() {
    setNum(num + 1)
  }

  return (
    <div>
      <img 
        alt="Dog"
        src={img}
        style={{
          width: 100,
        }}
      />
      <button onClick={handleButtonClick}>New dog</button>
    </div>
  )
}

function Form() {
  const [username, setUsername] = useState('')
  
  function login() {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      body: {
        username
      }
    })
  }

  return (
    <div>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  )
}

function App() {
  return (
    <div className="App"  >
      <Button/>
      <Dog/>
      <Form/>
    </div>
  );
}



export default App;