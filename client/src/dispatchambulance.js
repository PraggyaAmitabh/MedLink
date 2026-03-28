import { supabase } from './supabaseClient'
import { createDailyRoom } from './dailyco'
import { notifyDoctorOnDispatch } from './notifications'
import { updateAmbulance } from './api'

export async function dispatchAmbulance(ambulanceId, doctorId, patientInfo) {
  // Step 1: Update ambulance status to dispatched
  await updateAmbulance(ambulanceId, { status: 'dispatched' })

  // Step 2: Create a Daily.co video room
  const roomUrl = await createDailyRoom(ambulanceId)

  // Step 3: Notify the doctor with the room link
  await notifyDoctorOnDispatch(ambulanceId, doctorId, patientInfo, roomUrl)

  return roomUrl
}
