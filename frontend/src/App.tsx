import { useState } from "react";
import DocumentInput from "./components/DocumentInput";
import ResultAnalysis from "./components/ResultAnalysis";

function App() {
  const [result, setResult] = useState<any>(null);

  const handleCompare = (comparisonResult: any) => {
    setResult(comparisonResult);
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {result ? (
          <ResultAnalysis result={result} onBack={handleBack} />
        ) : (
          <DocumentInput onCompare={handleCompare} />
        )}
      </div>
    </div>
  );
}

export default App;
