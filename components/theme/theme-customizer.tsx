'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resume-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette, Check } from 'lucide-react';
import type { ResumeTheme } from '@/types/resume';

const PRESET_THEMES: ResumeTheme[] = [
  {
    id: 'professional',
    name: 'Professional Blue',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      text: '#1e293b',
      background: '#ffffff',
      accent: '#3b82f6',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: 'normal',
  },
  {
    id: 'modern',
    name: 'Modern Purple',
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      text: '#111827',
      background: '#ffffff',
      accent: '#8b5cf6',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: 'normal',
  },
  {
    id: 'elegant',
    name: 'Elegant Black',
    colors: {
      primary: '#18181b',
      secondary: '#71717a',
      text: '#09090b',
      background: '#ffffff',
      accent: '#3f3f46',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: 'normal',
  },
  {
    id: 'creative',
    name: 'Creative Teal',
    colors: {
      primary: '#0d9488',
      secondary: '#64748b',
      text: '#0f172a',
      background: '#ffffff',
      accent: '#14b8a6',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: 'normal',
  },
  {
    id: 'warm',
    name: 'Warm Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#78716c',
      text: '#1c1917',
      background: '#ffffff',
      accent: '#f97316',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: 'normal',
  },
  {
    id: 'minimal',
    name: 'Minimal Gray',
    colors: {
      primary: '#475569',
      secondary: '#94a3b8',
      text: '#1e293b',
      background: '#ffffff',
      accent: '#64748b',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: 'normal',
  },
];

export function ThemeCustomizer() {
  const { settings, updateTheme, updateSettings } = useResumeStore();
  const [open, setOpen] = useState(false);

  const handleThemeSelect = (theme: ResumeTheme) => {
    updateTheme(theme);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Palette className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
          <DialogDescription>
            Choose a preset theme or customize colors to match your style
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset Themes */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Preset Themes</h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`relative p-4 border-2 rounded-lg hover:border-slate-400 transition-all ${
                    settings.theme.id === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200'
                  }`}
                >
                  {settings.theme.id === theme.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-sm mb-2">{theme.name}</p>
                    <div className="flex gap-1">
                      <div
                        className="w-8 h-8 rounded border border-slate-200"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-8 h-8 rounded border border-slate-200"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-8 h-8 rounded border border-slate-200"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold">Additional Settings</h3>

            {/* Show Icons Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-icons" className="text-sm font-medium">
                  Show Icons
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display icons next to contact information
                </p>
              </div>
              <button
                id="show-icons"
                onClick={() => updateSettings({ showIcons: !settings.showIcons })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showIcons ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showIcons ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Verification Badges Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-badges" className="text-sm font-medium">
                  Show Verification Badges
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display checkmarks for verified achievements
                </p>
              </div>
              <button
                id="show-badges"
                onClick={() =>
                  updateSettings({ showVerificationBadges: !settings.showVerificationBadges })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showVerificationBadges ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showVerificationBadges ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Font Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="font-size" className="text-sm font-medium">
                  Font Size
                </Label>
                <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
              </div>
              <input
                id="font-size"
                type="range"
                min="12"
                max="18"
                step="1"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Margins Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="margins" className="text-sm font-medium">
                  Page Margins
                </Label>
                <span className="text-sm text-muted-foreground">{settings.margins}px</span>
              </div>
              <input
                id="margins"
                type="range"
                min="20"
                max="60"
                step="5"
                value={settings.margins}
                onChange={(e) => updateSettings({ margins: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Narrow</span>
                <span>Wide</span>
              </div>
            </div>

            {/* Line Height Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="line-height" className="text-sm font-medium">
                  Line Height
                </Label>
                <span className="text-sm text-muted-foreground">{settings.lineHeight}</span>
              </div>
              <input
                id="line-height"
                type="range"
                min="1.3"
                max="2.0"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Compact</span>
                <span>Relaxed</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
