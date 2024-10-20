import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Shimmer from './Shimmer';  
import { db } from './fire';     
import { useNavigate, useOutletContext } from 'react-router-dom';

const Profile = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const { setLoggedIn } = useOutletContext(); 

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;  
        if (user) {
          const userEmail = user.email; 
          const donationsRef = collection(db, 'donations');
          const q = query(donationsRef, where('email', '==', userEmail));

          const querySnapshot = await getDocs(q);
          const donationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setDonations(donationsList);  
          console.log(donations);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchDonations();  
  }, [auth]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.removeItem("loggedIn");
        setLoggedIn(false);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };


  if (loading) {
    return <Shimmer />; 
  }

  return (
    <div className="profile-container">
      <h2>Welcome, {auth.currentUser?.email}</h2> 
      <h3>Your Donations</h3>

      {donations.length > 0 ? ( 
        <ul>
          {donations.map(donation => (
            <li key={donation.id} className="donation-item">
              <h3>{donation.title}</h3>
              <p>{donation.description}</p>
              <p><strong>Donor Name:</strong> {donation.donorName}</p>
              <p><strong>Email:</strong> {donation.email}</p>
              <p><strong>Phone:</strong> {donation.phone}</p>
              {donation.imageUrl && (
                <img src={donation.imageUrl} alt={donation.title} style={{ width: '100px', height: 'auto' }} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No donations found.</p>  
      )}

      <button onClick={handleLogout}>Sign Out</button>  
    </div>
  );
};

export default Profile;
