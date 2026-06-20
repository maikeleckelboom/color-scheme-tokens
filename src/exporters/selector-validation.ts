export function isValidCssSelector(selector: string): boolean {
  if (selector.trim() !== selector || selector.length === 0) {
    return false;
  }
  if (selector.length > 256) {
    return false;
  }
  if (/[{};@()]/u.test(selector)) {
    return false;
  }
  if (selector.includes("/*") || selector.includes("*/")) {
    return false;
  }
  if (/^[,>+~]|\s[,>+~]|[,>+~]\s*$|,,/u.test(selector)) {
    return false;
  }
  return /^[\s"',.0-9:=A-Z_a-z#\-[\]~>+]+$/u.test(selector);
}
