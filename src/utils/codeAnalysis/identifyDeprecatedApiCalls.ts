
/**
 * Utility to identify deprecated API calls that should be replaced with standardized hooks
 * This is a developer tool, not meant for production use
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

/**
 * Configuration for API call analysis
 */
interface ApiCallAnalysisConfig {
  // Root directory to analyze
  rootDir: string;
  // Directories to ignore
  ignoreDirs: string[];
  // File extensions to analyze
  fileExtensions: string[];
}

/**
 * Information about a deprecated API call
 */
interface DeprecatedApiCall {
  filePath: string;
  relativePath: string;
  lineNumber: number;
  deprecatedImport: string;
  deprecatedUsage: string;
  suggestedReplacement: string;
}

/**
 * Default configuration
 */
const defaultConfig: ApiCallAnalysisConfig = {
  rootDir: 'src',
  ignoreDirs: ['node_modules', 'dist', 'build', '.git', 'public', 'coverage'],
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx']
};

/**
 * Deprecated API patterns to search for and their suggested replacements
 */
const DEPRECATED_API_PATTERNS = [
  {
    // Old direct import patterns
    importPattern: /import\s+{.*?\buseIdeas\b.*?}\s+from\s+['"]@\/hooks\/ideas['"]/,
    usagePattern: /\buseIdeas\([^)]*\)/g,
    suggestedImport: "import { useIdeasApi } from '@/hooks/api';",
    suggestedUsage: 'useIdeasApi()'
  },
  {
    importPattern: /import\s+{.*?\buseTranscripts\b.*?}\s+from\s+['"]@\/hooks\/transcripts['"]/,
    usagePattern: /\buseTranscripts\([^)]*\)/g,
    suggestedImport: "import { useTranscriptsApi } from '@/hooks/api';",
    suggestedUsage: 'useTranscriptsApi()'
  },
  {
    importPattern: /import\s+{.*?\buseAnalytics\b.*?}\s+from\s+['"]@\/hooks\/analytics['"]/,
    usagePattern: /\buseAnalytics\([^)]*\)/g,
    suggestedImport: "import { useAnalyticsApi } from '@/hooks/api';",
    suggestedUsage: 'useAnalyticsApi()'
  },
  {
    importPattern: /import\s+{.*?\buseTargetAudiences\b.*?}\s+from\s+['"]@\/hooks\/targetAudiences['"]/,
    usagePattern: /\buseTargetAudiences\([^)]*\)/g,
    suggestedImport: "import { useTargetAudienceApi } from '@/hooks/api';",
    suggestedUsage: 'useTargetAudienceApi()'
  },
  {
    importPattern: /import\s+{.*?\busePersonalStories\b.*?}\s+from\s+['"]@\/hooks\/personalStories['"]/,
    usagePattern: /\busePersonalStories\([^)]*\)/g,
    suggestedImport: "import { usePersonalStoriesApi } from '@/hooks/api';",
    suggestedUsage: 'usePersonalStoriesApi()'
  },
  {
    importPattern: /import\s+{.*?\buseContentPillars\b.*?}\s+from\s+['"]@\/hooks\/contentPillars['"]/,
    usagePattern: /\buseContentPillars\([^)]*\)/g,
    suggestedImport: "import { useContentPillarsApi } from '@/hooks/api';",
    suggestedUsage: 'useContentPillarsApi()'
  },
  {
    importPattern: /import\s+{.*?\buseDrafts\b.*?}\s+from\s+['"]@\/hooks\/useDrafts['"]/,
    usagePattern: /\buseDrafts\([^)]*\)/g,
    suggestedImport: "import { useDraftsApi } from '@/hooks/api';",
    suggestedUsage: 'useDraftsApi()'
  },
  {
    importPattern: /import\s+{.*?\buseNewsletterExamples\b.*?}\s+from\s+['"]@\/hooks\/newsletterExamples['"]/,
    usagePattern: /\buseNewsletterExamples\([^)]*\)/g,
    suggestedImport: "import { useNewsletterExamplesApi } from '@/hooks/api';",
    suggestedUsage: 'useNewsletterExamplesApi()'
  },
  {
    importPattern: /import\s+{.*?\buseLinkedinPosts\b.*?}\s+from\s+['"]@\/hooks\/linkedinPosts['"]/,
    usagePattern: /\buseLinkedinPosts\([^)]*\)/g,
    suggestedImport: "import { useLinkedinPostsApi } from '@/hooks/api';",
    suggestedUsage: 'useLinkedinPostsApi()'
  },
  {
    importPattern: /import\s+{.*?\buseDocuments\b.*?}\s+from\s+['"]@\/hooks\/useDocuments['"]/,
    usagePattern: /\buseDocuments\([^)]*\)/g,
    suggestedImport: "import { useDocumentsApi } from '@/hooks/api';",
    suggestedUsage: 'useDocumentsApi()'
  }
];

/**
 * Get all eligible files for analysis
 */
function getFiles(dir: string, config: ApiCallAnalysisConfig): string[] {
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
 * Analyze a file for deprecated API calls
 */
function analyzeFile(filePath: string): DeprecatedApiCall[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const results: DeprecatedApiCall[] = [];
    
    // Check for deprecated import patterns
    DEPRECATED_API_PATTERNS.forEach(pattern => {
      if (pattern.importPattern.test(content)) {
        // If we have the import, look for usages
        const matches = content.match(pattern.usagePattern) || [];
        
        for (const match of matches) {
          // Find the line number for this usage
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(match)) {
              results.push({
                filePath,
                relativePath: relative(process.cwd(), filePath),
                lineNumber: i + 1,
                deprecatedImport: content.match(pattern.importPattern)?.[0] || 'Unknown import',
                deprecatedUsage: match,
                suggestedReplacement: `${pattern.suggestedImport}\n// Usage: ${pattern.suggestedUsage}`
              });
              break;
            }
          }
        }
      }
    });
    
    return results;
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
    return [];
  }
}

/**
 * Identify deprecated API calls in the codebase
 */
export function identifyDeprecatedApiCalls(
  customConfig: Partial<ApiCallAnalysisConfig> = {}
): DeprecatedApiCall[] {
  const config = { ...defaultConfig, ...customConfig };
  const files = getFiles(config.rootDir, config);
  let results: DeprecatedApiCall[] = [];
  
  for (const file of files) {
    const fileResults = analyzeFile(file);
    results = [...results, ...fileResults];
  }
  
  // Sort by file path
  return results.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

/**
 * Generate a report of deprecated API calls
 */
export function generateDeprecatedApiCallsReport(
  customConfig: Partial<ApiCallAnalysisConfig> = {}
): string {
  const results = identifyDeprecatedApiCalls(customConfig);
  
  if (results.length === 0) {
    return 'No deprecated API calls found.';
  }
  
  let report = `Found ${results.length} deprecated API calls to be updated:\n\n`;
  
  // Group by file to make the report more readable
  const fileGroups: { [key: string]: DeprecatedApiCall[] } = {};
  
  for (const result of results) {
    if (!fileGroups[result.relativePath]) {
      fileGroups[result.relativePath] = [];
    }
    fileGroups[result.relativePath].push(result);
  }
  
  for (const [filePath, calls] of Object.entries(fileGroups)) {
    report += `File: ${filePath}\n`;
    report += `Instances: ${calls.length}\n`;
    report += 'Deprecated API calls:\n';
    
    for (const call of calls) {
      report += `  Line ${call.lineNumber}: ${call.deprecatedUsage}\n`;
    }
    
    report += 'Suggested replacement:\n';
    report += `  ${calls[0].suggestedReplacement}\n\n`;
  }
  
  return report;
}

// Export a CLI tool if this file is executed directly
if (require.main === module) {
  console.log(generateDeprecatedApiCallsReport());
}
