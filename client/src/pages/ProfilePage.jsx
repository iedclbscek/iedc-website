import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    teamRole: '',
    department: '',
    year: '',
    phoneNumber: '',
    linkedin: '',
    github: '',
    bio: '',
    profilePicture: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgRef, setImgRef] = useState();
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);

  const departments = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Other'
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        teamRole: user.teamRole || '',
        department: user.department || '',
        year: user.year || '',
        phoneNumber: user.phoneNumber || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || ''
      });
      
      if (user.profilePicture) {
        setPreviewUrl(`${import.meta.env.VITE_API_URL}${user.profilePicture}`);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Character limit for bio
    if (name === 'bio' && value.length > 500) {
      toast.error('Bio cannot exceed 500 characters');
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL for cropping
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImageUrl(e.target.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    setImgRef(e.currentTarget);
    
    // Set initial crop to center square
    const { width, height } = e.currentTarget;
    const size = Math.min(width, height);
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    
    const crop = {
      unit: 'px',
      x,
      y,
      width: size,
      height: size,
    };
    
    setCrop(crop);
    setCompletedCrop(crop);
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (imgRef && completedCrop) {
      try {
        const croppedImageBlob = await getCroppedImg(imgRef, completedCrop);
        const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
        
        // Create a new File object from the blob
        const croppedFile = new File([croppedImageBlob], selectedFile.name, {
          type: selectedFile.type,
        });
        
        setSelectedFile(croppedFile);
        setPreviewUrl(croppedImageUrl);
        setShowCropModal(false);
        toast.success('Image cropped successfully!');
      } catch (error) {
        console.error('Error cropping image:', error);
        toast.error('Failed to crop image');
      }
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setSelectedFile(null);
    setOriginalImageUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(profileData).forEach(key => {
        if (key !== 'profilePicture' && profileData[key] !== '') {
          formData.append(key, profileData[key]);
        }
      });
      
      // Append file if selected
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        updateUser(response.data.user);
        setSelectedFile(null);
        setIsEditing(false); // Exit edit mode
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Profile' : 'My Profile'}
            </h1>
            <p className="text-gray-600">
              {isEditing 
                ? 'Update your personal information and profile picture' 
                : 'View and manage your profile information'
              }
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isEditing 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Picture Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Profile Picture
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <img
                    className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                    src={previewUrl}
                    alt="Profile preview"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
                  >
                    Choose Photo
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG up to 5MB. Image will be cropped to square.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* Team Role */}
            <div>
              <label htmlFor="teamRole" className="block text-sm font-medium text-gray-700">
                Team Role
              </label>
              <input
                type="text"
                name="teamRole"
                id="teamRole"
                value={profileData.teamRole}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., Lead Developer, Marketing Head"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                id="department"
                value={profileData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <select
                name="year"
                id="year"
                value={profileData.year}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="9876543210"
                pattern="[6-9][0-9]{9}"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="text"
                name="linkedin"
                id="linkedin"
                value={profileData.linkedin}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/username"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* GitHub */}
            <div className="md:col-span-2">
              <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                GitHub Profile (Optional)
              </label>
              <input
                type="text"
                name="github"
                id="github"
                value={profileData.github}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="https://github.com/username"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio (Optional)
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
              {isEditing && (
                <p className="text-sm text-gray-500 mt-1">
                  Max 500 characters ({profileData.bio.length}/500)
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Crop Profile Picture</h3>
            
            <div className="mb-4">
              {originalImageUrl && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    src={originalImageUrl}
                    onLoad={onImageLoad}
                    alt="Crop preview"
                    style={{ maxHeight: '400px', width: 'auto' }}
                  />
                </ReactCrop>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCropCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
