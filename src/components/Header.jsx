import { useState, useEffect } from "react";

export default function Header(){

  const [time,setTime] = useState("");

  useEffect(()=>{

    const interval = setInterval(()=>{
      const now = new Date();
      setTime(now.toLocaleTimeString());
    },1000);

    return () => clearInterval(interval);

  },[]);

  return(

    <div
      style={{
        background:"white",
        padding:"18px 30px",
        borderBottom:"1px solid #e5e7eb",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
      }}
    >

      <h2 style={{color:"#1e3a8a"}}>
        Hospital Dashboard
      </h2>

      <div style={{display:"flex",gap:"20px",alignItems:"center"}}>

        <div style={{fontWeight:"600"}}>
          🕒 {time}
        </div>

        <div style={{fontSize:"20px",cursor:"pointer"}}>
          🔔
        </div>

        <div
          style={{
            background:"#f3f4f6",
            padding:"8px 14px",
            borderRadius:"6px"
          }}
        >
          Admin Panel
        </div>

      </div>

    </div>

  );

}