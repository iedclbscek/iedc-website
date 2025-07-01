console.log("🌍 Frontend Environment Check:");
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("Full API URL:", `${import.meta.env.VITE_API_URL}/api`);
console.log("Login URL:", `${import.meta.env.VITE_API_URL}/api/auth/login`);

// Test if the environment variable is loaded
if (import.meta.env.VITE_API_URL) {
  console.log("✅ Environment variable loaded successfully");
} else {
  console.log("❌ Environment variable not loaded");
}
