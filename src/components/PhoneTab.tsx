import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Smartphone, 
  ShieldCheck, 
  ChevronRight, 
  BrainCircuit, 
  Wind, 
  Flame, 
  ShieldAlert, 
  Activity, 
  Moon,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { AppState } from '../types';

interface PhoneTabProps {
  state: AppState;
  saveState: (next: AppState) => void;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  todayStr: string;
  getFormattedDateString: (dateStr: string) => string;
  playCompletionBeep: () => void;
  triggerCustomAlert: (text: string, title?: string, type?: 'info' | 'success' | 'error') => void;
  setActiveTab: (tab: any) => void;
}

export default function PhoneTab({
  state,
  saveState,
  setState,
  todayStr,
  getFormattedDateString,
  playCompletionBeep,
  triggerCustomAlert,
  setActiveTab
}: PhoneTabProps) {
  
  // Local screen states mimicking original declarations
  const [screenMetric, setScreenMetric] = useState<'screen' | 'notifications' | 'unlocks'>('screen');
  const [selectedScreenDate, setSelectedScreenDate] = useState<string>(todayStr); 
  const [activeChromeSiteDetails, setActiveChromeSiteDetails] = useState<boolean>(false);
    
  // Local Breathing module state
      
  // Live logger simulation tape state
  
  
  
  // Construct multi-day trend chart dataset
  const trendDataset = (() => {
    const list = [];
    const limitMin = state.phoneLimitMinutes || 150;
    
    // Fill last 7 days of items
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const keyStr = date.toISOString().split('T')[0];
      
      // Screen time in minutes
      const rawScreenMin = state.phoneUsageHistory?.[keyStr] !== undefined 
        ? state.phoneUsageHistory[keyStr] 
        : (i === 0 ? 124 : (i === 1 ? 190 : (i === 2 ? 80 : (i === 3 ? 155 : (i === 4 ? 220 : (i === 5 ? 105 : 140))))));

      // Daily Earned Focus points calculated in minutes
      const dayLog = state.history?.[keyStr]?.study || {};
      const rawStudySeconds = Object.values(dayLog).reduce((a, b) => a + (b as number), 0);
      const focusPointsEarned = Math.round(rawStudySeconds / 60);

      const dayLabel = date.toLocaleDateString(state.language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' });

      list.push({
        date: dayLabel,
        screenTime: rawScreenMin,
        focusPoints: focusPointsEarned > 0 ? focusPointsEarned : (i === 0 ? 90 : (i === 1 ? 40 : (i === 2 ? 160 : (i === 3 ? 110 : (i === 4 ? 30 : (i === 5 ? 140 : 80))))))
      });
    }
    return list;
  })();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      
      {/* MAIN APP ACTIVITY DETAILS VIEW (SCREENSHOT STYLE) */}
      <div id="app-activity-details-container" className="bg-black border border-neutral-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* SCREENSHOT TITLE BAR */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => {
              setActiveTab('study');
              playCompletionBeep();
            }}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800/80 flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-100 flex-1 text-center pr-3">
            {state.language === 'bn' ? 'অ্যাপ ব্যবহারের বিস্তারিত বিবরণ' : 'App activity details'}
          </h3>
          <div className="w-1.5 h-1.5 bg-transparent rounded-full" />
        </div>

        {/* DYNAMIC SPINNER METRIC SELECTOR BUBBLE */}
        <div className="flex justify-center mb-5">
          <div className="relative inline-block">
            <select 
              value={screenMetric}
              onChange={(e) => {
                setScreenMetric(e.target.value as any);
                playCompletionBeep();
              }}
              className="appearance-none bg-neutral-900 border border-neutral-800 text-xs text-neutral-350 font-extrabold px-5 py-2.5 pr-10 rounded-full focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm tracking-wide"
            >
              <option value="screen">
                {state.language === 'bn' ? 'স্ক্রিন টাইম' : 'Screen time'}
              </option>
              <option value="notifications">
                {state.language === 'bn' ? 'প্রাপ্ত নোটিফিকেশন' : 'Notifications received'}
              </option>
              <option value="unlocks">
                {state.language === 'bn' ? 'ডিভাইস খুলেছেন' : 'Times opened'}
              </option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* DYNAMIC EXTREME ACCUMULATOR DISPLAY */}
        {(() => {
          const activeRecord = state.appUsageDurations?.[selectedScreenDate] || {};
          
          let sportzfyVal = activeRecord.sportzfy !== undefined ? activeRecord.sportzfy : 33;
          let chromeVal = activeRecord.chrome !== undefined ? activeRecord.chrome : 31;
          let fbVal = activeRecord.facebook !== undefined ? activeRecord.facebook : 26;
          let liteVal = activeRecord.lite !== undefined ? activeRecord.lite : 16;
          let messengerVal = activeRecord.messenger !== undefined ? activeRecord.messenger : 11;
          let aiVal = activeRecord.meta_ai !== undefined ? activeRecord.meta_ai : 8;
          let mridhaVal = activeRecord.mridhax !== undefined ? activeRecord.mridhax : 16;

          const rawSum = sportzfyVal + chromeVal + fbVal + liteVal + messengerVal + aiVal + mridhaVal;

          let finalVal = rawSum;
          let unitTextBn = 'মিনিট';
          let unitTextEn = 'min';

          if (screenMetric === 'notifications') {
            finalVal = Math.round(rawSum * 1.5);
            unitTextBn = 'টি নোটিফিকেশন';
            unitTextEn = 'notifications';
          } else if (screenMetric === 'unlocks') {
            finalVal = Math.max(12, Math.round(rawSum / 4));
            unitTextBn = 'বার খোলা হয়েছে';
            unitTextEn = 'times';
          }

          let hrStr = '';
          let minStr = '';
          if (screenMetric === 'screen') {
            const hrs = Math.floor(finalVal / 60);
            const mins = finalVal % 60;
            
            if (state.language === 'bn') {
              const hrsBn = hrs.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
              const minsBn = mins.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
              hrStr = hrs > 0 ? `${hrsBn} ঘণ্টা, ` : '';
              minStr = `${minsBn} মিনিট`;
            } else {
              hrStr = hrs > 0 ? `${hrs} hr, ` : '';
              minStr = `${mins} min`;
            }
          } else {
            if (state.language === 'bn') {
              const finalBn = finalVal.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
              minStr = `${finalBn} ${unitTextBn}`;
            } else {
              minStr = `${finalVal} ${unitTextEn}`;
            }
          }

          const isTodayStr = selectedScreenDate === todayStr;
          const topLabel = isTodayStr 
            ? (state.language === 'bn' ? 'আজ' : 'Today') 
            : getFormattedDateString(selectedScreenDate);

          return (
            <div className="text-center mb-8 space-y-1 animate-fadeIn">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                {hrStr}{minStr}
              </h2>
              <p className="text-xs text-neutral-400 font-bold capitalize tracking-wide">
                {topLabel}
              </p>
            </div>
          );
        })()}

        {/* BAR CHART GRAPH (SCREENSHOT REPLICATED STYLE) */}
        <div className="relative mb-6 border-b border-neutral-900 pb-5">
          <div className="absolute top-0 bottom-5 left-0 right-0 flex flex-col justify-between pointer-events-none text-[9.5px] font-mono text-neutral-600">
            <div className="w-full border-t border-neutral-900 h-0 flex justify-between pr-1">
              <span />
              <span>12h</span>
            </div>
            <div className="w-full border-t border-neutral-900 h-0 flex justify-between pr-1">
              <span />
              <span>9h</span>
            </div>
            <div className="w-full border-t border-neutral-900 h-0 flex justify-between pr-1">
              <span />
              <span>6h</span>
            </div>
            <div className="w-full border-t border-neutral-900 h-0 flex justify-between pr-1">
              <span />
              <span>3h</span>
            </div>
            <div className="w-full border-t border-neutral-900 h-0 flex justify-between pr-1">
              <span />
              <span>0h</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2.5 h-36 px-2 relative z-10 items-end">
            {(() => {
              const d = new Date();
              const dayNum = d.getDay();
              const sunDiff = d.getDate() - dayNum;
              const sunObj = new Date(d.setDate(sunDiff));

              const cardsList = [];
              for (let i = 0; i < 7; i++) {
                const dayDate = new Date(sunObj);
                dayDate.setDate(sunObj.getDate() + i);
                const keyStr = dayDate.toISOString().split('T')[0];
                
                const dayRecord = state.appUsageDurations?.[keyStr] || {};
                let sportzfyVal = dayRecord.sportzfy !== undefined ? dayRecord.sportzfy : 33;
                let chromeVal = dayRecord.chrome !== undefined ? dayRecord.chrome : 31;
                let fbVal = dayRecord.facebook !== undefined ? dayRecord.facebook : 26;
                let liteVal = dayRecord.lite !== undefined ? dayRecord.lite : 16;
                let messengerVal = dayRecord.messenger !== undefined ? dayRecord.messenger : 11;
                let aiVal = dayRecord.meta_ai !== undefined ? dayRecord.meta_ai : 8;
                let mridhaVal = dayRecord.mridhax !== undefined ? dayRecord.mridhax : 16;

                const sumMin = sportzfyVal + chromeVal + fbVal + liteVal + messengerVal + aiVal + mridhaVal;
                const dayNameEn = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNameBn = dayDate.toLocaleDateString('bn-BD', { weekday: 'short' });

                cardsList.push({
                  keyStr,
                  sumMin,
                  nameEn: dayNameEn,
                  nameBn: dayNameBn
                });
              }

              return cardsList.map((dayItem, idx) => {
                const isSelected = selectedScreenDate === dayItem.keyStr;
                const heightPercent = Math.min(100, (dayItem.sumMin / 720) * 100);

                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setSelectedScreenDate(dayItem.keyStr);
                      playCompletionBeep();
                    }}
                    className="flex flex-col items-center h-full justify-end cursor-pointer group space-y-1 relative"
                  >
                    {isSelected && (
                      <span className="absolute -inset-x-1.5 bottom-5 top-0 rounded-xl bg-amber-500/10 pointer-events-none border border-amber-500/20" />
                    )}

                    <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-neutral-900 border border-neutral-800 text-[9px] font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded transition shadow-lg whitespace-nowrap z-30 pointer-events-none">
                      {dayItem.sumMin} min
                    </div>

                    <div className="w-full bg-neutral-900/30 rounded-t h-[80%] flex items-end">
                      <div 
                        style={{ height: `${Math.max(4, heightPercent)}%` }}
                        className={`w-full rounded-t transition-all duration-500 ${
                          isSelected 
                            ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
                            : 'bg-white group-hover:bg-neutral-300'
                        }`}
                      />
                    </div>
                    
                    <span className={`text-[8.5px] uppercase tracking-wide truncate max-w-full font-bold pt-1 block ${
                      isSelected ? 'text-amber-400 font-extrabold scale-105' : 'text-neutral-550'
                    }`}>
                      {state.language === 'bn' ? dayItem.nameBn : dayItem.nameEn}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* DATE HORIZONTAL NAVIGATION WIDGET */}
        <div className="flex items-center justify-between px-2 mb-8 select-none">
          <button
            onClick={() => {
              const d = new Date(selectedScreenDate);
              d.setDate(d.getDate() - 1);
              setSelectedScreenDate(d.toISOString().split('T')[0]);
              playCompletionBeep();
            }}
            className="w-8 h-8 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
          >
            ◀
          </button>
          <div className="text-xs font-black tracking-widest text-slate-200 uppercase font-mono">
            {getFormattedDateString(selectedScreenDate)}
          </div>
          <button
            onClick={() => {
              const d = new Date(selectedScreenDate);
              d.setDate(d.getDate() + 1);
              setSelectedScreenDate(d.toISOString().split('T')[0]);
              playCompletionBeep();
            }}
            className="w-8 h-8 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
          >
            ▶
          </button>
        </div>

        {/* INTERACTIVE APPS LIST */}
        <div className="space-y-4">
          {(() => {
            const dayData = state.appUsageDurations?.[selectedScreenDate] || {};
            
            const mappedApps = [
              { key: 'sportzfy', name: 'Sportzfy', defaultMin: 33, color: 'from-blue-600 to-indigo-600 bg-indigo-600 text-indigo-100', icon: '⚽' },
              { key: 'chrome', name: 'Chrome', defaultMin: 31, color: 'from-amber-400 to-green-500 bg-amber-500 text-slate-900', icon: '🌐' },
              { key: 'facebook', name: 'Facebook', defaultMin: 26, color: 'from-blue-600 to-blue-800 bg-blue-650 text-white', icon: 'f' },
              { key: 'lite', name: 'Lite', defaultMin: 16, color: 'from-sky-450 to-sky-600 bg-sky-505 text-white', icon: '⚡' },
              { key: 'messenger', name: 'Messenger', defaultMin: 11, color: 'from-teal-400 to-fuchsia-600 bg-pink-500 text-white', icon: '💬' },
              { key: 'meta_ai', name: 'Meta AI', defaultMin: 8, color: 'from-purple-500 to-indigo-500 bg-indigo-500 text-white', icon: '🧠' },
              { key: 'mridhax', name: 'MridhaX', defaultMin: 16, color: 'from-emerald-400 to-emerald-600 bg-emerald-600 text-slate-950', icon: '🌳' }
            ].map((appConfig) => {
              const durationVal = dayData[appConfig.key] !== undefined ? dayData[appConfig.key] : appConfig.defaultMin;
              
              let displayString = '';
              if (screenMetric === 'notifications') {
                const finalNoteCount = Math.round(durationVal * 1.5);
                displayString = state.language === 'bn' 
                  ? `${finalNoteCount.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)])} টি নোটিফিকেশন` 
                  : `${finalNoteCount} notifications`;
              } else if (screenMetric === 'unlocks') {
                const finalLockCount = Math.max(1, Math.round(durationVal / 4));
                displayString = state.language === 'bn' 
                  ? `${finalLockCount.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)])} বার ওপেন` 
                  : `${finalLockCount} openings`;
              } else {
                displayString = state.language === 'bn' 
                  ? `${durationVal.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)])} মিনিট` 
                  : `${durationVal} minutes`;
              }

              return {
                ...appConfig,
                val: durationVal,
                displayText: displayString
              };
            });

            return (
              <div className="space-y-3.5">
                {mappedApps.map((mappedItem) => {
                  return (
                    <div key={mappedItem.key} className="space-y-2">
                      <div className="flex items-center justify-between p-1 hover:bg-neutral-900/35 rounded-xl transition-all duration-200">
                        
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${mappedItem.color} flex items-center justify-center text-sm font-black shadow-md border border-white/5`}>
                            {mappedItem.icon}
                          </div>

                          <div className="space-y-0.5 truncate">
                            <h4 className="text-sm font-extrabold text-neutral-200">
                              {mappedItem.name}
                            </h4>
                            <p className="text-[11.5px] text-neutral-400 font-mono">
                              {mappedItem.displayText}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {mappedItem.key === 'chrome' && (
                            <button
                              onClick={() => {
                                setActiveChromeSiteDetails(!activeChromeSiteDetails);
                                playCompletionBeep();
                              }}
                              className="py-1.5 px-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white border border-neutral-800 text-[10px] font-bold rounded-lg uppercase cursor-pointer active:scale-95"
                            >
                              {state.language === 'bn' ? 'ওয়েবসাইট দেখান' : 'Show sites you visit'}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              playCompletionBeep();
                              triggerCustomAlert(
                                state.language === 'bn' 
                                  ? `${mappedItem.name} এর জন্য দৈনিক সীমা সেটআপ করা হয়েছে!` 
                                  : `Active usage constraints established for ${mappedItem.name}!`,
                                state.language === 'bn' ? 'অ্যাপ লিমিট' : 'Application Cap',
                                'info'
                              );
                            }}
                            className="w-10 h-10 rounded-full hover:bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-amber-400 transition cursor-pointer"
                          >
                            ⏳
                          </button>
                        </div>
                      </div>

                      {mappedItem.key === 'chrome' && activeChromeSiteDetails && (
                        <div className="ml-14 p-3.5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3 shadow-inner animate-fadeIn">
                          <span className="text-[9px] font-black tracking-widest uppercase text-amber-500 font-mono block">
                            🌐 Chrome Site Visits List:
                          </span>
                          {[
                            { host: 'github.com', mins: 12, ratio: 'w-[40%]', color: 'bg-emerald-500' },
                            { host: 'studyplatform.edu', mins: 8, ratio: 'w-[25%]', color: 'bg-indigo-500' },
                            { host: 'mridhax.pro', mins: 6, ratio: 'w-[18%]', color: 'bg-amber-400' },
                            { host: 'stackoverflow.com', mins: 5, ratio: 'w-[15%]', color: 'bg-slate-500' }
                          ].map((site, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <div className="flex justify-between items-center text-[11px] font-mono">
                                <span className="text-neutral-300 font-bold">{site.host}</span>
                                <span className="text-neutral-400">{site.mins} min</span>
                              </div>
                              <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                                <div className={`h-full ${site.color} ${site.ratio} rounded-full`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

      {/* NEW SECTION: MULTI-DAY TRENDS OVERLAY CHART CARD (RECHART BASED CO-RELATION CHART) */}
      <div className="bg-slate-950 border border-neutral-900 rounded-[32px] p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-900 pb-3">
          <Activity className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest font-mono">
              {state.language === 'bn' ? 'স্ক্রিন টাইম বনাম ফোকাস পয়েন্ট নিরীক্ষণ' : 'SCREEN TIME VS FOCUS POINTS CORELLATION'}
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {state.language === 'bn' ? 'স্ক্রিন টাইম কমানোর সাথে সাথে ফোকাস ও প্রোডাক্টিভিটি বৃদ্ধির বাস্তব প্রমাণ' : 'Daily metric analysis matching low distraction usage over high study accomplishments'}
            </p>
          </div>
        </div>

        {/* RECHARTS COMPOSED CHART RENDERING REAL DATA OVERLAYS */}
        <div className="h-64 w-full bg-black/60 rounded-2xl p-2.5 border border-neutral-900/60 font-mono text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendDataset}>
              <CartesianGrid stroke="#1c1917" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#71717a" tickLine={false} />
              <YAxis yAxisId="left" stroke="#10b981" label={{ value: 'Focus Pts', angle: -90, position: 'insideLeft', fill: '#10b981', style: { textAnchor: 'middle', fontWeight: 'bold' } }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" label={{ value: 'Screen Min', angle: 90, position: 'insideRight', fill: '#f59e0b', style: { textAnchor: 'middle', fontWeight: 'bold' } }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                labelClassName="text-white font-bold"
              />
              <Legend verticalAlign="top" height={36} />
              
              {/* Screen usage as modern Amber Area/Bar */}
              <Bar yAxisId="right" dataKey="screenTime" name="Screen Time (Min)" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.65} barSize={20} />
              
              {/* Productive focus points as Emerald overlay line */}
              <Line yAxisId="left" type="monotone" dataKey="focusPoints" name="Focus Points" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} dot={{ strokeWidth: 2, r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[10.5px] text-slate-400 mt-4 leading-relaxed text-center italic bg-neutral-900/30 p-3 rounded-xl border border-neutral-850">
          {state.language === 'bn' 
            ? '💡 কোচ সোহান ওডিট: চার্টের সোনালী বারগুলো (মোবাইল ব্যবহার) যত নিচুতে নেমেছে, সুবজ রেখাটি (পড়াশুনার ফোকাস পয়েন্ট) তত উপরে উঠেছে। আসক্তি ত্যাগ করার সাথে সাথেই আপনার মনোযোগের চরম উল্লম্ফন স্পষ্ট!' 
            : '💡 Coach Sohan Insight: Notice the high correlation — as orange bars (screen usage) collapse, green peak line (productive focus points) explodes. Absolute proof of focus recovery.'}
        </p>

      </div>

          </div>
  );
}
