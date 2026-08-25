import api from "./api";





const login = async (
  username,
  password
) => {


  const response =
    await api.post(
      "/auth/signin",
      {
        username,
        password
      }
    );





  if(
    response.data &&
    response.data.token
  ){


    // Save complete user data
    sessionStorage.setItem(
      "user",
      JSON.stringify(response.data)
    );



    // Save token separately
    sessionStorage.setItem(
      "token",
      response.data.token
    );


  }






  return response.data;


};









const register = async (
  fullName,
  username,
  email,
  password,
  phone,
  role
) => {


  return await api.post(
    "/auth/signup",
    {
      fullName,
      username,
      email,
      password,
      phone,
      role
    }
  );


};









const logout = () => {


  sessionStorage.removeItem(
    "user"
  );


  sessionStorage.removeItem(
    "token"
  );


};









const getCurrentUser = () => {


  const userStr =
    sessionStorage.getItem(
      "user"
    );



  if(userStr){


    try{


      return JSON.parse(userStr);



    }catch(error){


      console.error(
        "User parsing error:",
        error
      );


      return null;


    }


  }



  return null;



};








const authService = {


  login,

  register,

  logout,

  getCurrentUser


};






export default authService;