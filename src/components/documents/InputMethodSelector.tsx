
import React from "react";
import { Button } from "@/components/ui/button";

interface InputMethodSelectorProps {
  inputMethod: "upload" | "manual";
  setInputMethod: (method: "upload" | "manual") => void;
}

const InputMethodSelector: React.FC<InputMethodSelectorProps> = ({
  inputMethod,
  setInputMethod,
}) => {
  return (
    <div className="flex space-x-4">
      <Button
        type="button"
        variant={inputMethod === "manual" ? "default" : "outline"}
        onClick={() => setInputMethod("manual")}
        className="flex-1"
      >
        Manual Input
      </Button>
      <Button
        type="button"
        variant={inputMethod === "upload" ? "default" : "outline"}
        onClick={() => setInputMethod("upload")}
        className="flex-1"
      >
        Upload File
      </Button>
    </div>
  );
};

export default InputMethodSelector;
