import { MemberLayout } from '@/components/layout/MemberLayout';

export default function MemberDashboard() {
  return (
    <MemberLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Member Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Saved Offers</h2>
            <p className="text-muted-foreground">
              View and manage your saved offers
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-muted-foreground">
              Update your profile information
            </p>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}

