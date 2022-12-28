import reactLogo from './assets/react.svg'
import './App.css'

import YourLibNameComponent from '../lib'

function App() {
  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>React Lib Starter</h1>
      <div className="card">
        <p>
          React + Typescript + Vite library starter kit
        </p>
      </div>

      <YourLibNameComponent />
    </div>
  )
}

export default App
