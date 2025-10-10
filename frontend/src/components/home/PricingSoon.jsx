import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PricingSoon = () => {
    const { t } = useTranslation();
  return (
    <div className='flex flex-col gap-4 justify-center items-center max-w-7xl p-4'>
        <p className='bg-primary/10 px-3 py-2 text-sm font-semibold text-primary rounded-full'>{t("home.pricingSoon.soon")}</p>
      <h3 className='text-5xl font-bold mb-4'>{t("home.pricingSoon.h")}</h3>
        <p className='text-gray-500 max-w-5xl text-center mb-6'>
            {t("home.pricingSoon.p")}
        </p>
        <p className='font-semibold text-primary mb-2'>{t("home.pricingSoon.b")}</p>
        <Link to='/signup' className='btn btn-primary'>
			{t("navbar.SignUp")}
		</Link>
    </div>
  )
}

export default PricingSoon
