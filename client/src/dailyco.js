// Generate a Daily.co video room for each ambulance call
export async function createDailyRoom(ambulanceId) {
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_DAILY_API_KEY}`
    },
    body: JSON.stringify({
      name: `ambulance-${ambulanceId}`,
      properties: {
        max_participants: 5,
        enable_chat: true,
        start_video_off: false
      }
    })
  })
  const data = await response.json()
  return data.url  // this is the room link doctors and paramedics join
}

// Delete room after call ends
export async function deleteDailyRoom(ambulanceId) {
  await fetch(`https://api.daily.co/v1/rooms/ambulance-${ambulanceId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_DAILY_API_KEY}`
    }
  })
}
