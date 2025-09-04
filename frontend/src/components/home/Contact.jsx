import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { mutate: mailMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/admin/mail", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("home.contact.letsTalk"));
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response.data.message || t("common.somethingWentWrong"));
    },
  });
  const resetForm = () => {
    setName(""); setCompany(""); setEmail(""); setPhone(""); setMessage("");
  }
  const handleSendMsg = (e) => {
    e.preventDefault();
    mailMutation({ name, company, email, phone, message });
  };
  return (
    <div className="isolate bg-img px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl">{t("home.contact.title")}</h2>
        <p className="mt-2 text-lg/8 text-gray-600">{t("home.contact.description")}</p>
      </div>
      <form onSubmit={handleSendMsg} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm/6 font-semibold text-gray-900">
              {t("home.contact.yourName")}
            </label>
            <div className="mt-2.5">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-900">
              {t("home.contact.company")}
            </label>
            <div className="mt-2.5">
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
              {t("home.contact.email")}
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
              {t("home.contact.phoneNumber")}
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white border border-gray-300 ">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country"
                    aria-label="Country"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 "
                  >
                    <option selected >SA</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="123-456-7890"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
              {t("home.contact.message")}
            </label>
            <div className="mt-2.5">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

        </div>
        <div className="mt-10">
          <button
            type='submit' disabled={isPending}
            className="block w-full  rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs "
          >
            {isPending ? <Loader size={20} color='white' visible={isPending} className='mx-auto' /> : t("home.contact.letsTalk")}
          </button>
        </div>
      </form>
    </div>
  )
}
