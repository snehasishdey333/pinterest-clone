import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router";
import { apiClient } from "../utils/apiClient";

// ✅ Signup Schema
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(5, "Username must be at least 5 characters and unique"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// ✅ Login Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// ✅ Types
type SignupFormData = z.infer<typeof signupSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate=useNavigate()
  const {setCurrentUser}=useAuthStore()

  // ✅ Separate form for Signup
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
    reset: resetSignup,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // ✅ Separate form for Login
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Reset form when switching between Login/Signup
  useEffect(() => {
    if (isSignup) {
      resetSignup();
    } else {
      resetLogin();
    }
  }, [isSignup, resetSignup, resetLogin]);

  // ✅ Handle Signup Submit
  const onSubmitSignup = async(data: SignupFormData) => {
    try{
      const res=await apiClient.post("/api/auth/register",data)
      setCurrentUser(res.data)
      navigate("/")
    }
    catch(error){
      console.log(error)
    }
  };

  // ✅ Handle Login Submit
  const onSubmitLogin = async(data: LoginFormData) => {
    try{
      const res=await apiClient.post("/api/auth/login",data)
      setCurrentUser(res.data)
      navigate("/")
    }
    catch(error){
      console.log(error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <img src="/assets/asset 154.svg" alt="Pinterest" className="w-40 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isSignup ? "Sign Up for Pinterest" : "Welcome back to Pinterest"}
        </h2>

        {isSignup ? (
          // ✅ Signup Form
          <form
            key="signup"
            onSubmit={handleSubmitSignup(onSubmitSignup)}
            className="flex flex-col space-y-4"
          >
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...registerSignup("name")}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              {errorsSignup.name && (
                <p className="text-red-500 text-sm">{errorsSignup.name.message}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                {...registerSignup("username")}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              {errorsSignup.username && (
                <p className="text-red-500 text-sm">{errorsSignup.username.message}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                {...registerSignup("email")}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              {errorsSignup.email && (
                <p className="text-red-500 text-sm">{errorsSignup.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                {...registerSignup("password")}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              {errorsSignup.password && (
                <p className="text-red-500 text-sm">{errorsSignup.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-red-500 text-white w-full cursor-pointer p-2 rounded-lg mt-4"
            >
              Sign Up
            </button>
          </form>
        ) : (
          // ✅ Login Form
          <form
            key="login"
            onSubmit={handleSubmitLogin(onSubmitLogin)}
            className="flex flex-col space-y-4"
          >
            <div>
              <input
                type="email"
                placeholder="Email"
                {...registerLogin("email")}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              {errorsLogin.email && (
                <p className="text-red-500 text-sm">{errorsLogin.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                {...registerLogin("password")}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              {errorsLogin.password && (
                <p className="text-red-500 text-sm">{errorsLogin.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-red-500 cursor-pointer text-white w-full p-2 rounded-lg mt-4"
            >
              Log In
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-red-500 cursor-pointer ml-1"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
