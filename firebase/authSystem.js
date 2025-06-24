import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, rtdb } from "../firebaseConfig";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Giriş hatası:", error.message);
    throw error;
  }
};

export const registerUser = async (name, email, password, phoneNumber = null) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await set(ref(rtdb, 'users/' + user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error("Kayıt hatası:", error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Çıkış hatası:", error.message);
    throw error;
  }
};

export const getUserInfoByUid = async (uid) => {
  try {
    const userRef = ref(rtdb, 'users/' + uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Kullanıcı bilgisi alınamadı:', error);
    throw error;
  }
};

export { signOut };
