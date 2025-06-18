/**
 * Forms utility for handling newsletter signups and form submissions
 * with Remix JS and Cloudflare Workers
 */

// Mock data store (replace with actual database/KV store later)
let mockNewsletterSubscriptions = [];
let mockSuggestions = [];

/**
 * Validates email format
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates required form fields
 * @param {Object} fields - Object with field names as keys
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} - { isValid: boolean, missingFields: string[] }
 */
export function validateRequiredFields(fields, requiredFields) {
  const missingFields = requiredFields.filter(field => 
    !fields[field] || fields[field].toString().trim() === ''
  );
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Sanitizes form input to prevent XSS
 * @param {string} input 
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Basic XSS prevention
    .slice(0, 10000); // Limit length
}

/**
 * Handles newsletter signup
 * @param {FormData} formData 
 * @returns {Promise<Object>} - { success: boolean, error?: string, data?: Object }
 */
export async function handleNewsletterSignup(formData) {
  try {
    const email = sanitizeInput(formData.get("email"));
    
    // Validate email
    if (!email) {
      return { success: false, error: "Email is required" };
    }
    
    if (!isValidEmail(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }
    
    // Check if email already exists (mock check)
    const existingSubscription = mockNewsletterSubscriptions.find(
      sub => sub.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingSubscription) {
      return { success: false, error: "This email is already subscribed" };
    }
    
    // Create subscription record
    const subscription = {
      id: `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      source: "footer_form",
      status: "active"
    };
    
    // Store subscription (mock storage)
    mockNewsletterSubscriptions.push(subscription);
    
    // TODO: Replace with actual email service integration
    console.log("Newsletter signup:", subscription);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { 
      success: true, 
      data: { 
        id: subscription.id,
        email: subscription.email 
      } 
    };
    
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Handles suggestion form submissions
 * @param {FormData} formData 
 * @returns {Promise<Object>} - { success: boolean, error?: string, data?: Object }
 */
export async function handleSuggestionSubmission(formData) {
  try {
    const submissionType = sanitizeInput(formData.get("submissionType"));
    const name = sanitizeInput(formData.get("name"));
    const email = sanitizeInput(formData.get("email"));
    const social = sanitizeInput(formData.get("social"));
    const content = sanitizeInput(formData.get("content"));
    
    // Validate required fields
    const validation = validateRequiredFields(
      { submissionType, name, email, content },
      ["submissionType", "name", "email", "content"]
    );
    
    if (!validation.isValid) {
      return { 
        success: false, 
        error: `Please fill in all required fields: ${validation.missingFields.join(", ")}` 
      };
    }
    
    // Validate email
    if (!isValidEmail(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }
    
    // Validate submission type
    const validTypes = ["ask", "recipe", "request", "complaint", "feature", "other"];
    if (!validTypes.includes(submissionType)) {
      return { success: false, error: "Invalid submission type" };
    }
    
    // Create suggestion record
    const suggestion = {
      id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: submissionType,
      name,
      email: email.toLowerCase(),
      social: social || null,
      content,
      submittedAt: new Date().toISOString(),
      status: "pending",
      ipAddress: null, // TODO: Get from request headers in Cloudflare
      userAgent: null  // TODO: Get from request headers
    };
    
    // Store suggestion (mock storage)
    mockSuggestions.push(suggestion);
    
    // TODO: Replace with actual database/notification system
    console.log("New suggestion:", suggestion);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { 
      success: true, 
      data: { 
        id: suggestion.id,
        type: suggestion.type,
        submittedAt: suggestion.submittedAt
      } 
    };
    
  } catch (error) {
    console.error("Suggestion submission error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Gets newsletter subscription stats (for admin use)
 * @returns {Object}
 */
export function getNewsletterStats() {
  return {
    total: mockNewsletterSubscriptions.length,
    active: mockNewsletterSubscriptions.filter(sub => sub.status === "active").length,
    recent: mockNewsletterSubscriptions.filter(sub => {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(sub.subscribedAt) > dayAgo;
    }).length
  };
}

/**
 * Gets suggestion stats (for admin use)
 * @returns {Object}
 */
export function getSuggestionStats() {
  const typeStats = mockSuggestions.reduce((acc, suggestion) => {
    acc[suggestion.type] = (acc[suggestion.type] || 0) + 1;
    return acc;
  }, {});
  
  return {
    total: mockSuggestions.length,
    byType: typeStats,
    recent: mockSuggestions.filter(suggestion => {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(suggestion.submittedAt) > dayAgo;
    }).length,
    pending: mockSuggestions.filter(suggestion => suggestion.status === "pending").length
  };
}

/**
 * Helper to extract client IP from Cloudflare request
 * @param {Request} request 
 * @returns {string|null}
 */
export function getClientIP(request) {
  // Cloudflare-specific headers
  return request.headers.get("CF-Connecting-IP") || 
         request.headers.get("X-Forwarded-For") || 
         request.headers.get("X-Real-IP") || 
         null;
}

/**
 * Rate limiting helper (basic implementation)
 * @param {string} identifier - IP or email
 * @param {number} maxAttempts - Max attempts per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} - { allowed: boolean, retryAfter?: number }
 */
export function checkRateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  // TODO: Implement with Cloudflare KV or Durable Objects
  // For now, just allow all requests
  return { allowed: true };
}

// Export mock data getters for debugging (remove in production)
export function getMockData() {
  return {
    newsletters: mockNewsletterSubscriptions,
    suggestions: mockSuggestions
  };
}