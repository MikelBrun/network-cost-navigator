
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CostResult, CostResultItem, ProjectParameters } from "@/types/models";
import { getCurrentParameters, getCurrentResult } from "@/services/storageService";
import { calculateCosts } from "@/services/calculationService";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const CostOutput = () => {
  const [costResult, setCostResult] = useState<CostResult | null>(null);
  const [projectParams, setProjectParams] = useState<ProjectParameters | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Try to load the current calculation result
    const savedResult = getCurrentResult();
    const savedParams = getCurrentParameters();
    
    if (savedResult && savedParams) {
      setCostResult(savedResult);
      setProjectParams(savedParams);
    } else if (savedParams) {
      // If we have parameters but no result, recalculate
      const calculatedResult = calculateCosts(savedParams);
      setCostResult(calculatedResult);
      setProjectParams(savedParams);
    } else {
      // No saved data, redirect to input form
      toast({
        title: "No Estimate Found",
        description: "Please complete the input form first to generate an estimate.",
        variant: "destructive",
      });
      navigate("/input");
    }
  }, [navigate]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleExportPdf = () => {
    toast({
      title: "Export Started",
      description: "Your PDF is being prepared for download.",
    });
    // In a real implementation, we would generate a PDF here
    // For now, we just trigger the print dialog
    setTimeout(() => {
      window.print();
    }, 100);
  };
  
  const handleExportExcel = () => {
    toast({
      title: "Export Started",
      description: "Your Excel file is being prepared for download.",
    });
    // In a real implementation, we would generate an Excel file here
  };
  
  if (!costResult || !projectParams) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading cost estimate...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 print:py-2">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-netcost-blue-dark">Network Cost Estimation - Results</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/input")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Input
          </Button>
          <Button onClick={handlePrint}>
            <FileText className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={handleExportPdf}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" /> Export Excel
          </Button>
        </div>
      </div>
      
      {/* Project Information Summary */}
      <Card className="mb-6 print:mb-4 print:shadow-none">
        <CardContent className="pt-6 print:pt-4">
          <h2 className="text-xl font-semibold mb-4 text-netcost-blue-dark print:text-lg">Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:gap-2 print:text-sm">
            <div>
              <p className="text-sm font-medium text-gray-500">Requestor</p>
              <p>{projectParams.requestor}</p>
            </div>
            {projectParams.ritm && (
              <div>
                <p className="text-sm font-medium text-gray-500">RITM Description</p>
                <p>{projectParams.ritm}</p>
              </div>
            )}
            {projectParams.projectType && (
              <div>
                <p className="text-sm font-medium text-gray-500">Project Type</p>
                <p>{projectParams.projectType}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Wireless</p>
              <p>{projectParams.wireless ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Project Complexity</p>
              <p>{projectParams.projectComplexity}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Risk Factor</p>
              <p>{projectParams.riskFactor}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cost Estimate Results */}
      <Card className="mb-6 print:shadow-none">
        <CardContent className="pt-6 print:pt-4">
          <h2 className="text-xl font-semibold mb-4 text-netcost-blue-dark print:text-lg">One-Time Equipment Estimate</h2>
          
          {costResult.oneTimeItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse print:text-sm">
                <thead>
                  <tr>
                    <th className="table-header print:py-1">Task/Item Description</th>
                    <th className="table-header print:py-1 text-right">Calculated Quantity</th>
                    <th className="table-header print:py-1 text-right">Required Quantity</th>
                    <th className="table-header print:py-1 text-right">Unit Cost</th>
                    <th className="table-header print:py-1 text-right">Extended Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {costResult.oneTimeItems.map((item, index) => (
                    <tr key={index} className="table-row-alt">
                      <td className="table-cell print:py-1">
                        {item.description}
                        {item.detailedDescription && (
                          <p className="text-xs text-gray-500">{item.detailedDescription}</p>
                        )}
                      </td>
                      <td className="table-cell print:py-1 text-right">{item.calculatedQuantity}</td>
                      <td className="table-cell print:py-1 text-right">{item.requiredQuantity}</td>
                      <td className="table-cell print:py-1 text-right">{formatCurrency(item.unitCost)}</td>
                      <td className="table-cell print:py-1 text-right">{formatCurrency(item.extendedCost)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="table-cell font-semibold text-right print:pt-2">
                      Total One-Time Equipment Estimate
                    </td>
                    <td className="table-cell font-bold text-right print:pt-2">
                      {formatCurrency(costResult.oneTimeSubtotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No one-time equipment costs calculated.</p>
          )}
          
          {costResult.recurringItems.length > 0 && (
            <>
              <Separator className="my-6 print:my-4" />
              
              <h2 className="text-xl font-semibold mb-4 text-netcost-blue-dark print:text-lg">
                Ongoing, Annual Recurring Service Charges
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse print:text-sm">
                  <thead>
                    <tr>
                      <th className="table-header print:py-1">Service Description</th>
                      <th className="table-header print:py-1 text-right">Quantity</th>
                      <th className="table-header print:py-1 text-right">Monthly Unit Cost</th>
                      <th className="table-header print:py-1 text-right">Annual Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costResult.recurringItems.map((item, index) => (
                      <tr key={index} className="table-row-alt">
                        <td className="table-cell print:py-1">
                          {item.description}
                          {item.detailedDescription && (
                            <p className="text-xs text-gray-500">{item.detailedDescription}</p>
                          )}
                        </td>
                        <td className="table-cell print:py-1 text-right">{item.requiredQuantity}</td>
                        <td className="table-cell print:py-1 text-right">{formatCurrency(item.unitCost)}</td>
                        <td className="table-cell print:py-1 text-right">{formatCurrency(item.extendedCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="table-cell font-semibold text-right print:pt-2">
                        Total Annual Recurring Charges
                      </td>
                      <td className="table-cell font-bold text-right print:pt-2">
                        {formatCurrency(costResult.recurringSubtotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Cost Summary */}
      <Card className="print:shadow-none">
        <CardContent className="pt-6 print:pt-4">
          <h2 className="text-xl font-semibold mb-4 text-netcost-blue-dark print:text-lg">Cost Summary</h2>
          
          <div className="space-y-2 print:text-sm">
            <div className="flex justify-between border-b pb-2">
              <span>One-Time Equipment & Installation</span>
              <span>{formatCurrency(costResult.oneTimeSubtotal)}</span>
            </div>
            
            {costResult.recurringSubtotal > 0 && (
              <div className="flex justify-between border-b pb-2">
                <span>Annual Recurring Services</span>
                <span>{formatCurrency(costResult.recurringSubtotal)}</span>
              </div>
            )}
            
            {costResult.complexityRiskPremium && costResult.complexityRiskPremium > 0 && (
              <div className="flex justify-between border-b pb-2">
                <span>Complexity Risk Premium ({projectParams.riskFactor}%)</span>
                <span>{formatCurrency(costResult.complexityRiskPremium)}</span>
              </div>
            )}
            
            <div className="flex justify-between pt-2 font-bold text-lg">
              <span>Total Project Cost</span>
              <span>{formatCurrency(costResult.totalCost)}</span>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 print:mt-4">
            <p>This is an estimate based on the provided parameters and current pricing. Actual costs may vary.</p>
            <p>Estimate generated on {new Date().toLocaleDateString()} by Network Cost Navigator.</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 flex justify-between print:hidden">
        <Button variant="outline" onClick={() => navigate("/input")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Modify Inputs
        </Button>
        <Button onClick={() => navigate("/")}>
          Start New Estimate
        </Button>
      </div>
    </div>
  );
};

export default CostOutput;
