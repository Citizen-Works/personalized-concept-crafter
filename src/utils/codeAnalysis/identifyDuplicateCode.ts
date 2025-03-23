
/**
 * Utility to help identify duplicate or highly similar code patterns
 * This is a developer tool, not meant for production use
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';

/**
 * Configuration for duplicate code analysis
 */
interface DuplicateAnalysisConfig {
  // Root directory to analyze
  rootDir: string;
  // Directories to ignore
  ignoreDirs: string[];
  // File extensions to analyze
  fileExtensions: string[];
  // Minimum line count for a code block to be considered
  minLineCount: number;
  // Minimum similarity percentage to consider as duplicate
  minSimilarityPercentage: number;
}

/**
 * Information about a potential code duplication
 */
interface DuplicationInfo {
  fileA: string;
  fileB: string;
  similarityPercentage: number;
  potentialDuplicateBlocks: number;
  totalLinesAnalyzed: number;
}

/**
 * Default configuration
 */
const defaultConfig: DuplicateAnalysisConfig = {
  rootDir: 'src',
  ignoreDirs: ['node_modules', 'dist', 'build', '.git', 'public', 'coverage'],
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  minLineCount: 10,
  minSimilarityPercentage: 70
};

/**
 * Get all eligible files for analysis
 */
function getFiles(dir: string, config: DuplicateAnalysisConfig): string[] {
  const files: string[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      
      if (stats.isDirectory()) {
        const dirName = entry.toLowerCase();
        
        if (!config.ignoreDirs.includes(dirName)) {
          files.push(...getFiles(fullPath, config));
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
 * Calculate similarity percentage between two strings
 * using Levenshtein distance
 */
function calculateSimilarity(strA: string, strB: string): number {
  const lengthA = strA.length;
  const lengthB = strB.length;
  
  // Base cases
  if (lengthA === 0) return lengthB;
  if (lengthB === 0) return lengthA;
  
  // Create distance matrix
  const matrix: number[][] = [];
  
  // Initialize first row and column
  for (let i = 0; i <= lengthA; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= lengthB; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= lengthA; i++) {
    for (let j = 1; j <= lengthB; j++) {
      const cost = strA[i - 1] === strB[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  // Calculate similarity percentage based on edit distance
  const editDistance = matrix[lengthA][lengthB];
  const maxLength = Math.max(lengthA, lengthB);
  const similarityPercentage = ((maxLength - editDistance) / maxLength) * 100;
  
  return similarityPercentage;
}

/**
 * Extract code blocks from a file
 */
function extractCodeBlocks(filePath: string, minLineCount: number): string[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const blocks: string[] = [];
    
    // Simple approach: extract blocks of code separated by blank lines or comments
    let currentBlock: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if line is empty or a comment
      const isEmptyOrComment = 
        trimmedLine === '' || 
        trimmedLine.startsWith('//') || 
        trimmedLine.startsWith('/*') ||
        trimmedLine.startsWith('*');
      
      if (isEmptyOrComment && currentBlock.length >= minLineCount) {
        blocks.push(currentBlock.join('\n'));
        currentBlock = [];
      } else if (!isEmptyOrComment) {
        currentBlock.push(line);
      }
    }
    
    // Add the last block if it meets the minimum line count
    if (currentBlock.length >= minLineCount) {
      blocks.push(currentBlock.join('\n'));
    }
    
    return blocks;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

/**
 * Compare two files to identify potential duplications
 */
function compareFiles(
  fileA: string, 
  fileB: string, 
  config: DuplicateAnalysisConfig
): DuplicationInfo | null {
  try {
    const blocksA = extractCodeBlocks(fileA, config.minLineCount);
    const blocksB = extractCodeBlocks(fileB, config.minLineCount);
    
    if (blocksA.length === 0 || blocksB.length === 0) {
      return null;
    }
    
    let duplicateBlockCount = 0;
    let totalComparedBlocks = 0;
    let sumSimilarity = 0;
    
    // Compare each block from file A with each block from file B
    for (const blockA of blocksA) {
      for (const blockB of blocksB) {
        totalComparedBlocks++;
        const similarity = calculateSimilarity(blockA, blockB);
        sumSimilarity += similarity;
        
        if (similarity >= config.minSimilarityPercentage) {
          duplicateBlockCount++;
        }
      }
    }
    
    // Calculate overall similarity percentage
    const avgSimilarity = sumSimilarity / totalComparedBlocks;
    
    // Only return result if there are duplicate blocks
    if (duplicateBlockCount > 0) {
      return {
        fileA,
        fileB,
        similarityPercentage: avgSimilarity,
        potentialDuplicateBlocks: duplicateBlockCount,
        totalLinesAnalyzed: blocksA.length + blocksB.length
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error comparing files ${fileA} and ${fileB}:`, error);
    return null;
  }
}

/**
 * Identify duplicate code in the codebase
 */
export function identifyDuplicateCode(
  customConfig: Partial<DuplicateAnalysisConfig> = {}
): DuplicationInfo[] {
  const config = { ...defaultConfig, ...customConfig };
  const files = getFiles(config.rootDir, config);
  const results: DuplicationInfo[] = [];
  
  // Compare each file with every other file
  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const comparison = compareFiles(files[i], files[j], config);
      
      if (comparison) {
        results.push(comparison);
      }
    }
  }
  
  // Sort by similarity percentage (highest first)
  return results.sort((a, b) => b.similarityPercentage - a.similarityPercentage);
}

/**
 * Generate a report of potential code duplications
 */
export function generateDuplicateCodeReport(
  customConfig: Partial<DuplicateAnalysisConfig> = {}
): string {
  const results = identifyDuplicateCode(customConfig);
  
  if (results.length === 0) {
    return 'No significant code duplication found.';
  }
  
  let report = `Found ${results.length} potential code duplications:\n\n`;
  
  for (const result of results) {
    report += `Files:\n`;
    report += `  - ${relative(process.cwd(), result.fileA)}\n`;
    report += `  - ${relative(process.cwd(), result.fileB)}\n`;
    report += `Similarity: ${result.similarityPercentage.toFixed(2)}%\n`;
    report += `Potential Duplicate Blocks: ${result.potentialDuplicateBlocks}\n`;
    report += `Total Blocks Analyzed: ${result.totalLinesAnalyzed}\n\n`;
  }
  
  return report;
}

// Export a CLI tool if this file is executed directly
if (require.main === module) {
  console.log(generateDuplicateCodeReport());
}
