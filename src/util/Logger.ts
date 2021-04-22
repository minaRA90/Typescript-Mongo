import * as winston from 'winston';
import { FormatWrap, TransformableInfo } from 'logform';

const envLogLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : 'info';

/** Supported LogLevels */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export const defaultLogLevelConfig = {
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

export const defaultColorConfig = {
    error: 'red',
    warn: 'yellow',
    info: 'bold blue',
    debug: 'green',
    trace: 'blue',
};

/**
 * Class that can be easily extended and configured to provide logging functionalities based on Winston logger
 */
export class Logger {
    public logger: winston.Logger;
    private filePath: string;
    private moduleName: string;

    /**
     * Create a new Logger instance per file
     *
     * @param filePath    ALWAYS pass in __filename
     * @param moduleName  ALWAYS pass in module / service name calling the logger, It should be same as name in its package.json file
     */
    constructor(filePath: string, moduleName: string) {
        this.filePath = filePath;
        this.moduleName = moduleName;
        this.logger = this.createLogger();
    }

    /**
     * Create logger with formatters:
     *
     * winston.format.metadata() format groups the log object args[] under @property metadata,
     * should be called before changing info object with other formatters and before calling filterFn
     *
     * winston.format.timestamp() add @property timestamp to the log info object
     *
     * winston.format(), executes log message formating logic provided by formatLogMessage(info)
     * Which can be extendable by derived classes to override the logic
     *
     */
    private createLogger(): winston.Logger {
        const colorizer = winston.format.colorize();

        const logger = winston.createLogger({
            levels: defaultLogLevelConfig,
            level: envLogLevel,
            format: winston.format.combine(
                winston.format.metadata(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format((info: TransformableInfo, opts: any) => {
                    info.message = this.formatLogMessage(info);
                    // Colorize only in development
                    info.message = colorizer.colorize(info.level, info.message);
                    return info;
                })(),
                winston.format.printf((info: TransformableInfo) => info.message),
            ),
            transports: [new winston.transports.Console()],
        });

        return logger;
    }

    public log(logLevel: LogLevel, args: any[]) {
        // call winston log() passing logLevel, message and meta arguments
        this.logger.log(logLevel, args[0], args.slice(1));
    }

    /**
     * This method formats log message it combines log arguments, logging metadata stored in http-express-context
     * and also handle error objects formating.
     *
     * @param info represents a single log message data object (TransformableInfo), the object itself is mutable.
     * Every info must have at least the @property level, @property message
     * timestamp is added under @property timestamp by winston.format.timestamp()
     * Additional metadata are under @property metadata, its an array of objects, where each element is one of log message arguments
     * The loggerInstanceContext is the first element in @property metadata
     *
     */
    public formatLogMessage(info: TransformableInfo): string {
        let logMessage = `${info.timestamp}:[${info.level}][path: ${this.moduleName}:${this.filePath}]`;
        // Add log message if exists
        logMessage += info.message ? `[${info.message}]` : '';

        // format rest of log arguments
        for (let i = 0; i < Object.keys(info.metadata).length; i++) {
            const obj = info.metadata[i];
            if (obj instanceof Error) {
                logMessage += `[\n${obj.stack || obj.toString()}\n]`;
            } else {
                try {
                    logMessage += `[${JSON.stringify(obj, this.replacer())}]`;
                } catch (e) {
                    this.logger.log('error', 'Could not serialize log argument', e);
                }
            }
        }
        return logMessage;
    }

    //////////////////////////////////// Wrapper functions for different log levels //////////////////////////

    public info(...args: any[]) {
        this.log('info', args);
    }

    public error(...args: any[]) {
        this.log('error', args);
    }

    public warn(...args: any[]) {
        this.log('warn', args);
    }

    public debug(...args: any[]) {
        this.log('debug', args);
    }

    public trace(...args: any[]) {
        this.log('trace', args);
    }

    /**
     * Replaces circular references, with would otherwise cause JSON.stringify to crash
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
     *
     * It also replaces secretive information with [hidden]
     */
    private replacer() {
        const seen = new WeakSet();
        return (key: string, value: any) => {
            // Handle circular objects
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        };
    }
}
