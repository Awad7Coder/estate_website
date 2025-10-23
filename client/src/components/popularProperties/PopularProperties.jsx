import React, { useState, useEffect } from "react";
import classes from "./popularProperties.module.css";
import Properties from "./../properties/Properties";
import { Link } from "react-router-dom";
import { request } from "../../util/fetchAPI";
import img1 from "../../assets/realestatebeach.jpg";
import img2 from "../../assets/realestatemountain.jpg";
import img3 from "../../assets/realestatecountryside.jpg";

const PopularProperties = () => {
  const [numProperties, setNumProperties] = useState({});

  useEffect(() => {
    const fechNumberProperties = async () => {
      try {
        const data = await request("/property/find/types", "GET");
        setNumProperties(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fechNumberProperties();
  }, []);
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.titles}>
          <h5>Different types of properties</h5>
          <h2>Best type of properties</h2>
        </div>
        <div className={classes.properties}>
          <Link
            className={classes.property}
            to={`/properties?type=beach&continent=1&priceRange=2`}
          >
            <img src={img1} />
            <div className={classes.quantity}>
              {numProperties?.beach} properties
            </div>
            <h5>Beach properties</h5>
          </Link>
          <Link
            className={classes.property}
            to={`/properties?type=mountain&continent=1&priceRange=2`}
          >
            <img src={img2} />
            <div className={classes.quantity}>
              {numProperties?.mountain} properties
            </div>
            <h5>Mountain properties</h5>
          </Link>
          <Link
            className={classes.property}
            to={`/properties?type=village&continent=1&priceRange=2`}
          >
            <img src={img3} />
            <div className={classes.quantity}>
              {numProperties?.village} properties
            </div>
            <h5>village properties</h5>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularProperties;
