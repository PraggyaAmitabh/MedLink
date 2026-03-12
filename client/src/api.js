import { supabase } from './supabaseClient'

// ===== BEDS =====
export async function getBeds() {
  const { data, error } = await supabase.from('beds').select('*')
  if (error) throw error
  return data
}

export async function updateBed(id, updates) {
  const { data, error } = await supabase.from('beds').update(updates).eq('id', id)
  if (error) throw error
  return data
}

// ===== STAFF =====
export async function getStaff() {
  const { data, error } = await supabase.from('staff').select('*')
  if (error) throw error
  return data
}

// ===== AMBULANCES =====
export async function getAmbulances() {
  const { data, error } = await supabase.from('ambulances').select('*')
  if (error) throw error
  return data
}

export async function updateAmbulance(id, updates) {
  const { data, error } = await supabase.from('ambulances').update(updates).eq('id', id)
  if (error) throw error
  return data
}