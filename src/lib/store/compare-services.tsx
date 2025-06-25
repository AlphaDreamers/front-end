import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Gig } from "../types";
import { toast } from "sonner";

interface CompareServicesStore {
  gigs: Gig[];
  addGig: (gig: Gig) => void;
  removeGig: (gigId: string) => void;
  clearGigs: () => void;
  isGigInComparison: (gigId: string) => boolean;
  getGigCount: () => number;
}

const useCompareServicesStore = create<CompareServicesStore>()(
  persist(
    (set, get) => ({
      gigs: [],
      addGig: (gig: Gig) => {
        const existingGigs = get().gigs;
        if (!existingGigs.some((existingGig) => existingGig.id === gig.id)) {
          if (existingGigs.length >= 4) {
            toast.error(
              "Maximum of 4 services can be compared at once. Please remove a service before adding a new one",
              {
                description: (
                  <a href="/compare" className="text-blue-500 underline">
                    Go to comparison page
                  </a>
                ),
                dismissible: true,
              }
            );
          } else {
            set({ gigs: [...existingGigs, gig] });
          }
        }
      },
      removeGig: (gigId: string) => {
        set({ gigs: get().gigs.filter((gig) => gig.id !== gigId) });
      },
      clearGigs: () => set({ gigs: [] }),
      isGigInComparison: (gigId: string) => {
        return get().gigs.some((gig) => gig.id === gigId);
      },
      getGigCount: () => {
        return get().gigs.length;
      },
    }),
    {
      name: "compare-services-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
export default useCompareServicesStore;
