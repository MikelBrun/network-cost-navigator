
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Rule {
  id: string;
  name: string;
  condition: string;
  action: string;
}

const AdminRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    name: '',
    condition: '',
    action: ''
  });

  const handleAddRule = () => {
    if (newRule.name && newRule.condition && newRule.action) {
      const rule: Rule = {
        id: Date.now().toString(),
        name: newRule.name,
        condition: newRule.condition,
        action: newRule.action
      };
      
      setRules([...rules, rule]);
      setNewRule({ name: '', condition: '', action: '' });
    }
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Calculation Rules</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Rule</CardTitle>
          <CardDescription>Define calculation rules using logical conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rule Name</label>
              <Input 
                placeholder="Enter rule name"
                value={newRule.name}
                onChange={e => setNewRule({...newRule, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <Input 
                placeholder="e.g., quantity > 0"
                value={newRule.condition}
                onChange={e => setNewRule({...newRule, condition: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use logical expressions like {"'quantity > 0'"} or {"'complexity === \"high\"'"}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Action</label>
              <Input 
                placeholder="e.g., cost = quantity * unitPrice"
                value={newRule.action}
                onChange={e => setNewRule({...newRule, action: e.target.value})}
              />
            </div>
            
            <Button onClick={handleAddRule}>Add Rule</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Existing Rules</CardTitle>
          <CardDescription>Manage your calculation rules</CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <p className="text-muted-foreground">No rules defined yet.</p>
          ) : (
            <div className="space-y-4">
              {rules.map(rule => (
                <div key={rule.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{rule.name}</h3>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                      Delete
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Condition:</span> {rule.condition}</p>
                    <p><span className="font-medium">Action:</span> {rule.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRules;
