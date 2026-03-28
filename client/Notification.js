import { supabase } from './supabaseClient'

// Send notification when ambulance is dispatched
export async function notifyDoctorOnDispatch(ambulanceId, doctorId, patientInfo, roomUrl) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      ambulance_id: ambulanceId,
      doctor_id: doctorId,
      message: `🚨 Ambulance dispatched! Patient: ${patientInfo.name}. Join video call: ${roomUrl}`,
      type: 'ambulance_dispatch',
      is_read: false,
      created_at: new Date()
    }])
  if (error) throw error
  return data
}

// Get all notifications for a doctor
export async function getDoctorNotifications(doctorId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Mark notification as read
export async function markAsRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
  if (error) throw error
  return data
}

// Listen LIVE for new notifications (real-time)
export function listenForNotifications(doctorId, callback) {
  return supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `doctor_id=eq.${doctorId}`
    }, payload => {
      callback(payload.new)
    })
    .subscribe()
}