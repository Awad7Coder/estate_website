import React from "react";
import classes from "./signup.module.css";
import { AiOutlineFileImage } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { request } from "../../util/fetchAPI";

const Signup = () => {
  const [state, setState] = useState({});
  const [photo, setPhoto] = useState("");
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let filename = null;
      if (photo) {
        const formData = new FormData();
        filename = crypto.randomUUID() + photo.name;
        formData.append("filename", filename);
        formData.append("image", photo);
        await request("/upload/image", "POST", {}, formData, true);
      } else {
        return;
      }

      const headers = {
        "Content-Type": "application/json",
      };
      const data = await request("/auth/image", "POST", headers, {
        ...state,
        profileImg: filename,
      });
      // dispatch();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username..."
            onChange={handleState}
          />
          <input
            type="email"
            name="email"
            placeholder="Email..."
            onChange={handleState}
          />
          <label htmlFor="photo">
            Upload photo <AiOutlineFileImage />
          </label>
          <input
            type="file"
            id="photo"
            style={{ display: "none" }}
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
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
