import { useState, useEffect } from "react";

export default function StatsOverview(){

  const cardStyle = {
    background:"white",
    padding:"25px",
    borderRadius:"14px",
    boxShadow:"0 6px 16px rgba(0,0,0,0.08)",
    textAlign:"center",
    height:"140px",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    transition:"0.25s",
    cursor:"pointer"
  };

  const handleHover=(e)=>{
    e.currentTarget.style.transform="scale(1.04)";
  };

  const handleLeave=(e)=>{
    e.currentTarget.style.transform="scale(1)";
  };

  const [patients,setPatients]=useState(48);
  const [beds,setBeds]=useState(72);
  const [ambulances,setAmbulances]=useState(3);
  const [staff,setStaff]=useState(12);

  useEffect(()=>{

    const interval=setInterval(()=>{

      setPatients(p=>p + Math.floor(Math.random()*2));
      setBeds(70 + Math.floor(Math.random()*5));
      setAmbulances(2 + Math.floor(Math.random()*2));
      setStaff(11 + Math.floor(Math.random()*3));

    },5000);

    return ()=>clearInterval(interval);

  },[]);

  return(

    <div
      style={{
        display:"grid",
        gridTemplateColumns:"repeat(4,1fr)",
        gap:"25px",
        justifyContent:"space-between",
        marginBottom:"35px"
      }}
    >

      <div
        style={cardStyle}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <div style={{fontSize:"26px"}}>👨‍⚕️</div>
        <p>Patients Today</p>
        <h2 style={{color:"#1e3a8a"}}>{patients}</h2>
      </div>

      <div
        style={cardStyle}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <div style={{fontSize:"26px"}}>🛏</div>
        <p>Beds Occupied</p>
        <h2 style={{color:"#1e3a8a"}}>{beds}%</h2>
      </div>

      <div
        style={cardStyle}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <div style={{fontSize:"26px"}}>🚑</div>
        <p>Ambulances Active</p>
        <h2 style={{color:"#1e3a8a"}}>{ambulances}</h2>
      </div>

      <div
        style={cardStyle}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <div style={{fontSize:"26px"}}>👨‍⚕️</div>
        <p>Staff On Duty</p>
        <h2 style={{color:"#1e3a8a"}}>{staff}</h2>
      </div>

    </div>

  );

}