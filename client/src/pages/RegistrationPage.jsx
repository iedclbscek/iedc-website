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
    admissionNo: '', // required
    department: '',
    yearOfJoining: '',
    semester: '',
    isLateralEntry: false, // Added for lateral entry students
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
  const [errors, setErrors] = useState({});
  
  // Email verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationField, setShowVerificationField] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Reset email verification if email changes
    if (name === 'email' && isEmailVerified) {
      setIsEmailVerified(false);
      setShowVerificationField(false);
      setVerificationCode('');
    }
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

  // Email verification functions
  const sendVerificationCode = async () => {
    if (!formData.email.trim()) {
      toast.error('Please enter your email address first');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Verification code sent to your email!');
        setShowVerificationField(true);
        setIsEmailVerified(false);
        setVerificationCode('');
        setVerificationAttempts(0);
        
        // Start resend countdown
        setCanResend(false);
        setResendCountdown(60);
        const countdownInterval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    if (verificationAttempts >= 3) {
      toast.error('Too many failed attempts. Please request a new code.');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email.trim(),
          code: verificationCode.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Email verified successfully!');
        setIsEmailVerified(true);
        setShowVerificationField(false);
        setVerificationCode('');
      } else {
        setVerificationAttempts(prev => prev + 1);
        toast.error(data.message || 'Invalid verification code');
        
        if (verificationAttempts >= 2) {
          toast.error('Last attempt! Please request a new code if needed.');
        }
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!isEmailVerified) newErrors.email = "Email must be verified";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.admissionNo.trim()) newErrors.admissionNo = "Admission number is required";
    if (!formData.referralCode.trim()) newErrors.referralCode = "Referral code is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.yearOfJoining.trim()) newErrors.yearOfJoining = "Year of joining is required";
    if (!formData.semester.trim()) newErrors.semester = "Semester is required";
    if (!formData.motivation.trim()) newErrors.motivation = "Motivation is required";
    
    // Character limit validations
    if (formData.nonTechInterests && formData.nonTechInterests.length > 500) {
      newErrors.nonTechInterests = "Non-technical interests cannot exceed 500 characters";
    }
    if (formData.experience && formData.experience.length > 1000) {
      newErrors.experience = "Experience description cannot exceed 1000 characters";
    }
    if (formData.motivation && formData.motivation.length > 1000) {
      newErrors.motivation = "Motivation cannot exceed 1000 characters";
    }
    if (formData.linkedin && formData.linkedin.length > 200) {
      newErrors.linkedin = "LinkedIn URL cannot exceed 200 characters";
    }
    if (formData.github && formData.github.length > 200) {
      newErrors.github = "GitHub URL cannot exceed 200 characters";
    }
    if (formData.portfolio && formData.portfolio.length > 200) {
      newErrors.portfolio = "Portfolio URL cannot exceed 200 characters";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if email is verified
    if (!isEmailVerified) {
      toast.error('Please verify your email address before submitting');
      return;
    }
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      toast.error('Phone number must be exactly 10 digits.');
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
      
      // Reset verification states
      setIsEmailVerified(false);
      setShowVerificationField(false);
      setVerificationCode('');
      setVerificationAttempts(0);
    } catch (error) {
      toast.dismiss();
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-24 pb-8 sm:pb-16 px-3 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-text-dark mb-3 sm:mb-4 px-2">
            Join <span className="text-accent">IEDC LBSCEK</span>
          </h1>
          <p className="text-base sm:text-lg text-text-light max-w-2xl mx-auto px-4">
            Become part of our innovation ecosystem and turn your ideas into reality. 
            We're looking for passionate students who want to make a difference.
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-3 sm:mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Email *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base ${
                        isEmailVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {!isEmailVerified && (
                      <button
                        type="button"
                        onClick={sendVerificationCode}
                        disabled={isSendingCode || !canResend || !formData.email.trim()}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base whitespace-nowrap"
                      >
                        {isSendingCode ? 'Sending...' : canResend ? 'Verify Email' : `Resend (${resendCountdown}s)`}
                      </button>
                    )}
                  </div>
                  
                  {/* Email verification status */}
                  {isEmailVerified && (
                    <div className="flex items-center mt-2 text-green-600">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium">Email verified successfully!</span>
                    </div>
                  )}
                  
                  {/* Verification code field */}
                  {showVerificationField && !isEmailVerified && (
                    <div className="mt-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-end">
                        <div className="flex-1 w-full">
                          <label className="block text-xs sm:text-sm font-medium text-blue-800 mb-2">
                            Enter verification code sent to your email
                          </label>
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            maxLength="6"
                            className="w-full px-3 sm:px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={verifyCode}
                          disabled={isVerifying || !verificationCode.trim()}
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                        >
                          {isVerifying ? 'Verifying...' : 'Verify Code'}
                        </button>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        Check your email for the verification code. Didn't receive it? 
                        {canResend ? (
                          <button
                            type="button"
                            onClick={sendVerificationCode}
                            className="text-blue-800 underline ml-1 hover:text-blue-900"
                          >
                            Resend code
                          </button>
                        ) : (
                          <span className="ml-1">Wait {resendCountdown}s to resend</span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-3 sm:mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Admission No *
                  </label>
                  <input
                    type="text"
                    name="admissionNo"
                    value={formData.admissionNo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter your admission number"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base"
                  >
                    <option value="">Select your year of joining</option>
                    {joiningYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Current Semester *
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base"
                  >
                    <option value="">Select your semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                {/* Lateral Entry Checkbox */}
                <div className="sm:col-span-2">
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="isLateralEntry"
                      name="isLateralEntry"
                      checked={formData.isLateralEntry}
                      onChange={(e) => setFormData({
                        ...formData,
                        isLateralEntry: e.target.checked
                      })}
                      className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                    />
                    <label htmlFor="isLateralEntry" className="ml-2 block text-sm font-medium text-text-dark">
                      I am a lateral entry student
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Check this box if you joined through lateral entry scheme (directly to a higher semester)
                  </p>
                </div>
              </div>
            </div>

            {/* Areas of Interest */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-3 sm:mb-4">Areas of Interest</h3>
              <p className="text-xs sm:text-sm text-text-light mb-3 sm:mb-4">
                Select the technical areas you're interested in or have experience with (you can select multiple):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {interestAreas.map(interest => (
                  <label key={interest} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent focus:ring-2"
                    />
                    <span className="text-xs sm:text-sm text-text-dark">{interest}</span>
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
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base ${
                    errors.nonTechInterests ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about your non-technical interests, hobbies, sports, arts, music, etc..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.nonTechInterests && (
                    <span className="text-red-500 text-xs sm:text-sm">{errors.nonTechInterests}</span>
                  )}
                  <span className={`text-xs sm:text-sm ${formData.nonTechInterests.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {formData.nonTechInterests.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Photo Uploads (temporarily disabled) */}
            {Boolean(import.meta.env.VITE_ENABLE_UPLOADS === 'true') && (<div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-3 sm:mb-4">Photo Uploads</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Profile Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-accent transition-colors">
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
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto object-cover"
                          />
                          <p className="text-xs sm:text-sm text-accent font-medium break-all">{formData.profilePhoto.name}</p>
                          <p className="text-xs text-text-light">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-xs sm:text-sm text-text-dark">Click to upload profile photo</p>
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-accent transition-colors">
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
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg mx-auto object-cover"
                          />
                          <p className="text-xs sm:text-sm text-accent font-medium break-all">{formData.idPhoto.name}</p>
                          <p className="text-xs text-text-light">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-xs sm:text-sm text-text-dark">Click to upload ID card photo</p>
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
              <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-3 sm:mb-4">Experience & Motivation</h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe any relevant experience, projects, or skills you have..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.experience && (
                      <span className="text-red-500 text-xs sm:text-sm">{errors.experience}</span>
                    )}
                    <span className={`text-xs sm:text-sm ${formData.experience.length > 900 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {formData.experience.length}/1000
                    </span>
                  </div>
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
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.motivation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us why you want to join IEDC and what you hope to achieve..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.motivation && (
                      <span className="text-red-500 text-xs sm:text-sm">{errors.motivation}</span>
                    )}
                    <span className={`text-xs sm:text-sm ${formData.motivation.length > 900 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {formData.motivation.length}/1000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Profiles */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-3 sm:mb-4">Online Profiles (Optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.linkedin ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.linkedin && (
                      <span className="text-red-500 text-xs sm:text-sm">{errors.linkedin}</span>
                    )}
                    <span className={`text-xs sm:text-sm ${formData.linkedin.length > 180 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {formData.linkedin.length}/200
                    </span>
                  </div>
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
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.github ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://github.com/yourusername"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.github && (
                      <span className="text-red-500 text-xs sm:text-sm">{errors.github}</span>
                    )}
                    <span className={`text-xs sm:text-sm ${formData.github.length > 180 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {formData.github.length}/200
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.portfolio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://yourportfolio.com"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.portfolio && (
                      <span className="text-red-500 text-xs sm:text-sm">{errors.portfolio}</span>
                    )}
                    <span className={`text-xs sm:text-sm ${formData.portfolio.length > 180 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {formData.portfolio.length}/200
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            {!isEmailVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start sm:items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="text-yellow-800 font-medium text-sm sm:text-base">
                      Email verification required before submission
                    </span>
                    <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                      Please verify your email address using the verification code sent to your inbox.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !isEmailVerified || formData.referralCode.trim().toUpperCase() !== 'DREAMITDOIT'}
                className="w-full bg-accent text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold text-base sm:text-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : !isEmailVerified ? 'Verify Email First' : 'Submit Application'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-xs sm:text-sm text-text-light space-y-2">
              <p>
                After submitting your application, our team will review it and contact you within 3-5 business days.
              </p>
              <p>
                Have questions? Contact us at{' '}
                <a href="mailto:iedc@lbscek.ac.in" className="text-accent hover:underline">
                  iedc@lbscek.ac.in
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-accent hover:text-accent-dark transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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