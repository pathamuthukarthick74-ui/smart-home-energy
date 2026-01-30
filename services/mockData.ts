
import { EnergyData, BillRecord, Alert } from '../types';

const APPLIANCE_CONFIG = [
  { name: 'Air Conditioner', color: '#10b981', base: 1200, var: 200, icon: 'AC' },
  { name: 'Refrigerator', color: '#10b981', base: 150, var: 30, icon: 'RF' },
  { name: 'Washing Machine', color: '#10b981', base: 0, var: 1500, intermittent: true, icon: 'WM' },
  { name: 'Lighting', color: '#10b981', base: 100, var: 20, icon: 'LT' },
  { name: 'Home Theater', color: '#10b981', base: 80, var: 40, icon: 'HT' },
];

export const generateRealTimeData = (currentStates?: Record<string, boolean>): EnergyData => {
  const appliances = APPLIANCE_CONFIG.map(app => {
    const isOn = currentStates ? currentStates[app.name] : true;
    let power = 0;
    
    if (isOn) {
      power = app.base + Math.random() * app.var;
      if (app.intermittent && Math.random() > 0.4) power = 0;
    }

    return { 
      name: app.name, 
      power: Math.round(power), 
      color: app.color,
      status: (Math.random() > 0.02 ? 'online' : 'offline') as 'online' | 'offline',
      isOn
    };
  });

  const totalPower = appliances.reduce((sum, app) => sum + app.power, 0);

  return {
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    totalPower,
    appliances
  };
};

export const getHistoricalBills = (): BillRecord[] => [
  { month: 'May 2024', units: 420, cost: 50.40, status: 'Paid' },
  { month: 'June 2024', units: 380, cost: 45.60, status: 'Paid' },
  { month: 'July 2024', units: 510, cost: 61.20, status: 'Paid' },
  { month: 'August 2024', units: 440, cost: 52.80, status: 'Pending' },
];

export const mockAlerts: Alert[] = [
  { id: '1', type: 'warning', message: 'High load detected in HVAC system', timestamp: '10:15 AM' },
  { id: '2', type: 'info', message: 'ESP32 Device Node synchronized via local IP', timestamp: '09:30 AM' },
];
