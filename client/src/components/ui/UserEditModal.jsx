import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaTimes, FaSave, FaKey, FaCrop } from 'react-icons/fa';
import axios from 'axios';

const UserEditModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phoneNumber: '',
    linkedin: '',
    github: '',
    bio: '',
    teamYears: [],
    yearlyRoles: [],
    isActive: true,
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Image cropping states
  const [imagePreview, setImagePreview] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [_originalFile, setOriginalFile] = useState(null);
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);
  const canvasRef = React.useRef(null);
  const imageRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const cropContainerRef = React.useRef(null);

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'nodal_officer', label: 'Nodal Officer' },
    { value: 'ceo', label: 'CEO' },
    { value: 'lead', label: 'Lead' },
    { value: 'co_lead', label: 'Co-Lead' },
    { value: 'coordinator', label: 'Coordinator' },
    { value: 'member', label: 'Member' }
  ];

  const departments = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Other'
  ];

  // Generate team years (from 2020 to current year + 1)
  const currentYear = new Date().getFullYear();
  const teamYears = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    teamYears.push(year);
  }

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        phoneNumber: user.phoneNumber || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        bio: user.bio || '',
        teamYears: user.teamYears || [],
        yearlyRoles: user.yearlyRoles || [],
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
      setNewPassword('');
      setShowPasswordReset(false);
      setImagePreview(null);
      setShowCropModal(false);
      setCroppedImage(null);
      setOriginalFile(null);
      setImageLoaded(false);
      setCropData({ x: 0, y: 0, width: 200, height: 200 });
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTeamYearToggle = (year) => {
    setFormData(prev => {
      const newTeamYears = prev.teamYears.includes(year)
        ? prev.teamYears.filter(y => y !== year)
        : [...prev.teamYears, year];
      
      // Update yearly roles accordingly
      const newYearlyRoles = prev.yearlyRoles.filter(yr => newTeamYears.includes(yr.year));
      
      // Add default role for new years
      newTeamYears.forEach(year => {
        if (!newYearlyRoles.find(yr => yr.year === year)) {
          newYearlyRoles.push({
            year: year,
            role: 'member',
            teamRole: '',
            academicYear: '',
            order: 0
          });
        }
      });
      
      return {
        ...prev,
        teamYears: newTeamYears,
        yearlyRoles: newYearlyRoles
      };
    });
  };

  const handleYearlyRoleChange = (year, field, value) => {
    setFormData(prev => ({
      ...prev,
      yearlyRoles: prev.yearlyRoles.map(yr => 
        yr.year === year 
          ? { ...yr, [field]: value }
          : yr
      )
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setImageLoaded(false);
        setShowCropModal(true);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const cropImage = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image || !image.complete || image.naturalWidth === 0) {
      toast.error('Image not loaded properly. Please try again.');
      return;
    }

    const ctx = canvas.getContext('2d');

    // Set canvas size to desired output size (square)
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Get the display size of the image
    const displayWidth = image.clientWidth;
    const displayHeight = image.clientHeight;
    
    // Calculate the scale factor between display and natural size
    const scaleX = image.naturalWidth / displayWidth;
    const scaleY = image.naturalHeight / displayHeight;

    // Calculate crop dimensions based on the crop selection
    const cropX = cropData.x * scaleX;
    const cropY = cropData.y * scaleY;
    const cropWidth = cropData.width * scaleX;
    const cropHeight = cropData.height * scaleY;

    // Clear canvas and draw cropped image
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(
      image,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, size, size
    );

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
        setProfilePicture(file);
        setCroppedImage(canvas.toDataURL('image/jpeg', 0.9));
        setShowCropModal(false);
        toast.success('Image cropped successfully!');
      } else {
        toast.error('Failed to crop image. Please try again.');
      }
    }, 'image/jpeg', 0.9);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    const image = imageRef.current;
    if (image) {
      // Calculate initial crop area (center square)
      const displayWidth = image.clientWidth;
      const displayHeight = image.clientHeight;
      const size = Math.min(displayWidth, displayHeight) * 0.8;
      const x = (displayWidth - size) / 2;
      const y = (displayHeight - size) / 2;
      
      setCropData({ x, y, width: size, height: size });
    }
  };

  const handleMouseDown = (e, handle = null) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    const rect = cropContainerRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setDragStart({ x: startX, y: startY });
    
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setIsDragging(false); // Make sure dragging is off when resizing
    } else {
      setIsDragging(true);
      setIsResizing(false); // Make sure resizing is off when dragging
    }
  };

  // Add global mouse event listeners
  React.useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (!isDragging && !isResizing) return;
      
      const rect = cropContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const deltaX = currentX - dragStart.x;
      const deltaY = currentY - dragStart.y;
      
      const image = imageRef.current;
      if (!image) return;
      
      const maxX = image.clientWidth;
      const maxY = image.clientHeight;
      
      if (isDragging) {
        setCropData(prev => {
          const newX = Math.max(0, Math.min(prev.x + deltaX, maxX - prev.width));
          const newY = Math.max(0, Math.min(prev.y + deltaY, maxY - prev.height));
          return { ...prev, x: newX, y: newY };
        });
        setDragStart({ x: currentX, y: currentY });
      } else if (isResizing && resizeHandle) {
        setCropData(prev => {
          let newCropData = { ...prev };
          
          switch (resizeHandle) {
            case 'se': {// bottom-right
              const newWidth = Math.max(50, Math.min(currentX - prev.x, maxX - prev.x));
              const newHeight = Math.max(50, Math.min(currentY - prev.y, maxY - prev.y));
              const newSize = Math.min(newWidth, newHeight); // Keep square
              newCropData.width = newSize;
              newCropData.height = newSize;
              break;
            }
            case 'sw': {// bottom-left
              const newWidth = Math.max(50, Math.min(prev.x + prev.width - currentX, prev.x + prev.width));
              const newHeight = Math.max(50, Math.min(currentY - prev.y, maxY - prev.y));
              const newSize = Math.min(newWidth, newHeight); // Keep square
              newCropData.width = newSize;
              newCropData.height = newSize;
              newCropData.x = prev.x + prev.width - newSize;
              break;
            }
            case 'ne': {// top-right
              const newWidth = Math.max(50, Math.min(currentX - prev.x, maxX - prev.x));
              const newHeight = Math.max(50, Math.min(prev.y + prev.height - currentY, prev.y + prev.height));
              const newSize = Math.min(newWidth, newHeight); // Keep square
              newCropData.width = newSize;
              newCropData.height = newSize;
              newCropData.y = prev.y + prev.height - newSize;
              break;
            }
            case 'nw': {// top-left
              const newWidth = Math.max(50, Math.min(prev.x + prev.width - currentX, prev.x + prev.width));
              const newHeight = Math.max(50, Math.min(prev.y + prev.height - currentY, prev.y + prev.height));
              const newSize = Math.min(newWidth, newHeight); // Keep square
              newCropData.width = newSize;
              newCropData.height = newSize;
              newCropData.x = prev.x + prev.width - newSize;
              newCropData.y = prev.y + prev.height - newSize;
              break;
            }
          }
          
          return newCropData;
        });
      }
    };
    
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleMouseUpGlobal);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeHandle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'teamYears' || key === 'yearlyRoles') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append profile picture if selected
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}/admin-edit`,
        formDataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('User updated successfully!');
        onUpdate(response.data.user);
        onClose();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}/reset-password-admin`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Password reset successfully!');
        setNewPassword('');
        setShowPasswordReset(false);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Edit User: {user?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {croppedImage && (
                <div className="mt-2">
                  <img
                    src={croppedImage}
                    alt="Cropped preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCroppedImage(null);
                      setProfilePicture(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="mt-1 text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              maxLength={500}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active User</span>
            </label>
          </div>

          {/* Team Years */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Team Years</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {teamYears.map(year => (
                <label key={year} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.teamYears.includes(year)}
                    onChange={() => handleTeamYearToggle(year)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{year}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Yearly Roles */}
          {formData.teamYears.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Yearly Roles</label>
              <div className="space-y-4">
                {formData.teamYears.sort().map(year => {
                  const yearlyRole = formData.yearlyRoles.find(yr => yr.year === year) || {};
                  return (
                    <div key={year} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">{year}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                          <select
                            value={yearlyRole.role || 'member'}
                            onChange={(e) => handleYearlyRoleChange(year, 'role', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            {roles.map(role => (
                              <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Team Role</label>
                          <input
                            type="text"
                            value={yearlyRole.teamRole || ''}
                            onChange={(e) => handleYearlyRoleChange(year, 'teamRole', e.target.value)}
                            placeholder="e.g., Technical Lead"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Academic Year</label>
                          <select
                            value={yearlyRole.academicYear || ''}
                            onChange={(e) => handleYearlyRoleChange(year, 'academicYear', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Password Reset Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Password Management</h4>
              <button
                type="button"
                onClick={() => setShowPasswordReset(!showPasswordReset)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaKey className="mr-2" />
                {showPasswordReset ? 'Cancel' : 'Reset Password'}
              </button>
            </div>

            {showPasswordReset && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={loading || !newPassword}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Image Crop Modal */}
        {showCropModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Crop Profile Picture</h3>
              
              <div className="mb-4 text-center relative">
                <div 
                  ref={cropContainerRef}
                  className="relative inline-block max-w-full"
                  style={{ maxHeight: '400px' }}
                >
                  <img
                    ref={imageRef}
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-96 mx-auto border rounded block"
                    onLoad={handleImageLoad}
                    onError={() => {
                      toast.error('Failed to load image');
                    }}
                    crossOrigin="anonymous"
                    style={{ display: 'block' }}
                  />
                  
                  {/* Crop selection box */}
                  {imageLoaded && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 select-none"
                      style={{
                        left: `${cropData.x}px`,
                        top: `${cropData.y}px`,
                        width: `${cropData.width}px`,
                        height: `${cropData.height}px`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                      }}
                      onMouseDown={(e) => handleMouseDown(e)}
                    >
                      {/* Corner handles */}
                      <div 
                        className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white cursor-nw-resize hover:bg-blue-600 rounded-sm z-10"
                        onMouseDown={(e) => handleMouseDown(e, 'nw')}
                      ></div>
                      <div 
                        className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white cursor-ne-resize hover:bg-blue-600 rounded-sm z-10"
                        onMouseDown={(e) => handleMouseDown(e, 'ne')}
                      ></div>
                      <div 
                        className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white cursor-sw-resize hover:bg-blue-600 rounded-sm z-10"
                        onMouseDown={(e) => handleMouseDown(e, 'sw')}
                      ></div>
                      <div 
                        className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white cursor-se-resize hover:bg-blue-600 rounded-sm z-10"
                        onMouseDown={(e) => handleMouseDown(e, 'se')}
                      ></div>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  {imageLoaded ? 'Drag the selection box to move it, or drag corner handles to resize' : 'Loading image...'}
                </p>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropModal(false);
                    setImagePreview(null);
                    setProfilePicture(null);
                    setOriginalFile(null);
                    setImageLoaded(false);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={cropImage}
                  disabled={!imageLoaded}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCrop className="mr-2" />
                  Crop & Use
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEditModal;
