"use client";

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { STTModel } from '@shared/types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModels: string[];
  onSelectedModelsChange: (models: string[]) => void;
}

export default function Settings({
  isOpen,
  onClose,
  selectedModels,
  onSelectedModelsChange
}: SettingsProps) {
  const [models, setModels] = useState<STTModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    fetch("http://localhost:8080/models")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch models");
        return res.json();
      })
      .then(setModels)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const maxSelected = selectedModels.length >= 3;

  const handleToggle = (modelId: string, checked: boolean) => {
    if (checked) {
      if (!maxSelected) {
        onSelectedModelsChange([...selectedModels, modelId]);
      }
    } else {
      onSelectedModelsChange(selectedModels.filter(id => id !== modelId));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>STT Model Selection</DialogTitle>
          <DialogDescription>
            Select up to 3 models to compare. Provider and model type are shown in the label.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {loading && <div>Loading models...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && models.map((model) => (
            <div key={model.id} className="flex items-start space-x-3">
              <Checkbox
                id={model.id}
                checked={selectedModels.includes(model.id)}
                onCheckedChange={(checked) => handleToggle(model.id, !!checked)}
                disabled={!selectedModels.includes(model.id) && maxSelected}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={model.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {model.provider} – {model.name} <span className="capitalize text-xs text-gray-500">({model.type})</span>
                </label>
                {model.description && (
                  <p className="text-xs text-muted-foreground">
                    {model.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {maxSelected && (
          <div className="flex items-center space-x-2 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-700">
              Maximum of 3 models can be selected at once.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 