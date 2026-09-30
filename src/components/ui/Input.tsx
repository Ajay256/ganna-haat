"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  prefixText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, prefixText, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5 w-full">
        <label
          htmlFor={inputId}
          className="block text-sm font-bold text-cane-950"
        >
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative rounded-xl shadow-xs">
          {prefixText && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className="text-cane-600 font-bold text-sm">{prefixText}</span>
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`block w-full rounded-xl border bg-white py-3 text-cane-950 text-base placeholder:text-cane-400 focus:outline-hidden focus:ring-2 focus:ring-cane-500 transition-all ${
              prefixText ? "pl-9 pr-3.5" : "px-3.5"
            } ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                : "border-cane-300 focus:border-cane-600"
            } ${className}`}
            {...props}
          />
        </div>

        {helpText && !error && (
          <p className="text-xs text-cane-600 leading-normal">{helpText}</p>
        )}

        {error && (
          <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
