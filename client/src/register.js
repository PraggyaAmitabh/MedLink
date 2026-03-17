import { useState } from 'react'
import { registerUser } from './auth'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('patient')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleRegister() {
    try {
      await registerUser(email, password, name, role)
      setSuccess('Account created! Please login.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Full Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      
      <select onChange={e => setRole(e.target.value)}>
  <option value="patient">Patient</option>
  <option value="org">Hospital Staff (Org)</option>
  <option value="doctor">Doctor</option>
  <option value="paramedic">Paramedic</option>
</select>

      <button onClick={handleRegister}>Register</button>
      {error && <p style={{color:'red'}}>{error}</p>}
      {success && <p style={{color:'green'}}>{success}</p>}
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  )
}

export default Register