import React, { useState, useEffect } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import moment from 'moment';
// material-ui
import { Avatar } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
// components
import Sidebar from '../Sidebar/Sidebar';
import Widget from '../Widget/Widget';
import CommentModal from './CommentModal';
import TweetComment from './TweetComment';
// files
import { db, storage } from '../../config/firebase';
import { options } from '../../config/toastify';
import noImg from '../../images/noImg.png';

const Tweet = () => {
  // router-dom
  const history = useHistory();
  // const { location } = useHistory();
  const { postId } = useParams();
  // cookie
  const [cookies] = useCookies(['user']);
  // state
  const [post, setPost] = useState(null); // location.state
  const [showModal, setShowModal] = useState(false);
  // ref ke spesifik post
  const postRef = db.collection('posts').doc(postId);

  // getPost
  function getPost() {
    return postRef.onSnapshot((snapshot) => {
      console.log(snapshot.get('comments'));

      setPost({
        ...snapshot.data(),
        id: snapshot.id,
      });
    });
  }

  useEffect(() => {
    getPost();

    return () => getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // add Like
  async function addLike() {
    try {
      // get the referred post
      const post = await postRef.get();

      // jika post tsb exists
      if (post.exists) {
        const previousLikes = post.data().likes; // array of likes object
        const newLike = {
          likedBy: {
            id: cookies?.user?.uid,
            username: cookies?.user?.displayName.toLowerCase(),
          },
        };

        const updatedLikes = [...previousLikes, newLike]; // updated likes array
        const likeCount = updatedLikes.length; // updated likeCount

        // check jika post sudah di like sebelumnya oleh user yg sama
        const likedById = post.data().likes.map((like) => like.likedBy.id);
        const isLiked = likedById.includes(cookies?.user?.uid);
        if (isLiked) return toast.warning('Already liked', options);

        // update spesifik post di 'posts' collection ------------------------------------
        await postRef.update({
          likes: updatedLikes,
          likeCount,
        });

        // update 'likedBy' field di 'users' collection -----------------------------------
        const userRef = db.collection('users').doc(cookies?.user?.uid);
        const user = await userRef.get();
        const previousLikedPosts = user.data().likedPosts;
        const updatedLikedPosts = [...previousLikedPosts, postRef.id];
        await userRef.update({
          likedPosts: updatedLikedPosts,
        });

        // setPost di state and toast
        setPost((prevPost) => ({
          ...prevPost,
          likes: updatedLikes,
          likeCount,
        }));
        return toast.success('Tweet favorited', options);
      } else {
        return toast.warning('Post does not exists', options);
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Error liking a tweet', options);
    }
  }

  // add retweet
  async function addRetweet() {
    try {
      // get the referred post
      const post = await postRef.get();

      // jika post tsb exists
      if (post.exists) {
        const previousRetweets = post.data().retweets; // array of retweets object
        const newRetweet = {
          retweetedBy: {
            id: cookies?.user?.uid,
            username: cookies?.user?.displayName.toLowerCase(),
          },
        };

        const updatedRetweets = [...previousRetweets, newRetweet]; // updated retweets array

        // check jika post sudah di retweet sebelumnya oleh user yg sama
        const retweetedById = post
          .data()
          .retweets.map((el) => el.retweetedBy.id);
        const isRetweeted = retweetedById.includes(cookies?.user?.uid);
        if (isRetweeted) return toast.warning('Already retweeted', options);

        // update spesifik post di firestore
        await postRef.update({ retweets: updatedRetweets });

        // setPost di state and toast
        setPost((prevPost) => ({
          ...prevPost,
          retweets: updatedRetweets,
        }));
        return toast.success('Tweet retweeted', options);
      } else {
        return toast.warning('Tweet does not exists', options);
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Error retweeting a tweet', options);
    }
  }

  // posted by yourself
  function postedByYourself(post) {
    return cookies?.user?.uid === post?.postedBy?.id;
  }

  // delete post in firestore & image in storage
  async function deletePost() {
    try {
      history.push('/home');

      // delete image in storage
      const imageRef = storage.ref(`images/${post.image.imageName}`);
      await imageRef.delete();

      // delete post in firestore
      await postRef.delete();

      toast.success('Tweet deleted successfully', options);
    } catch (err) {
      console.error(err.message);
      toast.error('Error deleting tweet', options);
    }
  }

  // open modal
  function handleShowModal() {
    setShowModal(true);
  }

  // close modal
  function handleCloseModal() {
    setShowModal(false);
  }

  // add comment
  async function handleAddComment(commentText) {
    try {
      const doc = await postRef.get();

      if (doc.exists) {
        const previousComments = doc.data().comments; // array of comments
        const newComment = {
          text: commentText,
          createdAt: Date.now(),
          postedBy: {
            id: cookies?.user?.uid,
            displayName: cookies?.user?.displayName,
            username: cookies?.user?.displayName.toLowerCase(),
            photoURL: cookies?.user?.photoURL || noImg,
          },
        };
        // new comments array
        const updatedComments = [...previousComments, newComment];

        // update post di firestore
        await postRef.update({
          comments: updatedComments,
        });

        // update post di state
        setPost((prevState) => ({
          ...prevState,
          comments: updatedComments,
        }));

        // close modal
        setShowModal(false);
        toast.success('Comment successful', options);
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Adding comment error', options);
    }
  }

  console.log(post);

  // kalau tidak ada user cookie
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
          <h2>Tweet</h2>
        </div>

        {/* Post */}
        {post && (
          <>
            <div className="post">
              {/* avatar */}
              <div className="post__avatar">
                <Avatar
                  className="cursor-pointer hover:shadow-outline"
                  src={post?.postedBy?.photoURL || noImg}
                  alt={post?.postedBy?.displayName}
                  onClick={() => history.push(`/user/${post?.postedBy?.id}`)}
                />
              </div>

              {/* body */}
              <div className="post__body">
                <div className="post__header">
                  {/* displayname, badge, username */}
                  <div className="post__headerText">
                    <h3>
                      {post?.postedBy?.displayName}{' '}
                      <span className="post__headerSpan">
                        {post?.postedBy?.verified && (
                          <VerifiedUserIcon className="post__badge" />
                        )}
                        <br />@{post?.postedBy?.username || 'unknown'}
                      </span>
                    </h3>
                  </div>

                  {/* text */}
                  <div className="post__headerDescription mt-1">
                    <p>{post?.text}</p>
                  </div>
                </div>

                {/* foto */}
                <img
                  className="max-w-xl max-h-xl"
                  src={post?.image?.imageUrl}
                  alt={post?.image?.imageName}
                />

                {/* tanggal */}
                <p className="w-full mt-2 pb-2 border-b-2 border-gray-300 text-gray-500 italic text-sm">
                  {post?.createdAt
                    ? moment(post?.createdAt).format(
                        'dddd, MMMM Do YYYY, h:mm:ss a',
                      )
                    : null}
                </p>

                {/* jumlah comments, retweet, like */}
                <div className="w-full my-2 pb-2 border-b-2 border-gray-300 flex space-x-6 ">
                  <p className="text-gray-500 italic text-sm">
                    <span className="font-bold text-black">
                      {post?.comments?.length}{' '}
                    </span>
                    Comments
                  </p>
                  <p className="text-gray-500 italic text-sm">
                    <span className="font-bold text-black">
                      {post?.retweets?.length}{' '}
                    </span>
                    Retweets
                  </p>
                  <p className="text-gray-500 italic text-sm">
                    <span className="font-bold text-black">
                      {post?.likeCount}{' '}
                    </span>
                    Likes
                  </p>
                </div>

                {/* footer */}
                <div className="post__footer">
                  <ChatBubbleOutlineIcon
                    className="cursor-pointer rounded-full hover:text-yellow-500 hover:bg-yellow-200"
                    fontSize="small"
                    onClick={handleShowModal}
                  />
                  <RepeatIcon
                    className="cursor-pointer rounded-full hover:text-green-500 hover:bg-green-200"
                    fontSize="small"
                    onClick={addRetweet}
                  />
                  <FavoriteBorderIcon
                    className="cursor-pointer rounded-full hover:text-blue-500 hover:bg-blue-200"
                    fontSize="small"
                    onClick={addLike}
                  />
                  {postedByYourself(post) ? (
                    <DeleteForeverIcon
                      className="cursor-pointer rounded-full hover:text-red-500 hover:bg-red-200"
                      fontSize="small"
                      onClick={deletePost}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* comments */}
            {post?.comments.map((comment, i) => (
              <TweetComment
                key={i}
                post={post}
                setPost={setPost}
                comment={comment}
              />
            ))}
          </>
        )}
      </div>

      <Widget />

      <CommentModal
        isOpen={showModal}
        title="Add Comment"
        sendAction={handleAddComment}
        closeAction={handleCloseModal}
      />
    </>
  );
};

export default Tweet;
