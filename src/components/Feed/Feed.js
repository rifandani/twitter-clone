import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import StarsIcon from '@material-ui/icons/Stars';
import FlipMove from 'react-flip-move';
// files
import './Feed.css';
import TweetBox from './TweetBox';
import Post from './Post';
import { db } from '../../config/firebase';
import { options } from '../../config/toastify';

const Feed = ({ isTrending, isFavorite, isRetweet, isExplore }) => {
  const [cookies] = useCookies(['user']);

  const [posts, setPosts] = useState([]);

  async function handleSnapshot(snapshot) {
    setPosts([]);
    const posts = await snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setPosts(posts); // set posts to state
  }

  function getPosts() {
    if (isTrending) {
      return db
        .collection('posts')
        .orderBy('likeCount', 'desc')
        .onSnapshot(handleSnapshot);
    } else if (isFavorite) {
      return db
        .collection('users')
        .doc(cookies?.user?.uid)
        .onSnapshot(async (snapshot) => {
          setPosts([]);

          const arr = await snapshot.get('likedPosts'); // array of string
          let likedPosts = [];

          arr.forEach(async (el) => {
            const post = await db.collection('posts').doc(el).get();
            const data = {
              ...post.data(),
              id: post.id,
            };
            likedPosts.push(data);
          });

          setPosts(likedPosts);
        });
    } else if (isRetweet) {
      return db
        .collection('users')
        .doc(cookies?.user?.uid)
        .onSnapshot(async (snapshot) => {
          setPosts([]);

          const arr = await snapshot.get('retweetedPosts'); // array of string
          let retweetedPosts = [];

          arr.forEach(async (el) => {
            const post = await db.collection('posts').doc(el).get();
            const data = {
              ...post.data(),
              id: post.id,
            };
            retweetedPosts.push(data);
          });

          setPosts(retweetedPosts);
        });
    } else if (isExplore) {
      return setPosts([]);
    } else {
      return db
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .onSnapshot(handleSnapshot);
    }
  }

  useEffect(() => {
    getPosts();

    return () => getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrending, isFavorite]);

  function handleKeyDown(e) {
    if (e.keyCode === 13) {
      if (!query) return toast.warning('Please input some text', options);
      setClick((prev) => prev + 1);
    }
  }

  const [click, setClick] = useState(0);
  const [query, setQuery] = useState('');
  useEffect(() => {
    const unsub = db
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredPosts = posts.filter((post) =>
          post.text.toLowerCase().includes(query),
        );
        setPosts(filteredPosts);
      });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [click]);

  return (
    <div className="feed">
      {/* Header */}
      <div className="feed__header flex justify-between">
        <h2>
          {(isTrending && 'Trending') ||
            (isFavorite && 'Favorited') ||
            (isRetweet && 'Retweeted') ||
            (isExplore && 'Explore') ||
            'Home'}
        </h2>
        {isExplore ? (
          <input
            className="outline-none focus:shadow-outline focus:bg-blue-100 px-3 w-64 ml-5"
            type="text"
            placeholder="Search Twittee"
            value={query}
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <StarsIcon className="text-blue-400" />
        )}
      </div>

      {/* TweetBox */}
      {isExplore ? null : <TweetBox />}

      {/* Post */}
      <FlipMove>
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            text={post.text}
            image={post.image}
            createdAt={post.createdAt}
            post={post}
            postedBy={post.postedBy}
          />
        ))}
      </FlipMove>
    </div>
  );
};

export default Feed;
