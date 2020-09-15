import React, { forwardRef } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  LineShareButton,
  LineIcon,
} from 'react-share';
// material-ui
import { Avatar } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
// files
import './Post.css';
import noImg from '../../images/noImg.png';

const Post = forwardRef(
  ({ id, text, image, createdAt, post, postedBy }, ref) => {
    const history = useHistory();

    return (
      <div
        className="post cursor-pointer hover:bg-gray-200"
        ref={ref}
        onClick={() =>
          history.push(`/post/${id}`, {
            ...post,
          })
        }
      >
        {/* avatar */}
        <div className="post__avatar">
          <Avatar
            src={postedBy?.photoURL || noImg}
            alt={postedBy?.displayName}
          />
        </div>

        {/* body */}
        <div className="post__body">
          <div className="post__header">
            {/* displayname, badge, username */}
            <div className="post__headerText">
              <h3>
                {postedBy?.displayName}{' '}
                <span className="post__headerSpan">
                  {postedBy?.verified && (
                    <VerifiedUserIcon className="post__badge" />
                  )}{' '}
                  @{postedBy?.username} ~{' '}
                  {createdAt && moment(createdAt).fromNow()}
                  {/* {createdAt ? createdAt.toDate().toDateString() : null} */}
                  {/* {createdAt ? moment(createdAt.toDate()).fromNow() : null} */}
                </span>
              </h3>
            </div>

            {/* text */}
            <div className="post__headerDescription">
              <p>{text}</p>
            </div>
          </div>

          <img
            className="max-w-xl max-h-xl"
            src={image.imageUrl}
            alt={image.imageName}
          />

          {/* footer */}
          <div className="post__footer">
            <LineShareButton
              className="cursor-pointer hover:shadow-outline rounded-full"
              url="http://twitter.com"
              title={text}
            >
              <LineIcon size={20} round={true} />
            </LineShareButton>
            <TelegramShareButton
              className="cursor-pointer hover:shadow-outline rounded-full"
              url="http://twitter.com"
              title={text}
            >
              <TelegramIcon size={20} round={true} />
            </TelegramShareButton>
            <FacebookShareButton
              className="cursor-pointer hover:shadow-outline rounded-full"
              url="http://twitter.com"
              quote={text}
            >
              <FacebookIcon size={20} round={true} />
            </FacebookShareButton>
            <WhatsappShareButton
              className="cursor-pointer hover:shadow-outline rounded-full"
              separator=" ~ "
              url="http://twitter.com"
              title={text}
            >
              <WhatsappIcon size={20} round={true} />
            </WhatsappShareButton>
          </div>
        </div>
      </div>
    );
  },
);

export default Post;
