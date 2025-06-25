import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserInfoByUid } from '../../firebase/authSystem';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (authUser) {
        setLoading(true);
        try {
          const info = await getUserInfoByUid(authUser.uid);
          setUserInfo(info);
        } catch (error) {
          setUserInfo(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUserInfo(null);
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [authUser]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading, uid: authUser ? authUser.uid : null }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
