import React, { useState } from 'react'
import { motion, useScroll } from 'framer-motion';
import Api from "../Api"
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie';
const Login = () => {
    const navigate = useNavigate()
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await Api.post('/chatlogin/login/', {
          email: email,
          password: password,
        });
        console.log(response);
        if (response.status === 200){
          Cookies.set('access_token', response.data.access_token);
          navigate("/chats")
        }
      } catch (error) {
        console.error('Login failed:', error.response.data);
      }
    };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded shadow-md w-96"
    >
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
            email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="john@email.com"
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
            password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>


                        <div className="flex justify-between">
          
                      
                                    <button
                                      type="submit"     
                                      className="bg-blue-500 px-3 py-2 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                                    >
                                    <p>Login</p>
                                    </button>
                        
                        </div>
      </form>
    </motion.div>
  </div>
  )
}

export default Login