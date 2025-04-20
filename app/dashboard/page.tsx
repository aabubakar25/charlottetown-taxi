import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllRides } from "@/app/actions/ride-actions"
import RideHistoryTable from "@/components/ride-history-table"
import DashboardStats from "@/components/dashboard-stats"

export default async function DashboardPage() {
  // In a real app, this would check the session and redirect if not authenticated
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  const rides = await getAllRides()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardStats />
      </div>

      <Tabs defaultValue="rides" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="rides">Ride History</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="rides">
          <Card>
            <CardHeader>
              <CardTitle>Ride History</CardTitle>
              <CardDescription>View all your past and upcoming rides</CardDescription>
            </CardHeader>
            <CardContent>
              <RideHistoryTable rides={rides} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">No payment history available yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">Profile settings coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

