import { Prisma } from "@prisma/client";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { getIconBySocialType } from "@/lib/utils";

interface ConnectCardProps {
  links: Prisma.SocialLinkGetPayload<{
    select: {
      id: true;
      type: true;
      url: true;
    };
  }>[];
}

const ConnectCard = ({ links }: ConnectCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect</CardTitle>
        <CardDescription>
          Follow or message the seller to start a conversation.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
              }),
              "flex items-center justify-center rounded-full size-12"
            )}
          >
            {getIconBySocialType(link.type)}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConnectCard;
