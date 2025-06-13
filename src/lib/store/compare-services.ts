import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Gig } from "../types";

interface CompareServicesStore {
  gigs: Gig[];
  addGig: (gig: Gig) => void;
  removeGig: (gigId: string) => void;
  clearGigs: () => void;
  isGigInComparison: (gigId: string) => boolean;
}

const useCompareServicesStore = create<CompareServicesStore>()(
  persist(
    (set, get) => ({
      gigs: [],
      addGig: (gig: Gig) => {
        const existingGigs = get().gigs;
        if (!existingGigs.some((existingGig) => existingGig.id === gig.id)) {
          set({ gigs: [...existingGigs, gig] });
        }
      },
      removeGig: (gigId: string) => {
        set({ gigs: get().gigs.filter((gig) => gig.id !== gigId) });
      },
      clearGigs: () => set({ gigs: [] }),
      isGigInComparison: (gigId: string) => {
        return get().gigs.some((gig) => gig.id === gigId);
      },
    }),
    {
      name: "compare-services-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
export default useCompareServicesStore;
