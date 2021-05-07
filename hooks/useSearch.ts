import useSWR from "swr";
import { getImages, Image } from "../api/imgur";

type SearchHookParams = {
  query: string | null;
};

type SearchHookReturn = {
  images: Image[];
  loading: boolean;
  error: Error;
};

export function useSearch({ query }: SearchHookParams): SearchHookReturn {
  const { data: images, isValidating: loading, error } = useSWR(
    query,
    () => getImages({ query }),
    { shouldRetryOnError: false }
  );

  return {
    images,
    loading,
    error,
  };
}
