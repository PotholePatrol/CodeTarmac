// LoginPage.jsx
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaCar, FaRoad, FaTrafficLight, FaMapMarkedAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './apiService';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    let valid = true;
    const errors = { email: '', password: '' };

    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errors.email = 'Invalid email address';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-600 bg-opacity-70 text-white flex items-center justify-center py-[70px] p-4 font-sans relative overflow-hidden">
      {/* Animated floating road elements */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute top-[20%] left-[5%] opacity-10 text-amber-500">
          <FaRoad className="text-3xl animate-float-1" />
        </div>
        <div className="absolute top-[60%] left-[80%] opacity-10 text-amber-500">
          <FaCar className="text-3xl animate-float-2" />
        </div>
        <div className="absolute top-[30%] left-[85%] opacity-10 text-amber-500">
          <FaTrafficLight className="text-3xl animate-float-3" />
        </div>
        <div className="absolute top-[80%] left-[10%] opacity-10 text-amber-500">
          <FaMapMarkedAlt className="text-3xl animate-float-4" />
        </div>
      </div>

      {/* Pothole animation in the background */}
      <div className="absolute w-48 h-48 bottom-[-50px] right-[-50px] opacity-5">
        <div className="absolute w-36 h-36 rounded-full bg-gray-800 animate-pothole-pulse"></div>
        <div className="absolute w-32 h-32 rounded-full bg-amber-500 top-1 left-1 animate-pothole-fill"></div>
      </div>

      {/* Particle background */}
      <div className="absolute w-full h-full pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-amber-500 bg-opacity-50 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-6xl bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl">
        {/* Login Form */}
        <div className="w-full p-8 bg-gradient-to-br from-black to-gray-900 md:w-1/2 md:p-12">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-amber-500 mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to access your dashboard</p>
          </div>

          {error && (
            <Message 
              severity="error" 
              text={error}
              className="w-full mb-4 animate-fade-in"
            />
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1 animate-slide-up delay-100">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <InputText
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={classNames('w-full', { 'p-invalid': formErrors.email })}
                  placeholder="your@email.com"
                  required
                />
                {formErrors.email && (
                  <small className="p-error animate-fade-in">{formErrors.email}</small>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 animate-slide-up delay-200">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={classNames('w-full', { 'p-invalid': formErrors.password })}
                  placeholder="••••••••"
                  toggleMask
                  feedback={false}
                  required
                />
                {formErrors.password && (
                  <small className="p-error animate-fade-in">{formErrors.password}</small>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center animate-fade-in delay-300">
              <div className="flex items-center gap-2">
                <Checkbox
                  inputId="remember-me"
                  name="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.checked)}
                  className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-700 rounded focus:ring-amber-500"
                />
                <label htmlFor="remember-me" className="text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div>
                <a href="/forgot-password" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-3 bg-amber-500 text-black font-bold rounded-lg transition-all relative overflow-hidden ${isLoading ? 'cursor-not-allowed' : 'hover:bg-amber-400 hover:-translate-y-0.5'} animate-slide-up delay-400`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-black border-opacity-20 rounded-full border-t-black animate-spin"></span>
              ) : (
                <span className="relative inline-block">
                  Sign In
                  <span className="absolute right-[-20px] opacity-0 transition-all duration-300 group-hover:right-[-25px] group-hover:opacity-100">→</span>
                </span>
              )}
            </button>

            <div className="relative my-6 animate-fade-in delay-500">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700"></div>
              <div className="relative inline-flex justify-center px-2 bg-gray-900 text-sm text-gray-400">
                <span>Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white font-medium border border-gray-700 rounded-lg transition-all hover:bg-gray-700 hover:-translate-y-0.5 animate-slide-up delay-600"
            >
              <FcGoogle className="text-xl" />
              Sign in with Google
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400 animate-fade-in delay-700">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-amber-500 hover:text-amber-400 transition-colors">
              Sign up
            </a>
          </div>
        </div>

        {/* Project Description */}
        <div className="w-full p-8 bg-gradient-to-br from-amber-800 to-amber-900 text-gray-900 flex flex-col justify-center md:w-1/2 md:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-extrabold mb-4 animate-fade-in">Pothole Spotter</h1>
            <h2 className="text-2xl font-semibold mb-6 animate-fade-in delay-100">
              Smart Road Pothole Monitoring System
            </h2>

            <p className="mb-6 animate-fade-in delay-200">
              Welcome! Log in to explore real-time road infrastructure and 
              pothole monitoring—empowering cities to ensure safer streets and
              optimize maintenance costs.
            </p>

            <ul className="flex flex-col gap-3 mb-8 animate-fade-in delay-300">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5 transition-transform hover:scale-125 hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Real-time pothole detection</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5 transition-transform hover:scale-125 hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Automated reporting to city officials</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5 transition-transform hover:scale-125 hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Data analytics dashboard</span>
              </li>
            </ul>

            <div className="bg-black bg-opacity-10 p-4 rounded-lg animate-fade-in delay-400">
              <p className="text-sm italic mb-2">
                "This system has reduced our response time to road hazards by 75% and improved citizen satisfaction scores significantly."
              </p>
              <p className="text-sm font-medium">&copy; Pothole Spotter 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;