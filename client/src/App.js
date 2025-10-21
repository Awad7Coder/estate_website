import './App.css';
import { Routes, Route } from 'react-router-dom';
import Featuredproperties from './components/featuredproperties/Featuredproperties';
import Navbar from './components/navbar/Navbar';
import Hero from './components/hero/Hero';
import Newsletter from './components/newsletter/Newsletter';
import Signup from './components/signup/Signup';
import Signin from './components/signin/Signin';
import Properties from './components/properties/Properties';
import PropertyDetail from './components/propertyDetail/PropertyDetail';
import PopularProperties from './components/popularProperties/PopularProperties';
import Footer from './components/footer/Footer';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={
          <>
            <Navbar/>
            <Hero/>
            <PopularProperties/>
            <Featuredproperties/>
            <Newsletter/>
            <Footer/>
          </>
        } />
        
        <Route path='/properties' element={
          <>
            <Navbar/>
            <Properties/>
            <Footer/>
          </>
        } />
        
        <Route path='/propertyDetail/:id' element={
          <>
            <Navbar/>
            <PropertyDetail/>
            <Footer/>
          </>
        } />
        
        <Route path='/signup' element={<Signup/>} />
        <Route path='/signin' element={<Signin/>} />
      </Routes>
    </div>
  );
}

export default App;
