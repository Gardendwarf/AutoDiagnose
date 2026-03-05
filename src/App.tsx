import React, { useState } from "react";
import { 
  Car, 
  Search, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Loader2,
  ChevronRight,
  History,
  Settings2
} from "lucide-react";
import { decodeVinAndDiagnose, type DiagnosticResult, type VehicleInfo } from "./services/geminiService";
import Markdown from "react-markdown";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FullDiagnosticResponse {
  vehicleInfo: VehicleInfo;
  diagnostic: DiagnosticResult;
  summary: string;
}

export default function App() {
  const [vin, setVin] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FullDiagnosticResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin || !symptoms) return;

    setLoading(true);
    setError(null);
    try {
      const data = await decodeVinAndDiagnose(vin, symptoms);
      setResult(data);
    } catch (err) {
      setError("An error occurred while diagnosing. Please check your VIN and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#141414] p-2 rounded-sm">
            <Wrench className="w-6 h-6 text-[#E4E3E0]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">AutoDiagnose AI</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono italic">Expert Mechanical Diagnostic System v1.0</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors border border-transparent hover:border-[#141414]">
            <History className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors border border-transparent hover:border-[#141414]">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#141414] p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <h2 className="font-serif italic text-lg mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Vehicle Information
            </h2>
            <form onSubmit={handleDiagnose} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono mb-1 opacity-60">VIN (Vehicle Identification Number)</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder="Enter 17-character VIN"
                  className="w-full bg-[#F5F5F5] border border-[#141414] p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#141414]/10"
                  maxLength={17}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono mb-1 opacity-60">Symptoms & Issues</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe the problem (e.g., squealing noise when braking, engine misfire at idle...)"
                  className="w-full bg-[#F5F5F5] border border-[#141414] p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#141414]/10"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#141414] text-[#E4E3E0] py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50 active:translate-y-1 active:shadow-none shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Run Diagnostic
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-900 p-4 text-red-900 text-sm flex gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-[#141414] text-[#E4E3E0] p-6 font-mono text-[11px] leading-relaxed">
            <p className="opacity-50 mb-2 uppercase tracking-tighter">// SYSTEM_LOG</p>
            <p className="mb-1">{">"} Waiting for input...</p>
            {loading && <p className="animate-pulse">{">"} Processing VIN data...</p>}
            {result && <p className="text-emerald-400">{">"} Diagnostic complete. Report generated.</p>}
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-8">
          {!result && !loading && (
            <div className="h-full min-h-[400px] border-2 border-dashed border-[#141414]/20 flex flex-col items-center justify-center text-[#141414]/40 p-12 text-center">
              <Car className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-xl font-serif italic mb-2">No Diagnostic Data</h3>
              <p className="max-w-xs text-sm">Enter a VIN and describe the symptoms to generate an AI-powered mechanical report.</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-[#141414]/10 border-t-[#141414] rounded-full animate-spin" />
                <Wrench className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Scanning Vehicle Database</p>
                <p className="text-sm opacity-60 italic">Cross-referencing symptoms with technical service bulletins...</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Vehicle Header Card */}
              <div className="bg-white border border-[#141414] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#141414] text-[#E4E3E0] text-[10px] px-2 py-0.5 font-mono uppercase tracking-tighter">Identified Vehicle</span>
                    <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">{vin}</span>
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight uppercase leading-none">
                    {result.vehicleInfo.year} {result.vehicleInfo.make} {result.vehicleInfo.model}
                  </h2>
                  <p className="text-sm opacity-60 mt-2 font-mono uppercase tracking-widest">
                    {result.vehicleInfo.engine} {result.vehicleInfo.trim && `| ${result.vehicleInfo.trim}`}
                  </p>
                </div>
                <div className="bg-[#F5F5F5] border border-[#141414] p-4 text-center min-w-[140px]">
                  <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Difficulty</p>
                  <p className="font-bold uppercase tracking-tighter text-lg">{result.diagnostic.estimatedDifficulty}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Possible Causes */}
                <div className="space-y-4">
                  <h3 className="font-serif italic text-xl border-b border-[#141414] pb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Potential Causes
                  </h3>
                  <div className="space-y-3">
                    {result.diagnostic.possibleCauses.map((cause: any, idx: number) => (
                      <div key={idx} className="bg-white border border-[#141414] p-4 group hover:bg-[#141414] hover:text-[#E4E3E0] transition-all cursor-default">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold uppercase text-sm tracking-tight">{cause.title}</h4>
                          <span className={cn(
                            "text-[9px] uppercase px-1.5 py-0.5 font-mono border",
                            cause.severity === 'high' ? "border-red-500 text-red-500 group-hover:bg-red-500 group-hover:text-white" :
                            cause.severity === 'medium' ? "border-amber-500 text-amber-500 group-hover:bg-amber-500 group-hover:text-white" :
                            "border-emerald-500 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"
                          )}>
                            {cause.severity} risk
                          </span>
                        </div>
                        <p className="text-xs opacity-70 leading-relaxed">{cause.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations & Tools */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-serif italic text-xl border-b border-[#141414] pb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Recommended Steps
                    </h3>
                    <ul className="space-y-3">
                      {result.diagnostic.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-sm items-start">
                          <span className="font-mono text-[10px] opacity-40 mt-1">0{idx + 1}</span>
                          <p>{rec}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-serif italic text-xl border-b border-[#141414] pb-2 flex items-center gap-2">
                      <Wrench className="w-5 h-5" /> Required Tools
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.diagnostic.toolsNeeded.map((tool: string, idx: number) => (
                        <span key={idx} className="bg-[#141414] text-[#E4E3E0] text-[10px] px-3 py-1 uppercase tracking-widest font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white border border-[#141414] p-8 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
                <h3 className="font-serif italic text-xl mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" /> Mechanic's Summary
                </h3>
                <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-p:leading-relaxed">
                  <Markdown>{result.summary}</Markdown>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] mt-12 p-8 text-center bg-white/30">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-mono">
          &copy; 2024 AutoDiagnose AI // Powered by Gemini 3.1 Pro
        </p>
      </footer>
    </div>
  );
}
