import React, { useState } from "react";
import classes from "./navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { BsHouseDoor } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose, AiOutlineFileImage } from "react-icons/ai";
import { logout } from "./../../redux/authSlice";
import { request } from "./../../util/fetchAPI";

const Navbar = () => {
  const [state, setState] = useState("");
  const [photo, setPhoto] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setPhoto(null);
    setState({});
  };

  const handleListProperty = async (e) => {
    e.preventDefault();

    let filename = null;
    if (photo) {
      const formData = new FormData();
      filename = crypto.randomUUID() + photo.name;
      formData.append("filename", filename);
      formData.append("image", photo);

      await request("/upload/image", "POST", {}, formData, true);
    } else return;

    try {
      const options = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await request("/property", "POST", options, { ...state, img: filename });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Link to="/" className={classes.left}>
          RealEstate <BsHouseDoor />
        </Link>

        <ul className={classes.center}>
          <li className={classes.listItem}>Home</li>
          <li className={classes.listItem}>About</li>
          <li className={classes.listItem}>Featured</li>
          <li className={classes.listItem}>Contacts</li>
        </ul>

        <div className={classes.right}>
          {!user ? (
            <>
              <Link to="/signup">Sign up</Link>
              <Link to="/signin">Sign in</Link>
            </>
          ) : (
            <>
              <span>Hello {user.username}</span>
              <span className={classes.logoutBtn} onClick={handleLogout}>
                Logout
              </span>
              <Link onClick={() => setShowForm(true)} className={classes.list}>
                List your property
              </Link>
            </>
          )}
        </div>
      </div>
      {showForm && (
        <div onClick={handleCloseForm} className={classes.listPropertyForm}>
          <div
            className={classes.listPropertyWrapper}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>List Property</h2>
            <form onSubmit={handleListProperty}>
              <input
                type="text"
                placeholder="Title..."
                name="title"
                onChange={handleState}
              />
              <input
                type="text"
                placeholder="Type..."
                name="type"
                onChange={handleState}
              />
              <input
                type="text"
                placeholder="Desc..."
                name="desc"
                onChange={handleState}
              />
              <input
                type="text"
                placeholder="Continent..."
                name="continent"
                onChange={handleState}
              />

              <input
                type="number"
                placeholder="Price..."
                name="price"
                onChange={handleState}
              />
              <input
                type="number"
                placeholder="Sq, meters..."
                name="sqmeters"
                onChange={handleState}
              />
              <input
                type="number"
                placeholder="Beds..."
                name="beds"
                step={1}
                min={2}
                onChange={handleState}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "50%",
                }}
              >
                <label htmlFor="photo">
                  Property picture <AiOutlineFileImage />
                </label>
                <input
                  type="file"
                  id="photo"
                  style={{ display: "none" }}
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
                {photo && <p>{photo.name}</p>}
              </div>
              <button>List Property</button>
            </form>
            <AiOutlineClose
              onClick={handleCloseForm}
              className={classes.removeIcon}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
