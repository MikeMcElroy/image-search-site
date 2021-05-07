import Head from "next/head";
import { useState, useRef } from "react";
import useSWR from "swr";
import { getImages, getMediumImageSrc } from "../api/imgur";
import Lightbox from "react-image-lightbox";
import { useImages } from "../hooks/useImages";
import { useSearch } from "../hooks/useSearch";

export default function Home() {
  const inputRef = useRef(null);
  const [searchVal, setSearchVal] = useState<string | null>(null);
  const { images, loading, error } = useSearch({ query: searchVal });
  const { lightboxProps, selectImage } = useImages(images);

  return (
    <div className="container">
      <Head key="header">
        <title>Search for your cool images!</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/lightbox.css" />
      </Head>

      {lightboxProps && <Lightbox {...lightboxProps} />}
      <main>
        <h1 className="title">Search for an image!</h1>

        <p className="description">
          <input ref={inputRef} />
          <button onClick={() => setSearchVal(inputRef.current.value)}>
            Search
          </button>
        </p>
        {loading && <img src="/spinner.svg" />}
        {images && (
          <div className="grid">
            {images.map((image, index) => (
              <div className="card" onClick={() => selectImage(index)}>
                <img src={getMediumImageSrc(image)} alt={image.title} />
              </div>
            ))}
          </div>
        )}
        {error && <p>Oh noes!</p>}
        {}
      </main>

      <footer>
        <div>
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </div>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          min-width: 75%;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 80%;
          margin-top: 3rem;
        }

        .card {
          flex-basis: 100%;
          margin: 0.5rem;
          padding: 0.5rem;
          text-align: left;
          color: inherit;
          max-width: 19%;
          height: 360px;
          overflow: hidden;
          display: flex;
          justify-content: space-around;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card img {
          position: relative;
          margin: auto;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
          .card {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
