import { Skeleton } from "@chakra-ui/react";
import React from "react";

interface SkeletonLoadingProps {
  count: number;
  height: string;
  width?: string;
}

export default function SkeletonLoading({
  height,
  width,
  count,
}: SkeletonLoadingProps) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Skeleton
          key={index}
          height={height}
          width={width}
          startColor="blackAlpha.400"
          endColor="whiteAlpha.300"
          borderRadius={4}
        />
      ))}
    </>
  );
}
