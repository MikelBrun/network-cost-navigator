
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ProjectParameters } from "@/types/models";
import { mockDefaultParameters } from "@/services/mockData";
import { calculateCosts } from "@/services/calculationService";
import { saveCurrentParameters, saveCurrentResult } from "@/services/storageService";

const InputForm = () => {
  const [formData, setFormData] = useState<ProjectParameters>(mockDefaultParameters);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value === "" ? undefined : Number(value)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.requestor) {
      toast({
        title: "Missing Information",
        description: "Please enter the Requestor name.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate costs based on parameters
    const result = calculateCosts(formData);
    
    // Save current state
    saveCurrentParameters(formData);
    saveCurrentResult(result);
    
    toast({
      title: "Calculation Complete",
      description: "Your cost estimate has been generated successfully.",
    });
    
    // Navigate to output page
    navigate("/output");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-netcost-blue-dark">Network Cost Estimation - Input Parameters</h1>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="project">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="project">Project Info</TabsTrigger>
            <TabsTrigger value="phones">Voice & LAN</TabsTrigger>
            <TabsTrigger value="network">Network & WAN</TabsTrigger>
            <TabsTrigger value="wireless">Wireless</TabsTrigger>
          </TabsList>
          
          {/* Project Info Tab */}
          <TabsContent value="project">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="subsection">
                    <h3 className="subsection-title">Project Information</h3>
                    <div className="form-row">
                      <div>
                        <Label htmlFor="requestor" className="input-label">Requestor *</Label>
                        <Input
                          id="requestor"
                          name="requestor"
                          value={formData.requestor || ""}
                          onChange={handleInputChange}
                          placeholder="Enter requestor name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkToDCE" className="input-label">Link to DCE and CRM Listing</Label>
                        <Input
                          id="linkToDCE"
                          name="linkToDCE"
                          value={formData.linkToDCE || ""}
                          onChange={handleInputChange}
                          placeholder="Enter link"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div>
                        <Label htmlFor="ritm" className="input-label">RITM Short Description</Label>
                        <Input
                          id="ritm"
                          name="ritm"
                          value={formData.ritm || ""}
                          onChange={handleInputChange}
                          placeholder="Enter RITM description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingProfile" className="input-label">Billing Default Profile</Label>
                        <Input
                          id="billingProfile"
                          name="billingProfile"
                          value={formData.billingProfile || ""}
                          onChange={handleInputChange}
                          placeholder="Enter billing profile"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div>
                        <Label htmlFor="prjOrDemand" className="input-label">PRJ or Demand Number (if applicable)</Label>
                        <Input
                          id="prjOrDemand"
                          name="prjOrDemand"
                          value={formData.prjOrDemand || ""}
                          onChange={handleInputChange}
                          placeholder="Enter PRJ or demand number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="requestType" className="input-label">Request Type</Label>
                        <Select
                          value={formData.requestType || ""}
                          onValueChange={(value) => handleSelectChange("requestType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Change">Change</SelectItem>
                            <SelectItem value="Upgrade">Upgrade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="subsection-title">Project Specifications</h3>
                    <div className="form-row">
                      <div>
                        <Label htmlFor="projectType" className="input-label">Project Type</Label>
                        <Select
                          value={formData.projectType || ""}
                          onValueChange={(value) => handleSelectChange("projectType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New Installation">New Installation</SelectItem>
                            <SelectItem value="Upgrade">Upgrade</SelectItem>
                            <SelectItem value="Relocation">Relocation</SelectItem>
                            <SelectItem value="Expansion">Expansion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="wireless"
                            checked={formData.wireless || false}
                            onCheckedChange={(checked) => handleSwitchChange("wireless", checked)}
                          />
                          <Label htmlFor="wireless">Wireless</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="cellularBackup"
                            checked={formData.cellularBackup || false}
                            onCheckedChange={(checked) => handleSwitchChange("cellularBackup", checked)}
                          />
                          <Label htmlFor="cellularBackup">Cellular Backup</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div>
                        <Label htmlFor="projectComplexity" className="input-label">Project Complexity</Label>
                        <Select
                          value={formData.projectComplexity || "Medium"}
                          onValueChange={(value) => handleSelectChange("projectComplexity", value as 'Low' | 'Medium' | 'High')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stationCableComplexity" className="input-label">Station Cable Complexity & Type</Label>
                        <Select
                          value={formData.stationCableComplexity || ""}
                          onValueChange={(value) => handleSelectChange("stationCableComplexity", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select cable complexity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Complex">Complex</SelectItem>
                            <SelectItem value="Very Complex">Very Complex</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div>
                        <Label htmlFor="cableRegion" className="input-label">Cabling Region</Label>
                        <Select
                          value={formData.cableRegion || ""}
                          onValueChange={(value) => handleSelectChange("cableRegion", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Northeast">Northeast</SelectItem>
                            <SelectItem value="Southeast">Southeast</SelectItem>
                            <SelectItem value="Midwest">Midwest</SelectItem>
                            <SelectItem value="Southwest">Southwest</SelectItem>
                            <SelectItem value="West">West</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="riskFactor" className="input-label">Risk Factor (%)</Label>
                        <Input
                          id="riskFactor"
                          name="riskFactor"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.riskFactor !== undefined ? formData.riskFactor.toString() : "1"}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Voice & LAN Tab */}
          <TabsContent value="phones">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="subsection">
                    <h3 className="subsection-title">Voice Equipment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="premiumPhonesQty" className="input-label">Premium Phones (qty)</Label>
                        <Input
                          id="premiumPhonesQty"
                          name="premiumPhonesQty"
                          type="number"
                          min="0"
                          value={formData.premiumPhonesQty !== undefined ? formData.premiumPhonesQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="standardPhonesQty" className="input-label">Standard Phones (qty)</Label>
                        <Input
                          id="standardPhonesQty"
                          name="standardPhonesQty"
                          type="number"
                          min="0"
                          value={formData.standardPhonesQty !== undefined ? formData.standardPhonesQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="conferencePhonesQty" className="input-label">Conference Phones (qty)</Label>
                        <Input
                          id="conferencePhonesQty"
                          name="conferencePhonesQty"
                          type="number"
                          min="0"
                          value={formData.conferencePhonesQty !== undefined ? formData.conferencePhonesQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="singleLinePhonesQty" className="input-label">Single-Line Phones (qty)</Label>
                        <Input
                          id="singleLinePhonesQty"
                          name="singleLinePhonesQty"
                          type="number"
                          min="0"
                          value={formData.singleLinePhonesQty !== undefined ? formData.singleLinePhonesQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneExpansionModulesQty" className="input-label">Phone Expansion Modules (qty)</Label>
                        <Input
                          id="phoneExpansionModulesQty"
                          name="phoneExpansionModulesQty"
                          type="number"
                          min="0"
                          value={formData.phoneExpansionModulesQty !== undefined ? formData.phoneExpansionModulesQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faxAnalogLinesQty" className="input-label">Fax/Analog Lines (qty)</Label>
                        <Input
                          id="faxAnalogLinesQty"
                          name="faxAnalogLinesQty"
                          type="number"
                          min="0"
                          value={formData.faxAnalogLinesQty !== undefined ? formData.faxAnalogLinesQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="subsection-title">LAN Equipment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="otherNetworkDevicesQty" className="input-label">Other Network Connected Devices (qty)</Label>
                        <Input
                          id="otherNetworkDevicesQty"
                          name="otherNetworkDevicesQty"
                          type="number"
                          min="0"
                          value={formData.otherNetworkDevicesQty !== undefined ? formData.otherNetworkDevicesQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newNetworkDropsQty" className="input-label">New Network Drops (qty)</Label>
                        <Input
                          id="newNetworkDropsQty"
                          name="newNetworkDropsQty"
                          type="number"
                          min="0"
                          value={formData.newNetworkDropsQty !== undefined ? formData.newNetworkDropsQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Network & WAN Tab */}
          <TabsContent value="network">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="subsection">
                    <h3 className="subsection-title">Network Upgrade</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newNetworkDropsUPG" className="input-label">New Network Drops (qty)</Label>
                        <Input
                          id="newNetworkDropsUPG"
                          name="newNetworkDropsUPG"
                          type="number"
                          min="0"
                          value={formData.newNetworkDropsUPG !== undefined ? formData.newNetworkDropsUPG.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center space-y-0 pt-6">
                        <Switch
                          id="routerRequiredForCircuitUPG"
                          checked={formData.routerRequiredForCircuitUPG || false}
                          onCheckedChange={(checked) => handleSwitchChange("routerRequiredForCircuitUPG", checked)}
                        />
                        <Label htmlFor="routerRequiredForCircuitUPG" className="ml-2">
                          Router Required For Existing Circuit?
                        </Label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="existingITSWANCircuitUPG" className="input-label">Existing ITS WAN Circuit?</Label>
                        <Input
                          id="existingITSWANCircuitUPG"
                          name="existingITSWANCircuitUPG"
                          value={formData.existingITSWANCircuitUPG || ""}
                          onChange={handleInputChange}
                          placeholder="Specify circuit details"
                        />
                      </div>
                      <div>
                        <Label htmlFor="existingCircuitSpeedUPG" className="input-label">Existing Circuit Speed</Label>
                        <Input
                          id="existingCircuitSpeedUPG"
                          name="existingCircuitSpeedUPG"
                          value={formData.existingCircuitSpeedUPG || ""}
                          onChange={handleInputChange}
                          placeholder="Enter speed (e.g., 100 Mbps)"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="subsection-title">WAN Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-y-0">
                        <Switch
                          id="qosServiceRequired"
                          checked={formData.qosServiceRequired || false}
                          onCheckedChange={(checked) => handleSwitchChange("qosServiceRequired", checked)}
                        />
                        <Label htmlFor="qosServiceRequired" className="ml-2">
                          QoS Service Required?
                        </Label>
                      </div>
                      <div className="flex items-center space-y-0">
                        <Switch
                          id="higherSpeedCircuitRequired"
                          checked={formData.higherSpeedCircuitRequired || false}
                          onCheckedChange={(checked) => handleSwitchChange("higherSpeedCircuitRequired", checked)}
                        />
                        <Label htmlFor="higherSpeedCircuitRequired" className="ml-2">
                          Higher Speed Circuit Required?
                        </Label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="existingITSWANCircuitHS" className="input-label">Existing ITS WAN Circuit?</Label>
                        <Input
                          id="existingITSWANCircuitHS"
                          name="existingITSWANCircuitHS"
                          value={formData.existingITSWANCircuitHS || ""}
                          onChange={handleInputChange}
                          placeholder="Specify circuit details"
                        />
                      </div>
                      <div>
                        <Label htmlFor="existingCircuitSpeedHS" className="input-label">Existing Circuit Speed</Label>
                        <Input
                          id="existingCircuitSpeedHS"
                          name="existingCircuitSpeedHS"
                          value={formData.existingCircuitSpeedHS || ""}
                          onChange={handleInputChange}
                          placeholder="Enter speed (e.g., 100 Mbps)"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="desiredWANSpeed" className="input-label">Desired WAN Speed?</Label>
                        <Input
                          id="desiredWANSpeed"
                          name="desiredWANSpeed"
                          value={formData.desiredWANSpeed || ""}
                          onChange={handleInputChange}
                          placeholder="Enter desired speed"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newOrUpgradeVANQty" className="input-label">New or upgrade VAN (qty)</Label>
                        <Input
                          id="newOrUpgradeVANQty"
                          name="newOrUpgradeVANQty"
                          type="number"
                          min="0"
                          value={formData.newOrUpgradeVANQty !== undefined ? formData.newOrUpgradeVANQty.toString() : ""}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Wireless Tab */}
          <TabsContent value="wireless">
            <Card>
              <CardContent className="pt-6">
                <div className="subsection">
                  <h3 className="subsection-title">Wireless Equipment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wirelessPredictiveSurveyResultsQty" className="input-label">
                        Wireless Predictive Survey Results (qty)
                      </Label>
                      <Input
                        id="wirelessPredictiveSurveyResultsQty"
                        name="wirelessPredictiveSurveyResultsQty"
                        type="number"
                        min="0"
                        value={formData.wirelessPredictiveSurveyResultsQty !== undefined ? formData.wirelessPredictiveSurveyResultsQty.toString() : ""}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wirelessPredictiveSurveyResultsOutdoorQty" className="input-label">
                        Outdoor Wireless Predictive Survey Results (qty)
                      </Label>
                      <Input
                        id="wirelessPredictiveSurveyResultsOutdoorQty"
                        name="wirelessPredictiveSurveyResultsOutdoorQty"
                        type="number"
                        min="0"
                        value={formData.wirelessPredictiveSurveyResultsOutdoorQty !== undefined ? formData.wirelessPredictiveSurveyResultsOutdoorQty.toString() : ""}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(mockDefaultParameters)}
          >
            Reset Form
          </Button>
          <Button type="submit">Calculate Cost Estimate</Button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
