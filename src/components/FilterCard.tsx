"use client";

import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import {
  Slider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Card,
  CardContent,
  Toggle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui";
import { Button, buttonVariants } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";

interface FilterCardProps {
  config: (
    | (SliderButtonProps & { type: "slider" })
    | (ComboboxButtonProps & { type: "combobox" })
    | (MultiComboboxButtonProps & { type: "multicombobox" })
    | (SwitchButtonProps & { type: "switch" })
    | (CheckboxButtonProps & { type: "checkbox" })
    | (RadioButtonProps & { type: "radio" })
    | (DateButtonProps & { type: "date" })
    | (DateRangeButtonProps & { type: "daterange" })
  )[];
}

const FilterCard = ({ config }: FilterCardProps) => {
  const filterButtons = config.map((filterConfig) => {
    switch (filterConfig.type) {
      case "slider":
        return <SliderButton key={filterConfig.id} {...filterConfig} />;
      case "combobox":
        return <ComboboxButton key={filterConfig.id} {...filterConfig} />;
      case "multicombobox":
        return <MultiComboboxButton key={filterConfig.id} {...filterConfig} />;
      case "switch":
        return <SwitchButton key={filterConfig.id} {...filterConfig} />;
      case "checkbox":
        return <CheckboxButton key={filterConfig.id} {...filterConfig} />;
      case "radio":
        return <RadioButton key={filterConfig.id} {...filterConfig} />;
      case "date":
        return <DateButton key={filterConfig.id} {...filterConfig} />;
      case "daterange":
        return <DateRangeButton key={filterConfig.id} {...filterConfig} />;
      default:
        return null;
    }
  });

  return (
    <Card className="py-2">
      <CardContent className="flex flex-wrap gap-2 items-center px-2">
        {filterButtons}
      </CardContent>
    </Card>
  );
};

interface SliderButtonProps {
  id: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

const SliderButton = ({
  id,
  label,
  min = 0,
  max = 100,
  step = 1,
}: SliderButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const initialMin = Number(searchParams.get(id + "-min")) || min;
  const initialMax = Number(searchParams.get(id + "-max")) || max;

  const [values, setValues] = useState([initialMin, initialMax]);

  const updateUrlParams = useDebouncedCallback((values) => {
    const params = new URLSearchParams(searchParams);

    if (values[0] !== min) {
      params.set(id + "-min", values[0]);
    } else {
      params.delete(id + "-min");
    }

    if (values[1] !== max) {
      params.set(id + "-max", values[1]);
    } else {
      params.delete(id + "-max");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleValueChange = (newValues: [number, number]) => {
    setValues(newValues);

    updateUrlParams(newValues);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newMin = parseInt(e.target.value);

    if (!isNaN(newMin) && newMin >= min && newMin <= values[1]) {
      handleValueChange([newMin, values[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newMax: number = parseInt(e.target.value);

    if (!isNaN(newMax) && newMax >= values[0] && newMax <= max) {
      handleValueChange([values[0], newMax]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">
          {label}: {values[0]} - {values[1]}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Slider
          min={min}
          max={max}
          step={step}
          value={values}
          onValueChange={handleValueChange}
          className="mt-2 mb-4"
        />

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="number"
              value={values[0]}
              min={min}
              max={values[1]}
              className="text-center"
              onChange={handleMinChange}
            />
          </div>
          <span className="text-muted-foreground">to</span>
          <div className="flex-1">
            <Input
              type="number"
              value={values[1]}
              min={values[0]}
              max={max}
              className="text-center"
              onChange={handleMaxChange}
            />
          </div>
        </div>

        <div className="pt-1 text-xs text-muted-foreground flex justify-between">
          <span>Min: {min}</span>
          <span>Max: {max}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ComboboxButtonProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

const ComboboxButton = ({ id, label, options }: ComboboxButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(searchParams.get(id) || null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {label}:{" "}
          {value
            ? options.find((option) => option.value === value)?.label
            : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${label.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const isSameValue = currentValue === value;
                    setValue(isSameValue ? null : currentValue);
                    const params = new URLSearchParams(searchParams);
                    if (isSameValue) {
                      params.delete(id);
                    } else {
                      params.set(id, currentValue);
                    }
                    replace(`${pathname}?${params.toString()}`);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface MultiComboboxButtonProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

const MultiComboboxButton = ({
  id,
  label,
  options,
}: MultiComboboxButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState(searchParams.getAll(id));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between relative"
        >
          {label}: {value.length !== 0 && `(${value.length})`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandInput placeholder={`Search ${label}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const isSameValue = value.includes(currentValue);
                    const newValue = isSameValue
                      ? value.filter((v) => v !== currentValue)
                      : [...value, currentValue];

                    setValue(newValue);
                    const params = new URLSearchParams(searchParams);
                    if (isSameValue) {
                      params.delete(id, currentValue);
                    } else {
                      params.append(id, currentValue);
                    }
                    replace(`${pathname}?${params.toString()}`);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface SwitchButtonProps {
  id: string;
  label: string;
}

const SwitchButton = ({ id, label }: SwitchButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [pressed, setPressed] = useState(searchParams.get(id) === "true");

  return (
    <Toggle
      pressed={pressed}
      onPressedChange={(newValue) => {
        setPressed(newValue);
        const params = new URLSearchParams(searchParams);
        if (newValue) {
          params.set(id, "true");
        } else {
          params.delete(id);
        }
        replace(`${pathname}?${params.toString()}`);
      }}
      className={cn(
        buttonVariants({
          variant: "outline",
        }),
        "relative"
      )}
    >
      {label}
      <Check
        className={cn(
          "absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 h-4 w-4",
          !pressed && "hidden"
        )}
      />
    </Toggle>
  );
};

interface CheckboxButtonProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

const CheckboxButton = ({ id, label, options }: CheckboxButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [values, setValues] = useState(searchParams.getAll(id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {label}: {values.length ? `(${values.length})` : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={values.includes(option.value)}
            onCheckedChange={(checked) => {
              const newValues = checked
                ? [...values, option.value]
                : values.filter((value) => value !== option.value);
              setValues(newValues);
              const params = new URLSearchParams(searchParams);
              if (checked) {
                params.append(id, option.value);
              } else {
                params.delete(id, option.value);
              }
              replace(`${pathname}?${params.toString()}`);
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface RadioButtonProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

const RadioButton = ({ id, label, options = [] }: RadioButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState(
    searchParams.get(id) || options[0]?.value || undefined
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {label}:{" "}
          {value
            ? options.find((option) => option.value === value)?.label
            : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            const params = new URLSearchParams(searchParams);
            if (newValue) {
              params.set(id, newValue);
            } else {
              params.delete(id);
            }
            replace(`${pathname}?${params.toString()}`);
          }}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface DateButtonProps {
  id: string;
  label: string;
  min?: Date;
  max?: Date;
}

const DateButton = ({ id, label, min, max }: DateButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const dateParam = searchParams.get(id);
  const dateVal = dateParam ? new Date(dateParam) : undefined;
  const [date, setDate] = useState<Date | undefined>(
    dateVal && isValidDate(dateVal) ? dateVal : undefined
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? `${label}: ${format(date, "MMM dd, yyyy")}` : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          fromDate={min}
          toDate={max}
          onSelect={(date) => {
            setDate(date);
            const params = new URLSearchParams(searchParams);
            if (date) {
              params.set(id, date.toString());
            } else {
              params.delete(id);
            }
            replace(`${pathname}?${params.toString()}`);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

interface DateRangeButtonProps {
  id: string;
  label: string;
  min?: Date;
  max?: Date;
}

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

const DateRangeButton = ({ id, label, min, max }: DateRangeButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const fromParam = searchParams.get(id + "-from");
  const toParam = searchParams.get(id + "-to");

  const fromDate = fromParam ? new Date(fromParam) : undefined;
  const toDate = toParam ? new Date(toParam) : undefined;

  const initialDateRange: DateRange | undefined =
    fromDate && isValidDate(fromDate)
      ? isValidDate(toDate)
        ? { from: fromDate, to: toDate }
        : { from: fromDate }
      : undefined;

  const [date, setDate] = useState<DateRange | undefined>(initialDateRange);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date && date.from
            ? date.to
              ? `${label}: ${format(date.from, "MMM dd")} - ${format(
                  date.to,
                  "MMM dd"
                )}`
              : `${label}: ${format(date.from, "MMM dd")}`
            : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          fixedWeeks
          fromDate={min}
          toDate={max}
          onSelect={(dates) => {
            setDate(dates);
            const params = new URLSearchParams(searchParams);
            if (dates?.from) {
              params.set(id + "-from", dates.from.toString());
            } else {
              params.delete(id + "-from");
            }
            if (dates?.to) {
              params.set(id + "-to", dates.to.toString());
            } else {
              params.delete(id + "-to");
            }
            replace(`${pathname}?${params.toString()}`);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FilterCard;
