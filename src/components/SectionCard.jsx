export default function SectionCard({ title, children, icon }) {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "14px",
        boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
        marginTop: "28px"
      }}
    >
      <h3
        style={{
          marginBottom: "18px",
          color: "#1e3a8a",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "600"
        }}
      >
        {icon} {title}
      </h3>

      {children}
    </div>
  );
}