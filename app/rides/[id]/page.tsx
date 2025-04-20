import { notFound } from "next/navigation"
import { getRide } from "@/app/actions/ride-actions"
import RideDetails from "@/components/ride-details"
import RideStatusUpdater from "@/components/ride-status-updater"

export default async function RidePage({ params }) {
  let ride

  try {
    ride = await getRide(params.id)
  } catch (error) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Ride Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RideDetails ride={ride} />
        </div>
        <div>
          <RideStatusUpdater ride={ride} />
        </div>
      </div>
    </div>
  )
}

