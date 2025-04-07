import { useState } from "react";
import DocumentInput from "./components/DocumentInput";
import ResultAnalysis from "./components/ResultAnalysis";

function App() {
  const [result, setResult] = useState<any>(null);

  const handleCompare = async (comparisonResult: any) => {
    setResult(comparisonResult);
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {result ? (
        <ResultAnalysis result={result} onBack={handleBack} />
      ) : (
        <DocumentInput onCompare={handleCompare} />
      )}
    </div>
  );
}

export default App;
