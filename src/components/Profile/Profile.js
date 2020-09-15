import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import moment from 'moment';
import validator from 'validator';
import PhoneInput from 'react-phone-input-2';
// material-ui
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
// components
import Sidebar from '../Sidebar/Sidebar';
import Widget from '../Widget/Widget';
// files
import './Profile.css';
import 'react-phone-input-2/lib/style.css';
import { db, auth, storage } from '../../config/firebase';
import { options } from '../../config/toastify';
import noImg from '../../images/noImg.png';

const Profile = () => {
  // router-dom
  const history = useHistory();
  const { userId } = useParams();
  // cookie
  const [cookies, setCookie] = useCookies(['user']);
  // state
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [image, setImage] = useState(null);

  // get user based on username params
  useEffect(() => {
    db.collection('users').onSnapshot((snapshot) => {
      const el = snapshot.docs.filter((el) => el.data().uid === userId); // return array of user dengan username dari params
      const user = el[0].data(); // akses user object dan ambil semua datanya
      // set ke state
      setUser(user);
    });
  }, [userId]);

  // update cookie everytime user state changes
  useEffect(() => {
    if (user) {
      setCookie('user', user, { path: '/' });
      console.info('cookie set', cookies?.user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function imageChange(e) {
    setImage(e.target.files[0]);
    toast('Image set. Continue update the profile.', options);
  }

  async function verifyEmail() {
    try {
      await auth.currentUser.sendEmailVerification();
      await db
        .collection('users')
        .doc(user?.uid)
        .update({ emailVerified: true });

      toast.success(
        'Please check your email to verify your email address',
        options,
      );
    } catch (err) {
      console.error(err.message);
      toast.error('Error verifying email', options);
    }
  }

  async function updateEmail() {
    // validation
    if (!newEmail)
      return toast.warning('Please input the email field', options);
    if (!validator.isEmail(newEmail))
      return toast.warning('Please input the email field correctly', options);

    try {
      await auth.currentUser.updateEmail(newEmail);
      await db.collection('users').doc(user?.uid).update({ email: newEmail });
      setNewEmail('');

      toast.success(
        'Please check your email to update your email address',
        options,
      );
    } catch (err) {
      console.error(err.message);
      toast.error('Error updating email address', options);
    }
  }

  async function updatePassword() {
    // validation
    if (!newPassword)
      return toast.warning('Please input the password field', options);
    if (!validator.isLength(newPassword, { min: 6, max: 30 }))
      return toast.warning(
        'Please input the password field min 6 chars, max 30 chars',
        options,
      );

    try {
      await auth.currentUser.updatePassword(newPassword);
      setNewPassword('');

      toast.success('Please check your email to update your password', options);
    } catch (err) {
      console.error(err.message);
      toast.error('Error updating password', options);
    }
  }

  async function updateProfile() {
    // validation
    if (!newDisplayName || !newPhoneNumber || !newUsername || !image)
      return toast.warning('Please input all field correctly', options);
    if (!validator.isLength(newDisplayName, { min: 6, max: 30 }))
      return toast.warning(
        'Please input the display name field min 6 chars, max 30 chars',
        options,
      );
    if (!validator.isLength(newUsername, { min: 6, max: 30 }))
      return toast.warning(
        'Please input the username field min 6 chars, max 30 chars',
        options,
      );

    try {
      // user image ref
      const imageRef = storage.ref(`users/${user?.uid}/${image.name}`);

      // upload image to storage
      imageRef.put(image).on(
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
            .ref(`users/${user?.uid}`)
            .child(image.name)
            .getDownloadURL()
            .then((photoURL) => {
              // update in user firestore
              db.collection('users')
                .doc(user?.uid)
                .update({
                  displayName: newDisplayName || '',
                  phoneNumber: newPhoneNumber || '',
                  username: newUsername || '',
                  photoURL: photoURL || '',
                });
            })
            .then(() => {
              // set state back to normal
              setNewDisplayName('');
              setNewUsername('');
              setNewPhoneNumber('');
              setImage(null);

              toast.success('Profile updated', options);
            })
            .catch((err) => console.error(err.message));
        },
      );
    } catch (err) {
      console.error(err.message);
      toast.error('Error updating profile', options);
    }
  }

  if (!cookies.user) return <Redirect to="/login" />; // back to login if there is no user cookie
  console.log(user);
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
        <div className="w-full min-h-screen">
          {/* profile */}
          <div className="p-3 flex flex-col items-center">
            <img
              className="w-20 rounded-full focus:outline-none focus:shadow-outline"
              src={user?.photoURL || noImg}
              alt=""
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

          {/* Edit email and password */}
          <div className="p-3 flex flex-col border-t border-gray-200 space-y-3">
            {/* verify email */}
            <div className="w-full flex justify-between">
              <p className="p-3 mr-5 italic text-sm">
                {user?.emailVerified
                  ? 'Your email is verified'
                  : 'Your email is not verified'}
              </p>
              <button
                className="rounded-full bg-blue-400 text-white py-3 px-5 cursor-pointer hover:bg-blue-500 w-48"
                onClick={verifyEmail}
              >
                Verify Email
              </button>
            </div>

            {/* email */}
            <div className="w-full flex justify-between">
              <input
                className="outline-none focus:shadow-outline focus:bg-blue-100 p-3 mr-5"
                type="email"
                placeholder={user?.email}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button
                className="rounded-full bg-blue-400 text-white py-3 px-5 cursor-pointer hover:bg-blue-500 w-48"
                onClick={updateEmail}
              >
                Update Email
              </button>
            </div>

            {/* password */}
            <div className="w-full flex justify-between">
              <input
                className="outline-none focus:shadow-outline focus:bg-blue-100 p-3 mr-5"
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className="rounded-full bg-blue-400 text-white py-3 px-5 cursor-pointer hover:bg-blue-500 w-48"
                onClick={updatePassword}
              >
                Update Password
              </button>
            </div>
          </div>

          {/* edit */}
          <div className="p-3 flex flex-col border-t border-gray-200 space-y-3">
            <p className="text-lg font-bold self-center text-blue-500 italic">
              Edit Profile
            </p>

            <input
              className="outline-none focus:shadow-outline focus:bg-blue-100 p-3"
              type="text"
              placeholder={user?.displayName}
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
            />
            <input
              className="outline-none focus:shadow-outline focus:bg-blue-100 p-3"
              type="text"
              placeholder={user?.username}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />

            <PhoneInput
              containerClass="pl-3"
              country={'id'}
              onChange={(phone) => setNewPhoneNumber(phone)}
            />

            <input
              className="p-3"
              type="file"
              accept="image/*"
              onChange={imageChange}
            />

            <button
              className="rounded-full bg-blue-400 text-white mx-auto py-4 px-10 w-48 cursor-pointer hover:bg-blue-500"
              onClick={updateProfile}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>

      <Widget />
    </>
  );
};

export default Profile;
