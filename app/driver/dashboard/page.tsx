import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllRides } from "@/app/actions/ride-actions"
import DriverStats from "@/components/driver-stats"
import AvailableRidesTable from "@/components/available-rides-table"

export default async function DriverDashboardPage() {
  // In a real app, this would check the session and redirect if not authenticated
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  const rides = await getAllRides()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Driver Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DriverStats />
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="available">Available Rides</TabsTrigger>
          <TabsTrigger value="completed">Completed Rides</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Rides</CardTitle>
              <CardDescription>View and accept ride requests from passengers</CardDescription>
            </CardHeader>
            <CardContent>
              <AvailableRidesTable rides={rides.filter((ride) => ride.status === "pending")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Rides</CardTitle>
              <CardDescription>View your ride history</CardDescription>
            </CardHeader>
            <CardContent>
              <AvailableRidesTable rides={rides.filter((ride) => ride.status === "completed")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
              <CardDescription>View your earnings and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">Earnings dashboard coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

