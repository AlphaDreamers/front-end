import * as LucideIcons from "lucide-react";

export type LucideIconString = keyof typeof LucideIcons;

const Icon = ({
  icon,
  ...props
}: LucideIcons.LucideProps & {
  icon: keyof typeof LucideIcons;
}) => {
  const IconComponent = LucideIcons[icon] as LucideIcons.LucideIcon;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
};

export default Icon;
