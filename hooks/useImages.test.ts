import "@testing-library/jest-dom";

import * as React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useImages } from "./useImages";
import type { Image } from "../api/imgur";

describe("useImages hook", () => {
  test("returns no lightboxProps when there isn't any data", () => {
    const { result } = renderHook(() => useImages(undefined));
    expect(result.current.lightboxProps).toBeUndefined();
  });

  const randomChar = () =>
    String.fromCharCode(
      Math.floor(Math.random() * 26) + (Math.floor(Math.random()) ? 65 : 97)
    );

  // in test data, it's often useful to be able to discern ordering based on the string
  const randomString = (i: number) =>
    `Index${i}-${new Array(8).map(() => randomChar()).join()}`;

  const mockImages: Image[] = Array.from(new Array(8), (_, i) => ({
    id: randomString(i),
    link: randomString(i),
    nsfw: false,
    type: "image/jpeg",
    title: randomString(i),
    description: randomString(i),
  }));

  test("doesn't return lightboxProps initially, even when images are given to it", () => {
    const { result } = renderHook(() => useImages(mockImages));
    expect(result.current.lightboxProps).toBeUndefined();
  });

  test("returns lightboxProps when an image is selected", () => {
    const { result } = renderHook(() => useImages(mockImages));
    expect(result.current.lightboxProps).toBeUndefined();

    const imageIndex = 3;

    act(() => {
      result.current.selectImage(imageIndex);
    });

    expect(result.current.lightboxProps).toBeDefined();
    expect(result.current.lightboxProps.mainSrc).toBe(
      mockImages[imageIndex].link
    );
    expect(result.current.lightboxProps.nextSrc).toBe(
      mockImages[imageIndex + 1].link
    );
    expect(result.current.lightboxProps.prevSrc).toBe(
      mockImages[imageIndex - 1].link
    );
  });
  test("can control indexing through the onMoveNextRequest method", () => {
    const { result } = renderHook(() => useImages(mockImages));
    expect(result.current.lightboxProps).toBeUndefined();

    const imageIndex = 3;

    act(() => {
      result.current.selectImage(imageIndex);
    });
    act(() => {
      result.current.lightboxProps.onMoveNextRequest();
    });

    expect(result.current.lightboxProps.mainSrc).toBe(
      mockImages[imageIndex + 1].link
    );
    expect(result.current.lightboxProps.nextSrc).toBe(
      mockImages[imageIndex + 2].link
    );
    expect(result.current.lightboxProps.prevSrc).toBe(
      mockImages[imageIndex].link
    );
  });
  test("can control indexing through the onMoveNextRequest method", () => {
    const { result } = renderHook(() => useImages(mockImages));
    expect(result.current.lightboxProps).toBeUndefined();

    const imageIndex = 3;

    act(() => {
      result.current.selectImage(imageIndex);
    });
    act(() => {
      result.current.lightboxProps.onMovePrevRequest();
    });

    expect(result.current.lightboxProps.mainSrc).toBe(
      mockImages[imageIndex - 1].link
    );
    expect(result.current.lightboxProps.nextSrc).toBe(
      mockImages[imageIndex].link
    );
    expect(result.current.lightboxProps.prevSrc).toBe(
      mockImages[imageIndex - 2].link
    );
  });
  test("will cycle around the array if necessary", () => {
    const { result } = renderHook(() => useImages(mockImages));
    expect(result.current.lightboxProps).toBeUndefined();

    const imageIndex = 0;

    act(() => {
      result.current.selectImage(imageIndex);
    });

    expect(result.current.lightboxProps.prevSrc).toBe(
      mockImages[mockImages.length - 1].link
    );
  });
});
