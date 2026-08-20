import { buildPublicArtifact, OUTPUT_ROOT } from './public-artifact.mjs';

const files = buildPublicArtifact();
console.log(`Built ${files.length} allowlisted files in ${OUTPUT_ROOT}`);
