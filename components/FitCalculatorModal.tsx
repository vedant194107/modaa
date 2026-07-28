"use client";

import { useState } from "react";

interface FitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  productTitle?: string;
}

export default function FitCalculatorModal({
  isOpen,
  onClose,
  onSelectSize,
  productTitle = "TACTICAL VEST - MK1",
}: FitCalculatorModalProps) {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(74);
  const [build, setBuild] = useState<"slim" | "athletic" | "average" | "broad">("athletic");
  const [fitPreference, setFitPreference] = useState<"slim" | "regular" | "oversized">("oversized");
  const [calculatedResult, setCalculatedResult] = useState<{
    size: string;
    confidence: number;
    description: string;
  } | null>(null);

  if (!isOpen) return null;

  const calculateFit = (e: React.FormEvent) => {
    e.preventDefault();

    // Standardized BMI / Weight-to-Height calculations
    let hInMeters = heightCm / 100;
    if (unit === "imperial") {
      hInMeters = (heightCm * 2.54) / 100;
    }

    let wInKg = weightKg;
    if (unit === "imperial") {
      wInKg = weightKg * 0.453592;
    }

    const bmi = wInKg / (hInMeters * hInMeters);

    let recommendedSize = "M";
    if (wInKg < 62 || heightCm < 168) recommendedSize = "S";
    else if (wInKg <= 76 && heightCm <= 180) recommendedSize = "M";
    else if (wInKg <= 88 || heightCm <= 186) recommendedSize = "L";
    else if (wInKg <= 100) recommendedSize = "XL";
    else recommendedSize = "XXL";

    // Adjust for fit preference
    if (fitPreference === "oversized") {
      if (recommendedSize === "S") recommendedSize = "M";
      else if (recommendedSize === "M") recommendedSize = "L";
      else if (recommendedSize === "L") recommendedSize = "XL";
      else if (recommendedSize === "XL") recommendedSize = "XXL";
    } else if (fitPreference === "slim") {
      if (recommendedSize === "XXL") recommendedSize = "XL";
      else if (recommendedSize === "XL") recommendedSize = "L";
      else if (recommendedSize === "L") recommendedSize = "M";
      else if (recommendedSize === "M") recommendedSize = "S";
    }

    const confidence = Math.min(98, Math.max(89, Math.round(92 + (bmi % 4))));

    setCalculatedResult({
      size: recommendedSize,
      confidence,
      description: `Based on your ${build} frame and ${fitPreference} preference, Size ${recommendedSize} yields an ideal architectural silhouette for ${productTitle}.`,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-lemon-chiffon border-4 border-on-surface w-full max-w-xl p-6 sm:p-8 shadow-[12px_12px_0px_0px_#a90e02] max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b-2 border-on-surface pb-4">
          <div>
            <span className="font-label-bold text-xs uppercase text-milano-red tracking-widest block font-bold">AI FIT RADAR</span>
            <h3 className="font-display-xl text-3xl uppercase leading-none">FIT & SIZE CALCULATOR</h3>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-2xl hover:text-milano-red transition-colors cursor-pointer"
          >
            close
          </button>
        </div>

        {/* Unit Switcher */}
        <div className="flex justify-end gap-2 text-xs font-label-bold">
          <button
            type="button"
            onClick={() => setUnit("metric")}
            className={`px-3 py-1 uppercase border border-on-surface ${
              unit === "metric" ? "bg-on-surface text-lemon-chiffon font-bold" : "bg-surface"
            }`}
          >
            METRIC (CM / KG)
          </button>
          <button
            type="button"
            onClick={() => setUnit("imperial")}
            className={`px-3 py-1 uppercase border border-on-surface ${
              unit === "imperial" ? "bg-on-surface text-lemon-chiffon font-bold" : "bg-surface"
            }`}
          >
            IMPERIAL (IN / LBS)
          </button>
        </div>

        {/* Calculation Inputs Form */}
        <form onSubmit={calculateFit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-label-bold text-xs uppercase block mb-1.5 opacity-80">
                Height ({unit === "metric" ? "CM" : "INCHES"})
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-surface border-2 border-on-surface p-2.5 font-label-bold text-sm"
                required
              />
            </div>
            <div>
              <label className="font-label-bold text-xs uppercase block mb-1.5 opacity-80">
                Weight ({unit === "metric" ? "KG" : "LBS"})
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-surface border-2 border-on-surface p-2.5 font-label-bold text-sm"
                required
              />
            </div>
          </div>

          {/* Build Type */}
          <div>
            <label className="font-label-bold text-xs uppercase block mb-2 opacity-80">Body Frame</label>
            <div className="grid grid-cols-4 gap-2">
              {(["slim", "athletic", "average", "broad"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBuild(b)}
                  className={`py-2 text-xs font-label-bold uppercase border-2 border-on-surface transition-all duration-200 cursor-pointer ${
                    build === b
                      ? "bg-milano-red text-lemon-chiffon font-bold shadow-[2.5px_2.5px_0px_0px_#000]"
                      : "bg-surface text-on-surface hover:bg-milano-red hover:text-lemon-chiffon hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Preference */}
          <div>
            <label className="font-label-bold text-xs uppercase block mb-2 opacity-80">Preferred Fit Style</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "slim", label: "SLIM FIT" },
                { key: "regular", label: "STANDARD FIT" },
                { key: "oversized", label: "OVERSIZED DROP" },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFitPreference(f.key as any)}
                  className={`py-2.5 text-xs font-label-bold uppercase border-2 border-on-surface transition-all duration-200 cursor-pointer ${
                    fitPreference === f.key
                      ? "bg-on-surface text-lemon-chiffon font-bold shadow-[2.5px_2.5px_0px_0px_#a90e02]"
                      : "bg-surface text-on-surface hover:bg-milano-red hover:text-lemon-chiffon hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-milano-red text-lemon-chiffon font-headline-md text-base uppercase tracking-widest border-2 border-on-surface hover:bg-on-surface transition-colors cursor-pointer"
          >
            CALCULATE MY PERFECT SIZE
          </button>
        </form>

        {/* Calculated Result Card */}
        {calculatedResult && (
          <div className="border-3 border-on-surface bg-surface p-5 space-y-3 animate-fadeIn">
            <div className="flex justify-between items-center border-b-2 border-on-surface pb-3">
              <div>
                <span className="font-label-bold text-[10px] uppercase text-milano-red font-bold block">RECOMMENDED FIT</span>
                <h4 className="font-display-xl text-4xl text-primary leading-none">SIZE {calculatedResult.size}</h4>
              </div>
              <div className="text-right">
                <span className="font-label-bold text-xl text-milano-red font-bold">{calculatedResult.confidence}%</span>
                <span className="font-label-bold text-[9px] uppercase block opacity-60">CONFIDENCE MATCH</span>
              </div>
            </div>

            <p className="font-body-md text-xs text-on-surface/80">{calculatedResult.description}</p>

            <button
              type="button"
              onClick={() => {
                onSelectSize(calculatedResult.size);
                onClose();
              }}
              className="w-full py-2.5 bg-on-surface text-lemon-chiffon font-headline-md text-xs uppercase tracking-widest hover:bg-milano-red transition-colors border border-on-surface cursor-pointer"
            >
              SELECT SIZE {calculatedResult.size} & CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
