// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function importDefault<T = any>(module: string): Promise<T | null> {
  return new Promise((resolve) => {
    import(module)
      .then((mod) => {
        resolve(mod.default);
      })
      .catch(() => {
        resolve(null);
      });
  });
}
