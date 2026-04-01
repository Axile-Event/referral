/**
 * Auth Data Transformer
 * Transforms form data to match API field naming conventions
 */

/**
 * Transform signup form data to API format (capitalize field names)
 */
export const transformSignupData = (formData) => {
  return {
    username: formData.username,
    Firstname: formData.firstname,
    Lastname: formData.lastname,
    Email: formData.email,
    Password: formData.password,
    ...(formData.phone && { Phone: formData.phone }),
  };
};

/**
 * Transform login form data to API format
 */
export const transformLoginData = (email, password) => {
  return {
    Email: email,
    email: email,       // Greediness check
    Username: email,    // Some backends use Username even for email login
    username: email,    // Some backends use username even for email login
    Password: password,
    password: password  // Greediness check
  };
};

/**
 * Transform OTP verification data to API format (capitalized per backend convention)
 */
export const transformOtpData = (email, otp) => {
  return {
    Email: email,
    email: email, // Greediness check
    otp: otp,
    OTP: otp,     // Greediness check
  };
};

/**
 * Normalize user profile data from backend
 * Ensures consistent first name capture by combining Firstname and Lastname into a 'name' field
 */
export const normalizeUserProfile = (apiResponse) => {
  if (!apiResponse) {
    console.warn("normalizeUserProfile: apiResponse is null or undefined");
    return null;
  }

  // Handle wrapped response: { message: "...", profile: { ... } }
  const profile = apiResponse.profile || apiResponse;

  const {
    Firstname = "",
    Lastname = "",
    firstname = "",
    lastname = "",
    full_name = "",
    name = "",
    username = "",
    Username = "",
    email = "",
    Email = "",
    ...rest
  } = profile;

  // Determine the first name (try Firstname first, then firstname)
  const firstName = Firstname || firstname || "";
  const lastName = Lastname || lastname || "";
  
  // Create combined name field for dashboard display
  const combinedName = name || full_name || (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || username || Username || "Partner");

  const normalized = {
    ...rest,
    Firstname: firstName,
    Lastname: lastName,
    firstname: firstName,
    lastname: lastName,
    name: combinedName, // Add this for easy access in dashboard
    username: username || Username || email || Email,
    email: email || Email,
  };

  console.log("normalizeUserProfile - Input:", profile);
  console.log("normalizeUserProfile - Output:", normalized);

  return normalized;
};
