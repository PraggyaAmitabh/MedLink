
import { useEffect, useState } from 'react'
import { getBeds, getStaff, getAmbulances } from './api'
import { logoutUser } from './auth'
import { supabase } from './supabaseClient'

function Dashboard() {
  const [beds, setBeds] = useState([])
  const [staff, setStaff] = useState([])
  const [ambulances, setAmbulances] = useState([])

  useEffect(() => {
    async function loadData() {
      const bedsData = await getBeds()
      const staffData = await getStaff()
      const ambulanceData = await getAmbulances()
      setBeds(bedsData || [])
      setStaff(staffData || [])
      setAmbulances(ambulanceData || [])
    }

    loadData()

    // REAL-TIME BED UPDATES
    const bedChannel = supabase
      .channel('beds-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'beds' },
        payload => {
          console.log('Beds updated:', payload)
          getBeds().then(setBeds)
        }
      )
      .subscribe()

    // REAL-TIME AMBULANCE UPDATES
    const ambulanceChannel = supabase
      .channel('ambulances-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ambulances' },
        payload => {
          console.log('Ambulance updated:', payload)
          getAmbulances().then(setAmbulances)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(bedChannel)
      supabase.removeChannel(ambulanceChannel)
    }
  }, [])

  async function handleLogout() {
    await logoutUser()
    window.location.href = '/login'
  }

  return (
    <div>
      <h1>Hospital Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Beds ({beds.length})</h2>
      {beds.map(bed => (
        <div key={bed.id}>Bed {bed.id} — {bed.status}</div>
      ))}

      <h2>Staff ({staff.length})</h2>
      {staff.map(s => (
        <div key={s.id}>{s.name} — {s.role}</div>
      ))}

      <h2>Ambulances ({ambulances.length})</h2>
      {ambulances.map(a => (
        <div key={a.id}>
          🚑 {a.vehicle_number} — {a.status}
          <br />
          Patient: {a.patient_name || 'None'}
          <br />
          Destination: {a.destination || 'Not assigned'}
        </div>
      ))}
    </div>
  )
}

export default Dashboard