import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
  <div className={`bg-white rounded-lg p-3 shadow-sm border-l-4 ${highlight ? 'border-red-500' : 'border-blue-500'}`}>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? 'text-red-500' : 'text-gray-800'}`}>{value}</p>
  </div>
);

const DoctorView = () => {
  const [ambulance, setAmbulance] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      // Fetch latest dispatched ambulance
      const { data, error } = await supabase
        .from('ambulances')
        .select('*')
        .eq('status', 'dispatched')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching ambulance:', error);
      } else if (data && data.length > 0) {
        setAmbulance(data[0]);
      }

      // Fetch latest vitals
      const { data: vitalsData, error: vitalsError } = await supabase
        .from('vitals')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);

      if (!vitalsError && vitalsData && vitalsData.length > 0) {
        setVitals(vitalsData[0]);
      }
    };

    fetchLatestData();

    // Listen for new ambulance dispatches
    const subscription = supabase
      .channel('ambulances')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ambulances',
      }, (payload) => {
        setAmbulance(payload.new);
        setNotification(`🚨 New ambulance dispatched! Patient: ${payload.new.patient_name}`);
        setTimeout(() => setNotification(null), 5000);
      })
      .subscribe();

    // Listen for ambulance location updates
    const locationSubscription = supabase
      .channel('ambulance-location')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'ambulances',
      }, (payload) => {
        setAmbulance(prev => ({
          ...prev,
          lat: payload.new.lat,
          lng: payload.new.lng,
        }));
      })
      .subscribe();

    // Listen for new vitals
    const vitalsSubscription = supabase
      .channel('vitals')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'vitals',
      }, (payload) => {
        setVitals(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
      supabase.removeChannel(locationSubscription);
      supabase.removeChannel(vitalsSubscription);
    };
  }, []);

  const closeCall = () => {
    setShowCall(false);
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };

  return (
    <div className="flex h-screen font-sans relative">

      {/* Notification Banner */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-sm z-50 animate-bounce">
          {notification}
        </div>
      )}

      {/* Left — Patient Info + Vitals */}
      <div className="w-72 min-w-[288px] bg-gray-50 p-6 flex flex-col gap-4 overflow-y-auto shadow-md">
        <h2 className="text-xl font-bold text-blue-600">👨‍⚕️ Doctor Dashboard</h2>

        {ambulance ? (
          <>
            {/* Incoming ambulance alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-400 font-semibold uppercase mb-1">🚨 Incoming Ambulance</p>
              <p className="text-sm font-bold text-red-600">{ambulance.patient_name}</p>
              <p className="text-xs text-gray-500">{ambulance.destination}</p>
            </div>

            {/* Patient details */}
            <div className="flex flex-col gap-3">
              <InfoCard label="Patient" value={ambulance.patient_name} />
              <InfoCard label="Destination" value={ambulance.destination} />
              <InfoCard label="Status" value={ambulance.status} highlight />
            </div>

            {/* Vitals */}
            {vitals && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-red-400 font-semibold uppercase mb-3">🩺 Patient Vitals</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Blood Pressure</span>
                    <span className="font-semibold text-gray-800">{vitals.blood_pressure}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Heart Rate</span>
                    <span className="font-semibold text-gray-800">{vitals.heart_rate} bpm</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Oxygen Level</span>
                    <span className="font-semibold text-gray-800">{vitals.oxygen_level}%</span>
                  </div>
                  {vitals.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500">
                      📝 {vitals.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Join Call button */}
            <button
              onClick={() => setShowCall(true)}
              className="mt-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              📞 Join Ambulance Call
            </button>
          </>
        ) : (
          <div className="p-4 bg-gray-100 rounded-lg text-gray-500 text-sm text-center">
            No active ambulances right now
          </div>
        )}
      </div>

      {/* Right — Map */}
      <div className="flex flex-col flex-1">
        <div className="p-3 bg-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">🗺️ Ambulance Live Location</p>
          <p className="text-xs text-gray-400">
            {ambulance ? `Tracking: ${ambulance.patient_name}'s ambulance` : 'Waiting for dispatch...'}
          </p>
        </div>

        {ambulance && ambulance.lat && ambulance.lng ? (
          <MapContainer center={[ambulance.lat, ambulance.lng]} zoom={16} style={{ flex: 1 }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <MapUpdater position={[ambulance.lat, ambulance.lng]} />
            <Marker position={[ambulance.lat, ambulance.lng]}>
              <Popup>🚑 {ambulance.patient_name} → {ambulance.destination}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
            Waiting for ambulance location...
          </div>
        )}
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