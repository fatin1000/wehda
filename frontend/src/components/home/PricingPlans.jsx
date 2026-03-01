import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PricingPlans = () => {
  const { t } = useTranslation();

  const plans = [
    { key: "contractor_basic" },
    { key: "supplier_light" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center mb-10">
        {t("home.pricing.title")}
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan, index) => {
          const base = `home.pricing.plans.${plan.key}`;

          const features = t(`${base}.features`, { returnObjects: true });

          return (
            <div
              key={index}
              className="border rounded-2xl p-8 shadow-sm hover:shadow-lg transition bg-white"
            >
              <p className="text-primary font-semibold bg-primary/10 inline-block px-3 py-1 rounded-full mb-4">
                {t(`${base}.subtitle`)}
              </p>

              <h3 className="text-3xl font-bold mb-2">
                {t(`${base}.title`)}
              </h3>

              <p className="text-2xl font-bold text-primary mb-4">
                {t(`${base}.price`)}
              </p>

              <p className="text-gray-600 mb-6">
                {t(`${base}.description`)}
              </p>

              <ul className="text-gray-700 space-y-2 mb-6">
                {Array.isArray(features) &&
                  features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary text-lg">✔</span>
                      {feature}
                    </li>
                  ))}
              </ul>

              <Link
                to="/signup"
                className="btn btn-primary w-full text-center py-3 rounded-xl font-semibold"
              >
                {t("home.pricing.subscribe")}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPlans;