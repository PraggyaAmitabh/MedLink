export default function AnalyticsPanel(){

  const bars = [80,120,90,150,100,130,110];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return(

    <div
      style={{
        background:"white",
        padding:"25px",
        borderRadius:"14px",
        boxShadow:"0 6px 16px rgba(0,0,0,0.08)",
        marginTop:"30px"
      }}
    >

      <h3 style={{marginBottom:"20px"}}>
        📊 Hospital Analytics
      </h3>

      {/* SUMMARY CARDS */}

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(3,1fr)",
          gap:"20px",
          marginBottom:"35px"
        }}
      >

        <div style={{
          background:"#f8fafc",
          padding:"15px",
          borderRadius:"10px",
          textAlign:"center"
        }}>
          <p>Bed Occupancy</p>
          <h2 style={{color:"#1e3a8a"}}>72%</h2>
        </div>

        <div style={{
          background:"#f8fafc",
          padding:"15px",
          borderRadius:"10px",
          textAlign:"center"
        }}>
          <p>Ambulances Active</p>
          <h2 style={{color:"#1e3a8a"}}>3</h2>
        </div>

        <div style={{
          background:"#f8fafc",
          padding:"15px",
          borderRadius:"10px",
          textAlign:"center"
        }}>
          <p>Doctors On Duty</p>
          <h2 style={{color:"#1e3a8a"}}>12</h2>
        </div>

      </div>

      <h4 style={{marginBottom:"15px"}}>
        Bed Usage (Last 7 Days)
      </h4>

      {/* CHART */}

      <div
        style={{
          display:"flex",
          alignItems:"flex-end",
          gap:"18px",
          height:"180px",
          borderLeft:"2px solid #ddd",
          borderBottom:"2px solid #ddd",
          padding:"10px"
        }}
      >

        {bars.map((h,i)=>(
          <div key={i} style={{textAlign:"center"}}>

            <div
              style={{
                width:"40px",
                height:h+"px",
                background:"linear-gradient(180deg,#60a5fa,#2563eb)",
                borderRadius:"6px",
                transition:"height 0.8s ease"
              }}
            />

            <div style={{fontSize:"12px",marginTop:"6px"}}>
              {days[i]}
            </div>

          </div>
        ))}

      </div>

    </div>

  );

}