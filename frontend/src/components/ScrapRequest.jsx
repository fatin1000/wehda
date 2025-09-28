/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  CircleX,
  Clock,
  Loader,
  MapPin,
  MessageCircle,
  PartyPopper,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

import PostAction from "./PostAction";
import ScrapRequestForm from "./ScrapRequestForm";

const ScrapRequest = ({ scrap }) => {
  const { t } = useTranslation();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(scrap.comments || []);
  const isOwner = authUser ? authUser._id === scrap.author._id : false;
  const isLiked = authUser ? scrap.likes.includes(authUser._id) : false;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: deleteScrap, isPending: isDeletingScrap } = useMutation({
    queryKey: ["deleteScrap", scrap._id],
    mutationFn: async () => {
      await axiosInstance.put(`/scraps/delete/${scrap._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      toast.success(t("scrap.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/scraps/${scrap._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      toast.success(t("scrap.commentAddedSuccess"));
    },
    onError: (err) => {
      toast.error(err.response.data.message || t("scrap.commentAddError"));
    },
  });

  const { mutate: likeScrap, isPending: isLikingScrap } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/scraps/${scrap._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["scrap", scrap._id] });
    },
  });

  const { data: scrapResStatus, isLoading: scrapResStatusLoading } = useQuery({
    queryKey: ["scrapResStatus", scrap._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/scrapResponse/status/${scrap._id}`);
      return res.data;
    },
  });

  const handleDeleteScrap = () => {
    if (!window.confirm(t("scrap.deleteConfirm"))) return;
    deleteScrap();
    navigate("/depot");
  };

  const handleLikeScrap = async () => {
    if (isLikingScrap) return;
    if (!authUser) {
      return toast.error(t("scrap.pleaseLoginToLike"));
    } else {
      likeScrap();
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (authUser === null) {
      return toast.error(t("scrap.pleaseLoginToComment"));
    } else {
      if (newComment.trim()) {
        createComment(newComment);
        setNewComment("");
        setComments([
          ...comments,
          {
            content: newComment,
            user: {
              _id: authUser._id,
              name: authUser.username,
              profilePic: authUser.profilePic,
            },
            createdAt: new Date(),
          },
        ]);
      }
    }
  };

  const handleShare = async (scrapId) => {
    const scrapURL = `${window.location.origin}/scrap/${scrapId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("scrap.checkThisScrap"),
          text: `${t("scrap.lookAtThisDeal")}\n\n${scrapURL}`,
          url: scrapURL,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert(t("scrap.sharingNotSupported"));
    }
  };
  //the thind below is for the Scrap form
  const renderButton = () => {
    if (scrapResStatus) {
      if (scrapResStatusLoading) {
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500"
            disabled
          >
            {t("loading")}
          </button>
        );
      }
      switch (scrapResStatus[0]?.status) {
        case "pending":
          return (
            <div className="m-4 bg-yellow-100 text-yellow-700 p-4 rounded-full flex flex-col items-center">
              <p className="flex justify-center items-center gap-2 font-semibold">
                <Clock size={20} /> {t("status.pending")}{" "}
              </p>
              <p>{t("message.pending")}</p>
            </div>
          );
        case "accepted":
          return (
            <div>
              <div className="m-4 bg-green-100 text-green-600 p-4 rounded-full flex flex-col items-center">
                <p className="flex justify-center items-center gap-2 font-semibold">
                  <PartyPopper size={20} /> {t("status.accepted")}{" "}
                </p>
                <p>
                  {t("message.accepted")} {t("action.sendNew")}
                </p>
              </div>
              <ScrapRequestForm scrap={scrap} />
            </div>
          );
        case "rejected":
          return (
            <div>
              <div className="m-4 bg-red-100 text-red-600 p-4 rounded-full flex flex-col items-center">
                <p className="flex justify-center items-center gap-2 font-semibold">
                  <CircleX size={20} /> {t("status.rejected")}{" "}
                </p>
                <p className="">
                  {t("message.rejected")} {t("action.sendNew")}
                </p>
              </div>
              <ScrapRequestForm scrap={scrap} />
            </div>
          );
        case "auto Rejected":
          return (
            <div className="m-4 bg-gray-400 text-gray-900 p-4 rounded-full flex flex-col items-center">
              <p className="flex justify-center items-center gap-2 font-semibold">
                <CircleX size={20} />
                {t("status.autoRejected")}{" "}
              </p>
              <p className="">{t("message.autoRejected")}</p>
            </div>
          );
        default:
          return <ScrapRequestForm scrap={scrap} />;
      }
    } else {
      return <ScrapRequestForm scrap={scrap} />;
    }
  };


  return (
    <div key={scrap._id} className="bg-white rounded-lg mb-4">
      {isOwner && (
        <div className="flex justify-end gap-2">
          <button
            onClick={handleDeleteScrap}
            className="text-xs text-red-600 p-2  hover:text-red-700"
          >
            {isDeletingScrap ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Trash2 size={20} />
            )}
          </button>
        </div>
      )}

      <div className="px-4 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              to={`/profile/${scrap?.author?._id}`}
              className="size-20 rounded-full mr-3  mx-auto mt-[-40px] bg-white border  border-gray-300 p-1 shadow-lg overflow-hidden"
            >
              <img
                src={
                  scrap.author.profilePic
                    ? scrap.author.profilePic
                    : "/avatar.png"
                }
                alt={scrap.author.username}
                className="object-cover rounded-full"
              />
            </Link>

            <div>
              <Link to={`/profile/${scrap?.author?._id}`}>
                <h3 className="text-xl font-semibold">
                  {scrap.author.username}
                </h3>
              </Link>
              <p className="text-xs text-info">
                {t(`auth.${scrap.author.headline}`)}
              </p>
            </div>
          </div>
          <div>
            {!isOwner && (
              <div className="flex justify-end gap-2 mb-2 sm:mb-4">
                {scrap.scrapStatus === "open" ? (
                  <div className="flex justify-end gap-2">
                    <span className="text bg-green-200 text-green-600 rounded-full px-4 py-2">
                      {t("status.open")}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <span className="text-xs bg-red-200 text-red-600 rounded-full p-2">
                      {t("status.expired")}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <p className=" flex items-center gap-1">
                <MapPin size={15} className="text-primary" />
                {t(`cities.${scrap.location}`)}
              </p>
              <p className="flex items-center gap-1">
                <Calendar size={15} className="text-primary" />
                {formatDistanceToNow(new Date(scrap.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1  gap-x-6 gap-y-8 sm:grid-cols-2"> */}
        {/* item details */}
        <div className="bg-white rounded border-gray-400 my-4 sm:col-span-1">
          <div className="">
            <img
              src={scrap.image}
              alt={scrap.itemName}
              className="w-full rounded-lg h-72 object-cover"
            />
          </div>

          <p className=" flex items-center gap-1 my-2 text-gray-500">
            {t(`categories.${scrap.category}`)}
          </p>
          <h3 className="font-bold mb-3 inline-block text-primary sm:text-2xl">
            {t(`items.${scrap.itemName.value}`)}
          </h3>
          <div>
            <p className="text-gray-500 ">
              {t("label.quantity")}:{" "}
              {scrap.quantity === scrap.oldQuantity ? (
                <span className="text-gray-800 font-semibold">
                  {scrap.quantity}
                </span>
              ) : (
                <span className="text-gray-800 font-semibold">
                  {scrap.quantity}
                  <span className=" text-gray-500 font-normal">
                    {t("label.leftOf")}{" "}
                    <span className="font-semibold"> {scrap.oldQuantity}</span>
                  </span>
                </span>
              )}{" "}
              {t(`units.${scrap.units}`)}
            </p>
          </div>

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
          {scrap.discription && (
            <div>
              <p className="mb-2 text-gray-500 inline-block">
                {t("scrap.description")}:
              </p>
              <h3 className="text-gray-600 mb-2 inline-block ms-2 sm:text-lg">
                {scrap.discription}
              </h3>
            </div>
          )}
        </div>

        {!isOwner && scrap.scrapStatus === "open" && (
          <div className="bg-white shadow-lg border border-gray-200 px-4 py-8 rounded-lg  mt-4 mb-8">
            {renderButton()}
          </div>
        )}
        {!isOwner && scrap.scrapStatus === "expired" && (
          <div className="bg-white shadow-lg border border-gray-200 px-4 py-8 rounded-lg  mt-4 mb-8">
            <div className="flex justify-center items-center gap-2 text-red-500">
              <CircleX size={20} /> {t("scrap.itemExpired")}
            </div>
          </div>
        )}

        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500  fill-blue-300" : ""}
              />
            }
            text={`${t("scrap.like")} (${scrap.likes.length})`}
            onClick={handleLikeScrap}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`${t("scrap.comment")} (${comments.length})`}
          />
          <PostAction
            icon={<Share2 size={18} />}
            text={t("scrap.share")}
            onClick={() => handleShare(scrap._id)}
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        {authUser && (
          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("comment.placeholder")}
              className="flex-grow p-3 rounded-s-full bg-gray-100  focus:outline-orange-600"
            />

            <button
              type="submit"
              className="bg-primary text-white p-3 rounded-e-full hover:bg-primary-dark transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        )}
        {!authUser && (
          <p className="text-sm text-red-500 mt-2 text-center">
            {t("comment.loginRequired")}
          </p>
        )}
        <div className="my-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="mb-2 bg-gray-100 p-2 rounded flex items-start"
            >
              <img
                src={comment.user.profilePic || "/avatar.png"}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
              />
              <div className="flex-grow">
                <div className="flex items-center mb-1">
                  <span className="font-semibold mr-2">
                    {comment.user.username}
                  </span>
                  <span className="text-xs text-info">
                    {formatDistanceToNow(new Date(comment.createdAt))}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ScrapRequest;
