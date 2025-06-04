import { UseFormReturn } from "react-hook-form";
import { Plus, X, Clock, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "./form-input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

interface FormPackagesProps {
  form: UseFormReturn<any>;
  features: Array<{ label: string }>;
}

export default function FormPackages({ form, features }: FormPackagesProps) {
  const packages = form.watch("packages");

  const addPackage = () => {
    const currentPackages = form.getValues("packages");
    form.setValue("packages", [
      ...currentPackages,
      {
        title: "",
        deliveryTime: 1,
        price: 0,
        revisions: 0,
        featureInclusions: new Array(features.length).fill(false),
      },
    ]);
  };

  const removePackage = (index: number) => {
    const currentPackages = form.getValues("packages");
    form.setValue(
      "packages",
      currentPackages.filter((_, i) => i !== index)
    );
  };

  const addFeature = () => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", [...currentFeatures, { label: "" }]);

    // Update all packages to include the new feature
    const currentPackages = form.getValues("packages");
    form.setValue(
      "packages",
      currentPackages.map((pkg) => ({
        ...pkg,
        featureInclusions: [...pkg.featureInclusions, false],
      }))
    );
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    form.setValue(
      "features",
      currentFeatures.filter((_, i) => i !== index)
    );

    // Update all packages to remove the feature
    const currentPackages = form.getValues("packages");
    form.setValue(
      "packages",
      currentPackages.map((pkg) => ({
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
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Feature
          </Button>
        </div>

        <div className="grid gap-3">
          {features.map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormInput
                control={form.control}
                name={`features.${index}.label`}
                label=""
                placeholder="e.g., Responsive Design"
                className="flex-1"
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
                <FormInput
                  control={form.control}
                  name={`packages.${pkgIndex}.title`}
                  label="Package Name"
                  placeholder="e.g., Basic"
                  required
                />
                {packages.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8"
                    onClick={() => removePackage(pkgIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <FormInput
                  control={form.control}
                  name={`packages.${pkgIndex}.price`}
                  label="Price"
                  type="number"
                  placeholder="0"
                  icon={DollarSign}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name={`packages.${pkgIndex}.deliveryTime`}
                    label="Delivery (days)"
                    type="number"
                    placeholder="1"
                    icon={Clock}
                    required
                  />

                  <FormInput
                    control={form.control}
                    name={`packages.${pkgIndex}.revisions`}
                    label="Revisions"
                    type="number"
                    placeholder="0"
                    icon={RefreshCw}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Included Features
                  </label>
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
                              {feature.label}
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
      </div>
    </div>
  );
}
