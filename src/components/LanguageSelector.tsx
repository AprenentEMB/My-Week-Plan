import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useEinesStore } from "../stores/storeEines";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "ca", label: "Català" },
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

export function LanguageSelector() {
  const { t } = useTranslation();
  const updateTranslations = useEinesStore((state) => state.updateTranslations);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      updateTranslations();
      localStorage.setItem("lang", lang);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {t("language.label")}
      </span>

      <Select
        value={i18n.language || "ca"}
        onValueChange={changeLanguage}
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


