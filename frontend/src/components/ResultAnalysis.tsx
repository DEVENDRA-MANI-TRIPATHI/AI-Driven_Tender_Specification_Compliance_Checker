import React from "react";

interface ResultAnalysisProps {
  result: any;
  onBack: () => void;
}

const ResultAnalysis: React.FC<ResultAnalysisProps> = ({ result, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Document Comparison Result
      </h2>

      {/* Summary */}
      {result?.summary && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Summary</h3>
          <p className="text-gray-600 bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
            {result.summary}
          </p>
        </div>
      )}

      {/* Details */}
      {result?.details && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Details</h3>
          <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
            {typeof result.details === "string" ? (
              result.details
            ) : (
              <pre>{JSON.stringify(result.details, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {/* Raw fallback */}
      {!result?.summary && !result?.details && (
        <div className="bg-yellow-50 p-4 rounded-md text-gray-600">
          <p>No structured output received. Showing raw response:</p>
          <pre className="mt-2 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Back button */}
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
