import { supabase } from "./supabaseClient";

/* ---------------- BEDS ---------------- */

export async function getBeds() {
  const { data, error } = await supabase
    .from("beds")
    .select("*");

  if (error) console.error(error);
  return data;
}

export async function addBed(bed) {
  const { data, error } = await supabase
    .from("beds")
    .insert([bed]);

  if (error) console.error(error);
  return data;
}

/* ---------------- AMBULANCES ---------------- */

export async function getAmbulances() {
  const { data, error } = await supabase
    .from("ambulances")
    .select("*");

  if (error) console.error(error);
  return data;
}

export async function updateAmbulanceLocation(id, lat, lng) {
  const { data, error } = await supabase
    .from("ambulances")
    .update({ lat: lat, lng: lng })
    .eq("id", id);

  if (error) console.error(error);
  return data;
}

/* ---------------- APPOINTMENTS ---------------- */

export async function getAppointments() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*");

  if (error) console.error(error);
  return data;
}

export async function bookAppointment(appointment) {
  const { data, error } = await supabase
    .from("appointments")
    .insert([appointment]);

  if (error) console.error(error);
  return data;
}

/* ---------------- INVENTORY ---------------- */

export async function getInventory() {
  const { data, error } = await supabase
    .from("inventory")
    .select("*");

  if (error) console.error(error);
  return data;
}
/* ---------------- STAFF ---------------- */

export async function getStaff() {
  const { data, error } = await supabase
    .from("staff")
    .select("*");

  if (error) console.error(error);
  return data;
}