import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import moment from 'moment';
// material-ui
import { Avatar } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EditIcon from '@material-ui/icons/Edit';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
// files
import noImg from '../../images/noImg.png';
import { options } from '../../config/toastify';
import { db } from '../../config/firebase';
// components
import CommentModal from './CommentModal';

const TweetComment = ({ post, setPost, comment }) => {
  const [cookies] = useCookies(['user']);
  const [showModal, setShowModal] = useState(false);

  // is your own comment
  const postedByYourself = cookies?.user?.uid === comment?.postedBy?.id;

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleEditComment(commentText) {
    try {
      const postRef = db.collection('posts').doc(post.id);
      const doc = await postRef.get();

      if (doc.exists) {
        const previousComments = doc.data().comments; // comments array
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

        // updated comments array
        const updatedComments = previousComments.map((el) =>
          el.createdAt === comment.createdAt ? newComment : el,
        );

        // update comments di firestore
        await postRef.update({
          comments: updatedComments,
        });

        // update state
        setPost((prevState) => ({
          ...prevState,
          comments: updatedComments,
        }));

        // close modal and toast
        setShowModal(false);
        toast.success('Comment edited', options);
      } else {
        toast.warning('Post did not exists', options);
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Edit comment error', options);
    }
  }

  async function handleDeleteComment() {
    try {
      const postRef = db.collection('posts').doc(post.id);
      const doc = await postRef.get();

      if (doc.exists) {
        const previousComments = doc.data().comments; // comments array

        // delete comment == updated comments array
        const updatedComments = previousComments.filter(
          (el) => el.createdAt !== comment.createdAt,
        );

        // update the firestore
        await postRef.update({
          comments: updatedComments,
        });

        // update state
        setPost((prevState) => ({
          ...prevState,
          comments: updatedComments,
        }));

        // close modal and toast
        setShowModal(false);
        toast.success('Comment deleted successfully', options);
      } else {
        toast.warning('Post did not exists', options);
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Error deleting comment', options);
    }
  }

  return (
    <>
      <CommentModal
        isOpen={showModal}
        title="Edit Comment"
        sendAction={handleEditComment}
        closeAction={handleCloseModal}
        comment={comment}
      />

      <div className="w-full">
        <div className="post">
          {/* avatar */}
          <div className="post__avatar">
            <Avatar
              src={comment?.postedBy?.photoURL || noImg}
              alt={comment?.postedBy?.displayName}
            />
          </div>

          {/* body */}
          <div className="post__body">
            <div className="post__header">
              {/* displayname, badge, username */}
              <div className="post__headerText flex justify-between">
                <h3>
                  {comment?.postedBy?.displayName}{' '}
                  <span className="post__headerSpan">
                    {comment?.postedBy?.verified && (
                      <VerifiedUserIcon className="post__badge" />
                    )}{' '}
                    @{comment?.postedBy?.displayName.toLowerCase()} ~{' '}
                    {moment(comment?.createdAt).fromNow()}
                  </span>
                </h3>

                {postedByYourself && (
                  <div className="flex space-x-3">
                    <EditIcon
                      className="cursor-pointer rounded-full hover:text-orange-500"
                      fontSize="small"
                      onClick={() => setShowModal(true)}
                    />
                    <HighlightOffIcon
                      className="cursor-pointer rounded-full hover:text-red-500"
                      fontSize="small"
                      onClick={handleDeleteComment}
                    />
                  </div>
                )}
              </div>

              {/* text */}
              <div className="post__headerDescription">
                <p className="">{comment?.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TweetComment;
