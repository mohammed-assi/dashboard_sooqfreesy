import React, { useEffect, useState } from "react";
import { Languages, MapPin } from "lucide-react";
import { useParams } from "react-router-dom";
import { FILEURL, USERS } from "../../../config/endPoints";
import { getRequest } from "../../../config/apiFunctions";
import moment from "moment/moment";
import i18n from "../../../i18n";
import RatingStars from "../../../common/Rating/RatingStars";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../app/constants";
import dummyImage from "../../../assets/images/dummy.jpg";


// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import BackButton from "../../../components/TextEditor copy";

function ProductDetailPage() {
  const { id } = useParams();
  const decodedId = atob(id);

  const [adsDetail, setAdsDetail] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showAllRejections, setShowAllRejections] = useState(false);
  const [description, setDescription] = useState("Description");
  const [rejectTimeline, setRejectTimeline] = useState("Rejection Timeline");

  const [reason, setReason] = useState("Reason");
  const [memberSince, setMemberSince] = useState("Member Since");

  // 👇 Change this to your actual base URL
  // const imagePath = import.meta.env.VITE_APP_MEDIA_FILE_URL;

  async function getAdsDetails() {
    try {
      const response = await getRequest(`${USERS.ADS_DETAIL}/${decodedId}`);
      const { status } = response;
      const { data, success } = response.data;
      if (success && status === 200) {
        setAdsDetail(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   getAdsDetails();
  // }, []);

  useEffect(() => {
    getAdsDetails();

    const onLanguageChanged = () => {
      getAdsDetails();
    };

    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, []);

  useEffect(() => {
    if (i18n.language === "en") {
      setDescription("Description");
      setRejectTimeline("Rejection Timeline");
      setReason("Reason");
      setMemberSince("Member Since");
    } else {
      setDescription("الوصف");
      setRejectTimeline("الجدول الزمني للرفض");
      setReason("السبب");
      setMemberSince("عضو منذ");
    }
  }, [i18n.language]);

  // Mock timeline data (replace with API data if available)

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="pb-4">

      <BackButton/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section (Images) */}
        <div className="lg:col-span-2">
          {adsDetail?.post?.images?.length > 0 ? (
            <>
              {/* Main Swiper */}
              <Swiper
                style={{
                  "--swiper-navigation-color": "#2563eb",
                  "--swiper-pagination-color": "#2563eb",
                }}
                loop
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Pagination, FreeMode, Thumbs]}
                className="rounded-2xl overflow-hidden shadow-md"
              >
                {adsDetail?.post?.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${FILEURL}${img.image_url}`}
                      alt={`image-${index}`}
                      className="w-full h-[400px] object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Thumbnail Swiper */}
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={5}
                freeMode
                watchSlidesProgress
                modules={[FreeMode, Thumbs]}
                breakpoints={{
                  0: { slidesPerView: 3.4 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
                className="mt-3"
              >
                {adsDetail?.post?.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${FILEURL}${img.image_url}`}
                      alt={`thumb-${index}`}
                      className="w-full h-20 object-cover rounded-md cursor-pointer"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-xl">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        </div>

        {/* Right Section (Details) */}
        <div className="space-y-4">
          <div className="flex gap-3 ">
            {" "}
            <h2 className=" font-bold text-blue-600">
              ${adsDetail?.post?.price}
            </h2>{" "}
            /
            <h2 className="font-bold text-blue-600">
              £{adsDetail?.post?.price_syp}
            </h2>

          <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            Listing ID: {adsDetail?.post?.id}
          </div>
          </div>

          <p className="inline-block bg-blue-400 text-white text-xs font-medium px-3 py-1 rounded-full">
            {adsDetail?.post?.subCategoryName}
          </p>

          <p className="text-gray-500">{adsDetail?.post?.title}</p>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            {adsDetail?.post?.nearby_location}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 text-sm text-gray-700">
            {adsDetail?.post?.content &&
              Object.entries(adsDetail?.post?.content)?.map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col text-center items-center min-h-20 justify-center bg-gray-200 rounded-lg py-2 capitalize"
                >
                  <span className="font-semibold leading-none pb-2">{key}</span>
                  {value}
                </div>

                
              ))}

            

                <div
                  
                  className="flex flex-col text-center items-center min-h-20 justify-center bg-gray-200 rounded-lg py-2 capitalize"
                >
                  <span className="font-semibold leading-none pb-2">{"User Type"}</span>
                  {adsDetail?.post?.user_type}
                </div>

                   <div
                  
                  className="flex flex-col text-center items-center min-h-20 justify-center bg-gray-200 rounded-lg py-2 capitalize"
                >
                  <span className="font-semibold leading-none pb-2">{"Location"}</span>
                  {adsDetail?.post?.country}
                </div>

                <div
                  
                  className="flex flex-col text-center items-center min-h-20 justify-center bg-gray-200 rounded-lg py-2 capitalize"
                >
                  <span className="font-semibold leading-none pb-2">{"Post"}</span>
                  {moment(adsDetail?.post?.created_at).format("MM/DD/YYYY")}
                </div>
          </div>
        </div>
      </div>

      {/* Description & Sidebar */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Description Text */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-3">{description}</h3>
          <p className="text-gray-600 leading-relaxed">
            {adsDetail?.post?.description}
          </p>

          {/* Timeline Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">{rejectTimeline}</h3>

            <div className="space-y-6 max-h-[300px] overflow-y-auto">
              {(showAllRejections
                ? adsDetail?.post?.timeline || [] // show all
                : adsDetail?.post?.timeline?.slice(0, 1) || []
              ) // show first only
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
                  >
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {reason} {index + 1}
                    </h4>

                    {/* Date */}
                    <p className="text-xs text-gray-500 mb-2">
                      {moment(item.createdAt).format("MMM DD, YYYY")}
                    </p>

                    {/* Reason */}

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
            </div>

            {/* Toggle Button */}
            {adsDetail?.post?.timeline?.length > 1 && (
              <button
                onClick={() => setShowAllRejections(!showAllRejections)}
                className="mt-4 text-blue-600 text-sm font-medium hover:underline"
              >
                {showAllRejections ? "View Less" : "View All"}
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Map */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              title="map"
              src={`https://maps.google.com/maps?q=${adsDetail?.post?.nearby_location}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-48"
            />
          </div>

          {/* Owner Info */}
          <Link
                to={`${ROUTES.REVIEW.root}${adsDetail?.post?.user?.userid}`}
              >
          <div className="flex items-center gap-4 p-4 border rounded-lg shadow-sm">
            <img
              src={adsDetail?.post?.user?.user_profile_url ?  `${FILEURL}${adsDetail?.post?.user?.user_profile_url}` : dummyImage}
              alt="owner"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">
                {adsDetail?.post?.user?.username}
              </h4>
              {/* <Link to={`/reviews/${adsDetail?.post?.user?.id}`}> */}
              
                <RatingStars
                  rating={Number(adsDetail?.post?.user?.averageRating || 0)}
                />
        

              <p className="text-sm text-gray-500">
                {memberSince}{" "}
                {moment(adsDetail?.post?.user?.created_at).format("MM/DD/YYYY")}
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="22" class="ml-auto flex-shrink-0"><path fill="#00B4D8" d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z"/></svg>
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
