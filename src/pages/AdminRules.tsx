import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { CalculationRule } from "@/types/models";
import { isAuthenticated, getRules, addRule, updateRule, deleteRule } from "@/services/storageService";

const AdminRules = () => {
  const [rules, setRules] = useState<CalculationRule[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<CalculationRule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate("/admin");
      return;
    }
    
    // Load rules data
    const loadedRules = getRules();
    setRules(loadedRules);
  }, [navigate]);
  
  const handleAddNew = () => {
    setCurrentRule({
      id: "",
      name: "",
      description: "",
      condition: "",
      action: "",
      priority: 10,
      isActive: true
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEdit = (rule: CalculationRule) => {
    setCurrentRule({ ...rule });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (rule: CalculationRule) => {
    setCurrentRule(rule);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveRule = () => {
    if (!currentRule) return;
    
    // Validate required fields
    if (!currentRule.name || !currentRule.condition || !currentRule.action) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // If id is empty, it's a new rule
      let updatedRules;
      if (!currentRule.id) {
        updatedRules = addRule(currentRule);
        toast({
          title: "Rule Added",
          description: `${currentRule.name} has been added successfully.`,
        });
      } else {
        updatedRules = updateRule(currentRule);
        toast({
          title: "Rule Updated",
          description: `${currentRule.name} has been updated successfully.`,
        });
      }
      
      setRules(updatedRules);
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the rule.",
        variant: "destructive",
      });
    }
  };
  
  const handleConfirmDelete = () => {
    if (!currentRule) return;
    
    try {
      const updatedRules = deleteRule(currentRule.id);
      setRules(updatedRules);
      
      toast({
        title: "Rule Deleted",
        description: `${currentRule.name} has been deleted successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the rule.",
        variant: "destructive",
      });
    }
  };
  
  // Filter rules based on search term
  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.action.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort rules by priority
  const sortedRules = [...filteredRules].sort((a, b) => a.priority - b.priority);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-netcost-blue-dark">Calculation Rules</h1>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New Rule
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search rules by name, description, condition, or action..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {sortedRules.length > 0 ? (
              sortedRules.map((rule) => (
                <div key={rule.id} className="border rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{rule.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(rule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(rule)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Condition</Label>
                      <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md text-sm">
                        <code>{rule.condition}</code>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Action</Label>
                      <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md text-sm">
                        <code>{rule.action}</code>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      Priority: {rule.priority}
                    </span>
                    <span className={rule.isActive ? "text-green-600" : "text-red-600"}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No matching rules found." : "No calculation rules defined."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {currentRule && !currentRule.id ? "Add New Rule" : "Edit Rule"}
            </DialogTitle>
            <DialogDescription>
              {currentRule && !currentRule.id ? 
                "Add a new calculation rule to the system." : 
                "Make changes to the selected calculation rule."}
            </DialogDescription>
          </DialogHeader>
          
          {currentRule && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={currentRule.name}
                  onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
                  placeholder="Rule name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={currentRule.description}
                  onChange={(e) => setCurrentRule({ ...currentRule, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              
              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Textarea
                  id="condition"
                  value={currentRule.condition}
                  onChange={(e) => setCurrentRule({ ...currentRule, condition: e.target.value })}
                  placeholder="e.g., conferencePhonesQty > 0"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use JavaScript syntax for conditions (e.g., "param1 {'>'} 0 && param2 === 'value'")
                </p>
              </div>
              
              <div>
                <Label htmlFor="action">Action *</Label>
                <Textarea
                  id="action"
                  value={currentRule.action}
                  onChange={(e) => setCurrentRule({ ...currentRule, action: e.target.value })}
                  placeholder="e.g., ADD_ITEM: 'Conference Phone', conferencePhonesQty"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Define the calculation action to take when the condition is met
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    value={currentRule.priority}
                    onChange={(e) => setCurrentRule({ ...currentRule, priority: parseInt(e.target.value) || 10 })}
                    placeholder="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers run first
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 pt-7">
                  <Switch
                    id="isActive"
                    checked={currentRule.isActive}
                    onCheckedChange={(checked) => setCurrentRule({ ...currentRule, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRule}>
              {currentRule && !currentRule.id ? "Add Rule" : "Save Changes"}
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
              Are you sure you want to delete the rule "{currentRule?.name}"? This action cannot be undone.
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

export default AdminRules;
