/**
 * Friendly & playful Manglish (Malayalam written in English script) messages
 * for ResortHub authentication.
 */
export const authMessages = {
  // Missing inputs
  missingFields: {
    manglish: "Ellam fill cheytheettu po mone! 😅 Form ninne wait cheyyuvaa.",
    english: "Please fill in all the required fields."
  },
  
  // Missing email or password
  missingLoginFields: {
    manglish: "Email-um password-um type cheyyande chetta? 🧐 Veruthe click cheythal enganeya!",
    english: "Please enter both your email address and password."
  },

  // Invalid email format
  invalidEmail: {
    manglish: "Ithu valid aaya email aano machaane? 🤔 Check cheythu nokku!",
    english: "Please provide a valid email format."
  },

  // Weak password (< 8 chars)
  weakPassword: {
    manglish: "Ithentha password aano, kunjikka? 😭 Kurachu koode strong aakku (at least 8 characters)!",
    english: "Password must be at least 8 characters long."
  },

  // Password confirmation mismatch
  passwordMismatch: {
    manglish: "Randum match aavunnillallo aliya! 😵‍💫 Password onnude correct aayi type cheyy!",
    english: "Passwords do not match. Please verify and re-enter."
  },

  // Invalid credentials (wrong password or unlisted user)
  invalidCredentials: {
    manglish: "Ayyoo! Emailum passwordum thammil oru poruthakked undallo 😂",
    english: "Invalid email or password credentials."
  },

  // Duplicate email account
  duplicateEmail: {
    manglish: "Edaa, nee ivide already member aanallo! 😏 Login cheythu vaa!",
    english: "An account with this email address already exists. Please sign in."
  },

  // Server or network connection failure
  networkError: {
    manglish: "Ayyo! Server-umayi connection poyallo 😴 Kurachu kazhinju try cheyyu.",
    english: "Unable to reach server. Please check your connection and try again."
  },

  // Rate limiting
  rateLimited: {
    manglish: "Nee kurachu fast aayippoyi! 🏃‍♂️ 15 minute kazhinju try cheyyu kuttoo.",
    english: "Too many attempts. Please try again after 15 minutes."
  },

  // Successful registration
  registerSuccess: {
    manglish: "Pwoli! 🎉 ResortHub family-ilekku swagatham!",
    english: "Account created successfully! Redirecting you to sign in..."
  },

  // Successful login
  loginSuccess: {
    manglish: "Adipoli! 🌴 Kannur-ilekku varavelkkunnu!",
    english: "Welcome back! Entering your curated collection..."
  }
};

/**
 * Helper to map backend error messages or codes to funny Manglish responses
 */
export const getManglishErrorMessage = (error) => {
  if (!error) return null;
  const message = (typeof error === 'string' ? error : error.message || '').toLowerCase();

  if (message.includes('already exists') || message.includes('duplicate') || message.includes('409')) {
    return authMessages.duplicateEmail;
  }
  if (message.includes('invalid email or password') || message.includes('credentials') || message.includes('401')) {
    return authMessages.invalidCredentials;
  }
  if (message.includes('at least 8 characters') || message.includes('weak') || message.includes('short')) {
    return authMessages.weakPassword;
  }
  if (message.includes('match') || message.includes('mismatch')) {
    return authMessages.passwordMismatch;
  }
  if (message.includes('required') || message.includes('fill in all') || message.includes('provide both')) {
    return authMessages.missingFields;
  }
  if (message.includes('too many') || message.includes('rate limit')) {
    return authMessages.rateLimited;
  }
  if (message.includes('network') || message.includes('failed to fetch') || message.includes('502') || message.includes('connection')) {
    return authMessages.networkError;
  }

  // Default friendly fallback
  return {
    manglish: "Ayyeda, entho oru prashnam undallo! 😅 Onnude nokkiyittu cheyyu.",
    english: typeof error === 'string' ? error : error.message || "An error occurred."
  };
};
