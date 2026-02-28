import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Placeholder data — will come from Supabase in Week 2
const ASSIGNED_AMBULANCE = {
  patientName: 'Rahul Sharma',
  age: 45,
  destination: 'KIMS Hospital, Bhubaneswar',
  status: 'En Route',
  driver: 'Suresh Kumar',
  paramedic: 'Anita Das',
  position: [20.2961, 85.8245], // placeholder location
};

const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 16, { animate: true, duration: 1 });
  }, [position, map]);
  return null;
};

const InfoCard = ({ label, value, highlight }) => (
  <div className={`bg-white rounded-lg p-3 shadow-sm border-l-4 ${highlight ? 'border-red-500' : 'border-blue-500'}`}>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? 'text-red-500' : 'text-gray-800'}`}>{value}</p>
  </div>
);

const DoctorView = () => {
  const [showCall, setShowCall] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const joinCall = () => {
    setShowCall(true);
    // Week 2 — will connect to paramedic via Supabase assigned peer ID
  };

  const closeCall = () => {
    setShowCall(false);
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };

  return (
    <div className="flex h-screen font-sans relative">

      {/* Left — Patient Info */}
      <div className="w-72 min-w-[288px] bg-gray-50 p-6 flex flex-col gap-4 overflow-y-auto shadow-md">
        <h2 className="text-xl font-bold text-blue-600">👨‍⚕️ Doctor Dashboard</h2>

        {/* Assigned ambulance alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-400 font-semibold uppercase mb-1">🚨 Incoming Ambulance</p>
          <p className="text-sm font-bold text-red-600">{ASSIGNED_AMBULANCE.patientName}</p>
          <p className="text-xs text-gray-500">{ASSIGNED_AMBULANCE.destination}</p>
        </div>

        {/* Patient details */}
        <div className="flex flex-col gap-3">
          <InfoCard label="Patient" value={`${ASSIGNED_AMBULANCE.patientName}, ${ASSIGNED_AMBULANCE.age} yrs`} />
          <InfoCard label="Destination" value={ASSIGNED_AMBULANCE.destination} />
          <InfoCard label="Status" value={ASSIGNED_AMBULANCE.status} highlight />
          <InfoCard label="Driver" value={ASSIGNED_AMBULANCE.driver} />
          <InfoCard label="Paramedic" value={ASSIGNED_AMBULANCE.paramedic} />
        </div>

        {/* Join Call button */}
        <button
          onClick={joinCall}
          className="mt-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
        >
          📞 Join Ambulance Call
        </button>

        {/* Placeholder note */}
        <p className="text-xs text-gray-400 text-center">
          Live data will be connected in Week 2
        </p>
      </div>

      {/* Right — Map */}
      <div className="flex flex-col flex-1">
        <div className="p-3 bg-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">🗺️ Ambulance Live Location</p>
          <p className="text-xs text-gray-400">Tracking: {ASSIGNED_AMBULANCE.patientName}'s ambulance</p>
        </div>

        <MapContainer center={ASSIGNED_AMBULANCE.position} zoom={16} style={{ flex: 1 }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapUpdater position={ASSIGNED_AMBULANCE.position} />
          <Marker position={ASSIGNED_AMBULANCE.position}>
            <Popup>🚑 {ASSIGNED_AMBULANCE.patientName} → {ASSIGNED_AMBULANCE.destination}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Video Call Modal */}
      {showCall && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl p-6 w-[700px] shadow-2xl">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">📞 Ambulance Call</h3>
              <div className={`text-xs font-semibold px-3 py-1 rounded-full ${callStatus === 'Connected' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {callStatus}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Your Camera</p>
                <video ref={localVideoRef} autoPlay muted className="w-full rounded-xl bg-black aspect-video" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Paramedic's Camera</p>
                <video ref={remoteVideoRef} autoPlay className="w-full rounded-xl bg-black aspect-video" />
              </div>
            </div>

            <button
              onClick={closeCall}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors cursor-pointer"
            >
              🔴 End Call
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorView;