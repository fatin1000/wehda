
import { AtSign, Facebook, Headset, Instagram, MapPin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="bg-gray-900 text-white px-10 py-10 relative">
      <div className="mb-8" >
      <Link to={"/"} className=' flex gap-2 mb-5'>
								<img className='h-10 rounded' src='/logo.jpg' alt='ًwehda' />
									<span className='text-3xl '>Wehda</span>
			</Link>
      <div className="flex gap-2 "><Facebook /><Twitter /><Youtube /><Instagram /></div>
     
      </div>
      <div className="flex flex-col sm:flex-row justify-between  gap-2">
      <div>
            <p className="flex items-center gap-2  text-gray-500 mb-3"><AtSign size={20} /> RZd7o@example.com</p>
            <p className="flex items-center gap-2  text-gray-500 mb-3">Copyright © 2023 Wehda</p>
      </div>
      <div>
        <h4 className="mb-3 font-semibold">Company</h4>
        <ul className="text-gray-500">
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 font-semibold">Support</h4>
        <ul className="text-gray-500">
          <li>Submit ticket</li>
          <li>Documentation</li>
          <li>Guides</li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 font-semibold">Legal</h4>
        <ul className="text-gray-500">
          <li>Terms of service</li>
          <li>Privacy policy</li>
          <li>License</li>
        </ul>
      </div>

      
      </div>
    </div>
  )
}

export default Footer
