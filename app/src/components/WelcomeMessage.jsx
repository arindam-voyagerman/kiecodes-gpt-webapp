import React from "react";
// import { HiAcademicCap } from "react-icons/hi";

export default function WelcomeMessage({ onQuickAction }) {
  const quickActions = [
    "School hours and schedule",
    "Admissions information",
    "Upcoming events",
    "Contact information",
    "Academic programs",
    "School policies",
  ];

  return (
    <div className="welcome-message">
      <div className="flex justify-center mb-4">
        {/* <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <HiAcademicCap className="w-8 h-8 text-blue-600" />
                </div> */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <img
            src="https://dvuu6f878vjbe.cloudfront.net/public/logo/logo.webp"
            alt="School Logo"
            className="w-8 h-8 text-blue-600"
          />
        </div>
      </div>
      <h2>Welcome to Newtown School!</h2>
      <p>
        I'm your AI assistant, here to help you find information about our
        school. You can ask me about admissions, schedules, events, programs,
        and more.
      </p>
      <p className="text-sm opacity-75 mb-6">
        Try one of these common questions to get started:
      </p>
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="quick-action"
            onClick={() => onQuickAction(action)}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
