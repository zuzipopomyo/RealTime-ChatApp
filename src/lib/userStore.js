import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { db, auth } from "./firebase"; // Assuming you export auth and db from your firebase.js

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: false,
  fetchUserInfo: async (uid) => {
    set({ isLoading: true });

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      if (user.uid !== uid) {
        throw new Error("User does not have permission to fetch this data");
      }

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data)

      if (docSnap.exists()) {
        // Document exists in Firestore, update currentUser state
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        // Document does not exist in Firestore, handle appropriately
        console.error(`No document found for uid: ${uid}`);

        // Here you can choose to handle the situation, e.g., create a new document or set currentUser to null
        // For simplicity, setting currentUser to null
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error("Error fetching user info: ", err);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
