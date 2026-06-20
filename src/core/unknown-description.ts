export function describeUnknown(value: unknown): string {
  if (value === null) {
    return "null";
  }

  const valueType = typeof value;
  if (valueType === "undefined") {
    return "undefined";
  }
  if (valueType === "boolean") {
    return value ? "true" : "false";
  }
  if (valueType === "number") {
    return Number.isFinite(value) ? `number ${value}` : "non-finite number";
  }
  if (valueType === "bigint") {
    return "bigint";
  }
  if (typeof value === "string") {
    return describeString(value);
  }
  if (valueType === "symbol") {
    return "symbol";
  }
  if (valueType === "function") {
    return "function";
  }

  try {
    return Array.isArray(value) ? "array" : "object";
  } catch {
    return "object";
  }
}

function describeString(value: string): string {
  const normalized = value.length > 80 ? `${value.slice(0, 77)}...` : value;
  return `string ${JSON.stringify(normalized)}`;
}
