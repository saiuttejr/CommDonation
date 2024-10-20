import React, { useState } from 'react';
import { uploadDonation } from './uploadDonation';  
import { useNavigate } from 'react-router-dom';

const DonationForm = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [imageFileName, setImageFileName] = useState(''); 

  const handleSubmit = async (e) => {  
    e.preventDefault();

    if (!title || !description || !imageFile || !donorName || !email || !phone || !category) {
      alert("Please fill in all the fields.");   
      return;  
    }  

    try {
      await uploadDonation(title, description, imageFile, donorName, email, phone, category);
      alert("Donation uploaded successfully!");
      setTitle('');
      setDescription('');
      setImageFile(null);
      setDonorName('');
      setEmail('');
      setPhone('');
      setImageFileName(''); 
      setCategory(''); 
      navigate('/community');
    } catch (error) {
      console.error("Error uploading donation:", error);
      alert("Failed to upload donation.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageFileName(file ? file.name : '');  
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value); 
  };

  return (
    <div className="donation-form-container">
      <h2 className="donation-form-title">Submit a Donation</h2>
      <form className="donation-form" onSubmit={handleSubmit}>
        <div className="donation-form-group">
          <label className="donation-form-label">Title</label>
          <input
            type="text"
            className="donation-form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="donation-form-group">
          <label className="donation-form-label">Description</label>
          <textarea
            className="donation-form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="donation-form-group">
          <label className="donation-form-label">Image</label>
          <input
            className="donation-form-file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imageFileName && <p className="file-name">Selected file: {imageFileName}</p>}
        </div>

        <div className="donation-form-group">
          <label className="donation-form-label">Donor Name</label>
          <input
            type="text"
            className="donation-form-input"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
          />
        </div>

        <div className="donation-form-group">
          <label className="donation-form-label">Email</label>
          <input
            type="email"
            className="donation-form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="donation-form-group">
          <label className="donation-form-label">Phone</label>
          <input
            type="tel"
            className="donation-form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="donation-form-group">
          <label className="donation-form-label">Category</label>
          <div>
            {['Mobiles', 'Fashion', 'Electronics', 'Furniture', 'Appliances', 'Sports & Toys'].map((cat) => (
              <label key={cat} className="donation-form-category">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={handleCategoryChange}
                  required
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="donation-form-button">Submit Donation</button>
      </form>
    </div>
  );
};

export default DonationForm;
