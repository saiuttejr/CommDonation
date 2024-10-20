import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';  
import { db } from './fire';  
import Shimmer from './Shimmer';
import Donationcard2 from './Donationcardr2.0'; 
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [filterdonates, setfilterDonates] = useState([]);
  const [search, setSearch] = useState('');
  const { loggedIn, setLoggedIn } = useOutletContext();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const storedLoggedInState = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(storedLoggedInState);
    fetchDonations();      
  }, [setLoggedIn]);
  
  const fetchDonations = async () => {
    const querySnapshot = await getDocs(collection(db, 'donations'));
    const donationsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDonations(donationsData);
    setfilterDonates(donationsData);
  };

  const searchHandler = () => {
    const filteredList = donations.filter(res => 
      res.title.toLowerCase().includes(search.toLowerCase())
    );
    setfilterDonates(filteredList);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const filteredDonations = donations.filter(donation => donation.category === category);
    setfilterDonates(filteredDonations);
  };

  if (donations.length === 0) {
    return <Shimmer />;
  }

  return (
    <div className="donation-list">
      <div className='fields'>
        <ul>
          {['Mobiles', 'Fashion', 'Electronics', 'Furniture', 'Appliances', 'Sports & Toys'].map((category) => (
            <li 
              key={category} 
              onClick={() => handleCategoryClick(category)}
              className={selectedCategory === category ? 'selected-category' : ''} 
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div className='searchbar'>
        <input 
          type='text' 
          className='input-text' 
          placeholder='Search by Title                                                             🔎'  
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <button className='search-btn' onClick={searchHandler}>Search</button>
      </div>
      
      <div className="donty">
        {loggedIn ? filterdonates.map((item) => (
          <Link to={"/Donation/"+item.id} key={item.id}>
            <div className="card">
              <Donationcard2 item={item} />
            </div>
          </Link>
        )) :
        filterdonates.map((item) => (
          <div key={item.id} className="card" onClick={() => alert("You must be logged in to view this donation.")}>
            <Donationcard2 item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationList;
