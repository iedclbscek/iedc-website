import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Calendar, MapPin, Users, DollarSign, Tag, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const EventFormModal = ({ isOpen, onClose, event, onSuccess }) => {
  const { api } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Workshop',
    startDate: '',
    endDate: '',
    location: '',
    venue: '',
    maxParticipants: 0,
    registrationDeadline: '',
    registrationFee: 0,
    coordinators: [],
    speakers: [],
    tags: [],
    status: 'draft',
    featured: false
  });
  const [customFields, setCustomFields] = useState([]);
  const [images, setImages] = useState([]);

  const categories = ['Workshop', 'Bootcamp', 'Hackathon', 'Competition', 'Seminar', 'Conference', 'Networking', 'Other'];
  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'file', label: 'File Upload' },
    { value: 'date', label: 'Date' }
  ];

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get('/users/public-team');
        if (response.data.success) {
          setTeamMembers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    if (isOpen) {
      fetchTeamMembers();
      if (event) {
        setFormData({
          title: event.title || '',
          description: event.description || '',
          shortDescription: event.shortDescription || '',
          category: event.category || 'Workshop',
          startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
          endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
          location: event.location || '',
          venue: event.venue || '',
          maxParticipants: event.maxParticipants || 0,
          registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : '',
          registrationFee: event.registrationFee || 0,
          coordinators: event.coordinators?.map(c => c._id) || [],
          speakers: event.speakers || [],
          tags: event.tags || [],
          status: event.status || 'draft',
          featured: event.featured || false
        });
        setCustomFields(event.customRegistrationFields || []);
      } else {
        resetForm();
      }
    }
  }, [isOpen, event, api]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'Workshop',
      startDate: '',
      endDate: '',
      location: '',
      venue: '',
      maxParticipants: 0,
      registrationDeadline: '',
      registrationFee: 0,
      coordinators: [],
      speakers: [],
      tags: [],
      status: 'draft',
      featured: false
    });
    setCustomFields([]);
    setImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addCustomField = () => {
    const newField = {
      fieldId: `field_${Date.now()}`,
      fieldType: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: [],
      validation: {},
      order: customFields.length
    };
    setCustomFields([...customFields, newField]);
  };

  const updateCustomField = (index, updates) => {
    setCustomFields(prev => prev.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const removeCustomField = (index) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Add basic fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add custom fields
      submitData.append('customRegistrationFields', JSON.stringify(customFields));

      // Add images
      images.forEach(image => {
        if (event) {
          submitData.append('newImages', image);
        } else {
          submitData.append('images', image);
        }
      });

      const url = event 
        ? `/events/${event._id}`
        : '/events';
      
      const method = event ? 'put' : 'post';

      const response = await api[method](url, submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                required
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description for event cards"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/200 characters</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed event description"
              />
            </div>
          </div>

          {/* Date and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-1" size={16} />
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-1" size={16} />
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline mr-1" size={16} />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Main Auditorium, LBSCEK"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Details
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional venue information"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline mr-1" size={16} />
                Max Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0 for unlimited"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline mr-1" size={16} />
                Registration Fee
              </label>
              <input
                type="number"
                name="registrationFee"
                value={formData.registrationFee}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0 for free"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Event</span>
              </label>
            </div>
          </div>

          {/* Coordinators */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline mr-1" size={16} />
              Event Coordinators
            </label>
            <select
              multiple
              value={formData.coordinators}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, coordinators: values }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            >
              {teamMembers.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple coordinators</p>
          </div>

          {/* Speakers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speakers
            </label>
            {formData.speakers.map((speaker, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => handleArrayInputChange('speakers', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Speaker name"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('speakers', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('speakers')}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus size={16} />
              Add Speaker
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline mr-1" size={16} />
              Tags
            </label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tag"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus size={16} />
              Add Tag
            </button>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline mr-1" size={16} />
              Event Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {images.length > 0 && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Registration Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Custom Registration Fields
              </label>
              <button
                type="button"
                onClick={addCustomField}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus size={16} />
                Add Field
              </button>
            </div>

            {customFields.map((field, index) => (
              <div key={field.fieldId} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Field Type</label>
                    <select
                      value={field.fieldType}
                      onChange={(e) => updateCustomField(index, { fieldType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateCustomField(index, { label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Field label"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateCustomField(index, { placeholder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Placeholder text"
                    />
                  </div>
                </div>

                {(field.fieldType === 'select' || field.fieldType === 'radio' || field.fieldType === 'checkbox') && (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Options (one per line)</label>
                    <textarea
                      value={field.options.join('\n')}
                      onChange={(e) => updateCustomField(index, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      rows={3}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateCustomField(index, { required: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">Required field</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeCustomField(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
