"use client";

import { useParams, useSearchParams } from "next/navigation";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import { fetchGiftResults, fetchResponseBundle } from "@/api/giftbag/api";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/common/Loading";

const Page = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const step = searchParams?.get("step");
  const link = params?.id as string;

  const {
    data: giftBag,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["receiveGiftBag", link],
    queryFn: () => fetchResponseBundle(link),
    enabled: !!link,
  });

  const { data: giftResultData, isError: isGiftResultDataError } = useQuery({
    queryKey: ["giftResults", giftBag?.id],
    queryFn: () => fetchGiftResults(giftBag?.id as unknown as string),
    enabled: !!giftBag?.id && giftBag?.status === "COMPLETED",
  });

  if (isPending)
    return (
      <div className="relative w-full h-full">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loading />
        </div>
      </div>
    );

  if (isError || !giftBag || isGiftResultDataError)
    return (
      <div className="h-full flex flex-col items-center justify-center ">
        <h1 className="text-4xl font-bold text-gray-800">ERROR</h1>
        <p className="text-lg text-gray-600 mt-2">
          보따리를 불러오는 중에 오류가 발생했어요!
        </p>
      </div>
    );

  return (
    <div className={`h-full relative ${step === "2" && "bg-pink-50"}`}>
      {step === "1" && (
        <Step1
          delivery={giftBag.delivery_character_type}
          color={giftBag.design_type.toLowerCase()}
          isCompleted={giftBag.status === "COMPLETED"}
        />
      )}
      {step === "2" && (
        <Step2
          gifts={giftBag.gifts}
          giftResultData={giftResultData}
          isCompleted={giftBag.status === "COMPLETED"}
        />
      )}
      {step === "3" && <Step3 delivery={giftBag.delivery_character_type} />}
    </div>
  );
};

export default Page;
