import React, { useState } from 'react';
import { X, QrCode, CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (paymentDetails: { paymentMethod: string; txnId: string }) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayProps> = ({
  isOpen,
  onClose,
  amount,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'UPI' | 'Card'>('UPI');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardHolder, setCardHolder] = useState('Manish Parihar');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('892');
  const [upiApp, setUpiApp] = useState<'GooglePay' | 'PhonePe' | 'Paytm'>('GooglePay');
  const [processing, setProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [generatedTxnId, setGeneratedTxnId] = useState('');

  if (!isOpen) return null;

  const handleProcessPayment = async () => {
    try {
      setProcessing(true);
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: tab === 'UPI' ? `UPI (${upiApp})` : 'Credit/Debit Card',
          amount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedTxnId(data.txnId);
        setPaidSuccess(true);

        setTimeout(() => {
          onSuccess({
            paymentMethod: tab === 'UPI' ? `UPI (${upiApp})` : 'Credit/Debit Card',
            txnId: data.txnId,
          });
          setPaidSuccess(false);
          setProcessing(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Payment failure:', err);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#18181A] border border-[#E23744]/40 w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#D7E2EA]/60 hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#E23744] text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zomato Secure Payment Gateway</span>
          </div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Complete Payment</h3>
          <p className="text-xs text-[#D7E2EA]/60">Total Payable Amount: <span className="text-[#E23744] font-bold text-sm">₹{amount}</span></p>
        </div>

        {paidSuccess ? (
          <div className="py-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white uppercase">Payment Authorized!</h4>
            <p className="text-xs text-[#D7E2EA]/70">Transaction Reference ID: <span className="font-mono text-emerald-400 font-bold">{generatedTxnId}</span></p>
            <span className="text-[10px] uppercase text-[#D7E2EA]/40 tracking-wider">Redirecting to Live Order Tracker...</span>
          </div>
        ) : (
          <>
            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#0C0C0C] p-1.5 rounded-2xl border border-[#D7E2EA]/15">
              <button
                onClick={() => setTab('UPI')}
                className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  tab === 'UPI'
                    ? 'bg-[#E23744] text-white shadow-lg shadow-[#E23744]/30'
                    : 'text-[#D7E2EA]/60 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI QR Scanner</span>
              </button>

              <button
                onClick={() => setTab('Card')}
                className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  tab === 'Card'
                    ? 'bg-[#E23744] text-white shadow-lg shadow-[#E23744]/30'
                    : 'text-[#D7E2EA]/60 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card Payment</span>
              </button>
            </div>

            {/* Tab 1: User's Official Google Pay UPI QR Code */}
            {tab === 'UPI' && (
              <div className="flex flex-col items-center gap-4 bg-[#0C0C0C] p-5 rounded-3xl border border-[#D7E2EA]/10">
                <div className="flex items-center gap-2 text-[#D7E2EA]">
                  <span className="text-xs font-bold uppercase tracking-wider">Scan to pay with any UPI app</span>
                </div>

                {/* Display Official User QR Code Image */}
                <div className="p-3 bg-[#18181A] rounded-2xl border-2 border-[#E23744] shadow-2xl flex flex-col items-center max-w-[260px]">
                  <img
                    src="/manish_upi_qr.jpg"
                    alt="Manish Parihar Google Pay UPI QR Code"
                    className="w-full h-auto object-contain rounded-xl shadow-md"
                  />
                  <div className="mt-2 text-center">
                    <span className="text-[11px] font-bold text-[#E23744] uppercase tracking-wider block">Manish Parihar</span>
                    <span className="text-[9px] text-[#D7E2EA]/60 uppercase tracking-widest block">Payable: ₹{amount}</span>
                  </div>
                </div>

                {/* UPI App Quick Options */}
                <div className="flex items-center gap-3 w-full">
                  {(['GooglePay', 'PhonePe', 'Paytm'] as const).map(app => (
                    <button
                      key={app}
                      onClick={() => setUpiApp(app)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        upiApp === app
                          ? 'bg-[#E23744]/20 border-[#E23744] text-white'
                          : 'bg-[#18181A] border-white/10 text-[#D7E2EA]/50 hover:text-white'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card Form */}
            {tab === 'Card' && (
              <div className="flex flex-col gap-4 bg-[#0C0C0C] p-5 rounded-3xl border border-[#D7E2EA]/10">
                <div className="relative bg-gradient-to-tr from-[#900C1D] to-[#E23744] p-4 rounded-2xl text-white shadow-lg flex flex-col justify-between h-32">
                  <div className="flex justify-between items-center text-xs uppercase font-semibold">
                    <span>Zomato Priority Card</span>
                    <span className="font-bold text-amber-300">VISA</span>
                  </div>
                  <div className="font-mono tracking-widest text-sm text-amber-100">{cardNumber}</div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-light">
                    <span>{cardHolder}</span>
                    <span>EXP: {expiry}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-semibold text-[#D7E2EA]/60">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#D7E2EA]/60">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#D7E2EA]/60">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cvv}
                      onChange={e => setCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handleProcessPayment}
              disabled={processing}
              className="w-full py-4 bg-[#E23744] hover:bg-[#900C1D] text-white font-bold uppercase tracking-wider text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E23744]/40"
            >
              {processing ? (
                <span>Verifying UPI Payment...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Verify & Pay ₹{amount}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
