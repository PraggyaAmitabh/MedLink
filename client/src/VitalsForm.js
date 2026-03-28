import { useState } from 'react'
import { submitVitals } from './vitals'

function VitalsForm({ patientId, ambulanceId }) {
  const [bp, setBp] = useState('')
  const [hr, setHr] = useState('')
  const [temperature, setTemperature] = useState('')
  const [notes, setNotes] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    try {
      await submitVitals(patientId, ambulanceId, { bp, hr, temperature, notes })
      setSuccess('Vitals submitted!')
      setBp(''); setHr(''); setTemperature(''); setNotes('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>📋 Submit Patient Vitals</h2>
      <input placeholder="Blood Pressure (e.g. 120/80)" value={bp} onChange={e => setBp(e.target.value)} />
      <input placeholder="Heart Rate (bpm)" value={hr} onChange={e => setHr(e.target.value)} />
      <input placeholder="Temperature (°C)" value={temperature} onChange={e => setTemperature(e.target.value)} />
      <input placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
      <button onClick={handleSubmit}>Submit Vitals</button>
      {success && <p style={{color:'green'}}>{success}</p>}
    </div>
  )
}

export default VitalsForm

