
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TargetAudience } from "@/types";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
});

type TargetAudienceFormValues = z.infer<typeof formSchema>;

interface TargetAudienceFormProps {
  onSubmit: (values: TargetAudienceFormValues) => void;
  initialData?: TargetAudience;
  isSubmitting: boolean;
}

export function TargetAudienceForm({
  onSubmit,
  initialData,
  isSubmitting,
}: TargetAudienceFormProps) {
  const [painPointInput, setPainPointInput] = React.useState("");
  const [goalInput, setGoalInput] = React.useState("");

  const form = useForm<TargetAudienceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      painPoints: initialData?.painPoints || [],
      goals: initialData?.goals || [],
    },
  });

  const addPainPoint = () => {
    if (!painPointInput.trim()) return;
    
    const currentPainPoints = form.getValues().painPoints || [];
    form.setValue("painPoints", [...currentPainPoints, painPointInput.trim()]);
    setPainPointInput("");
  };

  const removePainPoint = (index: number) => {
    const currentPainPoints = form.getValues().painPoints || [];
    form.setValue(
      "painPoints",
      currentPainPoints.filter((_, i) => i !== index)
    );
  };

  const addGoal = () => {
    if (!goalInput.trim()) return;
    
    const currentGoals = form.getValues().goals || [];
    form.setValue("goals", [...currentGoals, goalInput.trim()]);
    setGoalInput("");
  };

  const removeGoal = (index: number) => {
    const currentGoals = form.getValues().goals || [];
    form.setValue(
      "goals",
      currentGoals.filter((_, i) => i !== index)
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    addFn: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFn();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Small Business Owners" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this audience segment in detail"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="painPoints"
          render={() => (
            <FormItem>
              <FormLabel>Pain Points</FormLabel>
              <FormDescription>
                What challenges does this audience face?
              </FormDescription>
              <div className="flex gap-2 mb-2">
                <Input
                  value={painPointInput}
                  onChange={(e) => setPainPointInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, addPainPoint)}
                  placeholder="Add a pain point"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addPainPoint}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("painPoints")?.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{point}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removePainPoint(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goals"
          render={() => (
            <FormItem>
              <FormLabel>Goals</FormLabel>
              <FormDescription>
                What are this audience's objectives or aspirations?
              </FormDescription>
              <div className="flex gap-2 mb-2">
                <Input
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, addGoal)}
                  placeholder="Add a goal"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addGoal}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("goals")?.map((goal, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{goal}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removeGoal(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Update" : "Create"} Audience
          </Button>
        </div>
      </form>
    </Form>
  );
}
