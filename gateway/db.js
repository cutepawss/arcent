/**
 * SQLite Database Module for Arcent Gateway
 * Provides persistent storage for transaction history and provider stats
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const dbPath = path.join(__dirname, 'arcent.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    provider TEXT NOT NULL,
    service_type TEXT,
    amount TEXT NOT NULL,
    tx_hash TEXT,
    status TEXT NOT NULL,
    latency_ms INTEGER,
    agent_id TEXT,
    query TEXT
  );

  CREATE TABLE IF NOT EXISTS provider_stats (
    provider TEXT PRIMARY KEY,
    success INTEGER DEFAULT 0,
    failure INTEGER DEFAULT 0,
    total_latency_ms INTEGER DEFAULT 0,
    last_updated TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
  CREATE INDEX IF NOT EXISTS idx_transactions_provider ON transactions(provider);
  CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
`);

console.log('[DB] SQLite database initialized at:', dbPath);

// Prepared statements for performance
const insertTransaction = db.prepare(`
  INSERT INTO transactions (timestamp, provider, service_type, amount, tx_hash, status, latency_ms, agent_id, query)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const upsertProviderStats = db.prepare(`
  INSERT INTO provider_stats (provider, success, failure, total_latency_ms, last_updated)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(provider) DO UPDATE SET
    success = success + excluded.success,
    failure = failure + excluded.failure,
    total_latency_ms = total_latency_ms + excluded.total_latency_ms,
    last_updated = excluded.last_updated
`);

const getAllProviderStats = db.prepare(`SELECT * FROM provider_stats`);
const getTransactionHistoryStmt = db.prepare(`SELECT * FROM transactions ORDER BY timestamp DESC LIMIT ?`);
const getTransactionsByProviderStmt = db.prepare(`SELECT * FROM transactions WHERE provider = ? ORDER BY timestamp DESC LIMIT ?`);

/**
 * Save a transaction to the database
 */
export function saveTransaction(tx) {
    try {
        insertTransaction.run(
            tx.timestamp || new Date().toISOString(),
            tx.provider || 'unknown',
            tx.serviceType || null,
            tx.amount || '0',
            tx.txHash || null,
            tx.status || 'unknown',
            tx.latencyMs || null,
            tx.agentId || null,
            tx.query || null
        );
        console.log('[DB] Transaction saved:', tx.txHash?.slice(0, 10) || 'no-hash');
        return true;
    } catch (error) {
        console.error('[DB] Failed to save transaction:', error.message);
        return false;
    }
}

/**
 * Update provider stats in database (incremental)
 */
export function persistProviderStats(provider, isSuccess, latencyMs) {
    try {
        upsertProviderStats.run(
            provider,
            isSuccess ? 1 : 0,
            isSuccess ? 0 : 1,
            latencyMs || 0,
            new Date().toISOString()
        );
        return true;
    } catch (error) {
        console.error('[DB] Failed to update provider stats:', error.message);
        return false;
    }
}

/**
 * Load all provider stats from database (for server startup)
 */
export function loadProviderStats() {
    try {
        const rows = getAllProviderStats.all();
        const stats = {};
        for (const row of rows) {
            stats[row.provider] = {
                success: row.success,
                failure: row.failure,
                totalLatency: row.total_latency_ms
            };
        }
        return stats;
    } catch (error) {
        console.error('[DB] Failed to load provider stats:', error.message);
        return {};
    }
}

/**
 * Get transaction history
 */
export function getTransactionHistory(limit = 50) {
    try {
        return getTransactionHistoryStmt.all(limit);
    } catch (error) {
        console.error('[DB] Failed to get transaction history:', error.message);
        return [];
    }
}

/**
 * Get transactions by provider
 */
export function getTransactionsByProvider(provider, limit = 50) {
    try {
        return getTransactionsByProviderStmt.all(provider, limit);
    } catch (error) {
        console.error('[DB] Failed to get transactions by provider:', error.message);
        return [];
    }
}

/**
 * Get database stats
 */
export function getDatabaseStats() {
    try {
        const transactionCount = db.prepare('SELECT COUNT(*) as count FROM transactions').get();
        const providerCount = db.prepare('SELECT COUNT(*) as count FROM provider_stats').get();
        return {
            transactions: transactionCount.count,
            providers: providerCount.count,
            dbPath: dbPath
        };
    } catch (error) {
        console.error('[DB] Failed to get database stats:', error.message);
        return { transactions: 0, providers: 0, dbPath: dbPath };
    }
}

export default {
    saveTransaction,
    persistProviderStats,
    loadProviderStats,
    getTransactionHistory,
    getTransactionsByProvider,
    getDatabaseStats
};
