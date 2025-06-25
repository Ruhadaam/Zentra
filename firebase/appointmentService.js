import { ref, push, set, get, update, remove } from 'firebase/database';
import { rtdb } from '../firebaseConfig';

// Randevu kaydetme
export const saveAppointment = async (uid, appointmentData) => {
  try {
    const formattedAppointmentData = {
      ...appointmentData,
      date: appointmentData.date ? appointmentData.date.toISOString().split('T')[0] : '',
      time: appointmentData.time ? appointmentData.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '',
      createdAt: new Date().toISOString(),
    };

    const newAppointmentRef = push(ref(rtdb, `appointments/${uid}`));
    await set(newAppointmentRef, formattedAppointmentData);
    console.log('Appointment saved successfully');
    return newAppointmentRef.key;
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw error;
  }
};

// Sadece giriş yapan kullanıcının randevularını çek
export const fetchAppointments = async (uid) => {
  try {
    const snapshot = await get(ref(rtdb, `appointments/${uid}`));

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Appointments fetched successfully!');
      return data;
    } else {
      console.log('No appointments data available');
      return {};
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const fetchAppointmentsWithIds = async (uid) => {
  try {
    const appointmentsRef = ref(rtdb, `appointments/${uid}`);
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

export const updateAppointment = async (uid, appointmentData) => {
  try {
    const appointmentRef = ref(rtdb, `appointments/${uid}/${appointmentData.id}`);
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

export const deleteAppointment = async (uid, appointmentId) => {
  try {
    const appointmentRef = ref(rtdb, `appointments/${uid}/${appointmentId}`);
    await remove(appointmentRef);
    console.log('Appointment deleted successfully');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}; 