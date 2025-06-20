import { ref, push, set, get, update, remove } from 'firebase/database';
import { rtdb } from '../firebaseConfig';

export const saveAppointment = async (appointmentData) => {
  try {
    // Format date to YYYY-MM-DD and time to HH:mm before saving
    const formattedAppointmentData = {
      ...appointmentData,
      date: appointmentData.date ? appointmentData.date.toISOString().split('T')[0] : '', // Format date as YYYY-MM-DD
      time: appointmentData.time ? appointmentData.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '', // Format time as HH:mm
      createdAt: new Date().toISOString(), // Add a timestamp
    };

    // Use push to generate a unique key for the new appointment
    const newAppointmentRef = push(ref(rtdb, 'appointments'));
    await set(newAppointmentRef, formattedAppointmentData);
    console.log('Appointment saved successfully');
    return newAppointmentRef.key; // Return the unique key
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw error;
  }
};

export const fetchAppointments = async () => {
  try {
    const appointmentsRef = ref(rtdb, 'appointments');
    const snapshot = await get(appointmentsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Firebase returns data as an object of objects, convert to array if needed
      // For this use case (grouping by date), returning the object might be better.
      console.log('Appointments fetched successfully!');
      return data; // Returns the object with firebase keys
    } else {
      console.log('No appointments data available');
      return {}; // Return empty object if no data
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const fetchAppointmentsWithIds = async () => {
  try {
    const appointmentsRef = ref(rtdb, 'appointments');
    const snapshot = await get(appointmentsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Map each appointment to include its Firebase key as 'id'
      return Object.entries(data).map(([id, value]) => ({ ...value, id }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching appointments with ids:', error);
    throw error;
  }
};

export const updateAppointment = async (appointmentData) => {
  try {
    const appointmentRef = ref(rtdb, `appointments/${appointmentData.id}`);
    // Prepare data for update - exclude id and createdAt if they should not be updated
    const dataToUpdate = { ...appointmentData };
    delete dataToUpdate.id;
    // delete dataToUpdate.createdAt; // Uncomment if you don't want to update createdAt

    await update(appointmentRef, dataToUpdate);
    console.log('Appointment updated successfully');
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const appointmentRef = ref(rtdb, `appointments/${appointmentId}`);
    await remove(appointmentRef);
    console.log('Appointment deleted successfully');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}; 