export const userValidation = (data) => {
  const errors = {};

  if (!data.username.trim()) {
    errors.username = "Username is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};
