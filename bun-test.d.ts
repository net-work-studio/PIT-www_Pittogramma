declare module "bun:test" {
  type MaybePromise<T> = T | Promise<T>;

  interface MockFunction {
    mock: {
      calls: unknown[][];
    };
    (...args: unknown[]): unknown;
  }

  interface Matchers {
    rejects: Matchers;
    toBe: (expected: unknown) => void;
    toBeInstanceOf: (expected: unknown) => void;
    toBeNull: () => void;
    toContain: (expected: unknown) => void;
    toEqual: (expected: unknown) => void;
    toHaveBeenCalledTimes: (expected: number) => void;
    toHaveLength: (expected: number) => void;
    toMatchObject: (expected: Record<string, unknown>) => void;
    toThrow: (expected?: string | RegExp) => void;
  }

  interface TestFunction {
    each<T extends readonly unknown[]>(
      cases: readonly T[]
    ): (name: string, fn: (...value: T) => MaybePromise<void>) => void;
    each<T>(
      cases: readonly T[]
    ): (name: string, fn: (value: T) => MaybePromise<void>) => void;
    (name: string, fn: () => MaybePromise<void>): void;
  }

  export function mock<T extends (...args: never[]) => unknown>(
    fn: T
  ): T & MockFunction;

  export const afterEach: (fn: () => MaybePromise<void>) => void;
  export const describe: (name: string, fn: () => void) => void;
  export const expect: (value: unknown) => Matchers;
  export const test: TestFunction;
}
