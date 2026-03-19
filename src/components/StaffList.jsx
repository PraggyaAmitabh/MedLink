import { useState } from "react";
import SectionCard from "./SectionCard";

export default function StaffList() {

  const [search, setSearch] = useState("");

  const staff = [
    { name: "Dr. Sharma", department: "ICU", status: "Available" },
    { name: "Dr. Mehta", department: "Emergency", status: "Busy" },
    { name: "Dr. Patel", department: "General", status: "Available" }
  ];

  const filtered = staff.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SectionCard title="Hospital Staff" icon="👨‍⚕️">

      <input
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "15px",
          padding: "10px",
          width: "100%",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>

        <thead>
          <tr style={{ borderBottom: "2px solid #eee" }}>
            <th style={{ textAlign: "left", padding: "10px" }}>Doctor</th>
            <th style={{ textAlign: "left", padding: "10px" }}>Department</th>
            <th style={{ textAlign: "left", padding: "10px" }}>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((doctor, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "12px" }}>{doctor.name}</td>
              <td style={{ padding: "12px" }}>{doctor.department}</td>
              <td style={{ padding: "12px" }}>
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    background:
                      doctor.status === "Available"
                        ? "#dcfce7"
                        : "#fee2e2",
                    color:
                      doctor.status === "Available"
                        ? "#166534"
                        : "#b91c1c"
                  }}
                >
                  {doctor.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </SectionCard>
  );
}