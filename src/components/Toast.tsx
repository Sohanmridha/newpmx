import React from 'react';
import { useToast } from './ToastContext';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-fade-in ${
            toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-800 text-emerald-100' :
            toast.type === 'error' ? 'bg-rose-950/90 border-rose-800 text-rose-100' :
            toast.type === 'warning' ? 'bg-amber-950/90 border-amber-800 text-amber-100' :
            'bg-slate-900/90 border-slate-700 text-slate-100'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};
