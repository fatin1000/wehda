import About from '../components/home/About'
import Contact from '../components/home/Contact'
import FAQ from '../components/home/FAQ'
import Footer from '../components/home/Footer'
import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import Testimon from '../components/home/Testimon'
import Trust from '../components/home/Trust'
import Pricing from '../components/home/Pricing'
import WhyWehda from '../components/home/WhyWehda'
import HowItWork from '../components/home/HowItWork'
import Serve from '../components/home/Serve'
import Featuers from '../components/home/Featuers'
import Ai from '../components/home/Ai'
import PricingSoon from '../components/home/PricingSoon'
import Test from '../components/home/Test'

const HomePage = () => {
  return (
    <div>
      <Hero/>
      <About/>
      {/* <Stats/> */}
      {/* <Testimon/> */}
      {/* <Pricing/> */}
      {/* <Trust/> */}
      <WhyWehda/>
      <HowItWork/>
      <Serve/>
      <Featuers/>
      <Ai/>
      <PricingSoon />
      <FAQ/>
      <Test />
      <Contact/>
      <Footer/>
    </div>
  )
}

export default HomePage
