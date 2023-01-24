import { Translatable } from "../../dto/Translatable";

export interface TranslationProps {
  fallback?: string;
  children: Translatable;
}

export function Translation({ fallback, children }: TranslationProps) {
  // TODO: Load from translation context (e.g. react-i81next)
  const language = "en";

  // TODO: Load from translation context
  const fallbackLanguage = "en";

  if (typeof children === "string") {
    return <>{children}</>;
  }

  if (language in children && typeof children[language] === "string") {
    return <>{children[language]}</>;
  }

  if (
    fallbackLanguage in children &&
    typeof children[fallbackLanguage] === "string"
  ) {
    return <>{children[fallbackLanguage]}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <></>;
}
