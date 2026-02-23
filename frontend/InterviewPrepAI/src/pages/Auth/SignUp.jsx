import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import {
  validatePasswordClient,
  checkPasswordRequirements,
  getStrengthLabel,
} from '../../utils/passwordStrength';

import axios from 'axios';

const PasswordRequirementItem = ({ met, text }) => (
  <div className='flex items-center gap-2 text-xs py-1'>
    <span
      className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] font-bold ${
        met ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      {met ? '✓' : '○'}
    </span>
    <span className={met ? 'text-green-700' : 'text-gray-600'}>{text}</span>
  </div>
);

const PasswordStrengthIndicator = ({ strength, strengthLabel }) => {
  const widthPercentage = (strength / 5) * 100;

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-1'>
        <label className='text-xs font-semibold text-gray-700'>Password Strength</label>
        <span className={`text-xs font-bold text-${strengthLabel.color}-600`}>
          {strengthLabel.label}
        </span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
        <div
          className={`h-full ${strengthLabel.bgColor} transition-all duration-300`}
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword) {
      const validation = validatePasswordClient(newPassword);
      setPasswordFeedback(validation);
      setShowPasswordRequirements(true);
    } else {
      setShowPasswordRequirements(false);
      setPasswordFeedback(null);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    let profileImageUrl = '';

    if (!fullName) {
      setError('Please enter full name.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter the password');
      return;
    }

    // Validate password before submission
    const validation = validatePasswordClient(password);
    if (!validation.isValid) {
      setError('Password does not meet security requirements');
      return;
    }

    setError('');

    //Signup API call
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl: profilePic || '',
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again');
      }
    }
  };

  const requirements = password ? checkPasswordRequirements(password) : {};
  const strengthLabel = passwordFeedback
    ? getStrengthLabel(passwordFeedback.strength)
    : { label: 'No Password', color: 'gray', bgColor: 'bg-gray-200' };

  return (
    <div className='w-full max-w-md p-3 flex flex-col justify-center mx-auto'>
      <h3 className='text-lg font-semibold text-black'>Create an Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Join us today by entering your details below.
      </p>
      <form onSubmit={handleSignup}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label='Full Name'
            placeholder='Jhon'
            type='text'
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label='Email Address'
            placeholder='Raquel@gmail.com'
            type='text'
          />

          <div>
            <Input
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => password && setShowPasswordRequirements(true)}
              label='Password'
              placeholder='Min 8 characters'
              type='password'
            />

            {password && (
              <>
                <PasswordStrengthIndicator
                  strength={passwordFeedback?.strength || 0}
                  strengthLabel={strengthLabel}
                />

                {showPasswordRequirements && (
                  <div className='mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg'>
                    <p className='text-xs font-semibold text-gray-700 mb-2'>
                      Password Requirements:
                    </p>
                    <PasswordRequirementItem
                      met={requirements.minLength}
                      text='At least 8 characters'
                    />
                    <PasswordRequirementItem
                      met={requirements.uppercase}
                      text='One uppercase letter (A-Z)'
                    />
                    <PasswordRequirementItem
                      met={requirements.lowercase}
                      text='One lowercase letter (a-z)'
                    />
                    <PasswordRequirementItem
                      met={requirements.number}
                      text='One number (0-9)'
                    />
                    <PasswordRequirementItem
                      met={requirements.specialChar}
                      text='One special character (!@#$%)'
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary'>
          SIGN UP
        </button>
        <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account?{' '}
          <button
            className='font-medium text-primary underline cursor-pointer'
            onClick={() => {
              setCurrentPage('login');
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

