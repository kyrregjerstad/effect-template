import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
    },
    include: ["{apps,packages}/**/*.test.ts", "src/**/*.test.ts"],
  },
  fmt: {
    ignorePatterns: [".pi/**"],
  },
  lint: {
    ignorePatterns: [".pi/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
