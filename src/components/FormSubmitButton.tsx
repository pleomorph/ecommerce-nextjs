"use client";

import React, { ComponentProps } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  children: React.ReactNode, // this allows us to pass a component inside the opening and closing tags of this component
  className?: string,
} & ComponentProps<"button">  // this allows us to use "normal" button props, like "disabled"

export default function FormSubmitButton(
  { children, className, ...props }: FormSubmitButtonProps //...props catches remaining "normal" button props passed in
) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props} // we place this first so our props override any default incoming props
      className={`btn btn-primary ${className}`}
      type="submit"
      disabled={pending}
    >
      {pending && <span className="loading loading-spinner" />}
      {children}
    </button>
  )
}