'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getAllCookies,
  setCookie,
  deleteCookie,
  type CookieInfo,
} from '@/lib/cookieUtils';
import { RefreshCw, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function CookiesManagementPage() {
  const [cookies, setCookies] = useState<CookieInfo[]>([]);
  const [selectedCookie, setSelectedCookie] = useState<CookieInfo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', value: '' });
  const [addForm, setAddForm] = useState({ name: '', value: '' });

  const loadCookies = () => {
    const allCookies = getAllCookies();
    setCookies(allCookies);
  };

  useEffect(() => {
    loadCookies();
  }, []);

  const handleEdit = (cookie: CookieInfo) => {
    setSelectedCookie(cookie);
    setEditForm({ name: cookie.name, value: cookie.value });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (cookie: CookieInfo) => {
    setSelectedCookie(cookie);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (cookie: CookieInfo) => {
    setSelectedCookie(cookie);
    setIsViewDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCookie) {
      deleteCookie(selectedCookie.name, selectedCookie.path || '/');
      toast.success(`Cookie "${selectedCookie.name}" deleted successfully`);
      loadCookies();
      setIsDeleteDialogOpen(false);
      setSelectedCookie(null);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedCookie || !editForm.name) {
      toast.error('Cookie name is required');
      return;
    }

    // If name changed, delete old cookie first
    if (editForm.name !== selectedCookie.name) {
      deleteCookie(selectedCookie.name, selectedCookie.path || '/');
    }

    // Set new cookie
    setCookie(editForm.name, editForm.value, {
      path: selectedCookie.path || '/',
      domain: selectedCookie.domain,
      secure: selectedCookie.secure,
      sameSite: selectedCookie.sameSite,
    });

    toast.success(`Cookie "${editForm.name}" updated successfully`);
    setIsEditDialogOpen(false);
    setSelectedCookie(null);
    setEditForm({ name: '', value: '' });
    loadCookies();
  };

  const handleAddCookie = () => {
    if (!addForm.name) {
      toast.error('Cookie name is required');
      return;
    }

    setCookie(addForm.name, addForm.value, {
      path: '/',
    });

    toast.success(`Cookie "${addForm.name}" added successfully`);
    setIsAddDialogOpen(false);
    setAddForm({ name: '', value: '' });
    loadCookies();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cookie Management</h1>
            <p className="text-muted-foreground mt-2">
              View, edit, and manage browser cookies
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadCookies}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Cookie
            </Button>
          </div>
        </div>

        {cookies.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              No cookies selected
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Select a cookie to preview its value
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Or add a new cookie using the button above
            </p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cookies.map((cookie, index) => (
                  <TableRow key={`${cookie.name}-${index}`}>
                    <TableCell className="font-medium">{cookie.name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {cookie.value || '(empty)'}
                    </TableCell>
                    <TableCell>{cookie.path || '/'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleView(cookie)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(cookie)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(cookie)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cookie Details</DialogTitle>
              <DialogDescription>
                View detailed information about this cookie
              </DialogDescription>
            </DialogHeader>
            {selectedCookie && (
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={selectedCookie.name} readOnly />
                </div>
                <div>
                  <Label>Value</Label>
                  <Input value={selectedCookie.value || ''} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Path</Label>
                    <Input
                      value={selectedCookie.path || '/'}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Domain</Label>
                    <Input
                      value={selectedCookie.domain || '(not set)'}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Cookie</DialogTitle>
              <DialogDescription>
                Modify the cookie name and value
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-value">Value</Label>
                <Input
                  id="edit-value"
                  value={editForm.value}
                  onChange={(e) =>
                    setEditForm({ ...editForm, value: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCookie(null);
                  setEditForm({ name: '', value: '' });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cookie</DialogTitle>
              <DialogDescription>
                Create a new cookie with name and value
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="add-name">Name</Label>
                <Input
                  id="add-name"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                  placeholder="cookie-name"
                />
              </div>
              <div>
                <Label htmlFor="add-value">Value</Label>
                <Input
                  id="add-value"
                  value={addForm.value}
                  onChange={(e) =>
                    setAddForm({ ...addForm, value: e.target.value })
                  }
                  placeholder="cookie-value"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setAddForm({ name: '', value: '' });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCookie}>Add Cookie</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the cookie "{selectedCookie?.name}".
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

