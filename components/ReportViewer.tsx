
import React, { useState, useEffect } from 'react';
import { Appointment, TestReport } from '../types';
import { generateHealthInsights } from '../services/geminiService';
import { X, FileText, Download, Sparkles, BrainCircuit, AlertCircle } from 'lucide-react';

interface ReportViewerProps {
  appointment: Appointment;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ appointment, onClose }) => {
  const [report, setReport] = useState<TestReport | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching report from DB
    const mockReport: TestReport = {
      id: 'rep-' + appointment.id,
      appointmentId: appointment.id,
      generatedAt: new Date().toLocaleDateString(),
      results: {
        'Hemoglobin': '14.2 g/dL',
        'WBC Count': '7,200 /µL',
        'RBC Count': '5.1 million/µL',
        'Platelet Count': '240,000 /µL',
        'Glucose (Fasting)': '92 mg/dL',
        'HDL Cholesterol': '45 mg/dL',
        'LDL Cholesterol': '110 mg/dL'
      }
    };
    
    setReport(mockReport);
    
    // Fetch AI insights
    const fetchInsights = async () => {
      const insights = await generateHealthInsights(appointment.testType, mockReport.results);
      setAiInsights(insights);
      setLoading(false);
    };

    fetchInsights();
  }, [appointment]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{appointment.testType}</h2>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Reference No: {appointment.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all">
              <Download size={16} /> Download PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Results Table */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Diagnostic Data</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-left">
                    <th className="pb-3 font-medium">Parameter</th>
                    <th className="pb-3 font-medium">Result</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report && Object.entries(report.results).map(([key, val]) => (
                    <tr key={key}>
                      <td className="py-3 font-medium text-gray-700">{key}</td>
                      <td className="py-3 text-blue-600 font-bold">{val}</td>
                      <td className="py-3">
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">NORMAL</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Insights Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BrainCircuit size={80} />
                </div>
                <h3 className="flex items-center gap-2 font-bold text-blue-800 mb-4">
                  <Sparkles size={18} className="text-blue-500" />
                  Smart Health Insights
                </h3>
                
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-blue-200/40 rounded w-full animate-pulse" />
                    <div className="h-4 bg-blue-200/40 rounded w-[90%] animate-pulse" />
                    <div className="h-4 bg-blue-200/40 rounded w-[75%] animate-pulse" />
                  </div>
                ) : (
                  <div className="text-sm text-blue-900/80 leading-relaxed whitespace-pre-line">
                    {aiInsights}
                  </div>
                )}

                <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-[10px] italic">
                  <AlertCircle size={14} className="shrink-0" />
                  Note: This AI-generated summary is for informational purposes only and is not a clinical diagnosis. Always consult with a qualified physician regarding medical concerns.
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-400">Tested Date</p>
                    <p className="font-bold text-gray-700">{report?.generatedAt}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Lab Technician</p>
                    <p className="font-bold text-gray-700">Dr. Sarah Johnson</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
