const logger = require('../utils/logger');

class AuditService {
  logAction(action, userId, details = {}) {
    logger.info('Audit Log', {
      action,
      userId,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }

  logQuotaViolation(userId, attemptedVolume, remainingQuota) {
    this.logAction('QUOTA_VIOLATION', userId, {
      attemptedVolume,
      remainingQuota,
      severity: 'warning',
    });
  }

  logTransaction(transactionId, customerId, cashierId, amount) {
    this.logAction('TRANSACTION_CREATED', cashierId, {
      transactionId,
      customerId,
      amount,
      type: 'billing',
    });
  }

  logLogin(userId, role) {
    this.logAction('USER_LOGIN', userId, {
      role,
      type: 'authentication',
    });
  }

  logFailedAuth(identifier, reason) {
    logger.warn('Failed Authentication', {
      identifier,
      reason,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = new AuditService();