export default function InventoryPanel(){

  const items=[
    {name:"Oxygen Cylinders",qty:24},
    {name:"Ventilators",qty:2},
    {name:"IV Kits",qty:120},
    {name:"Syringes",qty:50}
  ];

  return(

    <div
      style={{
        background:"white",
        padding:"25px",
        borderRadius:"14px",
        boxShadow:"0 10px 25px rgba(0,0,0,0.1)",
        marginBottom:"35px"
      }}
    >

      <h3 style={{marginBottom:"15px"}}>
        📦 Medical Inventory
      </h3>

      {items.map((item,i)=>{

        const lowStock=item.qty<5;

        return(

          <div
            key={i}
            style={{
              display:"flex",
              justifyContent:"space-between",
              padding:"10px 0",
              borderBottom:"1px solid #eee"
            }}
          >

            <span>{item.name}</span>

            <span
              style={{
                fontWeight:"600",
                color:lowStock?"red":"green"
              }}
            >

              {item.qty}

              {lowStock && " ⚠ Low"}

            </span>

          </div>

        );

      })}

    </div>

  );

}