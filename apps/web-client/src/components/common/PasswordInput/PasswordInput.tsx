"use client";

import { EyeOff, Eye } from "lucide-react";
import { FC, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<"input"> {
  className?: string;
}

const PasswordInput: FC<PasswordInputProps> = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
      >
        {showPassword ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
