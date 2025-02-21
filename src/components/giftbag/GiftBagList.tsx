"use client";

import Card from "@/components/common/Card";
import { useSelectedBagStore } from "@/stores/giftbag/useStore";

interface GiftBagListProps {
  numberOfCards: number;
  size: "small" | "medium";
  imgPaths: string[];
}

const GiftBagList = ({ numberOfCards, size, imgPaths }: GiftBagListProps) => {
  const { selectedBagIndex, setSelectedBagIndex } = useSelectedBagStore();

  const handleCardClick = (index: number) => {
    setSelectedBagIndex(index);
  };

  return (
    <div className="flex gap-4 h-[70px] whitespace-nowrap">
      {Array.from({ length: numberOfCards }, (_, index) => (
        <Card
          key={index}
          size={size}
          img={imgPaths[index % imgPaths.length]}
          isActive={index === selectedBagIndex}
          onClick={() => handleCardClick(index)}
        />
      ))}
    </div>
  );
};

export default GiftBagList;
