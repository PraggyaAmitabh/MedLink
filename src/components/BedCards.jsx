import { useState } from "react";

export default function BedCards(){

  const [beds,setBeds] = useState([
    {type:"ICU Beds",available:5,total:10},
    {type:"Emergency Beds",available:2,total:6},
    {type:"General Beds",available:18,total:25}
  ]);

  const toggleBed=(index)=>{

    const updated=[...beds];

    if(updated[index].available>0){
      updated[index].available--;
    } else {
      updated[index].available++;
    }

    setBeds(updated);

  };

  return(

    <div
      style={{
        display:"grid",
        gridTemplateColumns:"repeat(3,1fr)",
        gap:"25px",
        marginBottom:"35px"
      }}
    >

      {beds.map((bed,i)=>(

        <div
          key={i}
          style={{
            background:"white",
            padding:"25px",
            borderRadius:"14px",
            boxShadow:"0 10px 25px rgba(0,0,0,0.1)",
            textAlign:"center"
          }}
        >

          <h3>{bed.type}</h3>

          <p style={{fontSize:"18px",fontWeight:"600"}}>
            {bed.available} Available
          </p>

          <button
            onClick={()=>toggleBed(i)}
            style={{
              marginTop:"10px",
              padding:"6px 12px",
              borderRadius:"6px",
              border:"none",
              background:"#1e3a8a",
              color:"white",
              cursor:"pointer"
            }}
          >
            Update Bed Status
          </button>

        </div>

      ))}

    </div>

  );

}