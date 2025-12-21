"use client";

import { useState, useCallback } from "react";
import { Bookmark, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePresets, type Preset } from "@/hooks/use-presets";

interface PresetManagerProps {
  /** Currently selected package names */
  currentPackages: string[];
  /** Callback when a preset is loaded */
  onLoadPreset: (packages: string[]) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Component for managing package comparison presets.
 * Allows users to save, load, rename, and delete presets.
 *
 * @param currentPackages - Currently selected package names
 * @param onLoadPreset - Called when user loads a preset
 * @param disabled - Whether the component is disabled
 * @example
 * <PresetManager
 *   currentPackages={["react", "vue"]}
 *   onLoadPreset={(packages) => setPackages(packages)}
 * />
 */
export function PresetManager({
  currentPackages,
  onLoadPreset,
  disabled = false,
}: PresetManagerProps) {
  const {
    presets,
    savePreset,
    deletePreset,
    renamePreset,
    maxPresets,
    maxNameLength,
  } = usePresets();

  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [presetName, setPresetName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  /**
   * Opens the save dialog.
   */
  const handleOpenSaveDialog = useCallback(() => {
    setPresetName("");
    setNameError(null);
    setSaveDialogOpen(true);
  }, []);

  /**
   * Saves the current packages as a new preset.
   */
  const handleSavePreset = useCallback(async () => {
    const result = await savePreset(presetName, currentPackages);
    if (result.error) {
      setNameError(result.error);
      return;
    }
    setSaveDialogOpen(false);
    toast.success(`Preset "${presetName}" saved`);
  }, [presetName, currentPackages, savePreset]);

  /**
   * Loads a preset's packages.
   */
  const handleLoadPreset = useCallback(
    (preset: Preset) => {
      onLoadPreset(preset.packages);
      toast.success(`Loaded preset "${preset.name}"`);
    },
    [onLoadPreset]
  );

  /**
   * Opens the rename dialog for a preset.
   */
  const handleOpenRenameDialog = useCallback((preset: Preset) => {
    setSelectedPreset(preset);
    setPresetName(preset.name);
    setNameError(null);
    setRenameDialogOpen(true);
  }, []);

  /**
   * Renames the selected preset.
   */
  const handleRenamePreset = useCallback(async () => {
    if (!selectedPreset) return;
    const error = await renamePreset(selectedPreset.id, presetName);
    if (error) {
      setNameError(error);
      return;
    }
    setRenameDialogOpen(false);
    toast.success("Preset renamed");
  }, [selectedPreset, presetName, renamePreset]);

  /**
   * Opens the delete confirmation dialog for a preset.
   */
  const handleOpenDeleteDialog = useCallback((preset: Preset) => {
    setSelectedPreset(preset);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Deletes the selected preset.
   */
  const handleDeletePreset = useCallback(async () => {
    if (!selectedPreset) return;
    const success = await deletePreset(selectedPreset.id);
    if (success) {
      setDeleteDialogOpen(false);
      toast.success(`Preset "${selectedPreset.name}" deleted`);
    } else {
      toast.error("Failed to delete preset");
    }
  }, [selectedPreset, deletePreset]);

  const canSave = currentPackages.length > 0 && presets.length < maxPresets;

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={disabled}
                aria-label="Manage presets"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage presets</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            Presets ({presets.length}/{maxPresets})
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Save current as preset */}
          <DropdownMenuItem
            onClick={handleOpenSaveDialog}
            disabled={!canSave}
          >
            <Plus className="h-4 w-4" />
            Save current as preset
          </DropdownMenuItem>

          {presets.length > 0 && <DropdownMenuSeparator />}

          {/* Preset list */}
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              className="flex items-center justify-between group"
              onClick={() => handleLoadPreset(preset)}
            >
              <span className="truncate flex-1">{preset.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {preset.packages.length} pkg
              </span>
              <div
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleOpenRenameDialog(preset)}
                  className="p-1 hover:bg-accent rounded"
                  aria-label={`Rename preset ${preset.name}`}
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleOpenDeleteDialog(preset)}
                  className="p-1 hover:bg-destructive/10 rounded text-destructive"
                  aria-label={`Delete preset ${preset.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </DropdownMenuItem>
          ))}

          {presets.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No presets saved yet
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Preset</DialogTitle>
            <DialogDescription>
              Save current packages ({currentPackages.join(", ")}) as a preset
              for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => {
                setPresetName(e.target.value);
                setNameError(null);
              }}
              maxLength={maxNameLength}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "preset-name-error" : undefined}
            />
            {nameError && (
              <p id="preset-name-error" className="text-sm text-destructive">
                {nameError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {presetName.length}/{maxNameLength} characters
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Preset</DialogTitle>
            <DialogDescription>
              Enter a new name for this preset.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => {
                setPresetName(e.target.value);
                setNameError(null);
              }}
              maxLength={maxNameLength}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "rename-error" : undefined}
            />
            {nameError && (
              <p id="rename-error" className="text-sm text-destructive">
                {nameError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRenamePreset} disabled={!presetName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Preset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedPreset?.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePreset}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
