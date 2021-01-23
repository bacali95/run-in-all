import { blue, red } from 'chalk';

export class Logger {
  log(data: string, context?: string) {
    this.printMessage(data, 'log', context);
  }

  error(data: string, context?: string) {
    this.printMessage(data, 'error', context);
  }

  private printMessage(
    data: string,
    level: keyof typeof console,
    context?: string,
  ) {
    const contextMessage = context ? blue(`[${context}] `) : '';
    for (let line of this.splitAndCleanLog(data)) {
      level == 'error' && (line = red(line));
      console[level](`${contextMessage}${line}`);
    }
  }

  private splitAndCleanLog(data: string): string[] {
    return data
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => !!line);
  }
}

const logger = new Logger();

export default logger;
