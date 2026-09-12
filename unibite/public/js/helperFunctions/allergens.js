export const ALLERGENS = [
    { value: "gluten", label: "Gluten", icon: "🌾" },
    { value: "crustaceans", label: "Crustaceans", icon: "🦐" },
    { value: "eggs", label: "Eggs", icon: "🥚" },
    { value: "fish", label: "Fish", icon: "🐟" },
    { value: "peanuts", label: "Peanuts", icon: "🥜" },
    { value: "soybeans", label: "Soybeans", icon: "🫘" },
    { value: "dairy", label: "Dairy", icon: "🥛" },
    { value: "nuts", label: "Nuts", icon: "🌰" },
    { value: "celery", label: "Celery", icon: "🥬" },
    { value: "mustard", label: "Mustard", icon: "🌭" },
    { value: "sesame", label: "Sesame", icon: "✳️" },
    { value: "sulphur dioxide", label: "Sulphites", icon: "🧪" },
    { value: "lupin", label: "Lupin", icon: "🌸" },
    { value: "molluscs", label: "Molluscs", icon: "🐚" }
];

export function getAllergenMeta(value) {
    return ALLERGENS.find((allergen) => allergen.value === value)
        || { value, label: value, icon: "⚠️" };
}