import { useState } from 'react';
import { ShieldAlert, Phone, X, AlertTriangle } from 'lucide-react';

export const EmergencySOS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultEmergency = {
    policeName: 'National Police Helpline',
    policePhone: '100',
    hospitalName: 'National Ambulance Service',
    hospitalPhone: '108',
    hospitalDistance: 'Nationwide'
  };

  return (
    <div className="fixed bottom-6 right-6 z-[3000]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer hover:scale-110 transition-transform group"
        >
          <ShieldAlert className="w-7 h-7 text-white group-hover:animate-pulse" />
        </button>
      ) : (
        <div className="bg-[#0a101f] border border-red-500/30 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.2)] w-80 overflow-hidden view-enter">
          <div className="bg-red-600/10 p-4 border-b border-red-500/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-heading font-bold text-white uppercase tracking-wider text-sm">Emergency SOS</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-md transition-colors">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            <a href={`tel:${defaultEmergency.policePhone}`} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/50 hover:bg-red-500/10 transition-all group">
              <div>
                <p className="text-xs font-bold text-white mb-0.5">{defaultEmergency.policeName}</p>
                <p className="text-[10px] text-muted">Emergency Response</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500">
                <Phone className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
              </div>
            </a>
            
            <a href={`tel:${defaultEmergency.hospitalPhone}`} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/50 hover:bg-red-500/10 transition-all group">
              <div>
                <p className="text-xs font-bold text-white mb-0.5">{defaultEmergency.hospitalName}</p>
                <p className="text-[10px] text-muted">Medical Emergency</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500">
                <Phone className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
              </div>
            </a>
            
            <p className="text-[10px] text-center text-muted pt-2 border-t border-white/5">
              Dialing these numbers will use your device's native phone application.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
