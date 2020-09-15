import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
// files
import UserContext from '../../contexts/UserContext';

const PrivateRoute = ({ children, ...rest }) => {
  const { user } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (user) return children;

        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
