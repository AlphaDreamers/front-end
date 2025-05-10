import { getCategories, getGigTags } from "@/lib/actions";
import GigForm from "../../../../../components/CreateGigForm";

export default async function Page() {
  const tags = await getGigTags();
  const categories = await getCategories();

  return <GigForm tags={tags} categories={categories} />;
}
