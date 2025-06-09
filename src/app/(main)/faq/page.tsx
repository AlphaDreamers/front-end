import { getFaqCount, getFaqs } from "@/lib/actions/faq";
import { FaqPageSearchParams } from "@/lib/types";
import { buildFaqFilter } from "@/lib/utils";
import PageTemplate from "@/components/templates/page-template";
import SearchBar from "@/components/search-bar";
import Async from "@/components/async";
import Pagination from "@/components/pagination";
import { ContactSupportCard } from "@/components/contact/contact-support-card";
import FaqList, { FaqListSkeleton } from "../../../components/faq/faq-list";

const FAQ_PAGE_SIZE = 10;

export default async function FaqPage({
  searchParams,
}: {
  searchParams: Promise<FaqPageSearchParams>;
}) {
  const params = await searchParams;

  return (
    <PageTemplate
      title="FAQ"
      description="Frequently Asked Questions"
      className="space-y-6"
    >
      <SearchBar />

      <Async
        fetch={() =>
          Promise.all([
            getFaqs(buildFaqFilter(params, FAQ_PAGE_SIZE)),
            getFaqCount(buildFaqFilter(params, FAQ_PAGE_SIZE)),
          ])
        }
        fallback={<FaqListSkeleton />}
      >
        {([faqs, cnt]) => (
          <>
            <FaqList faqs={faqs} />
            <Pagination totalPages={Math.ceil(cnt / FAQ_PAGE_SIZE)} />
          </>
        )}
      </Async>

      <ContactSupportCard />
    </PageTemplate>
  );
}
