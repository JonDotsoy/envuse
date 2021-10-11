module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["envuse-definition.d.ts", ".__environment_demo__"],
  testMatch: ["**/*.spec.ts"],
};
