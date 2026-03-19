import { useState } from "react";

export default function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if(email && password){
      onLogin();
    } else {
      alert("Please enter email and password");
    }
  }

  return (

    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#f3f4f6"
    }}>

      <form
        onSubmit={handleLogin}
        style={{
          background:"white",
          padding:"40px",
          borderRadius:"10px",
          width:"320px",
          boxShadow:"0px 4px 15px rgba(0,0,0,0.1)"
        }}
      >

        <h2 style={{
          textAlign:"center",
          color:"#1e3a8a",
          marginBottom:"25px"
        }}>
          MedLink Hospital Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{
            width:"100%",
            padding:"12px",
            marginBottom:"15px",
            borderRadius:"6px",
            border:"1px solid #ccc"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{
            width:"100%",
            padding:"12px",
            marginBottom:"20px",
            borderRadius:"6px",
            border:"1px solid #ccc"
          }}
        />

        <button
          type="submit"
          style={{
            width:"100%",
            padding:"12px",
            background:"#1e3a8a",
            color:"white",
            border:"none",
            borderRadius:"6px",
            fontWeight:"bold",
            cursor:"pointer"
          }}
        >
          Login
        </button>

      </form>

    </div>

  );
}