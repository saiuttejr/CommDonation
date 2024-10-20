import { storage, db } from './fire'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';  
import { collection, addDoc } from 'firebase/firestore';  

 export const uploadDonation = async (title, description, imageFile, donorName, email, phone,category) => {
  try{
  const imageRef = ref(storage, `donations/${imageFile.name}`);
   console.log(imageRef);
  await uploadBytes(imageRef, imageFile);
  console.log("i am logged ");
  const imageUrl = await getDownloadURL(imageRef);
  console.log(imageUrl);
  await addDoc(collection(db, 'donations'), {
    title,
    description,
    imageUrl,
    donorName,   
    email,       
    phone, 
    category,        
  });

  console.log('Donation uploaded successfully');
}
 catch(error){
  console.error("Error uploading donation:", error);
  alert("Failed to upload donation.");
 };
}