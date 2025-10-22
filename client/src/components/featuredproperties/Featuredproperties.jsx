import React, { useEffect , useState } from 'react'
import classes from './featuredproperties.module.css'
import Properties from './../properties/Properties';
import Featuredproperties from './Featuredproperties';
import {request} from '../../util/fetchAPI';
import img from '../../assets/estate3.jpg'
import person from '../../assets/person.jpg'
import { Link } from 'react-router-dom';
import {FaBed,FaSquareFull} from 'react-icons/fa'


const Featuredproperties = () => {
  const[featuredproperties,setFeaturedproperties]=useState([])
 
  useEffect(() => {
    const fechFeatured = async () => {
      try{
        const data=await request('/property/find/featured',"GET")
        setFeaturedproperties(data)
      } catch(error) {
        console.error(error.message);
      }
    }
    fechFeatured();
  },[])
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.title}>
          <h5>Properties you may like</h5>
          <h2>Our Featured Properties</h2>
        </div>
        <div className={classes.featuredProperties}>
          {featuredproperties?.map((property) => (
            <div key={property._id} className={classes.featuredProperty}>
                <Link to={`/propertyDetail/${property._id}`} className={classes.imgContainer}>
                   <img src={img} alt="" />
                </Link>
                <div className={classes.details}>
                  <div className={classes.priceAndOwner}>
                    <span className={classes.price}>${property.price}</span>
                    <img src={person} className={classes.owner} />
                  </div>
                  <div className={classes.moreDetails}>
                    <span>{property?.bed} beds <FaBed className={classes.icon}/></span>
                    <span>{property?.sqmeters} square meters <FaSquareFull className={classes.icon}/></span>
                  </div>
                  <div className={classes.desc}>{property?.desc}</div>
                </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
} 
export default Featuredproperties