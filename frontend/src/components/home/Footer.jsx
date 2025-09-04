
import { AtSign, Facebook, Headset, Instagram, MapPin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-900 text-white px-10 py-10 relative">
      <div className="mb-8" >
        <Link to={"/"} className=' flex gap-2 mb-5'>
          <img className='h-10 rounded' src='/logo.jpg' alt='ًwehda' />
          <span className='text-3xl '>{t("wehda")}</span>
        </Link>
        <div className="flex gap-2 "><Facebook /><Twitter /><Youtube /><Instagram /></div>

      </div>
      <div className="flex flex-col sm:flex-row justify-between  gap-2">
        <div>
          <p className="flex items-center gap-2  text-gray-500 mb-3"><AtSign size={20} /> RZd7o@example.com</p>
          <p className="flex items-center gap-2  text-gray-500 mb-3">{t("home.footer.copyright")}</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{t("home.footer.company")}</h4>
          <ul className="text-gray-500">
            <li>{t("home.footer.home")}</li>
            <li>{t("home.footer.about")}</li>
            <li>{t("home.footer.services")}</li>
            <li>{t("home.footer.contact")}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{t("home.footer.support")}</h4>
          <ul className="text-gray-500">
            <li>{t("home.footer.submitTicket")}</li>
            <li>{t("home.footer.documentation")}</li>
            <li>{t("home.footer.guides")}</li>
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
