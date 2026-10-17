import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "primary" | "key"; children: ReactNode };

/** A link styled as a physical, pushable key: it lifts on hover and presses down on click. */
export function PushButton({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <a {...rest} className={`push push--${variant} ${className}`}>
      <span aria-hidden="true" className="push__shadow" />
      <span aria-hidden="true" className="push__edge" />
      <span className="push__front">{children}</span>
    </a>
  );
}
