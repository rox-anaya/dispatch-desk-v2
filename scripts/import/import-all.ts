import { execSync } from "child_process";

const steps = [
  "scripts/import/import-aircraft.ts",
  "scripts/import/import-airports.ts",
  "scripts/import/import-runways.ts",
  "scripts/import/import-navaids.ts",
];

for (const step of steps) {
  console.log(`\n=== Running ${step} ===`);
  execSync(`npx tsx ${step}`, { stdio: "inherit" });
}

console.log("\nAll Module 4 imports complete!");
