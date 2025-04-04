
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash, Plus, ArrowLeft } from "lucide-react";
import { CostItem } from "@/types/models";
import { isAuthenticated, getEquipment, addEquipmentItem, updateEquipmentItem, deleteEquipmentItem } from "@/services/storageService";

const AdminEquipment = () => {
  const [equipment, setEquipment] = useState<CostItem[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CostItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate("/admin");
      return;
    }
    
    // Load equipment data
    const loadedEquipment = getEquipment();
    setEquipment(loadedEquipment);
  }, [navigate]);
  
  const handleAddNew = () => {
    setCurrentItem({
      id: "",
      name: "",
      description: "",
      category: "",
      unitCost: 0,
      isActive: true
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEdit = (item: CostItem) => {
    setCurrentItem({ ...item });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (item: CostItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveItem = () => {
    if (!currentItem) return;
    
    // Validate required fields
    if (!currentItem.name || !currentItem.description || !currentItem.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // If id is empty, it's a new item
      let updatedEquipment;
      if (!currentItem.id) {
        updatedEquipment = addEquipmentItem(currentItem);
        toast({
          title: "Equipment Added",
          description: `${currentItem.name} has been added successfully.`,
        });
      } else {
        updatedEquipment = updateEquipmentItem(currentItem);
        toast({
          title: "Equipment Updated",
          description: `${currentItem.name} has been updated successfully.`,
        });
      }
      
      setEquipment(updatedEquipment);
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the equipment item.",
        variant: "destructive",
      });
    }
  };
  
  const handleConfirmDelete = () => {
    if (!currentItem) return;
    
    try {
      const updatedEquipment = deleteEquipmentItem(currentItem.id);
      setEquipment(updatedEquipment);
      
      toast({
        title: "Equipment Deleted",
        description: `${currentItem.name} has been deleted successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the equipment item.",
        variant: "destructive",
      });
    }
  };
  
  // Filter equipment based on search term
  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-netcost-blue-dark">Equipment Management</h1>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New Equipment
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search equipment by name, description, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="table-header text-left">Name</th>
                  <th className="table-header text-left">Description</th>
                  <th className="table-header text-left">Category</th>
                  <th className="table-header text-right">Unit Cost</th>
                  <th className="table-header text-center">Active</th>
                  <th className="table-header text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map((item) => (
                    <tr key={item.id} className="table-row-alt">
                      <td className="table-cell">{item.name}</td>
                      <td className="table-cell">{item.description}</td>
                      <td className="table-cell">{item.category}</td>
                      <td className="table-cell text-right">
                        ${item.unitCost.toFixed(2)}
                      </td>
                      <td className="table-cell text-center">
                        {item.isActive ? "Yes" : "No"}
                      </td>
                      <td className="table-cell">
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="table-cell text-center py-4 text-gray-500">
                      {searchTerm ? "No matching equipment items found." : "No equipment items defined."}
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
              {currentItem && !currentItem.id ? "Add New Equipment" : "Edit Equipment"}
            </DialogTitle>
            <DialogDescription>
              {currentItem && !currentItem.id ? 
                "Add a new equipment item to the system." : 
                "Make changes to the selected equipment item."}
            </DialogDescription>
          </DialogHeader>
          
          {currentItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  placeholder="Equipment name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  placeholder="Detailed description"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={currentItem.category}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Network Equipment">Network Equipment</SelectItem>
                    <SelectItem value="Wireless Equipment">Wireless Equipment</SelectItem>
                    <SelectItem value="Phones">Phones</SelectItem>
                    <SelectItem value="Cabling">Cabling</SelectItem>
                    <SelectItem value="Labor">Labor</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="unitCost">Unit Cost *</Label>
                <Input
                  id="unitCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem.unitCost}
                  onChange={(e) => setCurrentItem({ ...currentItem, unitCost: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={currentItem.isActive}
                  onCheckedChange={(checked) => setCurrentItem({ ...currentItem, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              {currentItem && !currentItem.id ? "Add Equipment" : "Save Changes"}
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
              Are you sure you want to delete "{currentItem?.name}"? This action cannot be undone.
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

export default AdminEquipment;
