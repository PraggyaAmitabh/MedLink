import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  if(!loggedIn){
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return <Dashboard />;
}

export default App;