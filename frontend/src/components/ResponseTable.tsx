import { useState, useEffect } from "react";
import axios from "axios";

type Row = {
  specification: string;
  reference: string;
  user: string;
  status: string;
  feedback?: string;
};

type ResponseTableProps = {
  data?: Row[];
  comparisonId: string;
};

const ResponseTable: React.FC<ResponseTableProps> = ({ data, comparisonId }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

  const handleFeedbackSubmit = async () => {
    if (selectedIndex === null) return;
    const row = rows[selectedIndex];

    try {
      await axios.post(`http://localhost:8000/api/v1/document/${comparisonId}/feedback`, {
        specification: row.specification,
        reference: row.reference,
        user: row.user,
        status: row.status,
        reason: feedbackText,
      });

      const updated = [...rows];
      updated[selectedIndex].feedback = feedbackText;
      setRows(updated);
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setSelectedIndex(null);
        setFeedbackText("");
        setFeedbackSubmitted(false);
      }, 1500);
    } catch (error) {
      console.error("Feedback submission failed:", error);
      alert("Error submitting feedback.");
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-800 rounded shadow p-4 relative">
      <table className="min-w-full border text-white">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="p-2">Specification</th>
            <th className="p-2">Reference</th>
            <th className="p-2">User</th>
            <th className="p-2">Result</th>
            <th className="p-2">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-600">
              <td className="p-2">{row.specification}</td>
              <td className="p-2">{row.reference}</td>
              <td className="p-2">{row.user}</td>
              <td className="p-2">{row.status}</td>
              <td className="p-2">
                <button
                  onClick={() => {
                    setSelectedIndex(i);
                    setFeedbackText(row.feedback || "");
                  }}
                  className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"
                >
                  Provide Feedback
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Provide Feedback</h2>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Specification:</strong> {rows[selectedIndex].specification}
            </p>

            {feedbackSubmitted ? (
              <div className="text-green-400 text-center text-lg">✅ Feedback submitted!</div>
            ) : (
              <>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded mb-4"
                  placeholder="Write your feedback..."
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedIndex(null);
                      setFeedbackText("");
                      setFeedbackSubmitted(false);
                    }}
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseTable;
