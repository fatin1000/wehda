import { Link } from "react-router-dom"
import LoginForm from "../../components/auth/LoginForm"
import { useTranslation } from 'react-i18next';
export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Wehda"
            src="/logo.jpg"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {t("auth.login")}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm />

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {t("auth.noAccount") }{' '}
            <Link to={'/signup'} className="font-semibold text-primary ">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
