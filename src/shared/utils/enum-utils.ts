/**
 * Option structure for dropdowns, filters, etc.
 */
export type EnumOption<T = string> = {
  label: string;
  value: T;
};

/**
 * Converts any enum to an array of options for UI components
 *
 * @param enumObject - The enum object to convert
 * @returns Array of {label, value} options
 *
 * @example
 * ```tsx
 * const statusOptions = enumToOptions(SedationistStatus);
 * // Returns: [
 * //   { label: "Active", value: "Active" },
 * //   { label: "Inactive", value: "Inactive" },
 * //   { label: "On Leave", value: "On Leave" },
 * //   { label: "In Training", value: "In Training" }
 * // ]
 * ```
 */
export function enumToOptions<T extends Record<string, string>>(
  enumObject: T
): EnumOption<T[keyof T]>[] {
  return Object.values(enumObject).map((value) => ({
    label: value,
    value: value as T[keyof T],
  }));
}

/**
 * Converts enum to options with custom label transformation
 *
 * @param enumObject - The enum object to convert
 * @param labelTransform - Function to transform the enum value into a custom label
 * @returns Array of {label, value} options with custom labels
 *
 * @example
 * ```tsx
 * const statusOptionsWithCount = enumToOptionsWithTransform(
 *   SedationistStatus,
 *   (status) => `${status} (${getStatusCount(status)})`
 * );
 * // Returns: [
 * //   { label: "Active (15)", value: "Active" },
 * //   { label: "Inactive (3)", value: "Inactive" }
 * // ]
 * ```
 */
export function enumToOptionsWithTransform<T extends Record<string, string>>(
  enumObject: T,
  labelTransform: (value: T[keyof T]) => string
): EnumOption<T[keyof T]>[] {
  return Object.values(enumObject).map((value) => ({
    label: labelTransform(value as T[keyof T]),
    value: value as T[keyof T],
  }));
}

/**
 * Gets enum values as a typed array
 *
 * @param enumObject - The enum object
 * @returns Array of enum values with proper typing
 *
 * @example
 * ```tsx
 * const allStatuses = getEnumValues(SedationistStatus);
 * // Returns: ["Active", "Inactive", "On Leave", "In Training"] with proper typing
 * ```
 */
export function getEnumValues<T extends Record<string, string>>(
  enumObject: T
): T[keyof T][] {
  return Object.values(enumObject) as T[keyof T][];
}

/**
 * Checks if a value exists in an enum
 *
 * @param enumObject - The enum object to check against
 * @param value - The value to check
 * @returns Boolean indicating if value exists in enum
 *
 * @example
 * ```tsx
 * const isValidStatus = isEnumValue(SedationistStatus, "Active"); // true
 * const isInvalidStatus = isEnumValue(SedationistStatus, "Unknown"); // false
 * ```
 */
export function isEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string
): value is T[keyof T] {
  return Object.values(enumObject).includes(value as T[keyof T]);
}

/**
 * Gets enum key by value (reverse lookup)
 *
 * @param enumObject - The enum object
 * @param value - The enum value to find key for
 * @returns The enum key or undefined if not found
 *
 * @example
 * ```tsx
 * const key = getEnumKeyByValue(SedationistStatus, "Active"); // "ACTIVE"
 * ```
 */
export function getEnumKeyByValue<T extends Record<string, string>>(
  enumObject: T,
  value: T[keyof T]
): keyof T | undefined {
  const entry = Object.entries(enumObject).find(
    ([_, enumValue]) => enumValue === value
  );
  return entry ? (entry[0] as keyof T) : undefined;
}
