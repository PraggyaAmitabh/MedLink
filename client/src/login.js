import { useState } from 'react'
import { loginUser } from './auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin() {
    try {
      const data = await loginUser(email, password)
      const role = data.user?.user_metadata?.role

    if (role === 'org') {
  window.location.href = '/dashboard'
} else if (role === 'patient') {
  window.location.href = '/patient-portal'
} else if (role === 'doctor') {
  window.location.href = '/doctor'
} else if (role === 'paramedic') {
  window.location.href = '/ambulance'
}
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p>No account? <a href="/register">Register</a></p>
    </div>
  )
}

export default Login