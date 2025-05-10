"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  ChevronsUpDown,
  Check,
  Loader2,
  Camera,
  AlertCircle,
  Globe,
  CheckCircle,
  Signature,
  BadgeInfo,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as faceapi from "face-api.js";
import clsx from "clsx";
import { drawContour } from "face-api.js/build/commonjs/draw";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, Input } from "@/components/ui";

import { COMMON_PASSWORDS } from "@/lib/common-passwords";
import { COUNTRIES } from "@/lib/countries";
import { SignUpFormDefaultValues, SignUpFormSchema } from "@/lib/schemas";
import { signUp } from "@/lib/actions";
import { useRouter } from "next/navigation";

type Status = "idle" | "loading" | "scanning" | "success" | "error";

export default function RegisterPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [securityLevel, setSecurityLevel] = useState(0);
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      setStatus("loading");
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);

      setStatus("idle");
    };

    loadModels();
  }, []);

  const handleScan = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video) return;
    if (!canvas) return;

    try {
      setStatus("loading");

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      setStatus("scanning");

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const interval = setInterval(async () => {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detections) {
          clearInterval(interval);

          const context = canvas.getContext("2d");
          if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            // ✨ Draw landmarks on the canvas
            context.lineWidth = 2;
            context.strokeStyle = "rgba(0, 255, 192, 0.25)";
            context.fillStyle = "rgba(0, 255, 192, 0.25)";
            drawContour(context, detections.landmarks.getLeftEye(), true);
            drawContour(context, detections.landmarks.getRightEye(), true);
            drawContour(context, detections.landmarks.getNose());
            drawContour(context, detections.landmarks.getMouth(), true);
            drawContour(context, detections.landmarks.getLeftEyeBrow());
            drawContour(context, detections.landmarks.getRightEyeBrow());
            drawContour(context, detections.landmarks.getJawOutline());

            detections.landmarks.positions.forEach((point) => {
              context.beginPath();
              context.strokeStyle = "rgba(0, 255, 192, 0.5)";
              context.fillStyle = "rgba(0, 255, 192, 0.5)";
              context.arc(point.x, point.y, 2, 0, Math.PI * 2);
              context.fill();
            });
            context.stroke();
          }

          // Stop camera
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;

          // Hide video, show canvas
          canvas.classList.remove("hidden");
          video.classList.add("hidden");

          const descriptor = detections.descriptor;
          const hash = Array.from(new Float32Array(descriptor))
            .map((val) => val.toFixed(5))
            .join("-");
          form.setValue("biometricHash", hash);
          setStatus("success");
        }
      }, 300);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const onSubmit = async (values: z.infer<typeof SignUpFormSchema>) => {
    toast.promise(
      async () => {
        try {
          await signUp(values);
        } catch {
          form.setError("root", {
            type: "manual",
            message: "An error occurred. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
      },
      {
        loading: "Creating account...",
        success: () => {
          push("/verify-email?email=" + values.email);

          return "Account created successfully. Please check your email for verification.";
        },
        error: (err) => {
          if (err instanceof Error) {
            return err.message;
          }
          return "An error occurred. Please try again.";
        },
      }
    );
  };

  const form = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: SignUpFormDefaultValues,
  });

  const validateSecurityLevel = (password: string) => {
    let level = 0;

    if (!password || password.length === 0) {
      setSecurityLevel(0);
      return;
    }

    if (password.length >= 8 && password.length <= 32) level++;
    if (/[a-z]/.test(password)) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/[0-9]/.test(password)) level++;
    if (/[^A-Za-z0-9]/.test(password)) level++;
    if (!COMMON_PASSWORDS.includes(password)) level++;

    setSecurityLevel(level);
  };

  return (
    <main className="w-md">
      <div className="mb-6 text-center">
        <h1>Create Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete your profile to get started with our secure platform
        </p>
      </div>

      <Tabs defaultValue="personalInfo">
        <TabsList className="w-full">
          <TabsTrigger value="personalInfo">
            <User size={16} className="text-primary" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock size={16} className="text-primary" />
            Security
          </TabsTrigger>
        </TabsList>

        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <TabsContent value="personalInfo" className="space-y-2 mb-4">
                  <div className="flex items-center gap-4 justify-between">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="flex items-center gap-1">
                            <BadgeInfo size={16} className="text-primary" />
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="flex items-center gap-1">
                            <Signature size={16} className="text-primary" />
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Johnson" {...field} />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <User size={16} className="text-primary" />
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="johnson_123" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          <Globe size={16} className="text-primary" />
                          Country
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? COUNTRIES.find(
                                      (country) => country.value === field.value
                                    )?.label
                                  : "Select Country"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search country..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {COUNTRIES.map((country) => (
                                    <CommandItem
                                      value={country.label}
                                      key={country.value}
                                      onSelect={() => {
                                        form.setValue("country", country.value);
                                      }}
                                    >
                                      {country.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          country.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="security" className="space-y-2 mb-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Mail size={16} className="text-primary" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Lock size={16} className="text-primary" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="*********"
                            type="password"
                            {...field}
                            onChange={(e) => {
                              validateSecurityLevel(e.target.value);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormDescription className="mb-2 flex flex-col gap-1">
                          <span className="flex justify-between items-center text-xs">
                            <span>Password Security</span>
                            <span>
                              {
                                [
                                  "Very Weak",
                                  "Weak",
                                  "Moderate",
                                  "Strong",
                                  "Very Strong",
                                  "Excellent",
                                  "Excellent",
                                  "Excellent",
                                ][Math.min(securityLevel, 7)]
                              }
                            </span>
                          </span>
                          <Progress max={8} value={securityLevel * 12.5} />
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Lock size={16} className="text-primary" />
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="*********"
                            type="password"
                            {...field}
                            onChange={(e) => {
                              validateSecurityLevel(e.target.value);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="biometricHash"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Shield size={16} className="text-primary" />
                          Biometric Verification
                        </FormLabel>
                        <FormControl>
                          <div>
                            <div className="relative h-48 w-full">
                              {status === "idle" && (
                                <div className="absolute w-full h-48 bg-secondary rounded flex items-center justify-center rounded-b-none">
                                  <Camera size={32} />
                                </div>
                              )}
                              {status === "loading" && (
                                <div className="absolute w-full h-48 bg-secondary rounded flex items-center justify-center rounded-b-none">
                                  <Loader2 size={32} className="animate-spin" />
                                </div>
                              )}
                              {status === "error" && (
                                <div className="absolute w-full h-48 bg-destructive rounded flex items-center justify-center rounded-b-none">
                                  <AlertCircle size={32} />
                                </div>
                              )}
                              {status === "success" && (
                                <div className="absolute z-10 w-full h-48 bg-primary rounded flex items-center justify-center rounded-b-none">
                                  <CheckCircle size={32} />
                                </div>
                              )}

                              <video
                                ref={videoRef}
                                playsInline
                                muted
                                className={clsx(
                                  "absolute w-full h-48 bg-secondary rounded-t object-cover",
                                  status !== "scanning" && "hidden"
                                )}
                              />

                              <canvas
                                ref={canvasRef}
                                className={clsx(
                                  "absolute z-20 w-full h-48 object-cover rounded-t pointer-events-none",
                                  status !== "scanning" &&
                                    status !== "success" &&
                                    "hidden"
                                )}
                              />
                            </div>

                            <Button
                              variant={
                                status !== "error" ? "outline" : "destructive"
                              }
                              className="w-full rounded-t-none"
                              onClick={(e) => handleScan(e)}
                              disabled={
                                status === "loading" || status === "scanning"
                              }
                            >
                              {status === "error"
                                ? "Retry"
                                : status === "success"
                                  ? "Retake"
                                  : "Begin Scan"}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="truncate">
                          {field.value && `Hash: ${field.value}`}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight />
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </Form>

          <Separator />

          <CardFooter className="tems-center justify-center text-sm text-muted-foreground">
            <span>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({
                    variant: "link",
                  }),
                  "inline py-0 px-1"
                )}
              >
                Sign in
              </Link>
            </span>
          </CardFooter>
        </Card>
      </Tabs>

      <div className="mt-4 flex items-center gap-2 justify-center text-sm text-muted-foreground">
        <Lock size={16} />
        Secure verification with end-to-end encryption
      </div>
    </main>
  );
}
