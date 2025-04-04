
// Base models for our application

// Input parameters
export interface ProjectParameters {
  // Project info
  requestor: string;
  linkToDCE?: string;
  ritm?: string;
  billingProfile?: string;
  prjOrDemand?: string;
  requestType?: string;
  
  // Project specifications
  projectType?: string;
  wireless?: boolean;
  cellularBackup?: boolean;
  projectComplexity?: 'Low' | 'Medium' | 'High';
  stationCableComplexity?: string;
  cableRegion?: string;
  riskFactor?: number;

  // Phone details
  premiumPhonesQty?: number;
  standardPhonesQty?: number;
  conferencePhonesQty?: number;
  singleLinePhonesQty?: number;
  phoneExpansionModulesQty?: number;
  faxAnalogLinesQty?: number;
  
  // LAN/WAN equipment
  otherNetworkDevicesQty?: number;
  newNetworkDropsQty?: number;
  newPSTNLinesQty?: number;
  routerRequiredForCircuit?: boolean;
  existingITSWANCircuit?: string;
  existingCircuitSpeed?: string;
  otherCircuitSpeedRequired?: string;
  
  // Computer equipment
  pcsQty?: number;
  printersQty?: number;
  otherNetworkConnectedDevicesLAN?: number;
  
  // Network upgrade details
  newNetworkDropsUPG?: number;
  routerRequiredForCircuitUPG?: boolean;
  existingITSWANCircuitUPG?: string;
  existingCircuitSpeedUPG?: string;
  qosServiceRequired?: boolean;
  higherSpeedCircuitRequired?: boolean;
  existingITSWANCircuitHS?: string;
  existingCircuitSpeedHS?: string;
  desiredWANSpeed?: string;
  newOrUpgradeVANQty?: number;
  
  // Station cabling
  newNetworkDropsStation?: number;
  
  // Wireless
  wirelessPredictiveSurveyResultsQty?: number;
  wirelessPredictiveSurveyResultsOutdoorQty?: number;
}

// Equipment/item definition
export interface CostItem {
  id: string;
  name: string;
  description: string;
  category: string;
  unitCost: number;
  isActive: boolean;
}

// Rule for calculation
export interface CalculationRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  priority: number;
  isActive: boolean;
}

// Region for cost adjustment
export interface Region {
  id: string;
  name: string;
  costMultiplier: number;
  isActive: boolean;
}

// Cost calculation result item
export interface CostResultItem {
  description: string;
  calculatedQuantity: number;
  adjustmentQuantity?: number;
  requiredQuantity: number;
  unitCost: number;
  extendedCost: number;
  detailedDescription?: string;
  category: 'one-time' | 'recurring';
  subcategory?: string;
}

// Full cost calculation result
export interface CostResult {
  oneTimeItems: CostResultItem[];
  recurringItems: CostResultItem[];
  oneTimeSubtotal: number;
  recurringSubtotal: number;
  complexityRiskPremium?: number;
  totalCost: number;
}
