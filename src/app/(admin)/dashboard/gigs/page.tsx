import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";

import SearchBar from "@/components/SearchBar";
import { getGigsByUserId, me } from "@/lib/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";
import GigDashboardCard from "@/components/GigDashboardCard";

export default async function GigsDashboardPage() {
  const user = await me();

  if (!user?.verified) {
    redirect("/sign-in");
  }

  const gigs = await getGigsByUserId(user.id);

  return (
    <div className="flex flex-col space-y-6">
      <SearchBar />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Gigs</h2>
          <p className="text-muted-foreground mt-1">
            Manage your services, packages, and performance
          </p>
        </div>

        <Link
          href="/dashboard/gigs/create"
          className={cn(buttonVariants({}), "flex items-center gap-2")}
        >
          <Plus size={18} />
          <span>Create New Gig</span>
        </Link>
      </div>

      {gigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold">No Gigs Found</h3>
          <p className="text-muted-foreground mt-2">
            Start by creating your first gig!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gigs.map((gig) => (
            <GigDashboardCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}

      {/* Mobile floating action button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
}
