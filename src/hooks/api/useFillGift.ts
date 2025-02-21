import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

const fetchFillGift = async (giftBagId: number) => {
  const accessToken = getCookie("accessToken");

  if (!giftBagId) return;

  const response = await fetch(`/api/v1/bundles/${giftBagId}/gifts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("데이터를 불러오는 데 실패했습니다.");
  }

  return response.json();
};

export const useFillGift = (giftBagId: number) => {
  return useQuery({
    queryKey: ["fillGift"],
    queryFn: () => fetchFillGift(giftBagId),
  });
};
