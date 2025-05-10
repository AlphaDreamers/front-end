import { Clock, Edit, Eye, Star, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import DeleteGigButton from "./DeleteGigButton";
import Link from "next/link";

interface GigProps {
  gig: Prisma.GigGetPayload<{
    include: {
      images: true;
      category: true;
      tags: true;
      packages: {
        include: {
          orders: true;
        };
      };
    };
  }>;
}

const GigDashboardCard = ({ gig }: GigProps) => {
  return (
    <Card key={gig.id} className="py-4 overflow-hidden">
      <CardHeader className="px-4">
        <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
          <Image
            src={gig.images[0]?.url || "/placeholder.jpg"}
            alt={gig.title}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between text-xs mb-2 text-muted-foreground">
          <div>{gig.category.label}</div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{gig.viewCount}</span>
          </div>
        </div>

        <CardTitle className="line-clamp-2">{gig.title}</CardTitle>

        <CardDescription className="mt-2 line-clamp-3">
          {gig.description}
        </CardDescription>
      </CardHeader>

      <div className="px-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {gig.tags.map((tag, index) => (
            <Badge variant="outline" className="text-chart-3" key={index}>
              {tag.label}
            </Badge>
          ))}
        </div>
      </div>

      <CardContent className="px-4 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Star size={16} className="text-primary mr-1" />
            <span>{gig.averageRating.toFixed(2)}</span>
            <span className="text-muted-foreground text-xs ml-1">
              ({gig.ratingCount})
            </span>
          </div>

          <div className="flex items-center">
            <Clock size={16} className="text-muted-foreground mr-1" />
            <span className="text-sm">
              Orders:{" "}
              {gig.packages.reduce((acc, pkg) => acc + pkg.orders.length, 0)}
            </span>
          </div>
        </div>

        <div className="flex justify-around items-center gap-4">
          {gig.packages.map((pkg, index) => (
            <Card
              key={index}
              className="flex-1 py-2 bg-accent text-center gap-2"
            >
              <CardHeader className="px-2">
                <CardTitle>{pkg.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-2 font-medium text-primary">
                {pkg.price} SOL
              </CardContent>
              <CardFooter className="px-2 block text-xs text-muted-foreground">
                {pkg.orders.length} sold
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-4 gap-2">
        <Link
          href={`/dashboard/gigs/${gig.id}/edit`}
          className={buttonVariants({
            className: "flex-1",
          })}
        >
          <Edit />
          <span>Edit</span>
        </Link>

        <Link
          href={`/gigs/${gig.id}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <Eye />
          <span>Preview</span>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                gig and remove it from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="grid grid-cols-2 gap-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DeleteGigButton gigId={gig.id} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default GigDashboardCard;
