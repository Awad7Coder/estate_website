import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaBed, FaSquareFull } from "react-icons/fa";
import { arrContinent, idxToContinent } from "../../util/idxToContinent";
import { request } from "../../util/fetchAPI";
import classes from "./properties.module.css";
import person from "../../assets/person.jpg";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    continent: "",
    priceRange: "",
  });
  const [loading, setLoading] = useState(false);
  const query = useLocation().search;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        let url = "/property/getAll";

        if (query) {
          url = `/property/find${query}`;
        }

        console.log("Fetching from:", url);
        const data = await request(url, "GET");
        setProperties(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [query]);

  useEffect(() => {
    const urlParams = new URLSearchParams(query);
    const newFilters = {
      type: urlParams.get("type") || "",
      continent: urlParams.get("continent") || "",
      priceRange: urlParams.get("priceRange") || "",
    };

    if (newFilters.continent) {
      const continentIndex = arrContinent.indexOf(newFilters.continent);
      if (continentIndex !== -1) {
        newFilters.continent = continentIndex.toString();
      }
    }

    console.log("Updated filters from URL:", newFilters);
    setFilters(newFilters);
  }, [query]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    if (!filters.type || !filters.continent || !filters.priceRange) {
      alert("Please select all filter options");
      return;
    }

    const continentName = idxToContinent(filters.continent);

    console.log("DEBUG Continent Conversion:");
    console.log("Continent Index:", filters.continent);
    console.log("Converted Continent Name:", continentName);

    const queryParams = new URLSearchParams({
      type: filters.type,
      continent: continentName,
      priceRange: filters.priceRange,
    });

    const queryString = queryParams.toString();
    console.log(
      "Final URL with proper continent:",
      `/properties?${queryString}`
    );
    navigate(`/properties?${queryString}`);
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.options}>
          <select
            value={filters.type}
            name="type"
            onChange={handleFilterChange}
          >
            <option value="">Select type</option>
            <option value="beach">Beach</option>
            <option value="mountain">Mountain</option>
            <option value="village">Village</option>
          </select>

          <select
            value={filters.priceRange}
            name="priceRange"
            onChange={handleFilterChange}
          >
            <option value="">Select Price Range</option>
            <option value="0">0-100,000</option>
            <option value="1">100,000-200,000</option>
            <option value="2">200,000-300,000</option>
            <option value="3">300,000-400,000</option>
            <option value="4">400,000-500,000</option>
          </select>

          <select
            value={filters.continent}
            name="continent"
            onChange={handleFilterChange}
          >
            <option value="">Select Continent</option>
            <option value="0">Europe</option>
            <option value="1">Asia</option>
            <option value="2">Africa</option>
            <option value="3">South America</option>
            <option value="4">North America</option>
            <option value="5">Oceania</option>
          </select>

          <button
            className={classes.searchBtn}
            onClick={handleSearch}
            type="button"
          >
            <AiOutlineSearch className={classes.searchIcon} />
            Search
          </button>
        </div>

        {properties.length > 0 ? (
          <>
            <div className={classes.titles}>
              <h5>Selected properties</h5>
              <h2>Property you may like</h2>
              <p>Showing {properties.length} properties</p>
            </div>
            <div className={classes.properties}>
              {properties.map((property) => (
                <div key={property._id} className={classes.property}>
                  <Link
                    className={classes.imgContainer}
                    to={`/propertyDetail/${property._id}`}
                  >
                    <img
                      src={`http://localhost:5000/images/${property?.img}`}
                      alt={property.title}
                    />
                  </Link>
                  <div className={classes.details}>
                    <div className={classes.priceAndOwner}>
                      <span className={classes.price}>
                        ${property.price.toLocaleString()}
                      </span>
                      <img src={person} className={classes.owner} alt="Owner" />
                    </div>
                    <div className={classes.moreDetails}>
                      <span>{property.beds}</span>
                      <FaBed className={classes.icon} />
                      <span>{property.sqmeters} sq. meters</span>
                      <FaSquareFull className={classes.icon} />
                    </div>
                    <div className={classes.desc}>{property.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={classes.noProperty}>
            <h2>No properties found with the specified filters</h2>
            <p>Try adjusting your search criteria or</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
