import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { Link, useHistory, Redirect } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import validator from 'validator';
// files
import './Register.css';
import { auth, db } from '../../config/firebase';
import { options } from '../../config/toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const [cookies, setCookies] = useCookies(['user']);

  async function register() {
    // validation
    if (!username || !email || !password)
      return toast.warning('Fill all the field', options);
    if (!validator.isLength(username, { min: 6, max: 30 }))
      return toast.warning(
        'Fill the username field min 6 chars, max 30 chars',
        options,
      );
    if (!validator.isEmail(email))
      return toast.warning('Fill the email field correctly', options);
    if (!validator.isLength(password, { min: 6, max: 30 }))
      return toast.warning(
        'Fill the passsword field min 6 chars, max 30 chars',
        options,
      );

    try {
      const newUser = await auth.createUserWithEmailAndPassword(
        email,
        password,
      );
      await newUser.user.updateProfile({ displayName: username });

      // set user object to the cookie
      setCookies('user', newUser.user, {
        maxAge: 3600,
        path: '/',
      });

      // add user in users collection
      const randomString = Math.floor(Math.random() * 100).toString();
      let arr = newUser.user.displayName.split(' ');
      arr.push(randomString);
      const newUsername = arr.join('').toLowerCase();

      await db.collection('users').doc(newUser.user.uid).set({
        uid: newUser.user.uid,
        displayName: newUser.user.displayName,
        email: newUser.user.email,
        createdAt: Date.now(),
        emailVerified: false,
        phoneNumber: '',
        photoURL: '',
        username: newUsername,
        likedPosts: [],
        retweetedPosts: [],
      });

      // await db.collection('users').add({
      //   uid: newUser.user.uid,
      //   displayName: newUser.user.displayName,
      // });

      toast.success('Registered ✔️', options);
      history.push('/home');
    } catch (err) {
      console.error(err.message);
      toast.error(`Register error ⛔`, options);
    }
  }

  // if there is still cookies, then redirect to home page
  if (cookies.user) return <Redirect to="/home" />;

  return (
    <div className="register min-h-screen w-full flex flex-col items-center">
      {/* logo */}
      <div className="p-5">
        <TwitterIcon className="register__twitterIcon hover:text-blue-500" />
      </div>

      {/* title */}
      <div className="pt-3 px-3 pb-1">
        <p className="font-bold text-center text-2xl">Sign up to Twitter</p>
      </div>

      {/* form */}
      <div className="w-1/2 p-3 flex flex-col space-y-3">
        <input
          className="p-3 rounded bg-gray-300 outline-none focus:shadow-outline focus:bg-blue-100"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="p-3 rounded bg-gray-300 outline-none focus:shadow-outline focus:bg-blue-100"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="p-3 rounded bg-gray-300 outline-none focus:shadow-outline focus:bg-blue-100"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* button */}
      <div className="w-1/2 p-3">
        <button
          className="w-full bg-blue-300 text-white rounded-full py-4 font-bold hover:bg-blue-500"
          onClick={register}
        >
          Sign up
        </button>
      </div>

      {/* login redirect */}
      <div className="w-1/2 p-3 flex justify-center">
        <Link to="/login">
          <p className=" text-blue-500 cursor-pointer hover:underline text-sm">
            Already have an account? Log in
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
