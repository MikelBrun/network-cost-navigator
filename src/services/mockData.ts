
import { 
  CostItem, 
  CalculationRule, 
  Region, 
  ProjectParameters, 
  CostResult 
} from "../types/models";

// Mock equipment data
export const mockEquipment: CostItem[] = [
  {
    id: "eq1",
    name: "24-Port Layer 2 Switch",
    description: "Network Equipment - 24-Port Layer 2 Switch",
    category: "Network Equipment",
    unitCost: 3780.00,
    isActive: true
  },
  {
    id: "eq2",
    name: "Network Equipment Installation",
    description: "Vendor labor to install network switches",
    category: "Labor",
    unitCost: 150.00,
    isActive: true
  },
  {
    id: "eq3",
    name: "Conference Phone",
    description: "Model 8832 + Mic Kit",
    category: "Phones",
    unitCost: 1212.60,
    isActive: true
  },
  {
    id: "eq4",
    name: "Patch Cord - Category 6",
    description: "Patch Cords: Rack/Cabinet side - Category 6",
    category: "Cabling",
    unitCost: 4.73,
    isActive: true
  },
  {
    id: "eq5",
    name: "48-Port Layer 2 POE Switch",
    description: "Wireless Network Equipment - 48-Port Layer 2 POE Switches for APs",
    category: "Wireless Equipment",
    unitCost: 6324.00,
    isActive: true
  },
  {
    id: "eq6",
    name: "Wireless Access Point (Outdoor)",
    description: "Meraki MR86 Cloud Managed AP (For Outdoors)",
    category: "Wireless Equipment",
    unitCost: 1947.00,
    isActive: true
  },
  {
    id: "eq7",
    name: "Meraki Dual-band Antenna",
    description: "Meraki Dual-band Omni Antenna MA-ANT-20",
    category: "Wireless Equipment",
    unitCost: 133.80,
    isActive: true
  },
  {
    id: "eq8",
    name: "VoIP Monthly Line",
    description: "VoIP Monthly Line Charges",
    category: "Recurring",
    unitCost: 12.74,
    isActive: true
  },
  {
    id: "eq9",
    name: "Wireless Access Point Patch Cord",
    description: "Wireless Access Point - 2X CAT6a Patch Cord 5' by default",
    category: "Cabling",
    unitCost: 5.94,
    isActive: true
  }
];

// Mock calculation rules
export const mockRules: CalculationRule[] = [
  {
    id: "rule1",
    name: "Conference Phone Calculation",
    description: "Calculate cost for conference phones based on input quantity",
    condition: "conferencePhonesQty > 0",
    action: "ADD_ITEM: 'Conference Phone', conferencePhonesQty",
    priority: 10,
    isActive: true
  },
  {
    id: "rule2",
    name: "Switch Calculation",
    description: "Calculate Layer 2 switches based on phone quantities",
    condition: "premiumPhonesQty + standardPhonesQty + conferencePhonesQty > 0",
    action: "ADD_ITEM: '24-Port Layer 2 Switch', Math.ceil((premiumPhonesQty + standardPhonesQty + conferencePhonesQty) / 24)",
    priority: 20,
    isActive: true
  },
  {
    id: "rule3",
    name: "Network Equipment Installation",
    description: "Labor cost for switch installation",
    condition: "true", // Always calculate
    action: "ADD_LABOR: 'Network Equipment Installation', TOTAL_SWITCHES",
    priority: 30,
    isActive: true
  },
  {
    id: "rule4",
    name: "Patch Cord Calculation",
    description: "Calculate patch cords based on phone quantities",
    condition: "premiumPhonesQty + standardPhonesQty + conferencePhonesQty > 0",
    action: "ADD_ITEM: 'Patch Cord - Category 6', premiumPhonesQty + standardPhonesQty + conferencePhonesQty",
    priority: 40,
    isActive: true
  },
  {
    id: "rule5",
    name: "Wireless Access Point Switch",
    description: "Calculate POE switches needed for wireless access points",
    condition: "wirelessPredictiveSurveyResultsQty > 0",
    action: "ADD_ITEM: '48-Port Layer 2 POE Switch', Math.ceil(wirelessPredictiveSurveyResultsQty / 48)",
    priority: 50,
    isActive: true
  },
  {
    id: "rule6",
    name: "Wireless Equipment",
    description: "Calculate wireless equipment costs",
    condition: "wireless === true",
    action: "ADD_WIRELESS_EQUIPMENT",
    priority: 60,
    isActive: true
  },
  {
    id: "rule7",
    name: "Risk Factor Premium",
    description: "Apply complexity risk premium",
    condition: "riskFactor > 0",
    action: "APPLY_RISK_PREMIUM: riskFactor",
    priority: 100, // Run last
    isActive: true
  }
];

// Mock regions
export const mockRegions: Region[] = [
  {
    id: "reg1",
    name: "Northeast",
    costMultiplier: 1.15,
    isActive: true
  },
  {
    id: "reg2",
    name: "Southeast",
    costMultiplier: 1.05,
    isActive: true
  },
  {
    id: "reg3",
    name: "Midwest",
    costMultiplier: 1.00,
    isActive: true
  },
  {
    id: "reg4",
    name: "Southwest",
    costMultiplier: 1.08,
    isActive: true
  },
  {
    id: "reg5",
    name: "West",
    costMultiplier: 1.12,
    isActive: true
  }
];

// Sample calculation result for demonstration
export const mockCalculationResult: CostResult = {
  oneTimeItems: [
    {
      description: "Network Equipment - 24-Port Layer 2 Switch",
      calculatedQuantity: 5,
      requiredQuantity: 5,
      unitCost: 3780.00,
      extendedCost: 18900.00,
      detailedDescription: "New 24-port layer 2 switch @ 40% expansion",
      category: "one-time"
    },
    {
      description: "Network Equipment Installation",
      calculatedQuantity: 5,
      requiredQuantity: 5,
      unitCost: 150.00,
      extendedCost: 750.00,
      detailedDescription: "Vendor labor to install network switches",
      category: "one-time"
    },
    {
      description: "Conference Phones",
      calculatedQuantity: 45,
      requiredQuantity: 45,
      unitCost: 1212.60,
      extendedCost: 54567.00,
      detailedDescription: "Model 8832 + Mic Kit",
      category: "one-time"
    },
    {
      description: "Patch Cords: Rack/Cabinet side - Category 6",
      calculatedQuantity: 45,
      requiredQuantity: 45,
      unitCost: 4.73,
      extendedCost: 212.85,
      detailedDescription: "Cord 7' by default",
      category: "one-time"
    },
    {
      description: "Wireless Network Equipment - 48-Port Layer 2 POE Switches for APs",
      calculatedQuantity: 45,
      requiredQuantity: 45,
      unitCost: 6324.00,
      extendedCost: 284580.00,
      detailedDescription: "New 48-port switches required to support WAPs only @ 40% expansion",
      category: "one-time"
    }
  ],
  recurringItems: [
    {
      description: "VoIP Monthly Line Charges",
      calculatedQuantity: 45,
      requiredQuantity: 45,
      unitCost: 12.74,
      extendedCost: 6879.60,
      category: "recurring"
    }
  ],
  oneTimeSubtotal: 359009.85,
  recurringSubtotal: 6879.60,
  complexityRiskPremium: 35900.99, // 10% complexity factor
  totalCost: 394910.84
};

// Mock sample default parameters
export const mockDefaultParameters: ProjectParameters = {
  requestor: "",
  projectType: "New Installation",
  wireless: false,
  cellularBackup: false,
  projectComplexity: "Medium",
  stationCableComplexity: "Standard",
  cableRegion: "Midwest",
  riskFactor: 1, // Default risk factor
  premiumPhonesQty: 0,
  standardPhonesQty: 0,
  conferencePhonesQty: 0,
  singleLinePhonesQty: 0,
  phoneExpansionModulesQty: 0,
  faxAnalogLinesQty: 0,
  otherNetworkDevicesQty: 0,
  newNetworkDropsQty: 0
};
