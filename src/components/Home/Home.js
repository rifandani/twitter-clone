import React from 'react';
import { useCookies } from 'react-cookie';
import { Redirect, useLocation } from 'react-router-dom';
// components
import Sidebar from '../Sidebar/Sidebar';
import Feed from '../Feed/Feed';
import Widget from '../Widget/Widget';

const Home = () => {
  let { pathname } = useLocation();
  const isTrending = pathname.includes('trending');
  const isFavorite = pathname.includes('favorite');
  const isRetweet = pathname.includes('retweet');
  const isExplore = pathname.includes('explore');

  const [cookies] = useCookies(['user']);
  if (!cookies?.user) return <Redirect to="/login" />;
  // console.log(cookies.user);

  return (
    <>
      <Sidebar />
      <Feed
        isTrending={isTrending}
        isFavorite={isFavorite}
        isRetweet={isRetweet}
        isExplore={isExplore}
      />
      <Widget />
    </>
  );
};

export default Home;
