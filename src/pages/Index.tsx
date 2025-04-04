
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, Settings, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-netcost-blue-dark">Network Cost Navigator</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Estimate enterprise network installation costs with precision and ease. Replace your Excel-based tools with this powerful web application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <Calculator className="w-12 h-12 text-netcost-blue mb-2" />
            <CardTitle>Cost Calculator</CardTitle>
            <CardDescription>
              Input your project parameters and get detailed cost estimates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our powerful calculation engine provides accurate cost estimates based on your specific network requirements.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/input")} className="w-full">
              Start Estimating <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <FileText className="w-12 h-12 text-netcost-blue mb-2" />
            <CardTitle>Cost Reports</CardTitle>
            <CardDescription>
              View and export professional cost reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Generate detailed cost breakdowns for equipment, labor, and recurring charges, ready to share with stakeholders.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/output")} variant="outline" className="w-full">
              View Reports <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <Settings className="w-12 h-12 text-netcost-blue mb-2" />
            <CardTitle>Administration</CardTitle>
            <CardDescription>
              Manage cost variables and calculation rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Configure equipment costs, labor rates, regional adjustments, and calculation rules to keep your estimates accurate.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/admin")} variant="outline" className="w-full">
              Admin Access <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-netcost-blue-dark">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="bg-netcost-blue text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="font-medium mb-2">Enter Parameters</h3>
            <p className="text-gray-600">Input your project details including equipment quantities and specifications</p>
          </div>
          <div>
            <div className="bg-netcost-blue text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="font-medium mb-2">Generate Estimate</h3>
            <p className="text-gray-600">Our calculation engine applies business rules to determine accurate costs</p>
          </div>
          <div>
            <div className="bg-netcost-blue text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="font-medium mb-2">View & Export</h3>
            <p className="text-gray-600">Review detailed cost breakdowns and export professional reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
