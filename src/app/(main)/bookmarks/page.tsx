import { me } from "@/lib/actions/auth";
import { getGigs } from "@/lib/actions/gig";
import { redirect } from "next/navigation";

const BookmarksPage = async () => {
  const user = await me();
  if (!user) {
    redirect("/sign-in?callback-url=/bookmarks");
  }

  const gigs = await getGigs({
    where: {
      bookmarks: {
        some: {
          id: user.id,
        },
      },
    },
  });

  return JSON.stringify(gigs, null, 2);
};

export default BookmarksPage;
