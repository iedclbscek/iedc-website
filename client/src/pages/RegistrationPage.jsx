import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitRegistration } from '../services/registrationService';
import toast from 'react-hot-toast';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    admissionNo: '',
    department: '',
    yearOfJoining: '',
    semester: '',
    interests: [],
    nonTechInterests: '',
    experience: '',
    motivation: '',
    linkedin: '',
    github: '',
    portfolio: '',
    referralCode: '',
    profilePhoto: null,
    idPhoto: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Computer Science and Engineering',
    'Computer Science and Business Systems',
    'Computer Science and Engineering(AI & Data Science)',
    'Electrical and Electronics Engineering',
    'Electronics and Communication Engineering',
    'Information Technology',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const joiningYears = ['2022', '2023', '2024', '2025'];
  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];

  const interestAreas = [
    'Web Development',
    'Mobile App Development',
    'AI/ML',
    'Data Science',
    'Cybersecurity',
    'IoT',
    'Blockchain',
    'Cloud Computing',
    'UI/UX Design',
    'Digital Marketing',
    'Business Development',
    'Product Management',
    'Robotics',
    '3D Printing',
    'Game Development',
    'DevOps',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }
    // Experience length validation
    if (formData.experience && formData.experience.length > 1000) {
      toast.error('Experience description cannot exceed 1000 characters.');
      return;
    }
    // Referral code validation
    if (formData.referralCode.trim().toUpperCase() !== 'DREAMITDOIT') {
      toast.error('Wrong referral code. Please enter DREAMITDOIT.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Prepare data for MongoDB (temporarily without photo URLs)
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        admissionNo: formData.admissionNo,
        department: formData.department,
        yearOfJoining: formData.yearOfJoining,
        semester: formData.semester,
        interests: formData.interests,
        nonTechInterests: formData.nonTechInterests,
        experience: formData.experience,
        motivation: formData.motivation,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        referralCode: formData.referralCode
      };
      // Submit to MongoDB via API
      toast.loading('Submitting application...');
      await submitRegistration(registrationData);
      toast.dismiss();
      // Success message
      toast.success('Application submitted successfully! We will review it and get back to you soon.');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        admissionNo: '',
        department: '',
        yearOfJoining: '',
        semester: '',
        interests: [],
        nonTechInterests: '',
        experience: '',
        motivation: '',
        linkedin: '',
        github: '',
        portfolio: '',
        referralCode: '',
        profilePhoto: null,
        idPhoto: null
      });
    } catch (error) {
      toast.dismiss();
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
            Join <span className="text-accent">IEDC LBSCEK</span>
          </h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Become part of our innovation ecosystem and turn your ideas into reality. 
            We're looking for passionate students who want to make a difference.
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-4">Academic Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Admission No (Optional)
                  </label>
                  <input
                    type="text"
                    name="admissionNo"
                    value={formData.admissionNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Enter your admission number (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Referral Code *
                  </label>
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Enter referral code"
                  />
                  <p className="text-xs text-text-light mt-2">
                    Don't have one? Get the referral code by joining our
                    <a
                      className="ml-1 text-accent underline"
                      href={import.meta.env.VITE_WHATSAPP_CHANNEL_URL || '#'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp channel
                    </a>
                    .
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  >
                    <option value="">Select your department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Year of Joining *
                  </label>
                  <select
                    name="yearOfJoining"
                    value={formData.yearOfJoining}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  >
                    <option value="">Select your year of joining</option>
                    {joiningYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Current Semester *
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  >
                    <option value="">Select your semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Areas of Interest */}
            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-4">Areas of Interest</h3>
              <p className="text-sm text-text-light mb-4">
                Select the technical areas you're interested in or have experience with (you can select multiple):
              </p>
              <div className="grid md:grid-cols-3 gap-3 mb-6">
                {interestAreas.map(interest => (
                  <label key={interest} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent focus:ring-2"
                    />
                    <span className="text-sm text-text-dark">{interest}</span>
                  </label>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Non-Technical Interests & Hobbies
                </label>
                <textarea
                  name="nonTechInterests"
                  value={formData.nonTechInterests}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="Tell us about your non-technical interests, hobbies, sports, arts, music, etc..."
                />
              </div>
            </div>

            {/* Photo Uploads (temporarily disabled) */}
            {Boolean(import.meta.env.VITE_ENABLE_UPLOADS === 'true') && (<div>
              <h3 className="text-xl font-semibold text-text-dark mb-4">Photo Uploads</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Profile Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      className="hidden"
                      id="profilePhoto"
                    />
                    <label htmlFor="profilePhoto" className="cursor-pointer">
                      {formData.profilePhoto ? (
                        <div className="space-y-2">
                          <img 
                            src={URL.createObjectURL(formData.profilePhoto)} 
                            alt="Profile preview" 
                            className="w-20 h-20 rounded-full mx-auto object-cover"
                          />
                          <p className="text-sm text-accent font-medium">{formData.profilePhoto.name}</p>
                          <p className="text-xs text-text-light">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm text-text-dark">Click to upload profile photo</p>
                          <p className="text-xs text-text-light">JPG, PNG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    ID Card Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'idPhoto')}
                      className="hidden"
                      id="idPhoto"
                    />
                    <label htmlFor="idPhoto" className="cursor-pointer">
                      {formData.idPhoto ? (
                        <div className="space-y-2">
                          <img 
                            src={URL.createObjectURL(formData.idPhoto)} 
                            alt="ID photo preview" 
                            className="w-20 h-20 rounded-lg mx-auto object-cover"
                          />
                          <p className="text-sm text-accent font-medium">{formData.idPhoto.name}</p>
                          <p className="text-xs text-text-light">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm text-text-dark">Click to upload ID card photo</p>
                          <p className="text-xs text-text-light">JPG, PNG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>)}

            {/* Experience & Motivation */}
            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-4">Experience & Motivation</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Describe any relevant experience, projects, or skills you have..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Why do you want to join IEDC? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Tell us why you want to join IEDC and what you hope to achieve..."
                  />
                </div>
              </div>
            </div>

            {/* Online Profiles */}
            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-4">Online Profiles (Optional)</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || formData.referralCode.trim().toUpperCase() !== 'DREAMITDOIT'}
                className="w-full bg-accent text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-text-light">
              <p>
                After submitting your application, our team will review it and contact you within 3-5 business days.
              </p>
              <p className="mt-2">
                Have questions? Contact us at{' '}
                <a href="mailto:iedc@lbscek.ac.in" className="text-accent hover:underline">
                  iedc@lbscek.ac.in
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-accent hover:text-accent-dark transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
