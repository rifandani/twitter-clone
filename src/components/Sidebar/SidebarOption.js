import React from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { Link, useHistory } from 'react-router-dom';
// files
import './SidebarOption.css';
import { auth } from '../../config/firebase';
import { options } from '../../config/toastify';

const SidebarOption = ({ text, Icon, to, active }) => {
  const [_, __, removeCookie] = useCookies(['user']);
  const history = useHistory();

  if (text === 'Logout') {
    async function logout() {
      await auth.signOut();
      removeCookie('user', { path: '/' });
      history.push('/login');

      toast.success('Logged out', options);
    }

    return (
      <div
        className={`sidebarOption ${active && 'sidebarOption--active'}`}
        onClick={logout}
      >
        <Icon />

        <h2 className="">{text}</h2>
      </div>
    );
  }

  return (
    <Link to={to}>
      <div className={`sidebarOption ${active && 'sidebarOption--active'}`}>
        <Icon />

        <h2 className="">{text}</h2>
      </div>
    </Link>
  );
};

export default SidebarOption;
