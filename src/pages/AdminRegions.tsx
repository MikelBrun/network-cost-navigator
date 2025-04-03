
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { Region } from "@/types/models";
import { isAuthenticated, getRegions, addRegion, updateRegion, deleteRegion } from "@/services/storageService";

const AdminRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate("/admin");
      return;
    }
    
    // Load regions data
    const loadedRegions = getRegions();
    setRegions(loadedRegions);
  }, [navigate]);
  
  const handleAddNew = () => {
    setCurrentRegion({
      id: "",
      name: "",
      costMultiplier: 1.0,
      isActive: true
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEdit = (region: Region) => {
    setCurrentRegion({ ...region });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (region: Region) => {
    setCurrentRegion(region);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveRegion = () => {
    if (!currentRegion) return;
    
    // Validate required fields
    if (!currentRegion.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a region name.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentRegion.costMultiplier <= 0) {
      toast({
        title: "Validation Error",
        description: "Cost multiplier must be greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // If id is empty, it's a new region
      let updatedRegions;
      if (!currentRegion.id) {
        updatedRegions = addRegion(currentRegion);
        toast({
          title: "Region Added",
          description: `${currentRegion.name} has been added successfully.`,
        });
      } else {
        updatedRegions = updateRegion(currentRegion);
        toast({
          title: "Region Updated",
          description: `${currentRegion.name} has been updated successfully.`,
        });
      }
      
      setRegions(updatedRegions);
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the region.",
        variant: "destructive",
      });
    }
  };
  
  const handleConfirmDelete = () => {
    if (!currentRegion) return;
    
    try {
      const updatedRegions = deleteRegion(currentRegion.id);
      setRegions(updatedRegions);
      
      toast({
        title: "Region Deleted",
        description: `${currentRegion.name} has been deleted successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the region.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-netcost-blue-dark">Regional Settings</h1>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New Region
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="table-header text-left">Region Name</th>
                  <th className="table-header text-right">Cost Multiplier</th>
                  <th className="table-header text-center">Active</th>
                  <th className="table-header text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {regions.length > 0 ? (
                  regions.map((region) => (
                    <tr key={region.id} className="table-row-alt">
                      <td className="table-cell">{region.name}</td>
                      <td className="table-cell text-right">
                        {region.costMultiplier.toFixed(2)}x
                      </td>
                      <td className="table-cell text-center">
                        {region.isActive ? "Yes" : "No"}
                      </td>
                      <td className="table-cell">
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(region)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(region)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="table-cell text-center py-4 text-gray-500">
                      No regions defined.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentRegion && !currentRegion.id ? "Add New Region" : "Edit Region"}
            </DialogTitle>
            <DialogDescription>
              {currentRegion && !currentRegion.id ? 
                "Add a new region with cost multipliers." : 
                "Make changes to the selected region."}
            </DialogDescription>
          </DialogHeader>
          
          {currentRegion && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Region Name *</Label>
                <Input
                  id="name"
                  value={currentRegion.name}
                  onChange={(e) => setCurrentRegion({ ...currentRegion, name: e.target.value })}
                  placeholder="e.g., Northeast"
                />
              </div>
              
              <div>
                <Label htmlFor="costMultiplier">Cost Multiplier *</Label>
                <Input
                  id="costMultiplier"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={currentRegion.costMultiplier}
                  onChange={(e) => setCurrentRegion({ ...currentRegion, costMultiplier: parseFloat(e.target.value) || 1.0 })}
                  placeholder="1.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Base value is 1.0. Use values greater than 1 for higher costs, less than 1 for lower costs.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={currentRegion.isActive}
                  onCheckedChange={(checked) => setCurrentRegion({ ...currentRegion, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRegion}>
              {currentRegion && !currentRegion.id ? "Add Region" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the region "{currentRegion?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRegions;
