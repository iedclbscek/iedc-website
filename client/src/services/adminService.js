import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch all registrations for admin dashboard with pagination
 * @param {Object} params - Pagination and filter parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.status - Filter by status
 * @param {string} params.department - Filter by department
 * @param {string} params.search - Search term
 * @returns {Promise<Object>} - Object containing data and pagination info
 */
export const fetchRegistrations = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.department) queryParams.append("department", params.department);
    if (params.search) queryParams.append("search", params.search);

    const response = await api.get(`/registrations?${queryParams.toString()}`);
    return response.data; // Returns { success: true, data: [...], pagination: {...} }
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch registrations"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to fetch registrations. Please try again.");
    }
  }
};

/**
 * Update registration status (approve/reject)
 * @param {string} registrationId - The registration ID
 * @param {string} status - New status (approved/rejected)
 * @returns {Promise<Object>} - Response from the server
 */
export const updateRegistrationStatus = async (registrationId, status) => {
  try {
    const response = await api.put(`/registrations/${registrationId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update status");
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to update status. Please try again.");
    }
  }
};

/**
 * Delete a registration
 * @param {string} registrationId - The registration ID to delete
 * @returns {Promise<Object>} - Response from the server
 */
export const deleteRegistration = async (registrationId) => {
  try {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to delete registration"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to delete registration. Please try again.");
    }
  }
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} - Dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch stats");
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to fetch stats. Please try again.");
    }
  }
};
