export const userValidation = (data) => {
  const errors = {};

  const name = data.name?.trim() || "";
  const username = data.username?.trim() || "";
  const email = data.email?.trim().toLowerCase() || "";
  const password = data.password || "";

  // Name validation
  if (!name) {
    errors.name = "Name is required";
  } else if (name.length > 100) {
    errors.name = "Name must be less than 100 characters";
  }

  // Username validation
  if (!username) {
    errors.username = "Username is required";
  } else if (username.length < 3 || username.length > 30) {
    errors.username = "Username must be between 3 and 30 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username =
      "Username can only contain letters, numbers, and underscores";
  }

  // Email validation
  if (!email) {
    errors.email = "Email is required";
  } else if (email.length > 254) {
    errors.email = "Email is too long";
  } else if (
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
  ) {
    errors.email = "Invalid email format";
  }

  // Password validation
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/.test(password)
  ) {
    errors.password =
      "Password must include uppercase, lowercase, number, and special character";
  }

  return errors;
};
