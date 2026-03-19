function StaffAssignment() {

  const assignments = [
    { doctor: "Dr. Sharma", ward: "ICU" },
    { doctor: "Dr. Mehta", ward: "Emergency" },
    { doctor: "Dr. Patel", ward: "General" },
    { doctor: "Dr. Khan", ward: "ICU" }
  ];

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "14px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        marginBottom: "35px"
      }}
    >

      <h3 style={{ marginBottom: "15px" }}>
        👨‍⚕️ Doctor Ward Assignment
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>

        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px" }}>Doctor</th>
            <th style={{ textAlign: "left", padding: "10px" }}>Ward</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a, i) => {
            return (
              <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{a.doctor}</td>
                <td style={{ padding: "10px" }}>{a.ward}</td>
              </tr>
            );
          })}
        </tbody>

      </table>

    </div>
  );
}

export default StaffAssignment;