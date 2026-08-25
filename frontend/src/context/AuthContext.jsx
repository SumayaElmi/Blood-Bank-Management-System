import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from "react";

import authService from "../services/authService";


const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {


  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);





  useEffect(() => {


    const currentUser =
      authService.getCurrentUser();



    if(currentUser){

      console.log(
        "Current User:",
        currentUser
      );

    }



    setUser(currentUser);

    setLoading(false);



  }, []);







  const login = async (
    username,
    password
  ) => {


    const data =
      await authService.login(
        username,
        password
      );



    console.log(
      "Login Response:",
      data
    );



    setUser(data);



    return data;


  };








  const register = async (
    fullName,
    username,
    email,
    password,
    phone,
    role
  ) => {


    return await authService.register(
      fullName,
      username,
      email,
      password,
      phone,
      role
    );


  };









  const logout = () => {


    authService.logout();


    setUser(null);


  };








  const value = {


    user,

    loading,

    login,

    register,

    logout


  };







  return (

    <AuthContext.Provider value={value}>


      {!loading && children}


    </AuthContext.Provider>


  );


};







export const useAuth = () => {


  return useContext(AuthContext);


};