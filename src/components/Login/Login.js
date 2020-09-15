import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { Link, useHistory, Redirect } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import validator from 'validator';
// files
import './Login.css';
import { auth } from '../../config/firebase';
import { options } from '../../config/toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const [cookies, setCookie] = useCookies(['user']);

  async function login() {
    // validation
    if (!email || !password)
      return toast.warning('Fill all the field', options);
    if (!validator.isEmail(email))
      return toast.warning('Fill the email field correctly', options);
    if (!validator.isLength(password, { min: 6, max: 30 }))
      return toast.warning(
        'Fill the passsword field min 6 chars, max 30 chars',
        options,
      );

    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);

      // set user object to the cookie
      setCookie('user', user, {
        maxAge: 3600,
        path: '/',
      });

      toast.success('Login success ✔️', options);
      history.push('/home');
    } catch (err) {
      console.error(err.message);
      toast.error(`Login error ⛔`, options);
    }
  }

  // if there is still cookies, then redirect to home page
  if (cookies.user) return <Redirect to="/home" />;

  return (
    <div className="login min-h-screen w-full flex flex-col items-center">
      {/* logo */}
      <div className="p-5">
        <TwitterIcon className="login__twitterIcon hover:text-blue-500" />
      </div>

      {/* title */}
      <div className="pt-3 px-3 pb-1">
        <p className="font-bold text-center text-2xl">Log in to Twitter</p>
      </div>

      {/* form */}
      <div className="w-1/2 p-3 flex flex-col space-y-3">
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
          onClick={login}
        >
          Log in
        </button>
      </div>

      {/* forgot password & register */}
      <div className="w-1/2 p-3 flex justify-evenly">
        <Link to="/forgot-password">
          <p className=" text-blue-500 cursor-pointer hover:underline text-sm">
            Forgot password?
          </p>
        </Link>
        <Link to="/register">
          <p className=" text-blue-500 cursor-pointer hover:underline text-sm">
            Sign up for twitter
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
