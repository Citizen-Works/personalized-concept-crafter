
import React from "react";
import MethodToggleButton from "./MethodToggleButton";

interface InputMethodSelectorProps {
  inputMethod: "upload" | "manual";
  setInputMethod: (method: "upload" | "manual") => void;
}

const InputMethodSelector: React.FC<InputMethodSelectorProps> = ({
  inputMethod,
  setInputMethod,
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full">
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

export default InputMethodSelector;
