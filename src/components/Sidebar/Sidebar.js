import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
// material-ui
import { Button } from '@material-ui/core';
import TwitterIcon from '@material-ui/icons/Twitter';
import HomeIcon from '@material-ui/icons/Home';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExploreIcon from '@material-ui/icons/Explore';
// files
import './Sidebar.css';
import SidebarOption from './SidebarOption';
import { db } from '../../config/firebase';

const Sidebar = () => {
  const { push } = useHistory();
  const { pathname } = useLocation();
  const [cookies] = useCookies(['user']);

  const isHome = pathname.includes('home');
  const isTrending = pathname.includes('trending');
  const isFavorite = pathname.includes('favorite');
  const isRetweet = pathname.includes('retweet');
  const isProfile = pathname.includes('profile');
  const isExplore = pathname.includes('explore');

  // untuk link ke profile butuh username
  const [username, setUsername] = useState('');
  useEffect(() => {
    const getUser = db
      .collection('users')
      .doc(cookies?.user?.uid)
      .onSnapshot((snapshot) => {
        const username = snapshot.get('username');
        setUsername(username);
      });

    return () => getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!cookies.user) return <Redirect to="/login" />;

  return (
    <div className="sidebar">
      {/* Twitter logo */}
      <TwitterIcon className="sidebar__twitterIcon cursor-pointer hover:text-blue-500" />

      {/* Sidebar options */}
      <SidebarOption text="Home" Icon={HomeIcon} to="/home" active={isHome} />
      <SidebarOption
        text="Explore"
        Icon={ExploreIcon}
        to="/explore"
        active={isExplore}
      />
      <SidebarOption
        text="Trending"
        Icon={WhatshotIcon}
        to="/trending"
        active={isTrending}
      />
      <SidebarOption
        text="Favorite"
        Icon={FavoriteIcon}
        to="/favorite"
        active={isFavorite}
      />
      <SidebarOption
        text="Retweet"
        Icon={PlaylistAddCheckIcon}
        to="/retweet"
        active={isRetweet}
      />
      <SidebarOption
        text="Profile"
        Icon={PersonOutlineIcon}
        to={`/profile/${cookies?.user?.uid}`}
        active={isProfile}
      />
      <SidebarOption text="Logout" Icon={ExitToAppIcon} />

      {/* Tweet button */}
      <Button
        className="sidebar__tweet cursor-pointer"
        variant="outlined"
        fullWidth
        onClick={() => push('/home')}
      >
        Tweet
      </Button>
    </div>
  );
};

export default Sidebar;
