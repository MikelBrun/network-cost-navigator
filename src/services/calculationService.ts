
import { ProjectParameters, CostResult, CostResultItem, CostItem } from "../types/models";
import { mockEquipment, mockRegions } from "./mockData";

// Helper function to find equipment by name
const findEquipment = (name: string): CostItem | undefined => {
  return mockEquipment.find(item => item.name === name || item.description === name);
};

// Helper function to get region multiplier
const getRegionMultiplier = (region: string | undefined): number => {
  if (!region) return 1.0;
  const foundRegion = mockRegions.find(r => r.name === region);
  return foundRegion?.costMultiplier || 1.0;
};

// Perform the calculation based on input parameters
export const calculateCosts = (params: ProjectParameters): CostResult => {
  const oneTimeItems: CostResultItem[] = [];
  const recurringItems: CostResultItem[] = [];
  const regionMultiplier = getRegionMultiplier(params.cableRegion);
  
  // Helper to add item to appropriate array
  const addItem = (
    description: string,
    quantity: number,
    unitCost: number,
    detailedDescription?: string,
    category: 'one-time' | 'recurring' = 'one-time',
    subcategory?: string
  ): void => {
    const adjustedUnitCost = category === 'one-time' ? unitCost * regionMultiplier : unitCost;
    const item: CostResultItem = {
      description,
      calculatedQuantity: quantity,
      requiredQuantity: quantity,
      unitCost: adjustedUnitCost,
      extendedCost: quantity * adjustedUnitCost,
      detailedDescription,
      category,
      subcategory
    };
    
    if (category === 'recurring') {
      recurringItems.push(item);
    } else {
      oneTimeItems.push(item);
    }
  };
  
  // Calculate network switches based on phone quantities
  const totalPhones = (params.premiumPhonesQty || 0) + 
                     (params.standardPhonesQty || 0) + 
                     (params.conferencePhonesQty || 0) + 
                     (params.singleLinePhonesQty || 0);
  
  if (totalPhones > 0) {
    // Calculate required switches (assuming 24 ports per switch)
    const switchesNeeded = Math.ceil(totalPhones / 24);
    const switchEquipment = findEquipment("24-Port Layer 2 Switch");
    
    if (switchEquipment) {
      addItem(
        switchEquipment.description,
        switchesNeeded,
        switchEquipment.unitCost,
        "New 24-port layer 2 switch @ 40% expansion"
      );
      
      // Add installation labor for switches
      const installLabor = findEquipment("Network Equipment Installation");
      if (installLabor) {
        addItem(
          installLabor.description,
          switchesNeeded,
          installLabor.unitCost,
          "Vendor labor to install network switches"
        );
      }
    }
    
    // Add patch cords for each phone
    const patchCord = findEquipment("Patch Cord - Category 6");
    if (patchCord && totalPhones > 0) {
      addItem(
        patchCord.description,
        totalPhones,
        patchCord.unitCost,
        "Cord 7' by default"
      );
    }
  }
  
  // Add specific phone types
  if (params.conferencePhonesQty && params.conferencePhonesQty > 0) {
    const confPhone = findEquipment("Conference Phone");
    if (confPhone) {
      addItem(
        "Conference Phones",
        params.conferencePhonesQty,
        confPhone.unitCost,
        confPhone.description
      );
    }
  }
  
  // Add wireless equipment if requested
  if (params.wireless) {
    if (params.wirelessPredictiveSurveyResultsQty && params.wirelessPredictiveSurveyResultsQty > 0) {
      // Add POE switches for wireless access points
      const poeSwitch = findEquipment("48-Port Layer 2 POE Switch");
      const switchesNeeded = Math.ceil((params.wirelessPredictiveSurveyResultsQty || 0) / 48);
      
      if (poeSwitch && switchesNeeded > 0) {
        addItem(
          poeSwitch.description,
          switchesNeeded,
          poeSwitch.unitCost,
          "New 48-port switches required to support WAPs only @ 40% expansion"
        );
      }
      
      // Add wireless access points
      if (params.wirelessPredictiveSurveyResultsQty > 0) {
        const wap = findEquipment("Wireless Access Point (Outdoor)");
        if (wap) {
          addItem(
            "Wireless Network Equipment - Wireless Access Points (For Outdoors)",
            params.wirelessPredictiveSurveyResultsQty,
            wap.unitCost,
            wap.description
          );
        }
        
        // Add antennas
        const antennas = findEquipment("Meraki Dual-band Antenna");
        if (antennas) {
          addItem(
            "Wireless Network Equipment - Meraki Dual-band Antenna - Omni",
            params.wirelessPredictiveSurveyResultsQty,
            antennas.unitCost,
            antennas.description
          );
        }
        
        // Add patch cords for wireless access points
        const wapCords = findEquipment("Wireless Access Point Patch Cord");
        if (wapCords) {
          addItem(
            "Patch Cords: Rack/Cabinet side & Wireless Access Points - Category 6A",
            params.wirelessPredictiveSurveyResultsQty,
            wapCords.unitCost,
            wapCords.description
          );
        }
      }
    }
  }
  
  // Add VoIP recurring charges if there are phones
  if (totalPhones > 0) {
    const voipLine = findEquipment("VoIP Monthly Line");
    if (voipLine) {
      addItem(
        voipLine.description,
        totalPhones,
        voipLine.unitCost,
        "Annual Cost for VoIP Line Charges",
        'recurring'
      );
    }
  }
  
  // Calculate subtotals
  const oneTimeSubtotal = oneTimeItems.reduce((sum, item) => sum + item.extendedCost, 0);
  const recurringSubtotal = recurringItems.reduce((sum, item) => sum + item.extendedCost, 0);
  
  // Apply risk factor if specified
  const riskFactor = params.riskFactor || 0;
  const complexityRiskPremium = riskFactor > 0 ? oneTimeSubtotal * (riskFactor / 100) : 0;
  
  // If risk factor applied, add as line item
  if (complexityRiskPremium > 0) {
    addItem(
      `Complexity Risk Premium - Risk Factor: ${riskFactor}`,
      1,
      complexityRiskPremium,
      "To be used as a catch all for additional required cost not spelled out in other line items.",
    );
  }
  
  // Recalculate one-time subtotal with risk premium included
  const updatedOneTimeSubtotal = oneTimeItems.reduce((sum, item) => sum + item.extendedCost, 0);
  
  // Calculate total
  const totalCost = updatedOneTimeSubtotal + recurringSubtotal;
  
  return {
    oneTimeItems,
    recurringItems,
    oneTimeSubtotal: updatedOneTimeSubtotal,
    recurringSubtotal,
    complexityRiskPremium: complexityRiskPremium > 0 ? complexityRiskPremium : undefined,
    totalCost
  };
};
