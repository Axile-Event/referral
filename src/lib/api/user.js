import client from "./client";

export const userApi = {
  // POST /logout/ — { "refresh" }
  logout: (refresh) => client.post("/logout/", { refresh }),

  // GET/PATCH /referee/profile/ — profile
  getProfile: () => client.get("/referee/profile/"),
  updateProfile: (data) => client.patch("/referee/profile/", data),

  // Password reset: /password/reset/, etc.
  resetPassword: (email) => client.post("/password/reset/", { email }),

  // Referee password change (authenticated): POST /password/change/
  changePassword: (old_password, new_password) => 
    client.post("/password/change/", { old_password, new_password }),

  // Referee PIN:
  // POST /referee/pin/
  setPin: (pin) => client.post("/referee/pin/", { pin }),

  // POST /referee/verify-pin/
  verifyPin: (pin) => client.post("/referee/verify-pin/", { pin }),

  // POST /referee/forgot-pin/
  forgotPin: () => client.post("/referee/forgot-pin/"),

  // POST /referee/change-pin/
  changePin: (old_pin, new_pin) => 
    client.post("/referee/change-pin/", { old_pin, new_pin }),
};
