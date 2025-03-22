
import React from "react";
import MethodToggleButton from "./MethodToggleButton";
import { MOBILE_BREAKPOINT } from "@/hooks/use-mobile";
import { createResponsiveComponent } from "@/components/ui/responsive-container";

interface InputMethodSelectorProps {
  inputMethod: "upload" | "manual";
  setInputMethod: (method: "upload" | "manual") => void;
}

// Desktop version
const DesktopSelector: React.FC<InputMethodSelectorProps> = ({
  inputMethod,
  setInputMethod,
}) => {
  return (
    <div className="flex flex-row space-x-4 w-full">
      <MethodToggleButton
        isActive={inputMethod === "manual"}
        onClick={() => setInputMethod("manual")}
      >
        Manual Input
      </MethodToggleButton>
      <MethodToggleButton
        isActive={inputMethod === "upload"}
        onClick={() => setInputMethod("upload")}
      >
        Upload File
      </MethodToggleButton>
    </div>
  );
};

// Mobile version
const MobileSelector: React.FC<InputMethodSelectorProps> = ({
  inputMethod,
  setInputMethod,
}) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <MethodToggleButton
        isActive={inputMethod === "manual"}
        onClick={() => setInputMethod("manual")}
      >
        Manual Input
      </MethodToggleButton>
      <MethodToggleButton
        isActive={inputMethod === "upload"}
        onClick={() => setInputMethod("upload")}
      >
        Upload File
      </MethodToggleButton>
    </div>
  );
};

/**
 * Component that renders a toggle for selecting between manual input and file upload.
 * Uses responsive design to adapt to different screen sizes.
 */
const InputMethodSelector: React.FC<InputMethodSelectorProps> = createResponsiveComponent<InputMethodSelectorProps>(
  DesktopSelector,
  MobileSelector
);

export default InputMethodSelector;
