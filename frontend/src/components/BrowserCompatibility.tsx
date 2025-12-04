import { useEffect, useState } from "react";

export function BrowserCompatibility() {
  const [compatible, setCompatible] = useState(true);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const detectedIssues: string[] = [];

    // Check for localStorage support
    if (typeof window === 'undefined' || !window.localStorage) {
      detectedIssues.push("localStorage is not supported in this browser");
    }

    // Check for fetch API support
    if (typeof window === 'undefined' || !window.fetch) {
      detectedIssues.push("Fetch API is not supported in this browser");
    }

    // Check for ES6 features
    try {
      new Function("class Test {}");
      new Function("const test = () => {}");
      new Function("const { test } = {}");
    } catch {
      detectedIssues.push("This browser doesn't support modern JavaScript features");
    }

    // Check for touch events (mobile compatibility)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      // This is just informational, not an error
      console.log("Not a touch device");
    }

    setIssues(detectedIssues);
    setCompatible(detectedIssues.length === 0);
  }, []);

  if (compatible) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <p className="font-medium">⚠️ Browser Compatibility Issues Detected</p>
      <ul className="text-sm mt-2 list-disc list-inside">
        {issues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
      <p className="text-sm mt-2">
        For the best experience, please use a modern browser like Chrome, Firefox, Safari, or Edge.
      </p>
    </div>
  );
}