import { BicepsFlexed, Building2, Loader, Mail, Phone, X } from "lucide-react";

import Header from "../components/common/Header";
import Dashboardlayout from "../../layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../lib/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Network = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: network,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["network"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/network");
      return res.data;
    },
  });
  const { mutate: follow, isPending } = useMutation({
    mutationFn: (userId) => axiosInstance.post(`/users/follow/${userId}`),
    onSuccess: () => {
      toast.success(t("dashboard.network.followSuccess"));
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["network"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || t("dashboard.network.followError")
      );
    },
  });

  const baseClass =
    "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";

  return (
    <Dashboardlayout>
      <div className="flex-1 overflow-auto relative py-6 px-4 lg:px-8">
        <Header title={t("dashboard.network.title")} />
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center text-primary">
              <Loader size={40} className="animate-spin" />
            </div>
          ) : isError ? (
            <div>{t("dashboard.network.errorLoadingUsers")}</div>
          ) : isSuccess && network.following.length === 0 ? (
            <div className="flex flex-col items-center mt-10">
              <p className="text-center text-2xl text-gray-500 font-semibold">
                {t("dashboard.network.emptyFollowing")}
              </p>
              <Link
                to="/depot"
                className="bg-primary text-white py-3 px-9 rounded text-center mt-10 font-semibold hover:bg-orange-700"
              >
                {t("dashboard.network.makeOneNow")}
              </Link>
            </div>
          ) : (
            <div>
              <h3 className="text-gray-500 mb-4">
                {t("dashboard.network.usersYouFollow")}
              </h3>

              {network.following.map((user) => (
                <div
                  key={user._id}
                  className=" flex flex-col items-center gap-4 p-4 sm:py-5 sm:px-14 rounded-xl border mb-4 sm:flex-row justify-between bg-white shadow-lg"
                >
                  <div className="w-full">
                    <div className="flex flex-col mb-4 sm:flex-row sm:justify-between items-start">
                      <Link to={`/profile/${user._id}`} className="flex mb-4">
                        <img
                          src={
                            user.profilePic ? user.profilePic : "/avatar.png"
                          }
                          alt={user.username}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h2 className="text-lg font-semibold">
                            {user.username}
                          </h2>
                          <p className="text-gray-500">{user.headline}</p>
                        </div>
                      </Link>

                      <button
                        className={
                          isPending
                            ? `${baseClass} bg-gray-500 cursor-not-allowed`
                            : `${baseClass} bg-red-400 hover:bg-red-600`
                        }
                        onClick={() => {
                          follow(user._id);
                        }}
                      >
                        <X size={20} className="mr-2" />
                        {t("dashboard.network.unfollow")}
                      </button>
                    </div>
                    <p>
                      <Phone className="mr-2 text-orange-600 inline size-5" />{" "}
                      {user.phone}
                    </p>
                    <a href={`mailto:${user.email}`}>
                      <Mail className="mr-2 text-orange-600 inline size-5" />{" "}
                      <span className="underline">{user.email}</span>{" "}
                    </a>
                    <p>
                      <Building2 className="mr-2 text-orange-600 inline size-5" />{" "}
                      {user.company}
                    </p>
                    {user.services ? (
                      <p>
                        <BicepsFlexed className="mr-2 text-orange-600 inline size-5" />{" "}
                        Provide A Worker {user.labor}
                      </p>
                    ) : null}
                  </div>

                  {/* <div>
                                            <span className="font-semibold text-orange-500"><Hammer className="mr-2 text-orange-600 inline size-5" />services</span>  {user.fields.map((service) => (
                                                <p key={service.label}>{service.value}</p>
                                            ))}
                                        </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dashboardlayout>
  );
};

export default Network;
