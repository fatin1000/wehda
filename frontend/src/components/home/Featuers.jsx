import {CheckBadgeIcon } from '@heroicons/react/20/solid'
import photo from '../../assets/6.jpg'
import { useTranslation } from 'react-i18next';

const getFeatures = (t) => [
  {
    name: t('home.feat.1'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.feat.2'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.feat.3'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.feat.4'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.feat.5'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.feat.6'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.feat.7'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.feat.8'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.feat.9'),
    icon: CheckBadgeIcon,
  }
]

export default function Featuers() {
  const { t } = useTranslation();
  const features = getFeatures(t);

  return (
    <div className="overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-primary">{t("home.about.deployFaster")}</h2>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl leading-3">
                {t("home.feat.wehdaFeat")}
              </h3>
              
              <div className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className=" flex gap-2">
                    <span >
                      <feature.icon aria-hidden="true" className=" size-5 text-primary" />
                      
                    </span>
                    <p className="font-semibold text-gray-900">
                    {feature.name}
                      </p>           
                          </div>
                ))}
              </div>
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