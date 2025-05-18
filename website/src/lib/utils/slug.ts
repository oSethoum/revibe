export function toSlug(text: string) {
  return text
    .toString() // convert to string
    .normalize("NFD") // normalize accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase() // convert to lowercase
    .trim() // trim whitespace
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // collapse multiple -
}
