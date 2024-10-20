import React from "react";
import { useState ,useEffect} from "react";
import ReactDOM from 'react-dom/client'; 
import Header from "./Header"; 
import Home from "./Home"; 
import DonationList from "./CommunityPages";
import Login from "./Login";
import { createBrowserRouter ,RouterProvider,Outlet,useNavigate} from 'react-router-dom'; 
import Aboutus from "./Aboutus";
import Contact from "./Contact";
import {Error} from "./Error";
import DonationCard from "./Donationcard";
import DonationForm from "./Dform";
import Profile from "./Profile";
import { getAuth, signOut } from "firebase/auth";

const AppLayout = () => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const navigate = useNavigate();

  const handleLoginState = (state) => {
    setLoggedIn(state);
    localStorage.setItem("loggedIn", state);
  };

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

  useEffect(() => {
    localStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);


  return (
    <div className="app">
      <Header loggedIn={loggedIn} handleLogout={handleLogout} />
      <Outlet context={{ loggedIn, setLoggedIn: handleLoginState }} />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path:"/",
    element : <AppLayout />,
    children:[
      {
        path:"/",
        element: <Home />
      },
      {
        path:"/about",
        element: <Aboutus />
      },
      
      {
        path:"/contact",
        element: <Contact />
      },
      { 
        path: "/Donation/:id",
        element: <DonationCard />
      },
      {
        path: "/Community",
        element: <DonationList />

      },
      {
        path: "/login",
        element:<Login />
      },
      {
        path:"/add-donation",
        element:<DonationForm />
      },
      {
        path:"/profile",
        element:<Profile />

      }
      
    ],
    errorElement:<Error />
  }
  

]);


const root = ReactDOM.createRoot(document.getElementById('root'));  
root.render(
 
   <RouterProvider router={router}/>

);

