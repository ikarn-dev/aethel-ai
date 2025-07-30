/**
 * Enhanced Response Parser
 * 
 * Improved parser specifically designed to extract text after "Final answer generated:"
 * with better pattern matching, multiline support, and robust extraction.
 */

export interface EnhancedParseResult {
  success: boolean;
  response?: string;
  error?: string;
  source: 'exact_match' | 'fallback' | 'none';
  debugInfo?: {
    totalLogs: number;
    checkedLogs: number;
    foundPattern: boolean;
    rawMatch?: string;
    matchedPattern?: string;
  };
}

export class EnhancedResponseParser {
  /**
   * Extract response from logs focusing on "Final answer generated:" pattern
   * @param logs Array of log entries from the backend
   * @returns EnhancedParseResult with the extracted response
   */
  public static extractResponse(logs: any[]): EnhancedParseResult {

    const result: EnhancedParseResult = {
      success: false,
      source: 'none',
      debugInfo: {
        totalLogs: logs ? logs.length : 0,
        checkedLogs: 0,
        foundPattern: false
      }
    };

    // Handle invalid input
    if (!Array.isArray(logs) || logs.length === 0) {
      result.error = 'No logs provided or logs array is empty';
      return result;
    }

    // Join all logs into a single string for better multiline matching
    const fullLogText = logs
      .filter(log => typeof log === 'string')
      .join('\n');



    // Try to extract using the enhanced patterns
    const extractedResponse = this.extractFinalAnswer(fullLogText);

    if (extractedResponse) {
      result.success = true;
      result.response = extractedResponse.content;
      result.source = 'exact_match';
      result.debugInfo!.foundPattern = true;
      result.debugInfo!.matchedPattern = extractedResponse.pattern;
      result.debugInfo!.rawMatch = extractedResponse.rawMatch;


      return result;
    }

    // Fallback: check individual log entries
    for (let i = 0; i < logs.length; i++) {
      const logEntry = logs[i];
      result.debugInfo!.checkedLogs++;

      if (typeof logEntry === 'string') {
        const response = this.extractFromSingleLog(logEntry);
        if (response) {
          result.success = true;
          result.response = response.content;
          result.source = 'exact_match';
          result.debugInfo!.foundPattern = true;
          result.debugInfo!.rawMatch = logEntry;
          result.debugInfo!.matchedPattern = response.pattern;


          return result;
        }
      }
    }

    // No response found
    result.error = 'No "Final answer generated:" pattern found in logs';
    return result;
  }

  /**
   * Enhanced extraction focusing specifically on "Final answer generated:" pattern
   * @param logText Full log text to search
   * @returns Extracted content with metadata or null
   */
  private static extractFinalAnswer(logText: string): { content: string; pattern: string; rawMatch: string } | null {
    // Enhanced patterns specifically for "Final answer generated:" - ordered by preference
    const patterns = [
      {
        name: 'clean_final_answer',
        regex: /Final answer generated:\s*([\s\S]*?)(?=\n(?:Creating plan|Executing plan|All steps completed|💡 Generating|Steps completed:|Execution summary:|Task completed|Agent finished)|$)/gi
      },
      {
        name: 'final_answer_to_end',
        regex: /Final answer generated:\s*([\s\S]*)$/gi
      },
      {
        name: 'final_answer_basic',
        regex: /Final answer generated:\s*(.+)/gi
      }
    ];

    for (const pattern of patterns) {
      // Reset regex lastIndex for global patterns
      pattern.regex.lastIndex = 0;

      const matches = [...logText.matchAll(pattern.regex)];

      // Get the last match (most recent final answer)
      const match = matches[matches.length - 1];

      if (match && match[1]) {
        let content = match[1].trim();

        // Clean up the extracted content
        content = this.cleanExtractedContent(content);

        if (content && content.length > 0) {
          return {
            content,
            pattern: pattern.name,
            rawMatch: match[0]
          };
        }
      }
    }

    return null;
  }

  /**
   * Extract from a single log entry
   * @param logEntry Single log string
   * @returns Extracted content with metadata or null
   */
  private static extractFromSingleLog(logEntry: string): { content: string; pattern: string } | null {
    const patterns = [
      {
        name: 'single_log_final_answer',
        regex: /Final answer generated:\s*(.+?)$/gi
      },
      {
        name: 'single_log_multiline',
        regex: /Final answer generated:\s*(.+)/gi
      }
    ];

    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0;
      const match = logEntry.match(pattern.regex);

      if (match && match[1]) {
        let content = match[1].trim();
        content = this.cleanExtractedContent(content);

        if (content && content.length > 0) {
          return {
            content,
            pattern: pattern.name
          };
        }
      }
    }

    return null;
  }

  /**
   * Clean and normalize extracted content
   * @param content Raw extracted content
   * @returns Cleaned content
   */
  private static cleanExtractedContent(content: string): string {
    if (!content) return '';



    // Remove execution logs and plan details that appear before the actual answer
    let cleaned = content
      // Remove execution plan logs
      .replace(/Creating plan for input:.*?\n/gi, '')
      .replace(/Executing plan with \d+ steps.*?\n/gi, '')
      .replace(/All steps completed:.*?\n/gi, '')
      .replace(/Steps completed:.*?\n/gi, '')
      .replace(/Execution summary:.*?\n/gi, '')
      .replace(/✓ Step \d+:.*?\n/gi, '')
      .replace(/✗ Step \d+:.*?\n/gi, '')
      .replace(/💡 Generating final answer.*?\n/gi, '');

    // Handle JavaScript-style string concatenation (the main issue)
    // This fixes the exact pattern from logs: ```java\n' +'import java.util.*;\n' +'\n' +'public class BFS {\n' +...
    if (cleaned.includes("' +") || cleaned.includes("\\n' +") || cleaned.includes("+'") || cleaned.includes("```java\\n' +")) {

      // Step 1: Handle the specific markdown code block pattern
      if (cleaned.includes("```java\\n' +")) {
        cleaned = cleaned.replace(/```java\\n'\s*\+\s*'/g, '```java\n');
      }

      // Step 2: Remove all JavaScript string concatenation patterns
      // This is the core fix for the formatting issue
      cleaned = cleaned
        // Remove concatenation operators between quotes: ' +' or ' + '
        .replace(/'\s*\+\s*'/g, '')
        .replace(/'\s*\+\s*\n\s*'/g, '')
        .replace(/'\s*\+\s*\n\s*\+\s*'/g, '')

        // Handle escaped newlines with concatenation: \n' + or ' +\n
        .replace(/\\n'\s*\+/g, '\n')
        .replace(/'\s*\+\s*\\n/g, '\n')
        .replace(/\\n'\s*\+\s*'/g, '\n')
        .replace(/'\s*\+\s*'\\n/g, '\n')

        // Remove standalone + operators
        .replace(/\s*\+\s*/g, '')

        // Remove quotes at the beginning and end of lines
        .replace(/^'|'$/gm, '')

        // Remove quotes at the beginning and end of the entire content
        .replace(/^["']|["']$/g, '')

        // Clean up quote artifacts around newlines
        .replace(/'\s*\n\s*'/g, '\n')
        .replace(/'\s*\n/g, '\n')
        .replace(/\n\s*'/g, '\n')

        // Final cleanup of any remaining quotes wrapping content
        .replace(/^'([\s\S]*)'$/g, '$1')
        .replace(/^"([\s\S]*)"$/g, '$1');
    }

    // Step 3: Handle escaped characters
    cleaned = cleaned
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\r/g, '\r')
      .replace(/\\\\/g, '\\');

    // Step 4: Clean up whitespace and formatting
    cleaned = cleaned
      // Remove surrounding quotes if they wrap the entire content
      .replace(/^["']([\s\S]*)["']$/, '$1')
      // Clean up whitespace
      .replace(/^\s+|\s+$/g, '')
      // Reduce multiple newlines to double
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove trailing artifacts
      .replace(/\\$/, '')
      .replace(/\r/g, '');

    // Step 5: Preserve intentional trailing newlines
    if (content.endsWith('\\n') || content.endsWith('\n')) {
      cleaned = cleaned.replace(/\n+$/, '') + '\n';
    }

    return cleaned;
  }

  /**
   * Display the extracted response in a formatted way
   * @param result Parse result
   * @returns Formatted output string
   */
  public static displayResponse(result: EnhancedParseResult): string {
    if (!result.success) {
      return `❌ Failed to extract response: ${result.error || 'Unknown error'}`;
    }

    const output = [
      '✅ Successfully extracted response:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      result.response || '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `📊 Source: ${result.source}`,
      result.debugInfo?.matchedPattern ? `🔍 Pattern: ${result.debugInfo.matchedPattern}` : '',
      `📈 Processed ${result.debugInfo?.checkedLogs || 0}/${result.debugInfo?.totalLogs || 0} logs`
    ].filter(line => line !== '').join('\n');

    return output;
  }

  /**
   * Test with your actual log data
   * @param logs The logs array to test
   * @returns Formatted test result
   */
  public static testWithLogs(logs: string[]): string {
    const result = this.extractResponse(logs);
    return this.displayResponse(result);
  }

  /**
   * Simple utility to just get the response text
   * @param logs Array of log entries
   * @returns Just the response text or null
   */
  public static getResponseText(logs: any[]): string | null {
    const result = this.extractResponse(logs);
    return result.success ? result.response || null : null;
  }

  /**
   * Utility to extract all final answers from logs (in case there are multiple)
   * @param logs Array of log entries
   * @returns Array of all extracted responses
   */
  public static extractAllResponses(logs: any[]): string[] {
    if (!Array.isArray(logs) || logs.length === 0) {
      return [];
    }

    const fullLogText = logs
      .filter(log => typeof log === 'string')
      .join('\n');

    const responses: string[] = [];
    // Use the same working regex pattern as in extractFinalAnswer
    const regex = /Final answer generated:\s*([\s\S]*)$/gi;

    let match;
    while ((match = regex.exec(fullLogText)) !== null) {
      const content = this.cleanExtractedContent(match[1]);
      if (content && content.length > 0) {
        responses.push(content);
      }
    }

    return responses;
  }
}