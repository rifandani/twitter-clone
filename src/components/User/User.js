import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import moment from 'moment';
// material-ui
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
// files
import { db } from '../../config/firebase';
import noImg from '../../images/noImg.png';
// components
import Sidebar from '../Sidebar/Sidebar';
import Widget from '../Widget/Widget';

const User = () => {
  // router-dom
  const history = useHistory();
  const { userId } = useParams();
  // cookie
  const [cookies] = useCookies(['user']);
  // state
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  function getUser() {
    return db
      .collection('users')
      .doc(userId)
      .onSnapshot((snapshot) => {
        const user = {
          ...snapshot.data(),
        };

        setUser(user);
      });
  }

  function getPosts() {
    return db.collection('posts').onSnapshot((snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const filteredPosts = posts.filter((post) => post.postedBy.id === userId);

      setPosts(filteredPosts);
    });
  }

  useEffect(() => {
    getUser();

    return () => getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    getPosts();

    return () => getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!cookies?.user) return <Redirect to="/login" />;
  return (
    <>
      <Sidebar />

      <div className="feed">
        {/* Header */}
        <div className="feed__header flex space-x-5">
          <KeyboardBackspaceIcon
            className="text-blue-400 cursor-pointer hover:text-blue-500"
            onClick={() => history.goBack()}
          />
          <h2>{user?.displayName}</h2>
        </div>

        {/* profile */}
        <div className="w-full min-h-full">
          {/* profile */}
          <div className="p-3 flex flex-col items-center">
            <img
              className="w-20 rounded-full outline-none"
              src={user?.photoURL || noImg}
              alt={user?.displayName}
            />

            <p className="text-lg font-bold mt-5">
              {user?.displayName}{' '}
              {user?.emailVerified && (
                <VerifiedUserIcon className="profile__badgeIcon" />
              )}
            </p>
            <p className="text-sm text-gray-500">@{user?.username}</p>
            <p className="text-sm text-gray-500 my-3">
              Joined {user && moment(user?.createdAt).format('MMMM Do YYYY')}
            </p>

            <p className="text-sm">
              <span className="mr-5">
                <strong>0</strong> following
              </span>
              <span>
                <strong>0</strong> followers
              </span>
            </p>
          </div>

          {/* tweets */}
          <div className="p-3 flex flex-col border-t border-gray-200 space-y-3">
            <p className="text-lg font-bold self-center text-blue-500 italic">
              Tweets
            </p>

            {/* list of tweets */}
            <div className="w-full p-3 divide-y divide-gray-200">
              {/* post */}
              {posts &&
                posts.map((post) => (
                  <div
                    className="p-3 flex-column justify-center items-center space-y-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                    key={post.id}
                    onClick={() => history.push(`/post/${post.id}`)}
                  >
                    <p className="w-full">{post?.text}</p>

                    <img
                      className="w-full max-h-sm max-w-md rounded-lg"
                      src={post?.image?.imageUrl}
                      alt={post?.image?.imageName}
                    />

                    {/* tanggal */}
                    <p className="w-full pb-2 text-gray-500 italic text-sm">
                      {post?.createdAt
                        ? moment(post?.createdAt).format(
                            'dddd, MMMM Do YYYY, h:mm:ss a',
                          )
                        : null}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Widget />
    </>
  );
};

export default User;
