
/**
 * Utility to help identify potentially unused files in the codebase
 * This is a developer tool, not meant for production use
 */

import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
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
  isLikelyUnused: boolean;
  reason: string;
}

/**
 * Default configuration
 */
const defaultConfig: AnalysisConfig = {
  rootDir: 'src',
  ignoreDirs: ['node_modules', 'dist', 'build', '.git', 'public', 'coverage'],
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  minDaysSinceLastModified: 60, // 2 months
  maxImportCount: 1 // Files with 0 or 1 import might be unused
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
        
        if (!config.ignoreDirs.includes(dirName)) {
          files.push(...walkDir(fullPath, config));
        }
      } else if (stats.isFile()) {
        const fileExt = entry.substring(entry.lastIndexOf('.'));
        
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
    // Use git grep to find imports
    // This is much faster than reading all files and parsing them
    const relativePath = relative(rootDir, filePath);
    const fileName = relativePath.substring(relativePath.lastIndexOf('/') + 1);
    const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    
    // Search for import statements with the file name
    const grepCommand = `git grep -l "import.*${fileNameWithoutExt}" ${rootDir} | wc -l`;
    const result = execSync(grepCommand, { encoding: 'utf-8' });
    
    return parseInt(result.trim(), 10);
  } catch (error) {
    console.error(`Error counting imports for ${filePath}:`, error);
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
      let reason = '';
      
      if (daysSinceModified >= config.minDaysSinceLastModified) {
        importCount = countImports(file, config.rootDir);
        
        if (importCount <= config.maxImportCount) {
          reason = `File has only ${importCount} imports and hasn't been modified in ${daysSinceModified} days`;
        }
      } else if (daysSinceModified < config.minDaysSinceLastModified) {
        // For recently modified files, still check import count
        importCount = countImports(file, config.rootDir);
        
        if (importCount === 0) {
          reason = `File has no imports (possibly new or unused)`;
        }
      }
      
      const isLikelyUnused = 
        (daysSinceModified >= config.minDaysSinceLastModified && 
         importCount <= config.maxImportCount) ||
        importCount === 0;
      
      if (isLikelyUnused) {
        results.push({
          filePath: file,
          relativePath: relative(config.rootDir, file),
          lastModified,
          daysSinceModified,
          importCount,
          isLikelyUnused,
          reason
        });
      }
    } catch (error) {
      console.error(`Error analyzing ${file}:`, error);
    }
  }
  
  // Sort by likelihood of being unused (fewer imports and older files first)
  return results.sort((a, b) => {
    // Primary sort by import count
    if (a.importCount !== b.importCount) {
      return a.importCount - b.importCount;
    }
    // Secondary sort by days since modified
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
  
  for (const result of results) {
    report += `File: ${result.relativePath}\n`;
    report += `Last Modified: ${result.lastModified.toISOString().split('T')[0]} (${result.daysSinceModified} days ago)\n`;
    report += `Import Count: ${result.importCount}\n`;
    report += `Reason: ${result.reason}\n\n`;
  }
  
  return report;
}

// Export a CLI tool if this file is executed directly
if (require.main === module) {
  console.log(generateUnusedFilesReport());
}
