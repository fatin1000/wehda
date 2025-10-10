import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Test = () => {
    const { t } = useTranslation();
  return (
    <div className='flex flex-col gap-4 justify-center items-center max-w-7xl p-4 text-center'>
      <h3 className='text-5xl font-bold mb-4'>{t("home.test.h")}</h3>
        <p className='text-gray-500 max-w-5xl text-center mb-6'>
            {t("home.test.p")}
        </p>
        <p className='bg-primary/10 px-3 py-2 text-sm font-semibold text-primary rounded-full'>{t("home.test.note")}</p>
      
    </div>
  )
}

export default Test
