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
 * Transform password reset data (forgot password flow)
 */
export const transformResetPasswordData = (email, otp, newPassword, uid, token) => {
  // If we have UID/Token (standard Django style), use that format
  if (uid && token) {
    return {
      uid: uid,
      token: token,
      new_password: newPassword,
      new_password1: newPassword,
      new_password2: newPassword,
    };
  }

  // If no UID/Token (simple OTP flow), use the project's default capitalized convention
  return {
    email: email,
    Email: email,
    otp: otp,
    OTP: otp,
    Password: newPassword,
    password: newPassword,
    new_password: newPassword,
    confirm_password: newPassword, // Fixed "Field is required" error
    ConfirmPassword: newPassword,
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

  // Handle wrapped response: { message: "...", profile: { ... }, referree_id: "..." }
  // We want to extract the profile data but also keep any other top-level fields
  const profile = apiResponse.profile || apiResponse.user || apiResponse.data || apiResponse;
  
  // If apiResponse is wrapped, we want to make sure fields like referree_id from the top level are preserved
  const topLevelFields = (apiResponse.profile || apiResponse.user || apiResponse.data) ? apiResponse : {};

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
    ...topLevelFields, // Keep original top-level fields if wrapped
    ...rest,
    Firstname: firstName,
    Lastname: lastName,
    firstname: firstName,
    lastname: lastName,
    name: combinedName,
    username: username || Username || email || Email,
    email: email || Email,
  };

  // Clean up to prevent recursive profile/user/data keys after normalization
  delete normalized.profile;
  delete normalized.user;
  delete normalized.data;

  console.log("normalizeUserProfile - Input:", apiResponse);
  console.log("normalizeUserProfile - Output:", normalized);

  return normalized;
};
