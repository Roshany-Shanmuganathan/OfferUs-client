import { PartnerLayout } from '@/components/layout/PartnerLayout';

export default function PartnerDashboard() {
  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your offers and view analytics
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Active Offers</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Total Views</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Engagements</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

