/**
 * Error Tracking & Monitoring Utility
 * 
 * Supports multiple error tracking services:
 * - Sentry (recommended for production)
 * - Custom error logging to database
 * - Console logging for development
 * 
 * Usage:
 * const errorTracker = require('./errorTracker');
 * errorTracker.captureException(error, context);
 */

class ErrorTracker {
  constructor() {
    this.service = process.env.ERROR_TRACKING_SERVICE || 'console'; // 'sentry', 'console', 'custom'
    this.environment = process.env.NODE_ENV || 'development';
    this.initialized = false;
    this.initializeService();
  }

  initializeService() {
    if (this.service === 'sentry' && process.env.SENTRY_DSN) {
      try {
        const Sentry = require('@sentry/node');
        Sentry.init({
          dsn: process.env.SENTRY_DSN,
          environment: this.environment,
          tracesSampleRate: this.environment === 'production' ? 0.1 : 1.0,
          debug: this.environment === 'development',
        });
        this.sentry = Sentry;
        this.initialized = true;
        console.log('✅ Sentry error tracking initialized');
      } catch (err) {
        console.warn('⚠️  Sentry not configured properly:', err.message);
        this.service = 'console';
      }
    }
  }

  captureException(error, context = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      message: error?.message || String(error),
      stack: error?.stack,
      context,
      environment: this.environment,
    };

    if (this.service === 'sentry' && this.sentry) {
      this.sentry.captureException(error, {
        contexts: { custom: context },
      });
    } else if (this.service === 'custom') {
      // Implement custom error logging here (e.g., save to database)
      this.logToDatabase(errorData);
    }

    // Always log to console in development
    if (this.environment === 'development') {
      console.error('🚨 Error captured:', errorData);
    }

    return errorData;
  }

  captureMessage(message, level = 'info', context = {}) {
    const messageData = {
      timestamp: new Date().toISOString(),
      message,
      level,
      context,
      environment: this.environment,
    };

    if (this.service === 'sentry' && this.sentry) {
      this.sentry.captureMessage(message, level);
    } else if (this.service === 'custom') {
      this.logToDatabase(messageData);
    }

    if (this.environment === 'development') {
      console.log(`📌 [${level.toUpperCase()}]`, message, context);
    }

    return messageData;
  }

  logToDatabase(errorData) {
    // Placeholder for custom database logging
    // Example: Insert into MongoDB collection
    // Usage: await ErrorLog.create(errorData);
  }

  setUser(userId, email, username) {
    if (this.service === 'sentry' && this.sentry) {
      this.sentry.setUser({
        id: userId,
        email,
        username,
      });
    }
  }

  setBreadcrumb(message, category = 'default', level = 'info', data = {}) {
    if (this.service === 'sentry' && this.sentry) {
      this.sentry.addBreadcrumb({
        message,
        category,
        level,
        data,
        timestamp: Date.now() / 1000,
      });
    }
  }
}

module.exports = new ErrorTracker();
