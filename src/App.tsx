import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import Dashboard from "./pages/Dashboard.tsx";

function App() {

  return (
	<Router>
    <div className="App">
	  <Routes>
		<Route path="/" element={<Navigate to="/login" replace />} />
		<Route path="/login" element={<Login />}/>
		<Route path="/register" element={<Register />}/>
		<Route path="/dashboard" element={<Dashboard />}/>
	  </Routes>
	</div>
	</Router>
  )
}

export default App
