// Production-safe logging utility
class Logger {
    constructor() {
        this.isProduction = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1';
    }

    log(message, ...args) {
        if (!this.isProduction) {
            console.log(`[LOG] ${message}`, ...args);
        }
    }

    error(message, ...args) {
        console.error(`[ERROR] ${message}`, ...args);
    }

    warn(message, ...args) {
        if (!this.isProduction) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    info(message, ...args) {
        if (!this.isProduction) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    debug(message, ...args) {
        if (!this.isProduction) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
}

// Create global logger instance
window.logger = new Logger();