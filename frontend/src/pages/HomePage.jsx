import About from '../components/home/About'
import Contact from '../components/home/Contact'
import FAQ from '../components/home/FAQ'
import Footer from '../components/home/Footer'
import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import Testimon from '../components/home/Testimon'
import Trust from '../components/home/Trust'
import Pricing from '../components/home/Pricing'

const HomePage = () => {
  return (
    <div>
      <Hero/>
      <About/>
      <Stats/>
      <Testimon/>
      <Pricing/>
      <Trust/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </div>
  )
}

export default HomePage
