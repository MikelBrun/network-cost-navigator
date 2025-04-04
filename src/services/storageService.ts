
import { ProjectParameters, CostResult, CostItem, CalculationRule, Region } from "../types/models";
import { mockEquipment, mockRules, mockRegions } from "./mockData";

// Local storage keys
const EQUIPMENT_KEY = "network-cost-navigator:equipment";
const RULES_KEY = "network-cost-navigator:rules";
const REGIONS_KEY = "network-cost-navigator:regions";
const CURRENT_PARAMS_KEY = "network-cost-navigator:current-params";
const CURRENT_RESULT_KEY = "network-cost-navigator:current-result";

// Equipment related functions
export const getEquipment = (): CostItem[] => {
  const storedItems = localStorage.getItem(EQUIPMENT_KEY);
  return storedItems ? JSON.parse(storedItems) : mockEquipment;
};

export const saveEquipment = (items: CostItem[]): void => {
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(items));
};

export const addEquipmentItem = (item: CostItem): CostItem[] => {
  const items = getEquipment();
  const newItems = [...items, { ...item, id: Date.now().toString() }];
  saveEquipment(newItems);
  return newItems;
};

export const updateEquipmentItem = (item: CostItem): CostItem[] => {
  const items = getEquipment();
  const index = items.findIndex(i => i.id === item.id);
  if (index >= 0) {
    items[index] = item;
    saveEquipment(items);
  }
  return items;
};

export const deleteEquipmentItem = (id: string): CostItem[] => {
  const items = getEquipment();
  const newItems = items.filter(item => item.id !== id);
  saveEquipment(newItems);
  return newItems;
};

// Rules related functions
export const getRules = (): CalculationRule[] => {
  const storedRules = localStorage.getItem(RULES_KEY);
  return storedRules ? JSON.parse(storedRules) : mockRules;
};

export const saveRules = (rules: CalculationRule[]): void => {
  localStorage.setItem(RULES_KEY, JSON.stringify(rules));
};

export const addRule = (rule: CalculationRule): CalculationRule[] => {
  const rules = getRules();
  const newRules = [...rules, { ...rule, id: Date.now().toString() }];
  saveRules(newRules);
  return newRules;
};

export const updateRule = (rule: CalculationRule): CalculationRule[] => {
  const rules = getRules();
  const index = rules.findIndex(r => r.id === rule.id);
  if (index >= 0) {
    rules[index] = rule;
    saveRules(rules);
  }
  return rules;
};

export const deleteRule = (id: string): CalculationRule[] => {
  const rules = getRules();
  const newRules = rules.filter(rule => rule.id !== id);
  saveRules(newRules);
  return newRules;
};

// Regions related functions
export const getRegions = (): Region[] => {
  const storedRegions = localStorage.getItem(REGIONS_KEY);
  return storedRegions ? JSON.parse(storedRegions) : mockRegions;
};

export const saveRegions = (regions: Region[]): void => {
  localStorage.setItem(REGIONS_KEY, JSON.stringify(regions));
};

export const addRegion = (region: Region): Region[] => {
  const regions = getRegions();
  const newRegions = [...regions, { ...region, id: Date.now().toString() }];
  saveRegions(newRegions);
  return newRegions;
};

export const updateRegion = (region: Region): Region[] => {
  const regions = getRegions();
  const index = regions.findIndex(r => r.id === region.id);
  if (index >= 0) {
    regions[index] = region;
    saveRegions(regions);
  }
  return regions;
};

export const deleteRegion = (id: string): Region[] => {
  const regions = getRegions();
  const newRegions = regions.filter(region => region.id !== id);
  saveRegions(newRegions);
  return newRegions;
};

// Current calculation state
export const saveCurrentParameters = (params: ProjectParameters): void => {
  localStorage.setItem(CURRENT_PARAMS_KEY, JSON.stringify(params));
};

export const getCurrentParameters = (): ProjectParameters | null => {
  const storedParams = localStorage.getItem(CURRENT_PARAMS_KEY);
  return storedParams ? JSON.parse(storedParams) : null;
};

export const saveCurrentResult = (result: CostResult): void => {
  localStorage.setItem(CURRENT_RESULT_KEY, JSON.stringify(result));
};

export const getCurrentResult = (): CostResult | null => {
  const storedResult = localStorage.getItem(CURRENT_RESULT_KEY);
  return storedResult ? JSON.parse(storedResult) : null;
};

// Authentication (simple for demo)
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("network-cost-navigator:authenticated") === "true";
};

export const setAuthenticated = (value: boolean): void => {
  localStorage.setItem("network-cost-navigator:authenticated", value.toString());
};
