const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create axios-like request function
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Execom API Service
export const execomService = {
  // Get execom profile
  getProfile: async () => {
    return apiRequest("/execom/profile");
  },

  // Update execom profile
  updateProfile: async (profileData) => {
    return apiRequest("/execom/profile", {
      method: "PUT",
      body: profileData,
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest("/execom/password", {
      method: "PUT",
      body: passwordData,
    });
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    return apiRequest("/execom/dashboard-stats");
  },

  // Get personalized roadmap
  getRoadmap: async () => {
    return apiRequest("/execom/roadmap");
  },

  // Approve execom call response
  approveExecomCall: async (membershipId, displayOrder) => {
    return apiRequest(`/registrations/execom/approve/${membershipId}`, {
      method: "POST",
      body: { displayOrder },
    });
  },

  // Get execom call responses
  getExecomCallResponses: async () => {
    return apiRequest("/registrations/execom/responses");
  },
};

// Admin service extensions for execom approval
export const adminService = {
  ...execomService,

  // Get all registrations (admin only)
  getRegistrations: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/registrations${queryParams ? `?${queryParams}` : ""}`;
    return apiRequest(url);
  },

  // Update user display order
  updateUserDisplayOrder: async (userId, displayOrder, teamYear) => {
    return apiRequest(`/users/${userId}/display-order`, {
      method: "PUT",
      body: { displayOrder, teamYear },
    });
  },
};

export default execomService;
