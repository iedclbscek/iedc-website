import { useState, useEffect } from 'react';

const CommunityGallery = ({ communityId }) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to check if an image exists
    const imageExists = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });
    };

    // Function to load images from the gallery folder
    const loadGalleryImages = async () => {
      setIsLoading(true);
      const images = [];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      
      // Try to load images from 1 to 20 (you can adjust this range)
      for (let i = 1; i <= 20; i++) {
        for (const ext of imageExtensions) {
          const imagePath = `/img/communities/${communityId}/gallery/${i}.${ext}`;
          const exists = await imageExists(imagePath);
          if (exists) {
            images.push(imagePath);
            break; // Found the image, no need to try other extensions
          }
        }
      }
      
      setGalleryImages(images);
      setIsLoading(false);
    };

    if (communityId) {
      loadGalleryImages();
    }
  }, [communityId]);

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-text-dark mb-6">Gallery</h2>
        <div className="flex justify-center items-center py-8">
          <div className="text-text-light">Loading gallery...</div>
        </div>
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-text-dark mb-6">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for selected image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Selected gallery image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityGallery;
