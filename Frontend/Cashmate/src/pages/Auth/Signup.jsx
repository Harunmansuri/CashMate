import React from "react";
import { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //handle sign up form submit
  const handleSignup = async (e) => {
    e.preventDefault();
    // Basic validation
    let profilePicUrl = "";

    if (!fullName) {
      setError("Full name is required.");
      return;
    }
    validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());

    }
    if(!validateEmail(email)){

      setError("Please enter a valid email address.");
      return;
    }
   if(!password ){
    setError("Please enter a valid password.");
    return;
   }
    setError("");

    // Mock signup process


  };
  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-10 flex flex-col justify-center ">
        <h3 className="text-xl font-semibold text-black ">
          Create An Account{" "}
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <Input
              value={fullName}
              onChange={({ target}) => setFullName(target.value)}
              label="Full Name"
              placeholder="john"
              type="text"
            ></Input>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email Address"
              label="Email Address"
              type="text"
            ></Input>
            <div className="col-span-2 ">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Password"
                label="Password"
                type="password"
              ></Input>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                      type="submit"
                      className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition"
                    >
                      SignUp
                    </button>
                    <p>
                      Already have an account?{" "}
                      <Link to="/login" className="text-purple-600 hover:underline mx-2">
                        Login
                      </Link>
                    </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
