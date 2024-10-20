import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs,where } from 'firebase/firestore';
import { db } from './fire';  
import { getAuth } from 'firebase/auth';
import Shimmer from './Shimmer';

const DonationCard = () => {
  const [item, setItem] = useState(null); 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userChats, setUserChats] = useState([]);              
  const [clientMessages, setClientMessages] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);  
  const { id } = useParams();
  const auth = getAuth();
  const user = auth.currentUser;
  const [chatRoomId, setChatRoomId] = useState(null); 
  
  useEffect(() => {
    fetchDonationDetails();
  }, [id]);

  useEffect(() => {
    if (item) {
      if (user.email === item.email) {
        fetchUsers();  
      } else {
        fetchMessages();  
      }
    }
  }, [item]);

  const fetchDonationDetails = async () => {
    const donationDocRef = doc(db, "donations", id);
    const donationDocSnapshot = await getDoc(donationDocRef);

    if (donationDocSnapshot.exists()) {
      const donationData = donationDocSnapshot.data();
      setItem(donationData);
    } else {
      console.log("No such document!");
    }
  };

  const generateChatRoomId = async (clientEmail, donationId, donorEmail) => {
    const generatedRoomId = `${clientEmail}_${donationId}_${donorEmail}`;
    setChatRoomId(generatedRoomId); 

    
    const querySnapshot = await getDocs(query(collection(db, 'collectionMetadata'), 
      where("roomId", "==", generatedRoomId)));
    
    if (querySnapshot.empty && user.email !== donorEmail) { 
      await addDoc(collection(db, "collectionMetadata"), {
        roomId: generatedRoomId,
        donor: donorEmail,
        client: clientEmail,
        donationId: donationId,
        createdAt: serverTimestamp(),
      });
    }
    return generatedRoomId; 
  }

  const fetchMessages = async () => {
    const roomId = await generateChatRoomId(user.email, id, item.email);
    
    const q = query(collection(db, roomId), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList = [];
      querySnapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesList);
    });

    return () => unsubscribe();
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'collectionMetadata'));
    const users = querySnapshot.docs.filter((doc) => {
      return doc.data().donationId === id;
    });
    setUserChats(users);
  };

  const fetchDonorChats = async () => {
    const roomId = await generateChatRoomId(selectedClient, id, user.email);
    
    const q = query(collection(db, roomId), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientMessagesList = [];
      querySnapshot.forEach((doc) => {
        clientMessagesList.push({ id: doc.id, ...doc.data() });
      });
      setClientMessages(clientMessagesList);
    });

    return () => unsubscribe();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    if (!chatRoomId) return;  

    await addDoc(collection(db, chatRoomId), {
      message,
      senderId: user.uid,
      senderEmail: user.email,
      senderName: user.displayName || user.email,
      timestamp: serverTimestamp(),
      donationId: id,
    });

    setMessage('');
  };

  const handleChatSelection = (clientEmail) => {
    setSelectedClient(clientEmail);
    fetchDonorChats();
  };

  if (!item) {
    return <Shimmer />;
  }

  return (
    <div className="donation-card-container">
    
      <div className="card">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className="card-image" />
        )}
        <h3 className="card-title">{item.title}</h3>
        <p className="card-description">{item.description}</p>
        <div className="donor-info">
          <h4 className="donor-info-title">Donor Information</h4>
          <p className="donor-info-text"><strong>Name:</strong> {item.donorName}</p>
          <p className="donor-info-text"><strong>Email:</strong> {item.email}</p>
          <p className="donor-info-text"><strong>Phone:</strong> {item.phone}</p>
        </div>
      </div>

     
      {user.email !== item.email && (
        <div className="chat-section">
          <h4>Chat with {item.donorName}</h4>
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.senderId === user.uid ? 'my-message' : ''}`}>
                <strong>{msg.senderName}</strong>: {msg.message}
              </div>
            ))}
          </div>
          <form onSubmit={(e) => sendMessage(e)}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

     
      {user.email === item.email && (
        <div className="donor-chat-list">
          <h4>Messages from Users</h4>
          {userChats.map(chat => (
            <div key={chat.roomId} className="user-chat" onClick={() => handleChatSelection(chat.data().client)}>
              <p>Chat with {chat.data().client}</p>
            </div>
          ))}
        </div>
      )}

    
      {selectedClient && (
        <div className="client-messages-section">
          <h4>Chat with {selectedClient}</h4>
          <div className="client-messages-container">
            {clientMessages.map((msg) => (
              <div key={msg.id} className={`message ${msg.senderId === user.uid ? 'my-message' : ''}`}>
                <strong>{msg.senderName}</strong>: {msg.message}
              </div>
            ))}
          </div>
          <form onSubmit={(e) => sendMessage(e)}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DonationCard;
