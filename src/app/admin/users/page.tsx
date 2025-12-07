import { AdminLayout } from '@/components/layout/AdminLayout';

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all users, members, and partners on the platform
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <p className="text-muted-foreground">
            User management functionality coming soon...
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

