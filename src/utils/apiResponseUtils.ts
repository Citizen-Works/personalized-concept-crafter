
/**
 * Utilities for consistent API response processing
 */

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}` 
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}` 
  : S;

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}` 
  ? T extends Capitalize<T> 
    ? `_${Lowercase<T>}${CamelToSnakeCase<U>}` 
    : `${T}${CamelToSnakeCase<U>}` 
  : S;

type CamelCase<T> = {
  [K in keyof T as K extends string ? SnakeToCamelCase<K> : K]: T[K] extends Record<string, any> 
    ? CamelCase<T[K]> 
    : T[K];
};

type SnakeCase<T> = {
  [K in keyof T as K extends string ? CamelToSnakeCase<K> : K]: T[K] extends Record<string, any> 
    ? SnakeCase<T[K]> 
    : T[K];
};

/**
 * Converts a snake_case key to camelCase
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) => 
    group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
};

/**
 * Converts a camelCase key to snake_case
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Transforms an object's keys from snake_case to camelCase
 */
export const transformToCamelCase = <T extends Record<string, any>>(obj: T): CamelCase<T> => {
  if (obj === null || typeof obj !== 'object') {
    return obj as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformToCamelCase) as any;
  }

  const camelCaseObj = {} as Record<string, any>;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamel(key);
      camelCaseObj[camelKey] = transformToCamelCase(obj[key]);
    }
  }
  
  return camelCaseObj as CamelCase<T>;
};

/**
 * Transforms an object's keys from camelCase to snake_case
 */
export const transformToSnakeCase = <T extends Record<string, any>>(obj: T): SnakeCase<T> => {
  if (obj === null || typeof obj !== 'object') {
    return obj as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformToSnakeCase) as any;
  }

  const snakeCaseObj = {} as Record<string, any>;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = camelToSnake(key);
      snakeCaseObj[snakeKey] = transformToSnakeCase(obj[key]);
    }
  }
  
  return snakeCaseObj as SnakeCase<T>;
};

/**
 * Transforms database response to frontend model
 */
export const processApiResponse = <T extends Record<string, any>>(response: T): CamelCase<T> => {
  return transformToCamelCase(response);
};

/**
 * Transforms frontend model to database format for requests
 */
export const prepareApiRequest = <T extends Record<string, any>>(request: T): SnakeCase<T> => {
  return transformToSnakeCase(request);
};
