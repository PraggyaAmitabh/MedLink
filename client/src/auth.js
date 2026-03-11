import { supabase } from './supabaseClient'

// REGISTER
export async function registerUser(email, password, name, role) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }
    }
  })
  if (error) throw error
  return data
}

// LOGIN
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

// GET CURRENT USER + THEIR ROLE
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return {
    user,
    role: user?.user_metadata?.role
  }
}

// LOGOUT
export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}