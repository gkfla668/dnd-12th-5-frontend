"use client";

import { useGiftStore } from "@/stores/gift-upload/useStore";
import Chip from "@/components/giftbag/Chip";
import GiftList from "@/components/giftbag/GiftList";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createGiftBag, updateGiftBag } from "@/api/giftbag/api";
import {
  useSelectedBagStore,
  useGiftBagStore,
} from "@/stores/giftbag/useStore";
import { useMutation } from "@tanstack/react-query";
import { GiftBox } from "@/types/giftbag/types";

const Page = () => {
  const { giftBoxes } = useGiftStore();
  const filledGiftCount = giftBoxes.filter(
    (gift) => gift && gift.filled === true,
  ).length;

  const router = useRouter();
  const { selectedBagIndex } = useSelectedBagStore();
  const { giftBagName } = useGiftBagStore();

  const createMutation = useMutation({
    mutationFn: () =>
      createGiftBag({
        giftBagName,
        selectedBagIndex,
        giftBoxes,
      }),
    onSuccess: (res) => {
      if (res?.id) {
        sessionStorage.setItem("giftBagId", res.id);
      }

      if (res?.gifts?.length) {
        res.gifts.forEach((gift: GiftBox, index: number) => {
          useGiftStore.getState().updateGiftBox(index, { id: gift.id });
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => updateGiftBag(giftBoxes),
    onSuccess: (res) => {
      res.result.gifts.forEach((gift: GiftBox, index: number) => {
        useGiftStore.getState().updateGiftBox(index, { id: gift.id });
      });
    },
  });

  const handleClickButton = async () => {
    try {
      const giftBagId = sessionStorage.getItem("giftBagId");

      if (!giftBagId) {
        await createMutation.mutateAsync();
      } else {
        await updateMutation.mutateAsync();
      }

      router.push("/giftbag/delivery?step=1");
    } catch (error) {
      alert(`보따리 저장에 실패했습니다. ${error}`);
    }
  };

  return (
    <div className="h-full bg-pink-50 px-4">
      <div className="h-full flex flex-col items-center justify-center relative">
        <div className="flex flex-col gap-7 w-[300px] items-center">
          <div className="absolute top-[10px]">
            <Chip text={`채워진 선물박스 ${filledGiftCount}개`} width="126px" />
          </div>
          <GiftList value={giftBoxes} />
        </div>
        <div className="w-full px-4 absolute bottom-4">
          <Button
            disabled={filledGiftCount <= 1}
            size="lg"
            onClick={handleClickButton}
          >
            선물 배달하러 가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
