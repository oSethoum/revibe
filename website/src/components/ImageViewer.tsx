import type { ReactElement } from "react";
import { Image } from "@mantine/core";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export type ImagesViewerProps = {
  images: string[] | { thumbnail: string; image: string }[];
  thumbnail?: {
    width?: number;
    height?: number;
  };
  image?: {
    width: number;
    height?: number;
  };
  render?: (
    image: string | { thumbnail: string; image: string },
    index: number
  ) => ReactElement;
};

function isArrayOfObjects(array: any[]): array is { [key: string]: any }[] {
  return array.every(
    (item) => typeof item === "object" && !Array.isArray(item)
  );
}

export const ImagesViewer = ({
  images,
  image,
  render,
  thumbnail,
}: ImagesViewerProps) => {
  if (isArrayOfObjects(images)) {
    return (
      <PhotoProvider>
        {images.map((item, index) => (
          <PhotoView
            key={index}
            src={item.image}
            width={image?.width}
            height={image?.height}
          >
            {render ? (
              <>{render(item, index)}</>
            ) : (
              <Image
                src={item.thumbnail}
                alt={item.thumbnail}
                w={thumbnail?.width}
                h={thumbnail?.height}
                style={{ cursor: "pointer" }}
              />
            )}
          </PhotoView>
        ))}
      </PhotoProvider>
    );
  } else {
    return (
      <PhotoProvider>
        {images.map((item, index) => (
          <PhotoView
            key={index}
            src={item}
            width={image?.width}
            height={image?.height}
          >
            {render ? (
              render(item, index)
            ) : (
              <Image
                src={item}
                alt={item}
                w={thumbnail?.width}
                h={thumbnail?.height}
                style={{ cursor: "pointer" }}
              />
            )}
          </PhotoView>
        ))}
      </PhotoProvider>
    );
  }
};

export default ImagesViewer;
