/**
 * Auth Data Transformer
 * Transforms form data to match API field naming conventions
 */

/**
 * Transform signup form data to API format (capitalize field names)
 */
export const transformSignupData = (formData) => {
  return {
    Username: formData.username,
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
export const transformLoginData = (formData) => {
  return {
    email: formData.email,
    password: formData.password,
  };
};

/**
 * Transform OTP verification data to API format (capitalized per backend convention)
 */
export const transformOtpData = (email, otp) => {
  return {
    Email: email,
    OTP: otp,
  };
};
