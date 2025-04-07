import React from "react";

interface ResultAnalysisProps {
  result: any;
  onBack: () => void;
}

const ResultAnalysis: React.FC<ResultAnalysisProps> = ({ result, onBack }) => {
  const { summary, details, complianceStatus, matchPercentage } = result || {};

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-gray-800 shadow-2xl rounded-2xl text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Document Comparison Result
      </h2>

      {(complianceStatus || matchPercentage) && (
        <div className="mb-6 text-center">
          <p className="text-lg font-medium">
            ✅ Compliance Status:{" "}
            <span className="font-semibold text-green-400">{complianceStatus}</span>
          </p>
          <p className="text-md text-gray-300">
            📊 Match Percentage:{" "}
            <span className="font-semibold">{matchPercentage}%</span>
          </p>
        </div>
      )}

      {summary && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Summary</h3>
          <p className="text-gray-200 bg-gray-700 p-4 rounded-md whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}

      {details && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Details</h3>

          {details.compliant?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-green-400 mb-2">✅ Compliant</h4>
              <ul className="list-disc pl-6 text-gray-200">
                {details.compliant.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {details.nonCompliant?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-red-400 mb-2">❌ Non-Compliant</h4>
              <ul className="list-disc pl-6 text-gray-200">
                {details.nonCompliant.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {details.partiallyCompliant?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Partially Compliant</h4>
              <ul className="list-disc pl-6 text-gray-200">
                {details.partiallyCompliant.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!summary && !details && (
        <div className="bg-yellow-100/10 p-4 rounded-md text-yellow-200 border border-yellow-400/40">
          <p>No structured output received. Showing raw response:</p>
          <pre className="mt-2 bg-gray-700 p-3 rounded text-sm overflow-x-auto text-gray-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
        >
          Back to Upload
        </button>
      </div>
    </div>
  );
};

export default ResultAnalysis;
