/**
 * Pure business logic utilities for WASEET platform:
 * - Escrow calculations
 * - Double-entry ledger audit
 * - Dispute & verification state machines
 */

export interface SplitCalculation {
  orderTotal: number;
  platformFee: number;
  affiliateCommission: number;
  vendorPayout: number;
}

export function calculateTransactionSplit(
  total: number,
  platformFeePercentage: number = 10,
  affiliateRate: number = 8,
  hasAffiliate: boolean = true
): SplitCalculation {
  const platformFee = Math.round((total * platformFeePercentage) / 100);
  const affiliateCommission = hasAffiliate ? Math.round((total * affiliateRate) / 100) : 0;
  const vendorPayout = total - platformFee - affiliateCommission;

  return {
    orderTotal: total,
    platformFee,
    affiliateCommission,
    vendorPayout,
  };
}

export type DisputeState = 'opened' | 'under_review' | 'resolved' | 'dismissed';

export function canTransitionDisputeState(current: DisputeState, next: DisputeState): boolean {
  const transitions: Record<DisputeState, DisputeState[]> = {
    opened: ['under_review', 'dismissed'],
    under_review: ['resolved', 'dismissed'],
    resolved: [],
    dismissed: [],
  };

  return transitions[current]?.includes(next) ?? false;
}

export interface LedgerEntryCheck {
  debitAccount: string;
  creditAccount: string;
  amount: number;
}

export function verifyLedgerBalance(entries: LedgerEntryCheck[]): { isBalanced: boolean; totalVolume: number } {
  const totalVolume = entries.reduce((acc, curr) => acc + curr.amount, 0);
  // In a balanced double-entry set, every entry pairs debit & credit for equal sum
  const isBalanced = entries.every(e => e.amount > 0 && e.debitAccount && e.creditAccount && e.debitAccount !== e.creditAccount);
  return {
    isBalanced,
    totalVolume,
  };
}
