import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { Avatar, Button } from '@material-ui/core';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import GifIcon from '@material-ui/icons/Gif';
import PollIcon from '@material-ui/icons/Poll';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import EventIcon from '@material-ui/icons/Event';
// files
import './TweetBox.css';
import noImg from '../../images/noImg.png';
import { options } from '../../config/toastify';
import { storage, db } from '../../config/firebase';

const TweetBox = () => {
  const [cookies] = useCookies(['user']);

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  function imageChange(e) {
    setImage(e.target.files[0]);
    console.log(e.target.files[0]);
    toast("Image set. Let's tweet!", options);
  }

  function tweet() {
    // validation
    if (!text || !image)
      return toast.warning('Please input the text and also the image', options);

    // upload to storage
    const imagesRef = storage.ref(`images/${image.name}`);

    // listen to every state changed & set the imageURL dari firebase storage ke state
    imagesRef.put(image).on(
      'state_changed',
      (next) => {
        console.log(
          Math.round((next.bytesTransferred / next.totalBytes) * 100) +
            '% uploading image to storage',
        );
      },
      (err) => toast.error(`Upload image error: ${err.message}`, options),
      (complete) => {
        // get the image URL ref
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((imageUrl) => {
            db.collection('users')
              .doc(cookies?.user?.uid)
              .onSnapshot(async (snapshot) => {
                // save to 'posts' collection
                await db.collection('posts').add({
                  text,
                  image: {
                    imageUrl,
                    imageName: image.name,
                  },
                  likeCount: 0,
                  likes: [],
                  comments: [],
                  createdAt: Date.now(),
                  postedBy: {
                    ...snapshot.data(),
                    id: snapshot.id,
                  },
                  retweets: [],
                });
              });
          });
      },
    );

    // set state back to normal
    setText('');
    setImage(null);

    toast.success('Tweet success', options);
  }

  return (
    <div className="tweetBox">
      {/* avatar and input text */}
      <div className="tweetBox__input">
        <Avatar src={cookies?.user?.photoURL || noImg} />

        <input
          className="outline-none"
          type="text"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* icons & button */}
      <div className="flex justify-between">
        <div className="flex justify-start space-x-3 pl-5 mt-8">
          <label>
            <input
              className="hidden"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={imageChange}
            />
            <CropOriginalIcon className="text-blue-500 hover:bg-blue-100 rounded-full cursor-pointer" />
          </label>

          <GifIcon className="text-blue-500 hover:bg-blue-100 rounded-full cursor-pointer" />
          <PollIcon className="text-blue-500 hover:bg-blue-100 rounded-full cursor-pointer" />
          <InsertEmoticonIcon className="text-blue-500 hover:bg-blue-100 rounded-full cursor-pointer" />
          <EventIcon className="text-blue-500 hover:bg-blue-100 rounded-full cursor-pointer" />
        </div>

        <Button
          className="tweetBox__tweetButton cursor-pointer"
          onClick={tweet}
        >
          Tweet
        </Button>
      </div>
    </div>
  );
};

export default TweetBox;
