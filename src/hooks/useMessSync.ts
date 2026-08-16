import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppState } from '../types';

export function useMessSync(state: AppState, setState: (updater: (prev: AppState) => AppState) => void) {
  const [lastSyncedMessData, setLastSyncedMessData] = useState<string>('');

  // 1. Listen from Cloud
  useEffect(() => {
    if (!state.messAccessCode) return;
    const docRef = doc(db, 'messGroups', state.messAccessCode);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const serverDataStr = JSON.stringify({
          routine: data.routine || {},
          lunchCookStartTime: data.lunchCookStartTime || '10:00',
          lunchCookEndTime: data.lunchCookEndTime || '14:00',
          dinnerCookStartTime: data.dinnerCookStartTime || '20:00',
          dinnerCookEndTime: data.dinnerCookEndTime || '22:00',
          messTransactions: data.transactions || [],
          messDebts: data.debts || [],
          messMeals: data.meals || [],
          messMembers: data.members || [],
        });
        
        const localDataStr = JSON.stringify({
          routine: state.routine || {},
          lunchCookStartTime: state.lunchCookStartTime || '10:00',
          lunchCookEndTime: state.lunchCookEndTime || '14:00',
          dinnerCookStartTime: state.dinnerCookStartTime || '20:00',
          dinnerCookEndTime: state.dinnerCookEndTime || '22:00',
          messTransactions: state.messTransactions || [],
          messDebts: state.messDebts || [],
          messMeals: state.messMeals || [],
          messMembers: state.messMembers || [],
        });

        if (serverDataStr !== localDataStr) {
          setLastSyncedMessData(serverDataStr);
          setState(prev => ({
            ...prev,
            routine: data.routine || prev.routine,
            lunchCookStartTime: data.lunchCookStartTime || prev.lunchCookStartTime,
            lunchCookEndTime: data.lunchCookEndTime || prev.lunchCookEndTime,
            dinnerCookStartTime: data.dinnerCookStartTime || prev.dinnerCookStartTime,
            dinnerCookEndTime: data.dinnerCookEndTime || prev.dinnerCookEndTime,
            messTransactions: data.transactions || prev.messTransactions,
            messDebts: data.debts || prev.messDebts,
            messMeals: data.meals || prev.messMeals,
            messMembers: data.members || prev.messMembers,
          }));
        }
      }
    });
    return () => unsubscribe();
  }, [state.messAccessCode, state.routine, state.lunchCookStartTime, state.lunchCookEndTime, state.dinnerCookStartTime, state.dinnerCookEndTime, state.messTransactions, state.messDebts, state.messMeals, state.messMembers, setState]);

  // 2. Push to Cloud
  useEffect(() => {
    if (!state.messAccessCode) return;
    const localDataStr = JSON.stringify({
       routine: state.routine || {},
       lunchCookStartTime: state.lunchCookStartTime || '10:00',
       lunchCookEndTime: state.lunchCookEndTime || '14:00',
       dinnerCookStartTime: state.dinnerCookStartTime || '20:00',
       dinnerCookEndTime: state.dinnerCookEndTime || '22:00',
       messTransactions: state.messTransactions || [],
       messDebts: state.messDebts || [],
       messMeals: state.messMeals || [],
       messMembers: state.messMembers || [],
    });
    
    if (localDataStr !== lastSyncedMessData) {
       setLastSyncedMessData(localDataStr);
       const docRef = doc(db, 'messGroups', state.messAccessCode);
       setDoc(docRef, {
          routine: state.routine || {},
          lunchCookStartTime: state.lunchCookStartTime || '10:00',
          lunchCookEndTime: state.lunchCookEndTime || '14:00',
          dinnerCookStartTime: state.dinnerCookStartTime || '20:00',
          dinnerCookEndTime: state.dinnerCookEndTime || '22:00',
          transactions: state.messTransactions || [],
          debts: state.messDebts || [],
          meals: state.messMeals || [],
          members: state.messMembers || [],
       }, { merge: true }).catch(err => console.error("Sync push error", err));
    }
  }, [state.routine, state.lunchCookStartTime, state.lunchCookEndTime, state.dinnerCookStartTime, state.dinnerCookEndTime, state.messTransactions, state.messDebts, state.messMeals, state.messMembers, state.messAccessCode, lastSyncedMessData]);
}
