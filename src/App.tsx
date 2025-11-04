import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./pages/Login.tsx"

function App() {

  return (
	<Router>
    <div className="App">
	  <Routes>
		<Route path="/login" element={<Login />}/>
	  </Routes>
	</div>
	</Router>
  )
}

export default App
