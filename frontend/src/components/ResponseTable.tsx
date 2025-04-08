import { useState } from "react";

type Row = {
  specification: string;
  reference: string;
  user: string;
  result: string;
  feedback?: string;
};

const dummyData: Row[] = [
  {
    specification: "Speed",
    reference: "120 km/h",
    user: "110 km/h",
    result: "Incorrect",
  },
  {
    specification: "Color",
    reference: "Red",
    user: "Red",
    result: "Correct",
  },
  {
    specification: "Size",
    reference: "15 cm",
    user: "12 cm",
    result: "Incorrect",
  },
];

const ResponseTable = () => {
  const [rows, setRows] = useState<Row[]>(dummyData);

  const updateFeedback = (index: number, feedback: string) => {
    const updated = [...rows];
    updated[index].feedback = feedback;
    setRows(updated);
  };

  return (
    <div className="overflow-x-auto bg-gray-800 rounded shadow p-4">
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
              <td className="p-2">{row.result}</td>
              <td className="p-2">
                <input
                type="text"
                value={row.feedback || ""}
                onChange={(e) => updateFeedback(i, e.target.value)}
                className="border rounded px-2 py-1 w-full bg-gray-900 text-white border-gray-600"
                placeholder="Provide feedback"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseTable;
