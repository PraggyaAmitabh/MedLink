export default function AmbulancePanel() {

  const ambulances = [
    { id: "Ambulance 1", status: "En Route" },
    { id: "Ambulance 2", status: "Available" },
    { id: "Ambulance 3", status: "At Hospital" }
  ];

  return (

    <div
      style={{
        marginTop: "30px",
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.08)"
      }}
    >

      <h3
        style={{
          marginBottom: "20px",
          color: "#1e3a8a",
          textAlign: "center"
        }}
      >
        🚑 Ambulance Status
      </h3>

      {ambulances.map((amb, index) => (

        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px",
            borderBottom: "1px solid #eee"
          }}
        >

          <span>{amb.id}</span>

          <span
            style={{
              fontWeight: "600",
              color:
                amb.status === "Available"
                  ? "green"
                  : amb.status === "En Route"
                  ? "orange"
                  : "#1e3a8a"
            }}
          >
            {amb.status}
          </span>

        </div>

      ))}

    </div>

  );
}