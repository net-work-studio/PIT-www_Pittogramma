declare module "bun:test" {
  type MaybePromise<T> = T | Promise<T>;

  interface Matchers {
    rejects: Matchers;
    toBe(expected: unknown): void;
    toBeNull(): void;
    toMatchObject(expected: Record<string, unknown>): void;
  }

  interface TestFunction {
    each<T>(
      cases: readonly T[]
    ): (name: string, fn: (value: T) => MaybePromise<void>) => void;
    (name: string, fn: () => MaybePromise<void>): void;
  }

  export const afterEach: (fn: () => MaybePromise<void>) => void;
  export const describe: (name: string, fn: () => void) => void;
  export const expect: (value: unknown) => Matchers;
  export const test: TestFunction;
}
