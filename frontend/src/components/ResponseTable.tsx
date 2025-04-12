import { useState, useEffect } from "react";

type Row = {
  specification: string;
  reference: string;
  user: string;
  status: string;
  feedback?: string;
};

type ResponseTableProps = {
  data?: Row[];
};

const ResponseTable: React.FC<ResponseTableProps> = ({ data }) => {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

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
              <td className="p-2">{row.status}</td>
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
