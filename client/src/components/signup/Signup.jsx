import React from "react";
import { useState } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classes from "./signup.module.css";
import { register } from "../../redux/authSlice";
import { request } from "../../util/fetchAPI";

const Signup = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState(false);
  const [emptyFields, setEmptyFields] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    const requiredFields = ["username", "email", "password"];
    if (requiredFields.some((field) => !state[field]) || !photo) {
      setEmptyFields(true);
      setTimeout(() => {
        setEmptyFields(false);
      }, 2500);
      return;
    }

    try {
      let filename = null;
      if (photo) {
        const formData = new FormData();
        // Remove the filename append - just send the image
        formData.append("image", photo);

        const uploadResponse = await fetch(
          `http://localhost:5000/upload/image`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const uploadData = await uploadResponse.json();
        filename = uploadData.filename; // Get filename from response
      }

      const headers = {
        "Content-Type": "application/json",
      };

      // Use the correct field name that matches your User model
      const data = await request(`/auth/register`, "POST", headers, {
        ...state,
        imageProfile: filename, // Changed from profileImg to imageProfile
      });

      dispatch(register(data));
      navigate("/");
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username..."
            onChange={handleState}
          />
          <input
            type="text"
            name="email"
            placeholder="Email..."
            onChange={handleState}
          />
          <label htmlFor="photo">
            Upload photo <AiOutlineFileImage />
          </label>
          <input
            style={{ display: "none" }}
            id="photo"
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <input
            type="password"
            name="password"
            placeholder="Password..."
            onChange={handleState}
          />
          <button type="submit">Register</button>
          <p>
            Already have an account? <Link to="/signin">Login</Link>
          </p>
        </form>
        {error && (
          <div className={classes.error}>
            There was an error signing up! Try again.
          </div>
        )}
        {emptyFields && <div className={classes.error}>Fill all fields!</div>}
      </div>
    </div>
  );
};

export default Signup;
