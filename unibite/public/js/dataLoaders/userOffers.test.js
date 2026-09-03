import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeClaimsIntoOffers } from './userOffers.js';
import { shouldShowRatingForClaim } from '../../components/UserOfferCard/UserOfferCard.js';

test('mergeClaimsIntoOffers attaches claim arrays to each offer by id', () => {
  const offers = [
    { id: 2, title: 'Pizza' },
    { id: 7, title: 'Salad' }
  ];

  const claimsByOffer = {
    2: [{ request_id: 10, status: 'PENDING', claimed_portions: 1 }],
    7: []
  };

  const merged = mergeClaimsIntoOffers(offers, claimsByOffer);

  assert.deepEqual(merged[0].claims, claimsByOffer[2]);
  assert.deepEqual(merged[1].claims, []);
});

test('shouldShowRatingForClaim only appears for the claimant on accepted claims', () => {
  assert.equal(shouldShowRatingForClaim({ status: 'ACCEPTED', con_id: 5 }, 5), true);
  assert.equal(shouldShowRatingForClaim({ status: 'ACCEPTED', con_id: 9 }, 5), false);
  assert.equal(shouldShowRatingForClaim({ status: 'PENDING', con_id: 5 }, 5), false);
});
