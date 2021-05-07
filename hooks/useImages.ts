import type { Image } from "../api/imgur";
import type { ILightBoxProps } from "react-image-lightbox";
import {
  useState,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

type ImageState = number | null;

type LightboxHookResults = {
  selectImage: Dispatch<SetStateAction<ImageState>>;
  lightboxProps?: Partial<ILightBoxProps> & {
    mainSrc: string;
    onCloseRequest: () => void;
  };
};

export function useImages(data: Image[] | null): LightboxHookResults {
  const [selectedImage, selectImage] = useState<ImageState>(null);
  const nextSrcIndex = useMemo(
    () => data && (data.length + selectedImage + 1) % data.length,
    [data?.length, selectedImage]
  );
  const prevSrcIndex = useMemo(
    () => data && (data?.length + selectedImage - 1) % data?.length,
    [data?.length, selectedImage]
  );
  const onCloseRequest = useCallback(() => selectImage(null), [selectImage]);
  const { link: mainSrc, description: imageCaption } =
    data?.[selectedImage] ?? {};
  const prevSrc = data?.[prevSrcIndex]?.link;
  const nextSrc = data?.[nextSrcIndex]?.link;
  const onMoveNextRequest = useCallback(() => selectImage(nextSrcIndex), [
    nextSrcIndex,
  ]);
  const onMovePrevRequest = useCallback(() => selectImage(prevSrcIndex), [
    prevSrcIndex,
  ]);

  return Object.assign(
    {
      selectImage,
    },
    selectedImage == null || {
      lightboxProps: {
        mainSrc,
        prevSrc,
        nextSrc,
        onMoveNextRequest,
        onMovePrevRequest,
        onCloseRequest,
        imageCaption,
      },
    }
  );
}
