
export interface EnergyData {
  timestamp: string;
  totalPower: number;
  appliances: {
    name: string;
    power: number;
    color: string;
    status: 'online' | 'offline';
    isOn: boolean;
  }[];
}

export interface BillRecord {
  month: string;
  units: number;
  cost: number;
  status: 'Paid' | 'Pending';
}

export interface User {
  id: string;
  username: string;
  email: string;
  homeId: string;
  esp32Ip: string;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}
