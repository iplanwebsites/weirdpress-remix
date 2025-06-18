import type { MetaFunction, ActionFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { appConfig } from "~/appConfig";

export const meta: MetaFunction = () => {
  return [
    { title: `Suggest - ${appConfig.siteName} 🦝 🍜` },
    { name: "description", content: `Submit a recipe or make a request to ${appConfig.siteName}!` },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const submissionType = formData.get("submissionType");
  const name = formData.get("name");
  const email = formData.get("email");
  const social = formData.get("social");
  const content = formData.get("content");

  // Basic validation
  if (!name || !email || !content || !submissionType) {
    return json({ 
      error: "Please fill in all required fields" 
    }, { status: 400 });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.toString())) {
    return json({ 
      error: "Please enter a valid email address" 
    }, { status: 400 });
  }

  // Here you would typically send this data to your backend/database
  // For now, we'll just log it and return success
  console.log("New submission:", {
    type: submissionType,
    name,
    email,
    social,
    content
  });

  // Special handling for recipe research requests
  if (submissionType === "ask") {
    console.log("Recipe research request received - will be added to research queue");
  }

  return json({ success: true });
};

export default function Suggest() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [submissionType, setSubmissionType] = useState("ask");

  const submissionTypes = [
    { value: "ask", label: "Ask for a Recipe" },
    { value: "recipe", label: "Suggest a Recipe" },
    { value: "request", label: "Recipe Request" },
    { value: "complaint", label: "Complaint" },
    { value: "feature", label: "Feature Idea" },
    { value: "other", label: "Other" }
  ];

  if (actionData?.success) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-green-800 mb-4">
              Thank you for your submission! 🎉
            </h1>
            <p className="text-green-700 mb-6">
              We've received your submission and will get back to you soon.
            </p>
            <a 
              href="/" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Share with {appConfig.siteName}
          </h1>
          <p className="text-lg text-gray-600">
            Have a recipe to share? Need help finding something? We'd love to hear from you!
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <Form method="post" className="space-y-6">
            {/* Submission Type */}
            <div>
              <label htmlFor="submissionType" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to do? *
              </label>
              <select
                id="submissionType"
                name="submissionType"
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {submissionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              
              {/* Info for Ask for a Recipe */}
              {submissionType === "ask" && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>How it works:</strong> Tell us what recipe you'd like us to research and create. 
                    We'll do the work to find the best version, test it, and share it with you when it's ready!
                  </p>
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Social */}
            <div>
              <label htmlFor="social" className="block text-sm font-medium text-gray-700 mb-2">
                Social Media Handle
                <span className="text-gray-500 text-sm ml-1">(optional)</span>
              </label>
              <input
                type="text"
                id="social"
                name="social"
                placeholder="@username or profile URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                {submissionType === "ask" && "What recipe would you like us to research? *"}
                {submissionType === "recipe" && "Recipe Details *"}
                {submissionType === "request" && "What are you looking for? *"}
                {submissionType === "complaint" && "Tell us what's wrong *"}
                {submissionType === "feature" && "Describe your idea *"}
                {submissionType === "other" && "Your message *"}
              </label>
              <textarea
                id="content"
                name="content"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  submissionType === "ask"
                    ? "Tell us what recipe you'd like us to research and create for you! For example:\n\n- 'Authentic Italian carbonara recipe'\n- 'Grandma's chocolate chip cookies from the 1950s'\n- 'Traditional Korean kimchi jjigae'\n- 'Gluten-free sourdough bread'\n\nBe as specific as possible about what you're looking for!"
                  : submissionType === "recipe" 
                    ? "Share your recipe here! Markdown formatting is supported.\n\n## Ingredients\n- 2 cups flour\n- 1 cup sugar\n\n## Instructions\n1. Mix ingredients...\n2. Bake at 350°F..."
                    : "Tell us more about your request..."
                }
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                💡 Markdown formatting is supported for better formatting
              </p>
            </div>

            {/* Error Message */}
            {actionData?.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700">{actionData.error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </Form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">📝 Tips for better submissions:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• For recipes: Include ingredients, instructions, and any special tips</li>
            <li>• Use markdown formatting for better readability (## headings, - lists, etc.)</li>
            <li>• Be specific in your requests - the more detail, the better we can help</li>
            <li>• Include your social handle if you'd like credit for recipe contributions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}