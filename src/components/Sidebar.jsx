import { useState } from "react";

export default function Sidebar(){

  const [active,setActive] = useState("Dashboard");

  const menu = [
    {name:"Dashboard", icon:"📊"},
    {name:"Beds", icon:"🛏"},
    {name:"Staff", icon:"👨‍⚕️"},
    {name:"Ambulances", icon:"🚑"},
    {name:"Inventory", icon:"📦"}
  ];

  return(

    <div
      style={{
        width:"240px",
        height:"100vh",
        background:"#1e3a8a",
        color:"white",
        position:"fixed",
        left:"0",
        top:"0",
        padding:"20px"
      }}
    >

      <h2 style={{marginBottom:"30px"}}>
        MedLink
      </h2>

      {menu.map((item)=>{

        const isActive = active === item.name;

        return(

          <div
            key={item.name}
            onClick={()=>setActive(item.name)}
            style={{
              padding:"12px 15px",
              marginBottom:"10px",
              borderRadius:"8px",
              cursor:"pointer",
              background: isActive ? "#33469b" : "transparent",
              transition:"0.2s"
            }}
          >

            {item.icon} {item.name}

          </div>

        );

      })}

    </div>

  );

}