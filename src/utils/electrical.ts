export interface Device {
  id: string;
  name: string;
  power: number; // in Watts
  type: 'inductive' | 'resistive';
  icon: string;
}

export const COMMON_DEVICES: Device[] = [
  { id: 'light', name: 'Đèn (LED)', power: 20, type: 'resistive', icon: '💡' },
  { id: 'fan', name: 'Quạt', power: 75, type: 'inductive', icon: '🎐' },
  { id: 'tv', name: 'Tivi', power: 150, type: 'resistive', icon: '📺' },
  { id: 'fridge', name: 'Tủ lạnh', power: 200, type: 'inductive', icon: '🧊' },
  { id: 'ac_9k', name: 'Điều hòa 9000 BTU', power: 900, type: 'inductive', icon: '❄️' },
  { id: 'ac_12k', name: 'Điều hòa 12000 BTU', power: 1200, type: 'inductive', icon: '❄️' },
  { id: 'water_heater', name: 'Bình nóng lạnh', power: 2500, type: 'resistive', icon: '🚿' },
  { id: 'induction_cooker', name: 'Bếp từ', power: 3000, type: 'resistive', icon: '🍳' },
  { id: 'washing_machine', name: 'Máy giặt', power: 500, type: 'inductive', icon: '🧺' },
  { id: 'microwave', name: 'Lò vi sóng', power: 1000, type: 'resistive', icon: '🍞' },
  { id: 'kettle', name: 'Ấm siêu tốc', power: 2000, type: 'resistive', icon: '☕' },
];

export interface Room {
  id: string;
  name: string;
  devices: { deviceId: string; quantity: number }[];
}

export interface CalculationResult {
  totalPower: number; // Watts
  current: number; // Amperes
  recommendedMCB: number; // Amperes
  recommendedWireSize: number; // mm2
}

/**
 * Calculates electrical properties based on total power.
 * Assumes 220V single-phase power supply.
 * Cos phi for inductive loads is typically 0.8.
 */
export function calculateElectrical(rooms: Room[]): CalculationResult {
  let totalPower = 0;
  
  rooms.forEach(room => {
    room.devices.forEach(d => {
      const deviceData = COMMON_DEVICES.find(cd => cd.id === d.deviceId);
      if (deviceData) {
        totalPower += deviceData.power * d.quantity;
      }
    });
  });

  // Voltage
  const U = 220;
  // Power factor (cos phi) - simplified assumption
  const cosPhi = 0.8;
  
  // Calculated current I = P / (U * cosPhi)
  // For simplicity, we use a mixed load approach or just P/U for resistive
  // but let's use a safe assumption for residential design.
  const current = totalPower / (U * cosPhi);

  // Recommended MCB: typically 1.25 to 1.5 times the load current
  const MCB_RATINGS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100];
  const requiredMCB = current * 1.25;
  const recommendedMCB = MCB_RATINGS.find(r => r >= requiredMCB) || MCB_RATINGS[MCB_RATINGS.length - 1];

  // Recommended Wire Size (Cu/PVC)
  // 6A -> 1.5mm2
  // 10A-16A -> 2.5mm2
  // 20A-25A -> 4.0mm2
  // 32A-40A -> 6.0mm2
  // 50A-63A -> 10.0mm2
  let recommendedWireSize = 1.5;
  if (recommendedMCB <= 6) recommendedWireSize = 1.5;
  else if (recommendedMCB <= 16) recommendedWireSize = 2.5;
  else if (recommendedMCB <= 25) recommendedWireSize = 4.0;
  else if (recommendedMCB <= 40) recommendedWireSize = 6.0;
  else if (recommendedMCB <= 63) recommendedWireSize = 10.0;
  else recommendedWireSize = 16.0;

  return {
    totalPower,
    current,
    recommendedMCB,
    recommendedWireSize,
  };
}
