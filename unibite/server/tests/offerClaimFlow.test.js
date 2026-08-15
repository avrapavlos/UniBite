import test from 'node:test';
import assert from 'node:assert/strict';

import {
  canClaimOffer,
  canAcceptClaim,
  calculateRemainingQuantity,
  buildClaimSummary
} from '../controllers/offerClaimLogic.js';

test('a user can claim when the offer still has available portions', () => {
  const offer = { id: 7, creator_id: 4, portions: 5 };
  const existingClaims = [{ con_id: 2, status: 'PENDING', claimed_portions: 2 }];

  assert.equal(canClaimOffer(offer, 9, existingClaims, 2), true);
});

test('a user cannot claim more than the remaining available portions', () => {
  const offer = { id: 7, creator_id: 4, portions: 3 };
  const existingClaims = [
    { con_id: 2, status: 'ACCEPTED', claimed_portions: 2 },
    { con_id: 9, status: 'PENDING', claimed_portions: 1 }
  ];

  assert.equal(canClaimOffer(offer, 8, existingClaims, 2), false);
});

test('only the offer creator can accept an active claim', () => {
  const offer = { id: 7, creator_id: 4, portions: 5 };
  const claim = { con_id: 8, status: 'PENDING', claimed_portions: 1 };

  assert.equal(canAcceptClaim(offer, claim, 4), true);
  assert.equal(canAcceptClaim(offer, claim, 8), false);
});

test('remaining quantity is reduced by accepted claims', () => {
  const offer = { id: 7, portions: 5 };
  const claims = [
    { status: 'ACCEPTED', claimed_portions: 2 },
    { status: 'PENDING', claimed_portions: 1 }
  ];

  assert.equal(calculateRemainingQuantity(offer, claims), 3);
});

test('claim summary includes active counts and available portions', () => {
  const summary = buildClaimSummary({ portions: 7 }, [
    { status: 'PENDING', claimed_portions: 2 },
    { status: 'ACCEPTED', claimed_portions: 3 },
    { status: 'REJECTED', claimed_portions: 1 }
  ]);

  assert.deepEqual(summary, {
    availablePortions: 2,
    pendingClaims: 1,
    acceptedClaims: 1,
    totalClaimed: 5
  });
});
