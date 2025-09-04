import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl">{t("home.faq.title")}</h2>
        <p className="mt-2 text-lg/8 text-gray-600">{t("home.faq.subtitle")}</p>
      </div>

      <div className="max-w-[90%] mx-auto sm:max-w-[70%] lg:max-w-[60%]">
        <div className="collapse collapse-plus bg-base-100 border border-base-300 mb-4">
          <input type="radio" name="my-accordion-3" defaultChecked />
          <div className="collapse-title font-semibold">{t("home.faq.howToCreateAccount")}</div>
          <div className="collapse-content text-sm">{t("home.faq.howToCreateAccountAnswer")}</div>
        </div>
        <div className="collapse collapse-plus bg-base-100 border border-base-300 mb-4">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title font-semibold">{t("home.faq.forgotPassword")}</div>
          <div className="collapse-content text-sm">{t("home.faq.forgotPasswordAnswer")}</div>
        </div>
        <div className="collapse collapse-plus bg-base-100 border border-base-300 mb-4">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title font-semibold">{t("home.faq.updateProfile")}</div>
          <div className="collapse-content text-sm">{t("home.faq.updateProfileAnswer")}</div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
