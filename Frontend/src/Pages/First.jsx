import React, { useEffect, useState } from "react";
import instance from "./axiosConfig";
import UserContext from "./UserContext.jsx";

const First = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await instance.get("/user/checkToken", {
        withCredentials: true,
      });

      const userData = res.data?.User; 
      if (userData?._id) {
        setUser({ _id: userData._id });
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider value={{ fetchData, user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default First;
