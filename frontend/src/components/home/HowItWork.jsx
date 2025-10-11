import { CheckBadgeIcon} from '@heroicons/react/20/solid'
import photo from '../../assets/how-it-work.png'
import { useTranslation } from 'react-i18next';

const getFeatures = (t) => [
  {
    name: t('home.how.1'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.how.2'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.how.3'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.how.4'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.how.5'),
    icon: CheckBadgeIcon,
  },
  {
    name: t('home.how.6'),
    icon: CheckBadgeIcon,
  }
]

export default function HowItWork() {
  const { t } = useTranslation();
  const features = getFeatures(t);

  return (
    <div className="overflow-hidden mt-4 bg-transparent px-8 py-6" id='how-it-works'>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto flex flex-col-reverse md:flex md:flex-row sm:flex-row sm:items-center max-w-2xl gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        

          <div className='w-full md:w-[50%]'>
            <div className="lg:max-w-lg">
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-[3rem] leading-normal">
                {t("home.how.howWehda")}
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
            className="w-full md:w-[50%]"
          />
        </div>
      </div>
    </div>
  )
}