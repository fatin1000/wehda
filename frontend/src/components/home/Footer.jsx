
import { AtSign, Facebook, Headset, Instagram, MapPin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useQuery } from "@tanstack/react-query";

const Footer = () => {
  const { t } = useTranslation();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })

  return (
    <div className="bg-gray-900 text-white px-10 py-10 relative">
      <div className="mb-8" >
        <Link to={"/"} className=' flex gap-2 mb-5'>
          <img className='h-10 rounded' src='/logo.jpg' alt='ًwehda' />
          <span className='text-3xl '>{t("wehda")}</span>
        </Link>
        {/* <div className="flex gap-2 "><Facebook /><Twitter /><Youtube /><Instagram /></div> */}

      </div>
      <div className="flex flex-col sm:flex-row justify-between  gap-2">
        <div>
          <p className="flex items-center gap-2  text-gray-500 mb-3"><AtSign size={20} /> team@wehda.io</p>
          <p className="flex items-center gap-2  text-gray-500 mb-3">{t("home.footer.copyright")}</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{t("home.footer.company")}</h4>
          <ul className="text-gray-500 flex flex-col">
            <li>
              <a href="#">{t("home.footer.home")}</a>
            </li>
            <Link to="/depot">
              {t("home.footer.about")}
              </Link>
            <Link to={ authUser ? `/profile/${authUser._id}` : "/login"}>
            {t("home.footer.services")}
            </Link>
            <a href="#contact">{t("home.footer.contact")}</a>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{t("home.footer.support")}</h4>
          <ul className="text-gray-500">
            <li>{t("home.footer.submitTicket")}</li>
            <a href="mailto:team@wehda.io">{t("home.footer.guides")}</a>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{t("home.footer.legal")}</h4>
          <ul className="text-gray-500">
            <li>{t("home.footer.termsOfService")}</li>
            <li>{t("home.footer.privacyPolicy")}</li>
            <li>{t("home.footer.license")}</li>
          </ul>
        </div>


      </div>
    </div>
  )
}

export default Footer
