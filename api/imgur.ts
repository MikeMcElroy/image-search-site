type GetImagesQueryOptions = {
  query: string;
  q_type?: "jpg" | "png" | "gif" | "anigif" | "album";
};

export type Image = {
  id: string;
  title: string;
  description: string;
  // datetime: number;
  type: string;
  // animated: boolean;
  // width: number;
  // height: number;
  // size: number;
  // views: number;
  // bandwidth: number;
  // deletehash?: string;
  link: string;
  // gifv?: string;
  // mp4?: string;
  // mp4_size?: number;
  // looping?: boolean;
  // vote: string;
  // favorite: boolean;
  nsfw: boolean;
  // comment_count: number;
  // topic: string;
  // topic_id: number;
  // section: string;
  // account_url: string;
  // account_id: number;
  // ups: number;
  // downs: number;
  // points: number;
  // score: number;
  // is_album: boolean;
  // in_most_viral: boolean;
};

type Album = {
  images: Image[];
  id: string;
  title: string;
  description: string;
  datetime: number;
  cover: string;
  cover_width: number;
  cover_height: number;
  account_url: string;
  account_id: number;
  privacy: string;
  layout: string;
  views: number;
  link: string;
  ups: number;
  downs: number;
  points: number;
  score: number;
  is_album: boolean;
  vote: string;
  favorite: boolean;
  nsfw: boolean;
  comment_count: number;
  topic: string;
  topic_id: number;
  images_count: number;
  in_most_viral: boolean;
};

type SearchResponse = {
  data: Album[];
  success: boolean;
  status: number;
};

export async function getImages({
  query,
  q_type,
}: GetImagesQueryOptions): Promise<Image[]> {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Client-ID 9b4341b3afe6f81");
  const response = await fetch(
    `https://api.imgur.com/3/gallery/search/?q=${query}${
      q_type ? `&qType=${q_type}&q_exactly=${query}` : ""
    }`,
    {
      headers: myHeaders,
      method: "GET",
    }
  );

  if (response.ok) {
    const album_results = ((await response.json()) as SearchResponse).data;
    const image_results = album_results.reduce(
      (images, album) => images.concat(album.images),
      []
    );
    return image_results.filter(
      (image) => image && !image.nsfw && image.type.startsWith("image/")
    );
  }
  throw new Error("There was an error when loading the Imgur API");
}

export function getMediumImageSrc(image: Image): string {
  if (image.type.includes("gif")) {
    return image.link;
  }
  return `https://i.imgur.com/${image.id}m${image.link.split(image.id)[1]}`;
}
