"use client";

import React, { useState } from "react";

interface ImageZoomProps {
  src?: string;
  alt?: string;
}

export function ImageZoom({ src, alt }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!src) return null;

  return (
    <>
      {/* Inline Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || "Article diagram"}
        onClick={() => setIsZoomed(true)}
        style={{
          maxWidth: "100%",
          borderRadius: 8,
          border: "1px solid var(--rule)",
          margin: "1.5rem 0",
          display: "block",
          cursor: "zoom-in",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      />

      {/* Lightbox / Zoom Modal */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            cursor: "zoom-out",
            padding: "2rem",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || "Zoomed image view"}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          />
          {alt && (
            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.75rem",
                color: "#e6edf3",
                marginTop: "1rem",
                textAlign: "center",
                maxWidth: "600px",
              }}
            >
              {alt}
            </p>
          )}
        </div>
      )}
    </>
  );
}
