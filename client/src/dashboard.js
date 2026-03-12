import { useEffect, useState } from 'react'
import { getBeds, getStaff, getAmbulances } from './api'
import { logoutUser } from './auth'

function Dashboard() {
  const [beds, setBeds] = useState([])
  const [staff, setStaff] = useState([])
  const [ambulances, setAmbulances] = useState([])

  useEffect(() => {
    getBeds().then(setBeds).catch(console.error)
    getStaff().then(setStaff).catch(console.error)
    getAmbulances().then(setAmbulances).catch(console.error)
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
        <div key={a.id}>Ambulance {a.id} — {a.status}</div>
      ))}
    </div>
  )
}

export default Dashboard