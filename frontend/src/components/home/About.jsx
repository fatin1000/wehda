import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import photo from '../../assets/4.jpg'
import { useTranslation } from 'react-i18next';

const getFeatures = (t) => [
  {
    name: t('home.about.pushToDeploy'),
    description: t('home.about.pushToDeployDesc'),
    icon: CloudArrowUpIcon,
  },
  {
    name: t('home.about.sslCertificates'),
    description: t('home.about.sslCertificatesDesc'),
    icon: LockClosedIcon,
  },
  {
    name: t('home.about.databaseBackups'),
    description: t('home.about.databaseBackupsDesc'),
    icon: ServerIcon,
  },
]

export default function About() {
  const { t } = useTranslation();
  const features = getFeatures(t);

  return (
    <div className="overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-primary">{t("home.about.deployFaster")}</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                {t("home.about.betterWorkflow")}
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                {t("home.about.aboutDescription")}
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-primary" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src={photo}
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
}
