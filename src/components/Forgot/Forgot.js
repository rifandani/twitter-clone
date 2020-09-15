import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
// files
import './Forgot.css';
import { auth } from '../../config/firebase';

const Forgot = () => {
  const [email, setEmail] = useState('');

  const history = useHistory();

  async function resetPassword() {
    try {
      await auth.sendPasswordResetEmail(email);

      toast.warning('Check your email to reset your password ⚠️', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      history.push('/login');
    } catch (err) {
      console.error(err.message);
      toast.error(`Reset password error ⛔`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* logo */}
      <div className="p-5">
        <TwitterIcon className="forgot__twitterIcon hover:text-blue-500" />
      </div>

      {/* title */}
      <div className="pt-3 px-3 pb-1">
        <p className="font-bold text-center text-2xl">
          Reset your Twitter password
        </p>
      </div>

      {/* form */}
      <div className="w-1/2 p-3 flex flex-col space-y-3">
        <input
          className="p-3 rounded bg-gray-300 outline-none focus:shadow-outline focus:bg-blue-100"
          placeholder="Enter your email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* button */}
      <div className="w-1/2 p-3">
        <button
          className="w-full bg-blue-300 text-white rounded-full py-4 font-bold hover:bg-blue-500"
          onClick={resetPassword}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Forgot;
