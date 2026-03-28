import { supabase } from './supabaseClient'

// Submit vitals from ambulance
export async function submitVitals(patientId, ambulanceId, vitalsData) {
  const { data, error } = await supabase
    .from('vitals')
    .insert([{
      patient_id: patientId,
      ambulance_id: ambulanceId,
      bp: vitalsData.bp,
      hr: vitalsData.hr,
      temperature: vitalsData.temperature,
      notes: vitalsData.notes,
      recorded_at: new Date()
    }])
  if (error) throw error
  return data
}

// Get vitals for a patient
export async function getPatientVitals(patientId) {
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false })
  if (error) throw error
  return data
}

// Listen for real-time vitals updates
export function listenForVitals(patientId, callback) {
  return supabase
    .channel('vitals')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'vitals',
      filter: `patient_id=eq.${patientId}`
    }, payload => {
      callback(payload.new)
    })
    .subscribe()
}