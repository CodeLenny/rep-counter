export type LanguageCode = "en" | "en-US" | "es";

export type TranslatedContent = Partial<Record<LanguageCode, string>>;

export type Translatable = string | TranslatedContent;
