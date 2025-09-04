import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";
import {
  Calendar,
  Check,
  CircleDollarSign,
  ExternalLink,
  Loader,
  LocateIcon,
  MapPin,
  Trash2,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ScrapRes = () => {
  const { t } = useTranslation();
  const { scrapId } = useParams();
  const { data: scrap, isLoading } = useQuery({
    queryKey: ["scrap", scrapId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/scraps/${scrapId}`);
      return res.data;
    },
    enabled: !!scrapId, // تأكد من أن scrapId موجود قبل استخدامه
  });
  const queryClient = useQueryClient();
  const { data: myScrapRes, isLoading: scrapResLoading } = useQuery({
    queryKey: ["myScrapRes"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/scrapResponse/sendedscrapResponses/${scrapId}`
      );
      return res.data;
    },
  });
  const { mutate: scrapRejectRequest } = useMutation({
    queryKey: ["scrapRejectRequest"],
    mutationFn: (requestId) =>
      axiosInstance.put(`/scrapResponse/reject/${requestId}`),
    onSuccess: () => {
      toast.success(t("status.rejected"));
      queryClient.invalidateQueries({ queryKey: ["scrapResStatus"] });
      queryClient.invalidateQueries({ queryKey: ["scrapResponse"] });
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["userScraps"] });
      queryClient.invalidateQueries({ queryKey: ["myScrapRes"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || t("common.somethingWentWrong")
      );
    },
  });

  const { mutate: scrapAcceptRequest } = useMutation({
    queryKey: ["scrapAcceptRequest"],
    mutationFn: ([scrapId, resScrapId, dealQuntity]) =>
      axiosInstance.put(
        `/scrapResponse/accept/${scrapId}/${resScrapId}/${dealQuntity}`
      ),
    onSuccess: () => {
      toast.success(t("status.accepted"));
      queryClient.invalidateQueries({ queryKey: ["scrapResStatus"] });
      queryClient.invalidateQueries({ queryKey: ["scrapResponse"] });
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["userScraps"] });
      queryClient.invalidateQueries({ queryKey: ["myScrapRes"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || t("common.somethingWentWrong")
      );
    },
  });

  const handleScrapAccept = (
    scrapId,
    resScrapId,
    scrapQuntity,
    dealQuntity
  ) => {
    if (scrapQuntity < dealQuntity) {
      toast.error(t("dashboard.scrapRes.cannotAcceptQuantity"));
      return;
    } else {
      scrapAcceptRequest([scrapId, resScrapId, dealQuntity]);
    }
  };

  const { mutate: deleteScrap, isPending: isDeletingScrap } = useMutation({
    mutationFn: async (scrapId) => {
      await axiosInstance.put(`/scraps/delete/${scrapId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["userScraps"] });
      queryClient.invalidateQueries({ queryKey: ["myScrapRes"] });
      toast.success(t("dashboard.scrapRes.deletedSuccess"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleScrapDelete = (scrapId) => {
    deleteScrap(scrapId);
  };

  const myScrapsResArr = scrapResLoading || !myScrapRes ? [] : myScrapRes;
  console.log(scrap, "scrap");
  console.log(myScrapsResArr, "myScrapResArr");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-10 text-primary">
        <Loader className="mr-2 animate-spin" size={40} />
      </div>
    );
  }
  return (
    <div>
      <div key={scrap._id} className="flex flex-col md:mx-4 bg-white p-4 mb-4">
        <div className="flex justify-between gap-2 mb-4">
          {scrap.scrapStatus === "open" ? (
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-500 py-1 px-2 rounded-full text-sm">
                {t("dashboard.myScraps.open")}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-gray-300 text-gray-600 py-1 px-2 rounded-full text-sm">
                {t("dashboard.myScraps.closed")}
              </span>
            </div>
          )}

          <div className="flex">
            <Link
              to={`/scrap/${scrapId}`}
              className=" text-gray-500 py-2 px-4 rounded  hover:text-blue-500 me-2"
            >
              <ExternalLink size={25} />
            </Link>
            <button
              onClick={() => handleScrapDelete(scrapId)}
              className=" text-gray-500 py-2 px-4  hover:text-red-500"
              disabled={isDeletingScrap}
            >
              <Trash2 size={25} />
            </button>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-between mb-7">
          <div className="flex flex-col md:flex-row md:h-min w-full gap-2 md:gap-4 lg:gap-6">
            <div className="md:w-[50%] overflow-hidden rounded-lg">
              <img
                className="w-full object-cover"
                src={scrap.image}
                alt={scrap.itemName}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl md:text-4xl font-semibold text-orange-500 md:mb-2">
                {t(`items.${scrap.itemName.value}`)}
              </h3>
              <p className="text-gray-500 text-sm">
                {t(`categories.${scrap.category}`)}
              </p>
              <p className="text-gray-500 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                <span>{t(`cities.${scrap.location}`)}</span>
              </p>
              <p className="text-gray-500">
                {scrap.quantity === 0 ? (
                  <span className="bg-red-600 font-bold text-white py-1 px-4">
                    {t("label.soldOut")}
                  </span>
                ) : (
                  <>
                    {t("label.quantity")} :{" "}
                    {scrap.quantity === scrap.oldQuantity ? (
                      <span className="text-gray-900 font-semibold">
                        {scrap.quantity}
                      </span>
                    ) : (
                      <span className="text-white font-semibold">
                        {scrap.quantity}
                        <span className="text-gray-500 font-normal">
                          {" "}
                          {t("label.leftOf")}{" "}
                          <span className="font-semibold">
                            {scrap.oldQuantity}
                          </span>
                        </span>
                      </span>
                    )}{" "}
                    {t(`units.${scrap.units}`)}
                  </>
                )}
              </p>
              {scrap.sell === "retail" && (
                <div className="flex  flex-col gap-10 sm:flex-row">
                  <div>
                    <p className="mb-2 text-gray-500 inline-block">
                      {t("scrap.unitPrice")}:
                    </p>
                    <p className="font-bold mb-2 inline-block ms-2">
                      {scrap.unitPrice}
                    </p>
                  </div>
                  <div className="">
                    <p className="mb-2 text-gray-500 inline-block">
                      {t("scrap.minimumQuantity")}:
                    </p>
                    <p className="font-bold mb-2 inline-block ms-2">
                      {scrap.minAmount}
                    </p>
                  </div>
                </div>
              )}
              <div className="">
                <p className="mb-2 text-gray-500 inline-block">
                  {t("scrap.status")}:
                </p>
                <p className="font-bold mb-2 inline-block ms-2">
                  {t(`status.${scrap.itemStatus}`)}
                </p>
              </div>
              <div className="flex w-full  gap-2 my-4">
                <div className="flex flex-col flex-1 justify-center items-center  p-6 border rounded-md shadow-sm text-green-500">
                  <div className="flex items-center gap-2">
                    {scrap.deal.length}{" "}
                  </div>
                  <span className="text-sm">{t("status.accepted")}</span>
                </div>
                <div className="flex flex-col flex-1 justify-center items-center  p-6 border rounded-md shadow-sm text-yellow-500">
                  <div className="flex items-center gap-2">
                    {
                      myScrapsResArr.filter((res) => res.status === "pending")
                        .length
                    }{" "}
                  </div>
                  <span className="text-sm">{t("status.pending")}</span>
                </div>
                <div className="flex flex-col flex-1 justify-center items-center  p-6 border rounded-md shadow-sm text-red-500">
                  <div className="flex items-center gap-2">
                    {
                      myScrapsResArr.filter((res) => res.status === "rejected")
                        .length
                    }{" "}
                  </div>
                  <span className="text-sm">{t("status.rejected")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {scrap.likes.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-blue-500">
                      {t("dashboard.myScraps.likesCount", {
                        count: scrap.likes.length,
                      })}
                    </span>
                  </div>
                )}
                {scrap.comments.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-blue-500">
                      {t("dashboard.myScraps.commentsCount", {
                        count: scrap.comments.length,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="text-gray-500 flex items-center gap-1 whitespace-nowrap">
              <Calendar size={15} />
              {formatDistanceToNow(new Date(scrap.createdAt), {
                addSuffix: true,
              })}
            </div>
            {scrap.deal.length > 0 && (
              <div className="text-green-500 flex items-center mt-2 whitespace-nowrap">
                <CircleDollarSign />{" "}
                {scrap.deal.reduce((total, deal) => total + deal.price, 0)} SR
              </div>
            )}
          </div>
        </div>

        {!scrapResLoading && myScrapsResArr.length === 0 ? (
          <div className="bg-gray-200 p-4 rounded">
            <h1 className=" text-gray-500">
              {t("dashboard.scrapRes.noOffersYet")}
            </h1>
          </div>
        ) : scrapResLoading ? (
          "loading ..."
        ) : (
          <div className="flex flex-col md:flex-row g-2 md:gap-4 lg:gap-6">
            {myScrapsResArr.map((sRes) => (
              <div
                key={sRes._id}
                className="border p-4 rounded shadow-lg md:w-[50%] lg:w-[33%] flex-wrap"
              >
                <div className="flex items-center gap-2">
                  <div className="size-10 md:size-14 rounded-full overflow-hidden">
                    <img
                      src={
                        sRes.sender.profileImg
                          ? sRes.sender.profileImg
                          : "/avatar.png"
                      }
                      alt={sRes.sender.username}
                    />
                  </div>
                  <div>
                    <p className="">{sRes.sender.username}</p>
                  </div>
                </div>
                <div className="my-2">
                  <span className="text-gray-500">
                    {t("dashboard.scrapRes.quantity")} :{" "}
                  </span>
                  <span className="text-primary">
                    {sRes.quantity} {scrap.units}
                  </span>
                  <br />
                  <span className="text-gray-500">
                    {t("dashboard.scrapRes.price")} :{" "}
                  </span>
                  <span className="text-primary">{sRes.price} SR</span>
                  <br />
                  <span className="text-gray-500">
                    {t("dashboard.scrapRes.paymentMethod")} :{" "}
                  </span>
                  <span>{sRes.paymentMethod}</span>
                </div>
                <div className="mt-4 flex w-full">
                  {sRes.quantity > scrap.quantity &&
                  sRes.status === "pending" ? (
                    <div className="bg-gray-400 text-gray-700 py-2 px-4 rounded-full flex items-center gap-1 ">
                      {t("dashboard.scrapRes.autoRejected")}
                    </div>
                  ) : sRes.status === "pending" &&
                    scrap.scrapStatus === "open" ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() =>
                          handleScrapAccept(
                            scrap._id,
                            sRes._id,
                            scrap.quantity,
                            sRes.quantity
                          )
                        }
                        className="bg-green-500 text-white py-2 px-4 rounded w-[50%] flex items-center justify-center gap-1 hover:bg-green-600"
                      >
                        <Check size={18} /> {t("dashboard.scrapRes.accept")}
                      </button>
                      <button
                        onClick={() => scrapRejectRequest(sRes._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded flex items-center gap-1 hover:bg-red-600 w-[50%] justify-center"
                      >
                        <X size={18} />
                        {t("dashboard.scrapRes.reject")}
                      </button>
                    </div>
                  ) : sRes.status == "rejected" ? (
                    <div className="bg-red-200 text-red-700 py-2 px-4 rounded-full flex items-center gap-1 ">
                      {t("dashboard.scrapRes.youRejected")}
                    </div>
                  ) : sRes.status == "accepted" ? (
                    <div className="bg-green-200 text-green-700 py-2 px-4 rounded-full flex items-center gap-1 ">
                      {t("dashboard.scrapRes.youAccepted")}
                    </div>
                  ) : (
                    <div className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full flex items-center gap-1 ">
                      {t("dashboard.scrapRes.autoRejected")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapRes;
