import { useState, useEffect } from 'react';
// files
import { auth } from '../config/firebase';

const useAuth = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // triggered ketika user signed in / signed out
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // jika user signed in
        setAuthUser(user);
      } else {
        // jika user signed out
        setAuthUser(null);
      }
    });

    // cleanup
    return () => unsubscribe();
  }, []);

  return [authUser, setAuthUser];
};

export default useAuth;
