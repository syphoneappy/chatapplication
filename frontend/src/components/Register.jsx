import React, { useState } from 'react';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { motion, useScroll } from 'framer-motion';
import PhoneInput from 'react-phone-number-input'
import Api from '../Api';
import Lottie from "lottie-react";
import loadingAnimation from "./Lottie/loadingAnimation.json";
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const navigate = useNavigate()

    const [step ,setstep] = useState(0)
    const [fullname, setFull_name] = useState('')
    const [email, setemail] = useState('')
    const [phone, setPhone] = useState()
    const [gender, setgender] = useState('')
    const [country, setcountry] = useState('')
    const [interests, setInterests] = useState([]);
    const [password , setPassword] = useState('')
    const [username, setusername] = useState('')
    console.log(step);

    const renderButton = (role, label, color) => (
        <div className="flex flex-col items-center space-y-2">
        
          <input
            type="radio"
            id={`${role}Option`}
            name="userRole"
            value={role}
            checked={gender === role}
            onChange={() => setgender(role)}
            className="hidden"
          />
          <label
            htmlFor={`${role}Option`}
            className={`cursor-pointer px-6 py-3 border rounded-md transition-all w-32 h-12 ${
              gender === role
                ? `bg-${color}-500 text-white border-${color}-600`
                : `bg-white text-${color}-500 border-${color}-500 hover:bg-${color}-100`
            }`}
          >
            <div className='flex flex-col justify-center items-center h-6'>
              <strong className='text-sm'>{label}</strong>
            </div>
          </label>
         
        </div>
        
        );
        
  
        const handleInterestChange = (interest) => {
          const updatedInterests = [...interests];
      
          if (updatedInterests.includes(interest)) {
            // Remove interest if it's already selected
            updatedInterests.splice(updatedInterests.indexOf(interest), 1);
          } else {
            // Add interest if it's not selected
            updatedInterests.push(interest);
          }
      
          setInterests(updatedInterests);
        };
      
        const interestButton = (interest, label, color) => (
            <div key={interest} className="flex flex-col items-center space-y-2">
              <input
                type="checkbox"
                id={`${interest}Option`}
                value={interest}
                checked={interests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
                className="hidden"
              />
              <label
                htmlFor={`${interest}Option`}
                className={`cursor-pointer px-6 py-3 border rounded-md transition-all w-32 h-12 ${
                  interests.includes(interest)
                    ? `bg-${color}-500 text-white border-${color}-600`
                    : `bg-white text-${color}-500 border-${color}-500 hover:bg-${color}-100`
                }`}
              >
                <div className='flex flex-col justify-center items-center h-6'>
                  <strong className='text-sm'>{label}</strong>
                </div>
              </label>
            </div>
          );

          const genderMapping = {
            'male': 'M',
            'female': 'F',
            'other': 'O',
          };
  const handleSubmit = async (e) => {
      e.preventDefault()
      console.log(gender);
      const mappedGender = genderMapping[gender];
      const requestData = {
        password: password,
        email: email,
        username: username,
        full_name: fullname,
        gender: mappedGender,
        country: country,
        interests: interests.map((interest) => ({ name: interest })),
        phone: phone,
      };

      console.log(requestData);

      await Api.post("/chatlogin/create/", requestData).then((response) => {
        if (response.status === 201){
          navigate("/login")
        }

      }).catch((error) => {
        alert(error)
      })

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>

        {step ===0 && (
                <>
                          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="John Doe"
              onChange={(e) => setFull_name(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="user123"
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="john@example.com"
              onChange={(e) => setemail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
                </>
            )}
                {step === 1 && (
                <>
                          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
              Phone
            </label>
            <PhoneInput
            country="US"
            placeholder={`Enter phone number`}
            value={phone}
            onChange={setPhone}   
            className=''
            /> 
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Gender
            </label>
            {renderButton('male', 'Male', 'blue')}
            {renderButton('female', 'Female', 'purple')}
            {renderButton('other', 'Other', 'blue')}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Country
            </label>
            <CountryDropdown
          value={country}
          onChange={(val) => setcountry(val)}
          className="w-64"
          />
          </div>
                </>
            )}
            {step === 2 && (
                          <div className="mb-4">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Intrests
                          </label>
                          <div className='flex flex-col'>
              {interestButton('football', 'Football', 'blue')}
              {interestButton('cricket', 'Cricket', 'blue')}
              {interestButton('basketBall', 'Basket Ball', 'blue')}
              {interestButton('valleyBall', 'Valley Ball', 'blue')}
            </div>
                        </div>
            )}
            {step === 3 && (
              <div className='mb-4'>
                <Lottie animationData={loadingAnimation} loop={true} />
              </div>
            )}

                          <div className="flex justify-between">
            
                          {step > 0 && (
                                              <button
                                              type='button'
                                              onClick={() => setstep(step - 1)}
                                              className="bg-purple-500 px-3 py-2 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 flex justify-end"
                                            >
                                              previous
                                            </button>
                          )}
                        
                                      <button
                                        type={step === 3 ? "submit" : "button"}
                                        onClick={() => setstep(step + 1)}
                                        className="bg-blue-500 px-3 py-2 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                                      >
                                        {step >= 2 ? <p>submit</p> : <p>next</p>}
                                      </button>
                          
                          </div>
  

        </form>
      </motion.div>
    </div>
  );
};

export default Register;
