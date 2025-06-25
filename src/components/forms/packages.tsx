"use client";

import { UseFormReturn } from "react-hook-form";
import { Plus, X, Clock, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Feature, Package } from "@/lib/types/forms";

interface PackagesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  features: Feature[];
}

const PACKAGE_TEMPLATES = [
  { title: "Basic", deliveryTime: 3, price: 50, revisions: 1 },
  { title: "Standard", deliveryTime: 2, price: 100, revisions: 2 },
  { title: "Premium", deliveryTime: 1, price: 200, revisions: -1 },
];

export default function Packages({ form, features }: PackagesProps) {
  const packages: Package[] = form.watch("packages") || [];

  const addPackage = () => {
    const currentPackages = form.getValues("packages") || [];
    const templateIndex = currentPackages.length;
    const template = PACKAGE_TEMPLATES[templateIndex] || PACKAGE_TEMPLATES[0];

    form.setValue("packages", [
      ...currentPackages,
      {
        ...template,
        featureInclusions: new Array(features.length).fill(false),
      },
    ]);
  };

  const removePackage = (index: number) => {
    const currentPackages = form.getValues("packages");
    form.setValue(
      "packages",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentPackages.filter((_: any, i: number) => i !== index)
    );
  };

  const addFeature = () => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue("features", [...currentFeatures, { title: "" }]);

    // Update all packages to include the new feature
    const currentPackages = form.getValues("packages") || [];
    form.setValue(
      "packages",
      currentPackages.map((pkg: Package) => ({
        ...pkg,
        featureInclusions: [...pkg.featureInclusions, false],
      }))
    );
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    form.setValue(
      "features",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentFeatures.filter((_: any, i: number) => i !== index)
    );

    // Update all packages to remove the feature
    const currentPackages = form.getValues("packages");
    form.setValue(
      "packages",
      currentPackages.map((pkg: Package) => ({
        ...pkg,
        featureInclusions: pkg.featureInclusions.filter((_, i) => i !== index),
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Features Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Features</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
            disabled={features.length >= 10}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Feature
          </Button>
        </div>

        <div className="grid gap-3">
          {features.map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`features.${index}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="e.g., Responsive Design" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFeature(index)}
                disabled={features.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Pricing Tiers</h3>
          {packages.length < 3 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPackage}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Package
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {packages.map((pkg, pkgIndex) => (
            <Card key={pkgIndex} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <FormField
                  control={form.control}
                  name={`packages.${pkgIndex}.title`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Basic" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {packages.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8 ml-2"
                    onClick={() => removePackage(pkgIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={`packages.${pkgIndex}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price (SOL)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`packages.${pkgIndex}.deliveryTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Delivery (days)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="1"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`packages.${pkgIndex}.revisions`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Revisions
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="0"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel>Included Features</FormLabel>
                  <div className="space-y-2">
                    {features.map((feature, featureIndex) => (
                      <FormField
                        key={featureIndex}
                        control={form.control}
                        name={`packages.${pkgIndex}.featureInclusions.${featureIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <label className="text-sm font-normal cursor-pointer">
                              {feature.title || `Feature ${featureIndex + 1}`}
                            </label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No packages added yet</p>
            <Button type="button" variant="outline" onClick={addPackage}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Package
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
