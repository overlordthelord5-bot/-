import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTransactionSplit,
  canTransitionDisputeState,
  verifyLedgerBalance,
} from './businessLogic';

test('calculateTransactionSplit correctly computes platform fee, affiliate commission, and vendor net', () => {
  const result = calculateTransactionSplit(1000, 10, 8, true);
  assert.equal(result.orderTotal, 1000);
  assert.equal(result.platformFee, 100);
  assert.equal(result.affiliateCommission, 80);
  assert.equal(result.vendorPayout, 820);
  assert.equal(result.platformFee + result.affiliateCommission + result.vendorPayout, result.orderTotal);
});

test('calculateTransactionSplit without affiliate allocates remainder to vendor', () => {
  const result = calculateTransactionSplit(500, 15, 0, false);
  assert.equal(result.platformFee, 75);
  assert.equal(result.affiliateCommission, 0);
  assert.equal(result.vendorPayout, 425);
  assert.equal(result.platformFee + result.vendorPayout, 500);
});

test('canTransitionDisputeState validates permissible lifecycle transitions', () => {
  assert.equal(canTransitionDisputeState('opened', 'under_review'), true);
  assert.equal(canTransitionDisputeState('under_review', 'resolved'), true);
  assert.equal(canTransitionDisputeState('opened', 'resolved'), false); // Cannot jump straight to resolved without review
  assert.equal(canTransitionDisputeState('resolved', 'opened'), false); // Terminal state
});

test('verifyLedgerBalance validates double-entry integrity', () => {
  const entries = [
    { debitAccount: 'buyer_gateway', creditAccount: 'escrow_hold', amount: 350 },
    { debitAccount: 'escrow_hold', creditAccount: 'vendor_wallet', amount: 315 },
    { debitAccount: 'escrow_hold', creditAccount: 'platform_revenue', amount: 35 },
  ];
  const audit = verifyLedgerBalance(entries);
  assert.equal(audit.isBalanced, true);
  assert.equal(audit.totalVolume, 700);
});
