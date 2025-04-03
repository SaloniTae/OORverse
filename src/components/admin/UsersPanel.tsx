
import { useState, useEffect } from "react";
import { DataCard } from "@/components/ui/DataCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCheck, UserMinus, Plus, Check, Ban } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/EmptyState";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { updateData, removeData, setData } from "@/lib/firebase";
import { toast } from "sonner";

interface UsersPanelProps {
  users: { [key: string]: boolean };
}

export function UsersPanel({ users }: UsersPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [localUsers, setLocalUsers] = useState<{[key: string]: boolean}>(users || {});
  
  // Update local state when props change
  useEffect(() => {
    setLocalUsers(users || {});
  }, [users]);
  
  const handleAddUser = async () => {
    if (!newUserId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }
    
    try {
      await setData(`/users/${newUserId}`, true);
      toast.success(`User ${newUserId} added successfully`);
      
      // Update local state
      setLocalUsers(prev => ({
        ...prev,
        [newUserId]: true
      }));
      
      setNewUserId("");
      setIsAddingUser(false);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };
  
  const confirmDeleteUser = (userId: string) => {
    setSelectedUser(userId);
    setIsConfirmingDelete(true);
  };
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await removeData(`/users/${selectedUser}`);
      toast.success(`User ${selectedUser} removed successfully`);
      
      // Update local state
      const updatedUsers = {...localUsers};
      delete updatedUsers[selectedUser];
      setLocalUsers(updatedUsers);
      
      setIsConfirmingDelete(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Failed to remove user");
    }
  };
  
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await setData(`/users/${userId}`, !currentStatus);
      toast.success(`User ${userId} ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      
      // Update local state
      setLocalUsers(prev => ({
        ...prev,
        [userId]: !currentStatus
      }));
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };
  
  // Filter users based on search term
  const filteredUsers = Object.entries(localUsers).filter(([userId]) =>
    userId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort users by ID
  const sortedUsers = filteredUsers.sort((a, b) => 
    a[0].localeCompare(b[0])
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Users Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => setIsAddingUser(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>
      
      <DataCard title={`All Users (${Object.keys(localUsers).length})`}>
        <div className="glass-morphism rounded-lg overflow-hidden">
          {sortedUsers.length > 0 ? (
            <div className="max-h-[600px] overflow-y-auto scrollbar-none">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map(([userId, isActive]) => (
                    <TableRow key={userId}>
                      <TableCell className="font-medium">{userId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {isActive ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              <span className="text-sm">Active</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                              <span className="text-sm">Inactive</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant={isActive ? "destructive" : "outline"} 
                            size="sm"
                            onClick={() => handleToggleUserStatus(userId, isActive)}
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => confirmDeleteUser(userId)}
                          >
                            <UserMinus className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState 
              title="No users found"
              description={searchTerm ? "Try adjusting your search" : "Start by adding users"}
              icon={<UserCheck className="h-10 w-10" />}
              action={
                <Button onClick={() => setIsAddingUser(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add User
                </Button>
              }
            />
          )}
        </div>
      </DataCard>
      
      {/* Add User Dialog */}
      <AlertDialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New User</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the ID of the user you want to add to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <Input
              placeholder="User ID"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddUser}>
              <Check className="h-4 w-4 mr-2" /> Add User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirm Delete Dialog */}
      <AlertDialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove user {selectedUser}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              <Ban className="h-4 w-4 mr-2" /> Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
