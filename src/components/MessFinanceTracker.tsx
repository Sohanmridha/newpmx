import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, Coins, Plus, Trash2, Home, TrendingUp, Handshake, Calendar, X, 
  CalendarDays, Edit2, AlertTriangle, Cloud, Utensils, Users, ArrowUpRight, 
  ArrowDownLeft, Check, RefreshCw, Sparkles, UserPlus, Copy, Share2, 
  Download, PiggyBank, FlameKindling, Info, BellRing, Settings, CheckCircle2,
  Eye, EyeOff, Menu
} from 'lucide-react';
import { AppState, MessTransaction, MessDebt, MessMeal } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';

interface MessFinanceTrackerProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export const MessFinanceTracker: React.FC<MessFinanceTrackerProps> = ({ state, updateState }) => {
  const isBn = state.language === 'bn';
  const transactions = state.messTransactions || [];
  const debts = state.messDebts || [];
  const rawMeals = state.messMeals || [];
  const rawMembers = state.messMembers || [];

  // Default members list if none exist
  const members = useMemo(() => {
    if (rawMembers.length > 0) return rawMembers;
    return [
      isBn ? 'সদস্য ১' : 'Member 1',
      isBn ? 'সদস্য ২' : 'Member 2',
      isBn ? 'সদস্য ৩' : 'Member 3',
      isBn ? 'সদস্য ৪' : 'Member 4',
      isBn ? 'সদস্য ৫' : 'Member 5'
    ];
  }, [rawMembers, isBn]);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  // Navigation and form visibility states
  const [activeTab, setActiveTab] = useState<'transactions' | 'meals' | 'debts'>('transactions');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);

  // New Member State
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [editingMemberName, setEditingMemberName] = useState('');

  // Transaction form states
  const [tType, setTType] = useState<'cooking' | 'room_rent' | 'others'>('cooking');
  const [tAmount, setTAmount] = useState('');
  const [tPaidBy, setTPaidBy] = useState(members[0] || '');
  const [tDesc, setTDesc] = useState('');
  const [tDate, setTDate] = useState(todayStr);
  const [editTransactionId, setEditTransactionId] = useState<string | null>(null);

  // Debt form states
  const [dFrom, setDFrom] = useState(members[0] || '');
  const [dTo, setDTo] = useState(members[1] || members[0] || '');
  const [dAmount, setDAmount] = useState('');
  const [dReason, setDReason] = useState('');
  const [dDate, setDDate] = useState(todayStr);
  const [editDebtId, setEditDebtId] = useState<string | null>(null);

  // Active logging date for Meal Tracker
  const [selectedMealDate, setSelectedMealDate] = useState(todayStr);

  // Deletion confirm states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmType, setDeleteConfirmType] = useState<'transaction' | 'debt' | 'member' | null>(null);
  const [deleteMemberIndex, setDeleteMemberIndex] = useState<number | null>(null);

  // --- LOCAL SYNC PANEL STATES ---
  const [syncCodeInput, setSyncCodeInput] = useState(state.messAccessCode || '');
  const [isSyncSaving, setIsSyncSaving] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [showSyncCode, setShowSyncCode] = useState(false);
  const [showMessMenu, setShowMessMenu] = useState(false);

  // Sync state update when prop changes
  useEffect(() => {
    if (state.messAccessCode) {
      setSyncCodeInput(state.messAccessCode);
    }
  }, [state.messAccessCode]);

  // --- LOCAL BUDGET PANEL STATES ---
  const defaultBudget = 15000;
  const currentBudget = (state as any).messBudget !== undefined ? (state as any).messBudget : defaultBudget;
  const [budgetInput, setBudgetInput] = useState(currentBudget.toString());
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);

  // ----------------------------------------------------
  // CALCULATIONS & METRICS
  // ----------------------------------------------------
  const todayCookingCost = useMemo(() => {
    return transactions
      .filter(t => t.date === todayStr && t.type === 'cooking')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, todayStr]);

  const monthCookingCost = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'cooking')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentMonthStr]);

  const monthOtherCost = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith(currentMonthStr) && t.type !== 'cooking')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentMonthStr]);

  const monthTotalCost = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith(currentMonthStr))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentMonthStr]);

  // Aggregate meal statistics for current month
  const mealStats = useMemo(() => {
    const stats: Record<string, { lunch: number; dinner: number; total: number }> = {};
    members.forEach(m => {
      stats[m] = { lunch: 0, dinner: 0, total: 0 };
    });

    rawMeals.forEach(meal => {
      if (meal.date.startsWith(currentMonthStr) && stats[meal.memberName]) {
        stats[meal.memberName].lunch += meal.lunchCount;
        stats[meal.memberName].dinner += meal.dinnerCount;
        stats[meal.memberName].total += (meal.lunchCount + meal.dinnerCount);
      }
    });

    return stats;
  }, [rawMeals, members, currentMonthStr]);

  const totalMealsCount = useMemo(() => {
    return Object.values(mealStats).reduce((sum, val: any) => sum + (val?.total || 0), 0);
  }, [mealStats]);

  const mealRate = useMemo(() => {
    const count = members.length || 1;
    return monthCookingCost / count;
  }, [monthCookingCost, members.length]);

  // Member payments and balances calculation
  const memberBalances = useMemo(() => {
    const payments: Record<string, number> = {};
    members.forEach(m => {
      payments[m] = 0;
    });

    // Sum up payments by member in current month
    transactions
      .filter(t => t.date.startsWith(currentMonthStr))
      .forEach(t => {
        if (payments[t.paidBy] !== undefined) {
          payments[t.paidBy] += t.amount;
        } else {
          payments[t.paidBy] = t.amount;
        }
      });

    const numMembers = members.length || 1;
    const sharedRentPerPerson = monthOtherCost / numMembers;

    return members.map(name => {
      const paid = payments[name] || 0;
      const eatingCost = mealRate;
      const totalShare = eatingCost + sharedRentPerPerson;
      const balance = paid - totalShare;

      return {
        name,
        paid,
        meals: 1,
        eatingCost,
        sharedCost: sharedRentPerPerson,
        totalShare,
        balance
      };
    });
  }, [members, transactions, mealRate, monthOtherCost, currentMonthStr]);

  // Greedy Debt Settlement Minimization Algorithm
  const settlements = useMemo(() => {
    const debtors: { name: string; amount: number }[] = [];
    const creditors: { name: string; amount: number }[] = [];

    memberBalances.forEach(m => {
      if (m.balance < -0.1) {
        debtors.push({ name: m.name, amount: Math.abs(m.balance) });
      } else if (m.balance > 0.1) {
        creditors.push({ name: m.name, amount: m.balance });
      }
    });

    const results: { from: string; to: string; amount: number }[] = [];
    let dIdx = 0;
    let cIdx = 0;

    const dAmts = debtors.map(d => ({ ...d }));
    const cAmts = creditors.map(c => ({ ...c }));

    while (dIdx < dAmts.length && cIdx < cAmts.length) {
      const debtor = dAmts[dIdx];
      const creditor = cAmts[cIdx];

      const settleAmount = Math.min(debtor.amount, creditor.amount);
      if (settleAmount > 0.5) {
        results.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(settleAmount * 100) / 100
        });
      }

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount < 0.5) dIdx++;
      if (creditor.amount < 0.5) cIdx++;
    }

    return results;
  }, [memberBalances]);

  // Filter meals for the selected date
  const selectedDateMeals = useMemo(() => {
    const dayMeals: Record<string, { lunch: number; dinner: number }> = {};
    members.forEach(m => {
      dayMeals[m] = { lunch: 0, dinner: 0 };
    });

    rawMeals
      .filter(m => m.date === selectedMealDate)
      .forEach(m => {
        if (dayMeals[m.memberName]) {
          dayMeals[m.memberName] = { lunch: m.lunchCount, dinner: m.dinnerCount };
        }
      });

    return dayMeals;
  }, [rawMeals, members, selectedMealDate]);

  // Calendar strip logic
  const daysInMonth = useMemo(() => {
    const [year, month] = currentMonthStr.split('-').map(Number);
    const date = new Date(year, month, 0);
    return date.getDate();
  }, [currentMonthStr]);

  const dailyExpenses = useMemo(() => {
    const expenses: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.date.startsWith(currentMonthStr)) {
        expenses[t.date] = (expenses[t.date] || 0) + t.amount;
      }
    });
    return expenses;
  }, [transactions, currentMonthStr]);

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = isBn 
      ? ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'] 
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()];
  };

  // ----------------------------------------------------
  // SYNC ACTION HANDLERS
  // ----------------------------------------------------
  const handleConnectSync = async () => {
    const code = syncCodeInput.trim();
    if (code.length < 4) {
      setSyncFeedback({
        type: 'error',
        msg: isBn ? 'কোড অন্তত ৪ অক্ষরের হতে হবে।' : 'Code must be at least 4 characters.'
      });
      return;
    }

    setIsSyncSaving(true);
    setSyncFeedback({ type: null, msg: '' });

    try {
      const snap = await getDoc(doc(db, 'messGroups', code));
      if (snap.exists()) {
        const data = snap.data();
        updateState({ 
          messAccessCode: code, 
          messTransactions: data.transactions || state.messTransactions || [], 
          messDebts: data.debts || state.messDebts || [],
          messMeals: data.meals || state.messMeals || [],
          messMembers: data.members || state.messMembers || [],
          routine: data.routine || state.routine || {},
          lunchCookStartTime: data.lunchCookStartTime || state.lunchCookStartTime || '10:00',
          lunchCookEndTime: data.lunchCookEndTime || state.lunchCookEndTime || '14:00',
          dinnerCookStartTime: data.dinnerCookStartTime || state.dinnerCookStartTime || '20:00',
          dinnerCookEndTime: data.dinnerCookEndTime || state.dinnerCookEndTime || '22:00',
        });
        setSyncFeedback({
          type: 'success',
          msg: isBn ? 'কানেক্ট হয়েছে! ক্লাউড ডেটা লোড হয়েছে।' : 'Sync active! Cloud ledger loaded.'
        });
      } else {
        // Create new document in cloud with local states
        await setDoc(doc(db, 'messGroups', code), { 
          transactions: state.messTransactions || [], 
          debts: state.messDebts || [],
          meals: state.messMeals || [],
          members: state.messMembers || [],
          routine: state.routine || {},
          lunchCookStartTime: state.lunchCookStartTime || '10:00',
          lunchCookEndTime: state.lunchCookEndTime || '14:00',
          dinnerCookStartTime: state.dinnerCookStartTime || '20:00',
          dinnerCookEndTime: state.dinnerCookEndTime || '22:00',
        });
        updateState({ messAccessCode: code });
        setSyncFeedback({
          type: 'success',
          msg: isBn ? 'নতুন ক্লাউড মেস গ্রুপ আইডি তৈরি হয়েছে!' : 'New Cloud Group registered!'
        });
      }
    } catch (e: any) {
      console.error(e);
      setSyncFeedback({
        type: 'error',
        msg: isBn ? 'সার্ভার সিঙ্ক ত্রুটি! ইন্টারনেট বা ফায়ারস্টোর রোল চেক করুন।' : 'Sync error! Check firestore setup or internet.'
      });
    } finally {
      setIsSyncSaving(false);
    }
  };

  const handleDisconnectSync = () => {
    updateState({ messAccessCode: null });
    setSyncCodeInput('');
    setSyncFeedback({ type: null, msg: '' });
  };

  const handleCopyCode = () => {
    if (!state.messAccessCode) return;
    navigator.clipboard.writeText(state.messAccessCode);
    setIsCodeCopied(true);
    setTimeout(() => setIsCodeCopied(false), 2000);
  };

  // ----------------------------------------------------
  // BUDGET LIMIT HANDLERS
  // ----------------------------------------------------
  const handleSaveBudget = () => {
    const bVal = parseFloat(budgetInput);
    if (isNaN(bVal) || bVal <= 0) return;
    updateState({ messBudget: bVal } as any);
    setShowBudgetEdit(false);
  };

  // ----------------------------------------------------
  // EXPORT SUMMARY / PDF HANDLERS
  // ----------------------------------------------------
  const handleShareSummary = () => {
    const currency = '৳';
    let text = `=== 🏢 ${isBn ? 'মেসের খরচ ও হিসাব বিবরণী' : 'Mess Expenses & Balances Report'} ===\n`;
    text += `${isBn ? 'মাস' : 'Month'}: ${new Date().toLocaleString(isBn ? 'bn-BD' : 'en-US', { month: 'long', year: 'numeric' })}\n`;
    text += `-------------------------------------------\n`;
    text += `💰 ${isBn ? 'মোট রান্নার খরচ' : 'Total Cooking'}: ${currency}${monthCookingCost}\n`;
    text += `👥 ${isBn ? 'মোট সদস্য সংখ্যা' : 'Total Members'}: ${members.length}\n`;
    text += `🏷️ ${isBn ? 'জনপ্রতি মিল/বাজার খরচ' : 'Food Cost per Person'}: ${currency}${mealRate.toFixed(2)}\n`;
    text += `🏠 ${isBn ? 'রুম ভাড়া ও অন্যান্য' : 'Rent & Other Overhead'}: ${currency}${monthOtherCost}\n`;
    text += `📊 ${isBn ? 'রুমমেট প্রতি ভাড়া' : 'Rent per Roommate'}: ${currency}${(monthOtherCost / (members.length || 1)).toFixed(2)}\n`;
    text += `===========================================\n\n`;

    text += `👤 ${isBn ? 'রুমমেট ব্যালেন্স বিবরণী' : 'Roommate Balances'}:\n`;
    memberBalances.forEach(m => {
      text += `- ${m.name}: ${isBn ? 'জমা করেছেন' : 'Paid'} ${currency}${m.paid.toFixed(2)} | ${isBn ? 'বাজার খরচ শেয়ার' : 'Food Share'} ${currency}${m.eatingCost.toFixed(2)} | ${isBn ? 'ব্যালেন্স' : 'Balance'}: ${m.balance >= 0 ? '+' : ''}${m.balance.toFixed(2)}\n`;
    });
    text += `\n`;

    if (settlements.length > 0) {
      text += `🤝 ${isBn ? 'দেনা-পাওনা নিষ্পত্তি রুট' : 'Debt Settlement Instructions'}:\n`;
      settlements.forEach(s => {
        text += `- ${s.from} ➔ ${s.to}: ${currency}${s.amount.toFixed(2)}\n`;
      });
    }

    text += `\n${isBn ? 'MridhaX AI অ্যাপ দ্বারা জেনারেট করা হিসাব' : 'Generated via MridhaX AI App'}`;

    navigator.clipboard.writeText(text);
    alert(isBn ? 'বিবরণী ক্লিপবোর্ডে কপি করা হয়েছে! মেসেঞ্জার বা হোয়াটস্যাপে বন্ধুদের সাথে শেয়ার করুন।' : 'Report copied to clipboard! Share with your roommates on WhatsApp/Messenger.');
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const title = isBn ? 'Mess Monthly Expenses & Ledger' : 'Mess Monthly Expenses & Ledger';
      const timestamp = new Date().toLocaleString(isBn ? 'bn-BD' : 'en-US');
      
      doc.setFontSize(22);
      doc.setTextColor(34, 197, 94); // Green accent
      doc.text(title, 20, 20);
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate secondary
      doc.text(`Generated on: ${timestamp}`, 20, 28);
      doc.line(20, 32, 190, 32);

      // Section 1: Overview stats
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // Slate dark
      doc.text('1. Monthly Financial Overview', 20, 42);
      doc.setFontSize(11);
      doc.text(`Total Food/Cooking Cost: ${monthCookingCost} TK`, 20, 50);
      doc.text(`Total Meal Members: ${members.length}`, 20, 56);
      doc.text(`Food Cost Share per Person: ${mealRate.toFixed(2)} TK`, 20, 62);
      doc.text(`Rent & Other Overhead: ${monthOtherCost} TK`, 20, 68);
      doc.text(`Overhead Share per Person: ${(monthOtherCost / (members.length || 1)).toFixed(2)} TK`, 20, 74);
      doc.line(20, 80, 190, 80);

      // Section 2: Roommate Balances
      doc.setFontSize(14);
      doc.text('2. Roommate Ledger Summary', 20, 90);
      doc.setFontSize(10);
      let yOffset = 98;
      memberBalances.forEach((m, idx) => {
        const lineText = `${idx + 1}. ${m.name} | Paid: ${m.paid.toFixed(1)} TK | Food Cost: ${m.eatingCost.toFixed(1)} TK | Net Balance: ${m.balance >= 0 ? '+' : ''}${m.balance.toFixed(1)} TK`;
        doc.text(lineText, 20, yOffset);
        yOffset += 8;
      });
      doc.line(20, yOffset + 2, 190, yOffset + 2);

      // Section 3: Debt settlement
      doc.setFontSize(14);
      doc.text('3. Debt Settlement Solutions', 20, yOffset + 12);
      doc.setFontSize(10);
      let yOffsetSettle = yOffset + 20;
      if (settlements.length > 0) {
        settlements.forEach((s, idx) => {
          const lineText = `${idx + 1}. ${s.from} pays to ${s.to}: ${s.amount.toFixed(1)} TK`;
          doc.text(lineText, 20, yOffsetSettle);
          yOffsetSettle += 8;
        });
      } else {
        doc.text('All roommate accounts are balanced perfectly, no debts pending.', 20, yOffsetSettle);
      }

      doc.save(`Mess_Ledger_Report_${currentMonthStr}.pdf`);
    } catch (e) {
      console.error(e);
      alert(isBn ? 'পিডিএফ তৈরি করতে সমস্যা হয়েছে।' : 'Error exporting PDF.');
    }
  };

  // ----------------------------------------------------
  // MUTATION HANDLERS
  // ----------------------------------------------------
  const addTransaction = () => {
    if (!tAmount || !tPaidBy || !tDesc || !tDate) return;
    const amountVal = parseFloat(tAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    if (editTransactionId) {
      const newTxs = transactions.map(t => t.id === editTransactionId ? {
        ...t,
        date: tDate,
        type: tType,
        amount: amountVal,
        paidBy: tPaidBy,
        description: tDesc,
      } : t);
      updateState({ messTransactions: newTxs });
      setEditTransactionId(null);
    } else {
      const newTx: MessTransaction = {
        id: Date.now().toString(),
        date: tDate,
        type: tType,
        amount: amountVal,
        paidBy: tPaidBy,
        description: tDesc,
      };
      updateState({ messTransactions: [...transactions, newTx] });
    }
    setTAmount(''); setTDesc(''); setTDate(todayStr);
    setShowAddForm(false);
  };

  const startEditTransaction = (tx: MessTransaction) => {
    setEditTransactionId(tx.id);
    setTType(tx.type);
    setTAmount(tx.amount.toString());
    setTPaidBy(tx.paidBy);
    setTDesc(tx.description);
    setTDate(tx.date);
    setShowAddForm(true);
  };

  const addDebt = () => {
    if (!dFrom || !dTo || !dAmount || !dReason) return;
    const amountVal = parseFloat(dAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    if (editDebtId) {
      const newDs = debts.map(d => d.id === editDebtId ? {
        ...d,
        fromPerson: dFrom,
        toPerson: dTo,
        amount: amountVal,
        reason: dReason,
        date: dDate
      } : d);
      updateState({ messDebts: newDs });
      setEditDebtId(null);
    } else {
      const newDebt: MessDebt = {
        id: Date.now().toString(),
        fromPerson: dFrom,
        toPerson: dTo,
        amount: amountVal,
        reason: dReason,
        date: dDate
      };
      updateState({ messDebts: [...debts, newDebt] });
    }
    setDAmount(''); setDReason(''); setDDate(todayStr);
    setShowDebtForm(false);
  };

  const startEditDebt = (d: MessDebt) => {
    setEditDebtId(d.id);
    setDFrom(d.fromPerson);
    setDTo(d.toPerson);
    setDAmount(d.amount.toString());
    setDReason(d.reason);
    setDDate(d.date || todayStr);
    setShowDebtForm(true);
  };

  // Log meals for a member on the selected date
  const updateMemberMeal = (memberName: string, mealType: 'lunch' | 'dinner', value: number) => {
    const existingIndex = rawMeals.findIndex(m => m.date === selectedMealDate && m.memberName === memberName);
    let updatedMeals: MessMeal[] = [...rawMeals];

    if (existingIndex > -1) {
      const item = { ...updatedMeals[existingIndex] };
      if (mealType === 'lunch') {
        item.lunchCount = Math.max(0, item.lunchCount + value);
      } else {
        item.dinnerCount = Math.max(0, item.dinnerCount + value);
      }
      updatedMeals[existingIndex] = item;
    } else {
      const newMeal: MessMeal = {
        id: `${selectedMealDate}_${memberName}_${Date.now()}`,
        memberName,
        date: selectedMealDate,
        lunchCount: mealType === 'lunch' ? Math.max(0, value) : 0,
        dinnerCount: mealType === 'dinner' ? Math.max(0, value) : 0
      };
      updatedMeals.push(newMeal);
    }

    updateState({ messMeals: updatedMeals });
  };

  const handleAddMember = () => {
    const name = newMemberName.trim();
    if (!name) return;
    if (members.includes(name)) {
      alert(isBn ? 'এই সদস্য ইতিমধ্যে তালিকায় আছেন!' : 'This member is already in the list!');
      return;
    }
    const updated = [...rawMembers.length > 0 ? rawMembers : members, name];
    updateState({ messMembers: updated });
    setNewMemberName('');
    setShowMemberForm(false);
  };

  const handleStartRenameMember = (index: number, currentName: string) => {
    setEditingMemberIndex(index);
    setEditingMemberName(currentName);
  };

  const handleSaveRenameMember = (index: number) => {
    const oldName = members[index];
    const newName = editingMemberName.trim();
    if (!newName || oldName === newName) {
      setEditingMemberIndex(null);
      return;
    }

    const updatedMembers = [...members];
    updatedMembers[index] = newName;

    const updatedTxs = transactions.map(t => t.paidBy === oldName ? { ...t, paidBy: newName } : t);
    const updatedDebts = debts.map(d => {
      let from = d.fromPerson;
      let to = d.toPerson;
      if (from === oldName) from = newName;
      if (to === oldName) to = newName;
      return { ...d, fromPerson: from, toPerson: to };
    });
    const updatedMeals = rawMeals.map(m => m.memberName === oldName ? { ...m, memberName: newName } : m);

    updateState({
      messMembers: updatedMembers,
      messTransactions: updatedTxs,
      messDebts: updatedDebts,
      messMeals: updatedMeals
    });

    setEditingMemberIndex(null);
  };

  const handleConfirmDeleteMember = (index: number) => {
    setDeleteMemberIndex(index);
    setDeleteConfirmType('member');
    setDeleteConfirmId('dummy_member_id');
  };

  const executeDeleteMember = () => {
    if (deleteMemberIndex === null) return;
    const oldName = members[deleteMemberIndex];
    const updatedMembers = members.filter((_, idx) => idx !== deleteMemberIndex);

    const updatedTxs = transactions.filter(t => t.paidBy !== oldName);
    const updatedDebts = debts.filter(d => d.fromPerson !== oldName && d.toPerson !== oldName);
    const updatedMeals = rawMeals.filter(m => m.memberName !== oldName);

    updateState({
      messMembers: updatedMembers,
      messTransactions: updatedTxs,
      messDebts: updatedDebts,
      messMeals: updatedMeals
    });

    setDeleteMemberIndex(null);
    setDeleteConfirmType(null);
    setDeleteConfirmId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmType === 'transaction' && deleteConfirmId) {
      updateState({ messTransactions: transactions.filter(t => t.id !== deleteConfirmId) });
    } else if (deleteConfirmType === 'debt' && deleteConfirmId) {
      updateState({ messDebts: debts.filter(d => d.id !== deleteConfirmId) });
    } else if (deleteConfirmType === 'member') {
      executeDeleteMember();
      return;
    }
    setDeleteConfirmId(null);
    setDeleteConfirmType(null);
  };

  const budgetProgress = Math.min(100, (monthTotalCost / currentBudget) * 100);
  const budgetAlertMode = budgetProgress >= 90 ? 'danger' : budgetProgress >= 70 ? 'warning' : 'safe';

  return (
    <div className="relative z-10 w-full animate-fade-in">
      
      {/* SINGLE COLUMN pristine layout */}
      <div className="space-y-4">
          
          {/* HEADER AND ROOMMATES CONFIG CONTROL */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
            {/* Background Blur wrapper with overflow-hidden so blurs do not bleed */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]" />
            </div>
            
            <div className="flex items-center gap-3 z-10">
              <div>
                <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-cyan-300 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  {isBn ? 'মেস ও রুমের ডিজিটাল খতিয়ান' : 'Mess & Room Digital Ledger'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isBn ? 'লাইভ বাজার খরচ, রুমমেট ব্যালেন্স ও রিয়েল-টাইম মিল ক্যালকুলেটর' : 'Live grocery log, roommate sharing, and real-time meal rate calculations'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 self-start md:self-center z-20">
              <button 
                onClick={() => setShowMemberForm(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-bold rounded-xl transition-all cursor-pointer select-none"
              >
                <Users className="w-4 h-4 text-cyan-500" />
                <span>{isBn ? `রুমমেট তালিকা (${members.length})` : `Roommates (${members.length})`}</span>
              </button>

              {/* 3-bar Hamburger Menu Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMessMenu(!showMessMenu)}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-xl border border-slate-800 transition-all flex items-center justify-center cursor-pointer select-none"
                  title={isBn ? 'মেস কুইক সেটিংস' : 'Mess Quick Settings'}
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Dropdown Menu / Drawer */}
                {showMessMenu && (
                  <>
                    {/* Overlay to close menu */}
                    <div className="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-xs transition-all duration-300" onClick={() => setShowMessMenu(false)} />
                    
                    <div className="fixed sm:absolute top-0 right-0 sm:top-auto sm:right-0 h-full sm:h-auto w-80 sm:w-96 max-w-[100vw] premium-glow-panel rounded-none sm:rounded-2xl p-6 shadow-2xl z-50 space-y-4 text-left animate-slide-in-right sm:animate-fade-in sm:mt-3 overflow-y-auto max-h-screen sm:max-h-[85vh] custom-scrollbar relative">
                      {/* Ambient light bulb */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-[65px] pointer-events-none z-0" />
                      
                      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                          <h4 className="text-sm font-extrabold text-slate-100 tracking-tight">{isBn ? 'মেস কন্ট্রোল প্যানেল' : 'Mess Control Panel'}</h4>
                        </div>
                        <button onClick={() => setShowMessMenu(false)} className="p-1.5 hover:bg-slate-900/60 text-slate-400 hover:text-rose-400 rounded-lg transition-all cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 1. CLOUD SYNC PANEL inside menu */}
                      <div className="relative z-10 space-y-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 overflow-hidden shadow-[inset_0_0_12px_rgba(34,211,238,0.02)]">
                        <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
                          <div className="flex items-center gap-2">
                            <Cloud className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold text-slate-200">{isBn ? 'মেস ক্লাউড সিঙ্ক' : 'Mess Cloud Sync'}</span>
                          </div>
                          <span className={`w-1.5 h-1.5 rounded-full ${state.messAccessCode ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'}`} />
                        </div>

                        {state.messAccessCode ? (
                          <div className="space-y-2.5">
                            <div className="p-3 rounded-lg bg-slate-950/70 border border-emerald-500/15 text-center shadow-[inset_0_0_10px_rgba(16,185,129,0.03)]">
                              <span className="text-[9px] text-emerald-400 font-bold block mb-1 uppercase tracking-wider">{isBn ? 'সক্রিয় সিঙ্ক কোড' : 'Active Sync Code'}</span>
                              <div className="flex items-center justify-between bg-emerald-500/5 px-2.5 py-1.5 rounded border border-emerald-500/15 font-mono text-base font-black text-slate-100 tracking-widest">
                                <span>{showSyncCode ? state.messAccessCode : '••••••••'}</span>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => setShowSyncCode(!showSyncCode)}
                                    className="p-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                                  >
                                    {showSyncCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                  <button 
                                    onClick={handleCopyCode}
                                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                                  >
                                    {isCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={handleDisconnectSync}
                              className="w-full py-2 bg-slate-950/80 hover:bg-red-950/20 hover:text-red-400 border border-slate-800/80 hover:border-red-500/30 text-slate-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              {isBn ? 'কানেকশন বিচ্ছিন্ন করুন' : 'Disconnect Sync'}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="relative">
                              <input 
                                type={showSyncCode ? "text" : "password"}
                                value={syncCodeInput}
                                onChange={(e) => setSyncCodeInput(e.target.value.toUpperCase())}
                                placeholder={isBn ? 'কোড লিখুন (যেমনঃ MES99)' : 'Enter Sync Code'}
                                className="w-full bg-slate-950/70 border border-slate-850 focus:border-cyan-500/60 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-200 outline-none font-mono text-center uppercase tracking-wider"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSyncCode(!showSyncCode)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                              >
                                {showSyncCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <button 
                              onClick={handleConnectSync}
                              disabled={isSyncSaving}
                              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {isSyncSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span>{isBn ? 'সিঙ্ক কানেক্ট করুন' : 'Connect Sync'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 2. REPORT EXPORT / DOWNLOAD PDF inside menu */}
                      <div className="relative z-10 space-y-2.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 shadow-[inset_0_0_12px_rgba(34,211,238,0.01)]">
                        <div className="flex items-center gap-2 border-b border-slate-800/40 pb-2">
                          <Share2 className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-slate-200">{isBn ? 'রিপোর্ট এবং হিসাব বিবরণী' : 'Ledger Export Options'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={handleShareSummary}
                            className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-slate-950/80 hover:bg-slate-900/90 border border-slate-855 text-slate-300 hover:text-cyan-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{isBn ? 'বিবরণী কপি' : 'Copy Text'}</span>
                          </button>
                          
                          <button 
                            onClick={handleExportPDF}
                            className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-slate-950/80 hover:bg-slate-900/90 border border-slate-855 text-slate-300 hover:text-emerald-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isBn ? 'ডাউনলোড PDF' : 'PDF Report'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 3. ROOMMATE LIST ACCESS inside menu */}
                      <button
                        onClick={() => {
                          setShowMemberForm(true);
                          setShowMessMenu(false);
                        }}
                        className="relative z-10 w-full py-3 bg-slate-900/50 hover:bg-slate-850 border border-slate-800/60 text-slate-300 hover:text-cyan-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.02)]"
                      >
                        <Users className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span>{isBn ? `রুমমেট তালিকা ও ম্যানেজমেন্ট (${members.length})` : `Roommates / Members (${members.length})`}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>


          {/* Roommates Config Modal */}
          {showMemberForm && (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 rounded-3xl">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                  <h4 className="font-extrabold text-slate-100 flex items-center gap-2 text-sm">
                    <Users className="w-5 h-5 text-cyan-400" />
                    {isBn ? 'রুমমেট তালিকা ও মেম্বার ম্যানেজমেন্ট' : 'Roommates / Mess Members'}
                  </h4>
                  <button onClick={() => { setShowMemberForm(false); setEditingMemberIndex(null); }} className="text-slate-400 hover:text-red-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Add Member Row */}
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder={isBn ? 'মেম্বারের নাম লিখুন...' : 'New member name...'}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                  />
                  <button 
                    onClick={handleAddMember}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(8,145,178,0.3)]"
                  >
                    <UserPlus className="w-4 h-4" />
                    {isBn ? 'যোগ করুন' : 'Add'}
                  </button>
                </div>

                {/* Members List */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {members.map((m, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between group">
                      {editingMemberIndex === idx ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input 
                            type="text"
                            value={editingMemberName}
                            onChange={(e) => setEditingMemberName(e.target.value)}
                            className="bg-slate-900 border border-cyan-500 text-slate-100 text-xs px-2 py-1 rounded outline-none w-full font-bold"
                            autoFocus
                          />
                          <button onClick={() => handleSaveRenameMember(idx)} className="p-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                            <span className="text-[10px] font-bold text-cyan-400">{m.substring(0, 1)}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-300">{m}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        {editingMemberIndex !== idx && (
                          <button 
                            onClick={() => handleStartRenameMember(idx, m)}
                            className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleConfirmDeleteMember(idx)}
                          disabled={members.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HORIZONTAL CALENDAR STRIP */}
          <div className="bg-slate-900/30 p-3 rounded-2xl border border-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-amber-400 font-extrabold flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
                {new Date().toLocaleString(isBn ? 'bn-BD' : 'en-US', { month: 'long', year: 'numeric' })} {isBn ? 'মাসের খরচ গ্রিড' : 'Month Flow'}
              </h4>
            </div>
            <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar snap-x">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentMonthStr}-${day.toString().padStart(2, '0')}`;
                const isToday = dateStr === todayStr;
                const expense = dailyExpenses[dateStr] || 0;
                const hasExpense = expense > 0;
                const d = new Date(dateStr);
                const dayName = isBn 
                  ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'][d.getDay()] 
                  : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];

                return (
                  <button 
                    key={dateStr}
                    onClick={() => {
                      setSelectedMealDate(dateStr);
                      setActiveTab('meals');
                    }}
                    className={`snap-start min-w-[50px] h-16 rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all duration-300 relative flex-shrink-0 group overflow-hidden
                      ${isToday 
                        ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
                        : selectedMealDate === dateStr
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                          : hasExpense
                            ? 'border-cyan-800/40 bg-cyan-950/20 hover:border-cyan-700/60'
                            : 'border-slate-800/60 bg-slate-900/10 hover:bg-slate-800/20'
                      }
                    `}
                  >
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">{dayName}</span>
                    <span className={`text-sm font-black font-mono ${isToday ? 'text-amber-400' : selectedMealDate === dateStr ? 'text-cyan-400' : 'text-slate-300'}`}>{day}</span>
                    
                    {hasExpense && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BENTO STATS CARDS (with custom hover glowing and shadows) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
            
            {/* 1. Meal Rate */}
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 shadow-md flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] duration-300">
                <Utensils className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isBn ? 'জনপ্রতি মিল খরচ' : 'Meal Cost Per Head'}</p>
              <p className="text-base font-black text-emerald-400 font-mono mt-0.5">৳{mealRate.toFixed(1)}</p>
            </div>

            {/* 2. Cooking Cost */}
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 shadow-md flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center mb-1.5 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] duration-300">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isBn ? 'মোট রান্নার খরচ' : 'Cooking Cost'}</p>
              <p className="text-base font-black text-cyan-400 font-mono mt-0.5">৳{monthCookingCost}</p>
            </div>

            {/* 3. Rent & Other overheads */}
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 shadow-md flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mb-1.5 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] duration-300">
                <Home className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isBn ? 'রুম ভাড়া ও অন্যান্য' : 'Rent & Other'}</p>
              <p className="text-base font-black text-blue-400 font-mono mt-0.5">৳{monthOtherCost}</p>
            </div>

            {/* 4. Total Meal Members */}
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 shadow-md flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-1.5 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] duration-300">
                <Users className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isBn ? 'মোট সদস্য সংখ্যা' : 'Total Members'}</p>
              <p className="text-base font-black text-purple-400 font-mono mt-0.5">{members.length}</p>
            </div>

          </div>

          {/* TAB HEADERS */}
          <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 gap-1 overflow-x-auto custom-scrollbar select-none">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer border ${
                activeTab === 'transactions' 
                  ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-black' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border-transparent'
              }`}
            >
              <Wallet className={`w-5 h-5 transition-all duration-300 ${activeTab === 'transactions' ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
              <span>{isBn ? 'বাজার' : 'Bazar'}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('meals')}
              className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer border ${
                activeTab === 'meals' 
                  ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-black' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border-transparent'
              }`}
            >
              <Users className={`w-5 h-5 transition-all duration-300 ${activeTab === 'meals' ? 'text-emerald-400 scale-110' : 'text-slate-400'}`} />
              <span>{isBn ? 'মিল সদস্য' : 'Meal Members'}</span>
            </button>

            <button
              onClick={() => setActiveTab('debts')}
              className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer border ${
                activeTab === 'debts' 
                  ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-300 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] font-black' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border-transparent'
              }`}
            >
              <Handshake className={`w-5 h-5 transition-all duration-300 ${activeTab === 'debts' ? 'text-purple-400 scale-110' : 'text-slate-400'}`} />
              <span>{isBn ? 'পাওনা / দেনা' : 'Loans'}</span>
            </button>
          </div>

          {/* TAB PANELS WITH FRAMER MOTION TRANSITIONS */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: EXPENSES LIST */}
              {activeTab === 'transactions' && (
                <motion.div
                  key="tx"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {!showAddForm ? (
                    <button
                      onClick={() => {
                        if (members.length === 0) {
                          alert(isBn ? 'দয়া করে আগে রুমমেট তালিকা বা মেম্বার তৈরি করুন!' : 'Please add roommates first!');
                          return;
                        }
                        setShowAddForm(true);
                      }}
                      className="w-full py-4 rounded-xl border-2 border-dashed border-slate-800 text-slate-500 font-bold flex items-center justify-center gap-2 hover:bg-slate-900/20 hover:border-cyan-500/30 hover:text-cyan-400 transition-all group cursor-pointer"
                    >
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform text-cyan-500" />
                      <span>{isBn ? 'নতুন খরচ যোগ করুন' : 'Add New Expense Log'}</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/5 space-y-4 relative overflow-hidden shadow-lg animate-fade-in">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                        <h4 className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-cyan-400" />
                          {isBn ? (editTransactionId ? 'খরচ বিবরণ সংশোধন' : 'নতুন খরচ যোগ করুন') : (editTransactionId ? 'Edit Expense Log' : 'Add New Expense')}
                        </h4>
                        <button onClick={() => {
                          setShowAddForm(false);
                          setEditTransactionId(null);
                          setTAmount(''); setTDesc(''); setTDate(todayStr);
                        }} className="text-slate-500 hover:text-red-400 p-1 bg-slate-800/80 rounded-full"><X className="w-4 h-4"/></button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'খরচের ধরন' : 'Category'}</label>
                          <select 
                            value={tType} onChange={(e: any) => setTType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
                          >
                            <option value="cooking">{isBn ? 'রান্না / বাজার খরচ' : 'Groceries / Food'}</option>
                            <option value="room_rent">{isBn ? 'রুম ভাড়া (Shared)' : 'Room Rent (Shared)'}</option>
                            <option value="others">{isBn ? 'অন্যান্য মেস খরচ' : 'Utilities / Other (Shared)'}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'তারিখ' : 'Date'}</label>
                          <input 
                            type="date" value={tDate} onChange={(e) => setTDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-cyan-500 [color-scheme:dark]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'টাকার পরিমাণ (৳)' : 'Amount (TK)'}</label>
                          <input 
                            type="number" value={tAmount} onChange={(e) => setTAmount(e.target.value)} placeholder="0.00"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-cyan-500 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'কে টাকা দিলো?' : 'Paid By'}</label>
                          <select 
                            value={tPaidBy} onChange={(e) => setTPaidBy(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 font-bold"
                          >
                            {members.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'খরচের বিবরণ (যেমনঃ ৫ কেজি চাল, ডিশ বিল ইত্যাদি)' : 'Description'}</label>
                          <input 
                            type="text" value={tDesc} onChange={(e) => setTDesc(e.target.value)} placeholder={isBn ? 'যেমনঃ বাজার খরচ...' : 'e.g. Bought beef & spices...'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={addTransaction}
                        className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(8,145,178,0.35)] text-xs uppercase tracking-wider"
                      >
                        {isBn ? (editTransactionId ? 'হিসাব আপডেট করুন' : 'হিসাব সংরক্ষণ করুন') : (editTransactionId ? 'Update Log' : 'Save Log')}
                      </button>
                    </div>
                  )}

                  {/* Transaction ledger list */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                      <div key={t.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-slate-800/80 flex items-center justify-between group transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner ${
                            t.type === 'cooking' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                            t.type === 'room_rent' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 'bg-purple-500/10 text-purple-400 border border-purple-500/25'
                          }`}>
                            {t.type === 'cooking' ? <Utensils className="w-3.5 h-3.5" /> : t.type === 'room_rent' ? <Home className="w-3.5 h-3.5" /> : <Coins className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <p className="text-slate-200 font-bold text-xs">{t.description}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5 flex items-center flex-wrap gap-1">
                              <span className="text-cyan-400/90 font-bold">{t.paidBy}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{t.date}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-500">{getDayName(t.date)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black font-mono text-cyan-400">৳{t.amount}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditTransaction(t)} className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded">
                              <Edit2 className="w-3 h-3"/>
                            </button>
                            <button onClick={() => { setDeleteConfirmId(t.id); setDeleteConfirmType('transaction'); }} className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded">
                              <Trash2 className="w-3 h-3"/>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center gap-2">
                        <Info className="w-8 h-8 text-slate-600" />
                        <span>{isBn ? 'এই মাসে এখনো কোনো বাজার খরচ যুক্ত করা হয়নি।' : 'No common expenses recorded for this month.'}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: MEALS REGISTRATION */}
              {activeTab === 'meals' && (
                <motion.div
                  key="meals"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Meal Member Management Header Card */}
                  <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
                        <Users className="w-4 h-4 text-emerald-400" />
                        {isBn ? 'মিল সদস্য তালিকা ও হিসাব' : 'Meal Members & Cost Share'}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {isBn 
                          ? 'এখানে মেসের বা মিলের সকল সদস্য যুক্ত ও পরিচালনা করুন। মোট রান্নার খরচ সকল সদস্যের মধ্যে সমানভাগে ভাগ হবে।' 
                          : 'Manage all members here. Cooking/grocery expenses will be split equally among members.'}
                      </p>
                    </div>

                    <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-[10px] font-bold text-emerald-400 font-mono">
                      {isBn ? `জনপ্রতি বাজার খরচ শেয়ার: ৳${mealRate.toFixed(1)}` : `Food Cost Per Head: ৳${mealRate.toFixed(1)}`}
                    </div>
                  </div>

                  {/* Add Member Row */}
                  <div className="p-4 rounded-xl bg-slate-905/40 border border-slate-850 flex flex-col sm:flex-row gap-3 items-center">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                        {isBn ? 'নতুন সদস্যের নাম' : 'New Member Name'}
                      </label>
                      <input 
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder={isBn ? 'সদস্যের নাম লিখুন...' : 'Enter roommate name...'}
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition-colors"
                      />
                    </div>
                    <button 
                      onClick={handleAddMember}
                      className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 self-end h-[41px] cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{isBn ? 'সদস্য যুক্ত করুন' : 'Add Member'}</span>
                    </button>
                  </div>

                  {/* Active Members List */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {members.map((m, idx) => {
                      return (
                        <div key={idx} className="p-3 rounded-xl bg-slate-955/30 border border-slate-850 hover:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                              <span className="text-[11px] font-black text-emerald-400 font-mono">{m.substring(0, 1).toUpperCase()}</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              {editingMemberIndex === idx ? (
                                <div className="flex items-center gap-2 max-w-xs">
                                  <input 
                                    type="text"
                                    value={editingMemberName}
                                    onChange={(e) => setEditingMemberName(e.target.value)}
                                    className="bg-slate-900 border border-emerald-500 text-slate-100 text-xs px-2 py-1.5 rounded-lg outline-none w-full font-bold"
                                    autoFocus
                                  />
                                  <button 
                                    onClick={() => handleSaveRenameMember(idx)} 
                                    className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all cursor-pointer"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="font-bold text-xs text-slate-200 block truncate">{m}</span>
                                  <span className="text-[10px] text-slate-400 font-bold font-mono">
                                    {isBn ? `রান্না/বাজার খরচ শেয়ার: ৳${mealRate.toFixed(1)}` : `Grocery share: ৳${mealRate.toFixed(1)}`}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            {editingMemberIndex !== idx && (
                              <button 
                                onClick={() => handleStartRenameMember(idx, m)}
                                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 rounded-lg transition-all cursor-pointer"
                                title={isBn ? 'নাম পরিবর্তন' : 'Rename'}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleConfirmDeleteMember(idx)}
                              disabled={members.length <= 1}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900/60 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                              title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: MANUAL DEBTS LOG */}
              {activeTab === 'debts' && (
                <motion.div
                  key="debts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {!showDebtForm ? (
                    <button
                      onClick={() => {
                        if (members.length < 2) {
                          alert(isBn ? 'পাওনা হিসাবের জন্য অন্তত ২ জন মেম্বার থাকতে হবে!' : 'Need at least 2 members!');
                          return;
                        }
                        setShowDebtForm(true);
                      }}
                      className="w-full py-4 rounded-xl border-2 border-dashed border-slate-800 text-slate-500 font-bold flex items-center justify-center gap-2 hover:bg-slate-900/20 hover:border-purple-500/30 hover:text-purple-400 transition-all group cursor-pointer"
                    >
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform text-purple-500" />
                      <span>{isBn ? 'নতুন লোন বা পাওনা যোগ করুন' : 'Record Peer Debt / Loan'}</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-950/5 space-y-4 relative overflow-hidden shadow-lg animate-fade-in">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                        <h4 className="text-purple-400 font-bold text-xs">
                          {isBn ? (editDebtId ? 'পাওনা সংশোধন' : 'নতুন পাওনা এন্ট্রি') : (editDebtId ? 'Edit Debt Record' : 'Record Peer Debt')}
                        </h4>
                        <button onClick={() => {
                          setShowDebtForm(false);
                          setEditDebtId(null);
                          setDAmount(''); setDReason(''); setDDate(todayStr);
                        }} className="text-slate-500 hover:text-red-400 p-1 bg-slate-800 rounded-full"><X className="w-4 h-4"/></button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'কে ধার নিলো?' : 'Who Owes?'}</label>
                          <select 
                            value={dFrom} onChange={(e) => setDFrom(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-purple-500 font-bold"
                          >
                            {members.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'কাকে টাকা দিবে?' : 'To Whom?'}</label>
                          <select 
                            value={dTo} onChange={(e) => setDTo(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-purple-500 font-bold"
                          >
                            {members.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'টাকার পরিমাণ (৳)' : 'Amount (TK)'}</label>
                          <input 
                            type="number" value={dAmount} onChange={(e) => setDAmount(e.target.value)} placeholder="0.00"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-purple-500 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'তারিখ' : 'Date'}</label>
                          <input 
                            type="date" value={dDate} onChange={(e) => setDDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-purple-500 [color-scheme:dark]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">{isBn ? 'ধার বা পাওনার বিবরণ' : 'Description/Reason'}</label>
                          <input 
                            type="text" value={dReason} onChange={(e) => setDReason(e.target.value)} placeholder={isBn ? 'যেমনঃ বিকাশে লোন, ফ্লেক্সিলোড...' : 'e.g. Bkash advance, flexiload...'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={addDebt}
                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.35)] text-xs uppercase tracking-wider"
                      >
                        {isBn ? (editDebtId ? 'সংশোধন সেভ করুন' : 'নতুন পাওনা সংরক্ষণ') : (editDebtId ? 'Save Updates' : 'Save Record')}
                      </button>
                    </div>
                  )}

                  {/* Peer loans history list */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {debts.slice().sort((a, b) => new Date(b.date || todayStr).getTime() - new Date(a.date || todayStr).getTime()).map(d => (
                      <div key={d.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
                            <Handshake className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-slate-200 font-bold text-xs">{d.reason}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">
                              <span className="text-red-400 font-bold">{d.fromPerson}</span> {isBn ? '➔ দিবে কাকে ➔' : '➔ owes ➔'} <span className="text-emerald-400 font-bold">{d.toPerson}</span>
                              {d.date && <span className="text-slate-500"> • {d.date}</span>}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black font-mono text-purple-400">৳{d.amount}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditDebt(d)} className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded">
                              <Edit2 className="w-3 h-3"/>
                            </button>
                            <button onClick={() => { setDeleteConfirmId(d.id); setDeleteConfirmType('debt'); }} className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded">
                              <Trash2 className="w-3 h-3"/>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {debts.length === 0 && (
                      <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center gap-2">
                        <Info className="w-8 h-8 text-slate-600" />
                        <span>{isBn ? 'ব্যক্তিগত লোন বা ধার-দেনার কোনো বিবরণ নেই।' : 'No personal loans logged between roommates.'}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      {/* CONFIRM DELETION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl relative overflow-hidden animate-zoom-in">
            <h4 className="font-extrabold text-slate-100 mb-2 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
              {isBn ? 'ডিলিট নিশ্চিতকরণ!' : 'Confirm Deletion'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {isBn 
                ? 'আপনি কি নিশ্চিতভাবে এই তথ্যটি খতিয়ান থেকে স্থায়ীভাবে মুছে ফেলতে চান?' 
                : 'Are you sure you want to permanently delete this record from the ledger?'}
            </p>
            <div className="flex justify-end gap-2.5">
              <button 
                onClick={() => { setDeleteConfirmId(null); setDeleteConfirmType(null); }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_12px_rgba(220,38,38,0.3)]"
              >
                {isBn ? 'মুছে ফেলুন' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
