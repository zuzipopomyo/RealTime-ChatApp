import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore'; // Import query and where functions
import './addUser.css';
import { db } from "../../../../lib/firebase";
import { useState } from 'react';
import { useUserStore } from '../../../../lib/userStore';

const AddUser = () => {
  const { currentUser } = useUserStore();
  const [user, setUser] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username)); // Use query and where functions correctly
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        setUser(null); // Clear user state if not found
        console.log("User not found.");
      }
    } catch (err) {
      console.error("Error searching for user:", err);
    }
  }

  const handleAdd = async () => {
    if (!user) {
      console.error("No user selected.");
      return;
    }

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Update userchats for user.id (receiver)
      await setDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      }, { merge: true });

      // Update userchats for currentUser.id
      await setDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      }, { merge: true });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  }

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  )
}

export default AddUser;
