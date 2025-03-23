
/**
 * Utility to help identify potentially unused files in the codebase
 * This is a developer tool, not meant for production use
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative, extname, basename } from 'path';
import { execSync } from 'child_process';

/**
 * Configuration for the unused file analysis
 */
interface AnalysisConfig {
  // Root directory to start scanning from
  rootDir: string;
  // Directories to ignore during scan
  ignoreDirs: string[];
  // File extensions to analyze
  fileExtensions: string[];
  // Minimum days since last modification to consider a file as potentially unused
  minDaysSinceLastModified: number;
  // Maximum number of imports for a file to be considered as potentially unused
  maxImportCount: number;
  // Names that are commonly used and thus not indicative of file usage
  commonNames: string[];
}

/**
 * Result of the unused file analysis
 */
interface AnalysisResult {
  filePath: string;
  relativePath: string;
  lastModified: Date;
  daysSinceModified: number;
  importCount: number;
  exportCount: number; // Track exported items
  sizeBytes: number; // File size
  isLikelyUnused: boolean;
  confidence: 'high' | 'medium' | 'low'; // Confidence level
  reason: string;
}

/**
 * Default configuration
 */
const defaultConfig: AnalysisConfig = {
  rootDir: 'src',
  ignoreDirs: [
    'node_modules', 
    'dist', 
    'build', 
    '.git', 
    'public', 
    'coverage',
    '__tests__',
    'tests',
    'test',
    '__mocks__'
  ],
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  minDaysSinceLastModified: 60, // 2 months
  maxImportCount: 1, // Files with 0 or 1 import might be unused
  commonNames: [
    'index', 
    'types', 
    'constants', 
    'utils', 
    'helpers', 
    'context',
    'provider'
  ]
};

/**
 * Walk through the directory structure recursively
 */
function walkDir(dir: string, config: AnalysisConfig): string[] {
  const files: string[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      
      if (stats.isDirectory()) {
        const dirName = entry.toLowerCase();
        
        if (!config.ignoreDirs.includes(dirName) && !config.ignoreDirs.some(d => fullPath.includes(d))) {
          files.push(...walkDir(fullPath, config));
        }
      } else if (stats.isFile()) {
        const fileExt = extname(entry);
        
        if (config.fileExtensions.includes(fileExt)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

/**
 * Count the number of imports for a file in the codebase
 */
function countImports(filePath: string, rootDir: string): number {
  try {
    // Use two methods to count imports to improve accuracy
    
    // 1. Git grep for direct imports by filename
    const fileBaseName = basename(filePath, extname(filePath));
    
    // Skip common names that might give false positives
    if (defaultConfig.commonNames.includes(fileBaseName.toLowerCase())) {
      // For common names, be more specific with the path
      const relativePath = relative(rootDir, filePath);
      const pathToSearch = relativePath
        .replace(/\\/g, '/') // Normalize for Windows
        .replace(/\.[^/.]+$/, ""); // Remove extension
      
      // Search for more specific path imports
      const grepCommand = `git grep -l "from ['\\\"].*${pathToSearch}['\\\"]" ${rootDir} || echo 0`;
      const pathResult = execSync(grepCommand, { encoding: 'utf-8' });
      const pathCount = pathResult === "0" ? 0 : pathResult.split('\n').filter(Boolean).length;
      
      return pathCount;
    }
    
    // For unique filenames, search by name
    const grepCommand = `git grep -l "import.*${fileBaseName}" ${rootDir} || echo 0`;
    const result = execSync(grepCommand, { encoding: 'utf-8' });
    return result === "0" ? 0 : result.split('\n').filter(Boolean).length;
  } catch (error) {
    console.error(`Error counting imports for ${filePath}:`, error);
    return 0;
  }
}

/**
 * Count exports defined in a file to detect utility files that might be imported as a whole
 */
function countExports(filePath: string): number {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Count export statements
    const exportMatches = content.match(/export\s+(const|function|class|interface|type|let|var|enum|default)/g) || [];
    
    // Count named exports
    const namedExportMatches = content.match(/export\s+{[^}]*}/g) || [];
    let namedExportCount = 0;
    
    for (const match of namedExportMatches) {
      // Count commas to estimate number of exports (plus 1)
      const commaCount = (match.match(/,/g) || []).length;
      namedExportCount += commaCount + 1;
    }
    
    return exportMatches.length + namedExportCount;
  } catch (error) {
    console.error(`Error counting exports for ${filePath}:`, error);
    return 0;
  }
}

/**
 * Analyze files to identify potentially unused ones
 */
export function identifyUnusedFiles(
  customConfig: Partial<AnalysisConfig> = {}
): AnalysisResult[] {
  // Merge custom config with defaults
  const config = { ...defaultConfig, ...customConfig };
  const now = new Date();
  const results: AnalysisResult[] = [];
  
  // Get all files matching the criteria
  const files = walkDir(config.rootDir, config);
  
  for (const file of files) {
    try {
      const stats = statSync(file);
      const lastModified = new Date(stats.mtime);
      const daysSinceModified = Math.floor(
        (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Count imports only if the file hasn't been modified recently
      let importCount = 0;
      let exportCount = 0;
      let reason = '';
      let confidence: 'high' | 'medium' | 'low' = 'low';
      
      if (daysSinceModified >= config.minDaysSinceLastModified) {
        importCount = countImports(file, config.rootDir);
        exportCount = countExports(file);
        
        if (importCount === 0) {
          reason = `File has no imports and hasn't been modified in ${daysSinceModified} days`;
          confidence = 'high';
        } else if (importCount <= config.maxImportCount) {
          reason = `File has only ${importCount} imports and hasn't been modified in ${daysSinceModified} days`;
          confidence = 'medium';
        }
      } else if (daysSinceModified < config.minDaysSinceLastModified) {
        // For recently modified files, still check import count
        importCount = countImports(file, config.rootDir);
        exportCount = countExports(file);
        
        if (importCount === 0) {
          reason = `File has no imports (possibly new or unused)`;
          confidence = exportCount === 0 ? 'medium' : 'low';
        }
      }
      
      const isLikelyUnused = 
        (importCount === 0) || 
        (daysSinceModified >= config.minDaysSinceLastModified && importCount <= config.maxImportCount && exportCount === 0);
      
      if (isLikelyUnused) {
        results.push({
          filePath: file,
          relativePath: relative(config.rootDir, file),
          lastModified,
          daysSinceModified,
          importCount,
          exportCount,
          sizeBytes: stats.size,
          isLikelyUnused,
          confidence,
          reason
        });
      }
    } catch (error) {
      console.error(`Error analyzing ${file}:`, error);
    }
  }
  
  // Sort by likelihood of being unused (fewer imports, fewer exports, and older files first)
  return results.sort((a, b) => {
    // Primary sort by import count
    if (a.importCount !== b.importCount) {
      return a.importCount - b.importCount;
    }
    
    // Secondary sort by export count
    if (a.exportCount !== b.exportCount) {
      return a.exportCount - b.exportCount;
    }
    
    // Tertiary sort by days since modified
    return b.daysSinceModified - a.daysSinceModified;
  });
}

/**
 * Generate a report of potentially unused files
 */
export function generateUnusedFilesReport(
  customConfig: Partial<AnalysisConfig> = {}
): string {
  const results = identifyUnusedFiles(customConfig);
  
  if (results.length === 0) {
    return 'No potentially unused files found.';
  }
  
  let report = `Found ${results.length} potentially unused files:\n\n`;
  
  // Group results by confidence level
  const highConfidence = results.filter(r => r.confidence === 'high');
  const mediumConfidence = results.filter(r => r.confidence === 'medium');
  const lowConfidence = results.filter(r => r.confidence === 'low');
  
  if (highConfidence.length > 0) {
    report += `HIGH CONFIDENCE (${highConfidence.length} files):\n`;
    report += `These files are very likely unused and safe to remove after verification.\n\n`;
    
    for (const result of highConfidence) {
      report += `File: ${result.relativePath}\n`;
      report += `Last Modified: ${result.lastModified.toISOString().split('T')[0]} (${result.daysSinceModified} days ago)\n`;
      report += `Import Count: ${result.importCount}\n`;
      report += `Export Count: ${result.exportCount}\n`;
      report += `Size: ${(result.sizeBytes / 1024).toFixed(2)} KB\n`;
      report += `Reason: ${result.reason}\n\n`;
    }
  }
  
  if (mediumConfidence.length > 0) {
    report += `MEDIUM CONFIDENCE (${mediumConfidence.length} files):\n`;
    report += `These files might be unused but need careful verification before removal.\n\n`;
    
    for (const result of mediumConfidence) {
      report += `File: ${result.relativePath}\n`;
      report += `Last Modified: ${result.lastModified.toISOString().split('T')[0]} (${result.daysSinceModified} days ago)\n`;
      report += `Import Count: ${result.importCount}\n`;
      report += `Export Count: ${result.exportCount}\n`;
      report += `Size: ${(result.sizeBytes / 1024).toFixed(2)} KB\n`;
      report += `Reason: ${result.reason}\n\n`;
    }
  }
  
  if (lowConfidence.length > 0) {
    report += `LOW CONFIDENCE (${lowConfidence.length} files):\n`;
    report += `These files need thorough investigation before considering removal.\n\n`;
    
    for (const result of lowConfidence) {
      report += `File: ${result.relativePath}\n`;
      report += `Last Modified: ${result.lastModified.toISOString().split('T')[0]} (${result.daysSinceModified} days ago)\n`;
      report += `Import Count: ${result.importCount}\n`;
      report += `Export Count: ${result.exportCount}\n`;
      report += `Size: ${(result.sizeBytes / 1024).toFixed(2)} KB\n`;
      report += `Reason: ${result.reason}\n\n`;
    }
  }
  
  // Add a summary and recommendations
  report += `RECOMMENDATIONS:\n`;
  report += `1. Start by examining high confidence files, which are most likely unused.\n`;
  report += `2. For each file, verify it's not used by:\n`;
  report += `   - Searching for imports using the full path\n`;
  report += `   - Looking for dynamic imports or require() statements\n`;
  report += `   - Checking for references to exported functions or types\n`;
  report += `3. After verification, move the file to a temporary directory before deleting\n`;
  report += `4. Run tests to ensure nothing breaks\n`;
  report += `5. Consider using tools like 'depcheck' for additional verification\n`;
  
  return report;
}

/**
 * Find and analyze potential duplicate components or utilities
 * This helps identify redundant code that might be consolidated
 */
export function findPotentialDuplicates(
  customConfig: Partial<AnalysisConfig> = {}
): Record<string, string[]> {
  const config = { ...defaultConfig, ...customConfig };
  const potentialDuplicates: Record<string, string[]> = {};
  
  // Get all files
  const files = walkDir(config.rootDir, config);
  
  // Group files by basename
  for (const file of files) {
    const baseName = basename(file, extname(file)).toLowerCase();
    // Skip index files and other common patterns that aren't typically duplicates
    if (!config.commonNames.includes(baseName)) {
      if (!potentialDuplicates[baseName]) {
        potentialDuplicates[baseName] = [];
      }
      potentialDuplicates[baseName].push(file);
    }
  }
  
  // Filter to only include entries with multiple files
  return Object.fromEntries(
    Object.entries(potentialDuplicates)
      .filter(([_, files]) => files.length > 1)
  );
}

/**
 * Generate a report of potentially duplicate files
 */
export function generateDuplicatesReport(
  customConfig: Partial<AnalysisConfig> = {}
): string {
  const duplicates = findPotentialDuplicates(customConfig);
  const rootDir = customConfig.rootDir || defaultConfig.rootDir;
  
  if (Object.keys(duplicates).length === 0) {
    return 'No potential duplicates found.';
  }
  
  let report = `Found ${Object.keys(duplicates).length} potential duplicate components/utilities:\n\n`;
  
  for (const [name, files] of Object.entries(duplicates)) {
    report += `Component/Utility: ${name}\n`;
    report += `Found in ${files.length} locations:\n`;
    
    for (const file of files) {
      report += `- ${relative(rootDir, file)}\n`;
    }
    
    report += '\n';
  }
  
  return report;
}

// Export a CLI tool if this file is executed directly
if (require.main === module) {
  console.log(generateUnusedFilesReport());
}
