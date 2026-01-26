
import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, ShieldCheck, X, CheckCircle2 } from 'lucide-react';

interface PaymentModuleProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModule: React.FC<PaymentModuleProps> = ({ amount, onSuccess, onCancel }) => {
  const [step, setStep] = useState<'SELECT' | 'QR' | 'SUCCESS'>('SELECT');
  const [processing, setProcessing] = useState(false);

  const simulateSuccess = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {step !== 'SUCCESS' && (
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold text-gray-900">Secure Payment</h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
        )}

        <div className="p-8">
          {step === 'SELECT' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm uppercase font-bold tracking-widest mb-1">Total Payable</p>
                <h3 className="text-4xl font-extrabold text-gray-900">₹{amount}</h3>
              </div>

              <div className="space-y-3">
                <PaymentOption 
                  icon={<QrCode className="text-blue-600" />} 
                  title="Scan QR Code" 
                  desc="GPay, PhonePe, Paytm, etc." 
                  onClick={() => setStep('QR')}
                />
                <PaymentOption 
                  icon={<CreditCard className="text-blue-600" />} 
                  title="Debit / Credit Card" 
                  desc="All major cards supported" 
                  onClick={simulateSuccess}
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-tighter pt-4">
                <ShieldCheck size={16} />
                256-bit SSL Encrypted Transaction
              </div>
            </div>
          )}

          {step === 'QR' && (
            <div className="text-center space-y-6">
              <div className="bg-gray-50 p-6 rounded-3xl inline-block mx-auto border-4 border-gray-100">
                {/* Simulated QR Code */}
                <div className="w-48 h-48 bg-white p-2 relative">
                   <div className="absolute inset-0 border-4 border-blue-600 opacity-20"></div>
                   <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=swiftlab@upi&am=${amount}`} 
                    alt="QR Code" 
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Scan to Pay</h4>
                <p className="text-sm text-gray-500">Use any UPI app to scan and pay ₹{amount}</p>
              </div>
              <button 
                disabled={processing}
                onClick={simulateSuccess}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {processing ? 'Verifying Transaction...' : 'I have completed the payment'}
              </button>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-12 animate-in slide-in-from-bottom duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-500">Redirecting you to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentOption: React.FC<{ icon: React.ReactNode; title: string; desc: string; onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full p-4 border-2 border-gray-100 rounded-2xl flex items-center gap-4 hover:border-blue-600 hover:bg-blue-50/30 transition-all text-left group"
  >
    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">{icon}</div>
    <div>
      <p className="font-bold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  </button>
);

export default PaymentModule;
