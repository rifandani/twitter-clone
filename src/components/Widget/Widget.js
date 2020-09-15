import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  TwitterTweetEmbed,
  TwitterShareButton,
  TwitterFollowButton,
} from 'react-twitter-embed';
import SearchIcon from '@material-ui/icons/Search';
// files
import './Widget.css';

const Widget = () => {
  const history = useHistory();

  return (
    <div className="widget">
      {/* search */}
      <div className="widget__input">
        <Link to="/explore">
          <SearchIcon className="widget__searchIcon" />
        </Link>
        <input
          className="outline-none"
          type="text"
          placeholder="Search Twittee"
          onKeyDown={(e) => {
            if (e.key === 'Enter') return history.push('/explore');
          }}
        />
      </div>

      {/* widget container */}
      <div className="widget__widgetContainer">
        <h2>Trends for you</h2>

        <hr className="w-full bg-gray-500" />

        <TwitterTweetEmbed tweetId={'1302651872143003648'} />

        <div className="widget__button">
          <TwitterFollowButton screenName={'ipanda2505'} />
        </div>

        <div className="widget__button">
          <TwitterShareButton
            url={'https://rifandani-blog.netlify.app/'}
            options={{
              text: 'The twitter clone built with #reactjs is DOPE',
              via: 'ipanda2505',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Widget;
