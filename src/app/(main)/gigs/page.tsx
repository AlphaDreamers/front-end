import FilterCard from "@/components/FilterCard";
import GigCardDesign from "@/components/GigCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";

export default function Page() {
  return (
    <main className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SearchBar />
        <FilterCard config={[]} />
      </div>

      <div>
        {Array.from({ length: 10 }).map((_, i) => (
          <GigCardDesign
            title={`Gig Title ${i + 1}`}
            description={`This is a description for gig ${i + 1}.`}
            level={`Level ${(i % 3) + 1}`}
            experience={`Experience ${(i % 5) + 1} years`}
            completedProjects={i * 10}
            deliveryTime={`${i + 1} days`}
            startingPrice={i * 10}
            currency={"USD"}
            sellerName={`Seller ${i + 1}`}
            sellerAvatar={`https://i.pravatar.cc/150?img=${i + 1}`}
            popularityScore={i * 10}
            key={i}
          />
        ))}
      </div>
      <Pagination />
    </main>
  );
}
