import { Star, Zap, Trophy, Hourglass, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface GigCardProps {
  title: string;
  description: string;
  level: string;
  experience: string;
  completedProjects: number;
  deliveryTime: string;
  startingPrice: number;
  currency: string;
  sellerName: string;
  sellerAvatar: string;
  popularityScore: number;
}

export default function GigCardDesign({
  title,
  description,
  level,
  experience,
  completedProjects,
  deliveryTime,
  startingPrice,
  currency,
  sellerName,
  sellerAvatar,
  popularityScore,
}: GigCardProps) {
  return (
    <Card className="max-w-sm">
      {/* Header with Level Badge */}
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image
            src={sellerAvatar}
            alt="Seller Avatar"
            width={64}
            height={64}
            className="rounded-full border-2 border-primary object-cover size-12"
          />

          <div>
            <p className="font-bold text-lg mb-1">{sellerName}</p>

            <div className="flex items-center gap-1">
              <Badge variant="outline">
                <Star size={12} className="text-primary fill-primary" />
                <span>{popularityScore}% Positive</span>
              </Badge>
              <Badge variant="outline">
                <Trophy size={12} className="text-chart-5 fill-chart-5" />
                <span>{completedProjects} Projects</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent>
        <h3 className="font-bold text-xl mb-3 text-primary">{title}</h3>
        <p className="text-sm mb-4">{description}</p>

        <div className="grid grid-cols-2 gap-2">
          <Card className="py-4">
            <CardContent className="px-4 flex items-center gap-4">
              <Hourglass className="bg-chart-2 rounded p-1.5 size-8 stroke-[1.5]" />
              <div>
                <p className="text-xs text-muted-foreground">Delivery Time</p>
                <p className="text-sm font-medium">{deliveryTime}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardContent className="px-4 flex items-center gap-4">
              <Zap
                size={16}
                className="bg-chart-4 rounded p-1.5 size-8 stroke-[1.5]"
              />
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-medium">{experience}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      <CardFooter>
        <div>
          <p className="text-xs text-muted-foreground">Starting at</p>
          <p className="text-2xl font-bold">
            {startingPrice} <span className="text-primary">{currency}</span>
          </p>
        </div>

        <Link
          href="/order"
          className={buttonVariants({
            size: "lg",
            className: "ml-auto",
          })}
        >
          Order
          <ArrowRight />
        </Link>
      </CardFooter>
    </Card>
  );
}
