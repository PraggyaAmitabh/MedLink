import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Peer from 'peerjs';
import { supabase } from '../supabaseClient';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 16, { animate: true, duration: 1 });
  }, [position, map]);
  return null;
};

const InfoCard = ({ label, value, highlight }) => (
  <div className={`bg-white rounded-lg p-3 min-w-[150px] shadow-sm border-l-4 ${highlight ? 'border-red-500' : 'border-blue-500'}`}>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? 'text-red-500' : 'text-gray-800'}`}>{value}</p>
  </div>
);

const AmbulancePage = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [ambulanceInfo, setAmbulanceInfo] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [form, setForm] = useState({
    patientName: '',
    age: '',
    destination: '',
    driver: '',
    paramedic: '',
    status: 'En Route',
  });

  const [vitals, setVitals] = useState({
    bp: '',
    hr: '',
    oxygen: '',
    temp: '',
    notes: '',
  });
  const [vitalsSaved, setVitalsSaved] = useState(false);

  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // GPS
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    const watcher = navigator.geolocation.watchPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => setError('Unable to get location: ' + err.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // PeerJS
  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;
    peer.on('call', (call) => {
      setShowCall(true);
      setCallStatus('Incoming call from doctor...');
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            setCallStatus('Connected');
          });
        });
    });
    return () => peer.destroy();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleVitalsChange = (e) => setVitals({ ...vitals, [e.target.name]: e.target.value });

const handleDispatch = async () => {
  if (!form.patientName || !form.destination || !form.driver || !form.paramedic) {
    alert('Please fill in all fields!');
    return;
  }

  // Save to Supabase ambulances table
  const { data, error } = await supabase
    .from('ambulances')
    .insert([{
      patient_name: form.patientName,
      destination: form.destination,
      status: 'dispatched',
      lat: position[0],
      lng: position[1],
    }]);

  if (error) {
    console.error('Error saving ambulance:', error);
    alert('Failed to save to database!');
    return;
  }

  setAmbulanceInfo(form);
  setTracking(true);
};

 const handleSaveVitals = async () => {
  if (!vitals.bp || !vitals.hr || !vitals.oxygen || !vitals.temp) {
    alert('Please fill in all vitals!');
    return;
  }

  const { error } = await supabase
    .from('vitals')
    .insert([{
      patient_name: ambulanceInfo.patientName,
      blood_pressure: vitals.bp,
      heart_rate: vitals.hr,
      oxygen_level: vitals.oxygen,
      notes: vitals.notes,
    }]);

  if (error) {
    console.error('Error saving vitals:', error);
    alert('Failed to save vitals!');
    return;
  }

  setVitalsSaved(true);
  setTimeout(() => setVitalsSaved(false), 3000);
};

  const closeCall = () => {
    setShowCall(false);
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };

  if (error) return <div className="p-5 text-red-500">{error}</div>;
  if (!position) return <div className="p-5 text-gray-500">Getting your location...</div>;

  return (
    <div className="flex h-screen font-sans relative">

      {/* Left — Dispatch Form */}
      <div className="w-72 min-w-[288px] bg-gray-50 p-6 flex flex-col gap-4 overflow-y-auto shadow-md">
        <h2 className="text-xl font-bold text-blue-600">🚑 Dispatch Ambulance</h2>

        {[
          { label: 'Patient Name', name: 'patientName', placeholder: 'e.g. Rahul Sharma' },
          { label: 'Age', name: 'age', placeholder: 'e.g. 45' },
          { label: 'Destination Hospital', name: 'destination', placeholder: 'e.g. KIMS Hospital' },
          { label: 'Driver Name', name: 'driver', placeholder: 'e.g. Suresh Kumar' },
          { label: 'Paramedic Name', name: 'paramedic', placeholder: 'e.g. Anita Das' },
        ].map(field => (
          <div key={field.name}>
            <label className="text-xs text-gray-500 block mb-1">{field.label}</label>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <button
          onClick={handleDispatch}
          className="mt-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
        >
          🚨 Start Tracking
        </button>

        {tracking && (
          <>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
              ✅ Ambulance is being tracked!
            </div>
            <button
              onClick={() => setShowCall(true)}
              className="py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              📞 Join Doctor Call
            </button>
          </>
        )}
      </div>

      {/* Middle — Info Panel + Map */}
      <div className="flex flex-col flex-1">
        {ambulanceInfo && (
          <div className="flex gap-3 p-3 bg-gray-100 flex-wrap shadow-sm">
            <InfoCard label="Patient" value={`${ambulanceInfo.patientName}, ${ambulanceInfo.age} yrs`} />
            <InfoCard label="Destination" value={ambulanceInfo.destination} />
            <InfoCard label="Status" value={ambulanceInfo.status} highlight />
            <InfoCard label="Driver" value={ambulanceInfo.driver} />
            <InfoCard label="Paramedic" value={ambulanceInfo.paramedic} />
          </div>
        )}

        <MapContainer center={position} zoom={16} style={{ flex: 1 }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapUpdater position={position} />
          <Marker position={position}>
            <Popup>
              {ambulanceInfo
                ? `🚑 ${ambulanceInfo.patientName} → ${ambulanceInfo.destination}`
                : '🚑 Ambulance'}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Right — Vitals Panel (only shows after dispatch) */}
      {tracking && (
        <div className="w-72 min-w-[288px] bg-gray-50 p-6 flex flex-col gap-4 overflow-y-auto shadow-md border-l border-gray-200">
          <h2 className="text-xl font-bold text-red-500">🩺 Patient Vitals</h2>
          <p className="text-xs text-gray-400">Enter vitals in real time as paramedic monitors the patient</p>

          {[
            { label: 'Blood Pressure (mmHg)', name: 'bp', placeholder: 'e.g. 120/80' },
            { label: 'Heart Rate (bpm)', name: 'hr', placeholder: 'e.g. 72' },
            { label: 'Oxygen Level (%)', name: 'oxygen', placeholder: 'e.g. 98' },
            { label: 'Temperature (°C)', name: 'temp', placeholder: 'e.g. 37.2' },
          ].map(field => (
            <div key={field.name}>
              <label className="text-xs text-gray-500 block mb-1">{field.label}</label>
              <input
                name={field.name}
                value={vitals[field.name]}
                onChange={handleVitalsChange}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-500 block mb-1">Notes</label>
            <textarea
              name="notes"
              value={vitals.notes}
              onChange={handleVitalsChange}
              placeholder="e.g. Patient is conscious, complaining of chest pain"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>

          <button
            onClick={handleSaveVitals}
            className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
          >
            💾 Save Vitals
          </button>

          {vitalsSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
              ✅ Vitals saved to database!
            </div>
          )}
        </div>
      )}

      {/* Video Call Modal */}
      {showCall && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl p-6 w-[700px] shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">📞 Doctor Call</h3>
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
                <p className="text-xs text-gray-400 mb-1">Doctor's Camera</p>
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

export default AmbulancePage;