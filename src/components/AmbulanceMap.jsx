import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const ambulanceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
  iconSize: [32,32]
});

export default function AmbulanceMap(){

  const ambulances = [
    {id:1, lat:22.5726, lng:88.3639, status:"En Route"},
    {id:2, lat:22.5740, lng:88.3700, status:"Available"},
    {id:3, lat:22.5690, lng:88.3600, status:"At Hospital"}
  ];

  return(

    <div
      style={{
        background:"white",
        padding:"25px",
        borderRadius:"14px",
        boxShadow:"0 6px 16px rgba(0,0,0,0.08)",
        marginBottom:"35px"
      }}
    >

      <h3 style={{marginBottom:"15px"}}>
        🗺 Ambulance Tracking
      </h3>

      <MapContainer
        center={[22.5726,88.3639]}
        zoom={13}
        style={{height:"350px", width:"100%", borderRadius:"10px"}}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {ambulances.map(a => (
          <Marker key={a.id} position={[a.lat,a.lng]} icon={ambulanceIcon}>
            <Popup>
              Ambulance {a.id}<br/>
              Status: {a.status}
            </Popup>
          </Marker>
        ))}

      </MapContainer>

    </div>

  );

}