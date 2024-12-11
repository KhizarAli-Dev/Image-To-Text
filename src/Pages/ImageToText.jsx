import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Tesseract from "tesseract.js";

const ImageToText = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handle file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setText("");
      setProgress(0);
    }
  };

  // Process image using Tesseract.js
  const convertImageToText = () => {
    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      Tesseract.recognize(reader.result, "eng", {
        logger: (info) => {
          if (info.status === "recognizing text") {
            setProgress(Math.round(info.progress * 100));
          }
        },
      })
        .then(({ data: { text } }) => {
          setText(text);
        })
        .catch((error) => {
          console.error("Error:", error);
          setText("Failed to extract text.");
        });
    };
    reader.readAsDataURL(image);
  };

  // Copy extracted text to clipboard
  const copyTextToClipboard = () => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success("Text copied to clipboard!"))
        .catch((error) => console.error("Failed to copy text:", error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Image Preview Section */}
        <div className="flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              className="w-64 h-64 object-contain border rounded-lg"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center border rounded-lg bg-gray-50 text-gray-500">
              No Image Selected
            </div>
          )}
        </div>

        {/* Input and Output Section */}
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Image to Text Converter
          </h2>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>
          <button
            onClick={convertImageToText}
            
            className={`w-full py-2 px-4 rounded-lg text-white font-bold ${
              image
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {image ? "Convert to Text" : "Upload an Image"}
          </button>
          {progress > 0 && (
            <div className="mt-4">
              <p className="text-center text-gray-600">
                Processing: {progress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          {text && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Extracted Text:
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">{text}</p>
              <button
                onClick={copyTextToClipboard}
                className="mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                Copy Text
              </button>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ImageToText;
