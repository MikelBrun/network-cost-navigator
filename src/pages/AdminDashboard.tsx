
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Package, BarChart3, Globe, LogOut } from "lucide-react";
import { isAuthenticated, setAuthenticated } from "@/services/storageService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate("/admin");
    }
  }, [navigate]);
  
  const handleLogout = () => {
    setAuthenticated(false);
    navigate("/admin");
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-netcost-blue-dark">Admin Dashboard</h1>
        <Button variant="ghost" onClick={handleLogout} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <Package className="w-10 h-10 text-netcost-blue mb-2" />
            <CardTitle>Equipment Management</CardTitle>
            <CardDescription>
              Manage equipment items, costs, and descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Add, edit, or remove equipment items and their associated costs. Update unit prices and descriptions.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/admin/equipment")} className="w-full">
              Manage Equipment
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <Settings className="w-10 h-10 text-netcost-blue mb-2" />
            <CardTitle>Calculation Rules</CardTitle>
            <CardDescription>
              Configure the rules that drive cost calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Define conditional logic for cost calculations. Set up formulas and business rules for estimations.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/admin/rules")} className="w-full">
              Manage Rules
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <Globe className="w-10 h-10 text-netcost-blue mb-2" />
            <CardTitle>Regional Settings</CardTitle>
            <CardDescription>
              Configure region-specific cost multipliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Set up region-based cost adjustments. Configure multipliers for different geographical areas.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/admin/regions")} className="w-full">
              Manage Regions
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="mt-8 shadow-md">
        <CardHeader>
          <BarChart3 className="w-10 h-10 text-netcost-blue mb-2" />
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Current system status and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Equipment Items</h3>
              <p className="text-gray-600">9 active items defined in the system</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Calculation Rules</h3>
              <p className="text-gray-600">7 calculation rules currently active</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Regional Settings</h3>
              <p className="text-gray-600">5 regions configured with custom cost multipliers</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Last Update</h3>
              <p className="text-gray-600">System data last updated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
