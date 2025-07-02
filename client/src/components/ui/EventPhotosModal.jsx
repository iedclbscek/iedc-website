import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Camera, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const EventPhotosModal = ({ isOpen, onClose, event, onSuccess }) => {
  const { api } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (isOpen && event) {
      setPhotos(event.eventPhotos || []);
    }
  }, [isOpen, event]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotos(prev => [...prev, ...files]);
  };

  const removeNewPhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async () => {
    if (newPhotos.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      newPhotos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await api.post(
        `/events/${event._id}/photos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setPhotos(prev => [...prev, ...response.data.photos]);
        setNewPhotos([]);
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Error uploading photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const downloadPhoto = (photoUrl) => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_API_URL}${photoUrl}`;
    link.download = `event-photo-${Date.now()}.jpg`;
    link.click();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Event Photos</h2>
            <p className="text-gray-600">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Upload New Photos */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload New Photos</h3>
              {newPhotos.length > 0 && (
                <button
                  onClick={uploadPhotos}
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : `Upload ${newPhotos.length} Photo${newPhotos.length > 1 ? 's' : ''}`}
                </button>
              )}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="text-gray-400" size={48} />
                <div>
                  <p className="text-lg font-medium text-gray-900">Upload Photos</p>
                  <p className="text-gray-600">Drag and drop or click to select photos</p>
                  <p className="text-sm text-gray-500 mt-2">Supports: JPG, PNG, GIF, WEBP (Max 10MB each)</p>
                </div>
              </label>
            </div>

            {/* Preview New Photos */}
            {newPhotos.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Photos to Upload ({newPhotos.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {newPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`New photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeNewPhoto(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Photos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera size={20} />
              Event Photos ({photos.length})
            </h3>

            {photos.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="mx-auto text-gray-400 mb-4" size={64} />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No photos yet</h4>
                <p className="text-gray-600">Upload some photos from this event to share with everyone!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${photo}`}
                      alt={`Event photo ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => downloadPhoto(photo)}
                        className="bg-blue-600 text-white rounded-full p-2 mr-2 hover:bg-blue-700 transition-colors"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
            >
              <X size={32} />
            </button>
            <img
              src={`${import.meta.env.VITE_API_URL}${selectedPhoto}`}
              alt="Full size photo"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => downloadPhoto(selectedPhoto)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPhotosModal;
