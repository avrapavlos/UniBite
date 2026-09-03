export function calculateRemainingQuantity(offer, claims = []) {
  const totalAvailable = Number(offer?.portions ?? 0);
  const acceptedClaimed = claims
    .filter((claim) => String(claim?.status || '').toUpperCase() === 'ACCEPTED')
    .reduce((sum, claim) => sum + Number(claim?.claimed_portions ?? 0), 0);

  return Math.max(totalAvailable - acceptedClaimed, 0);
}

export function canClaimOffer(offer, userId, existingClaims = [], requestedPortions = 1) {
  if (!offer || !userId || Number(requestedPortions) <= 0) {
    return false;
  }

  const totalAvailable = Number(offer?.portions ?? 0);
  const requested = Number(requestedPortions);
  const currentlyAccepted = existingClaims
    .filter((claim) => String(claim?.status || '').toUpperCase() === 'ACCEPTED')
    .reduce((sum, claim) => sum + Number(claim?.claimed_portions ?? 0), 0);

  return totalAvailable - currentlyAccepted >= requested;
}

export function canAcceptClaim(offer, claim, currentUserId) {
  if (!offer || !claim || !currentUserId) {
    return false;
  }

  return Number(offer.creator_id) === Number(currentUserId)
    && String(claim?.status || '').toUpperCase() === 'PENDING';
}

export function buildClaimSummary(offer, claims = []) {
  const activeClaims = claims.filter((claim) =>
    ['PENDING', 'ACCEPTED'].includes(String(claim?.status || '').toUpperCase())
  );

  const totalClaimed = activeClaims.reduce(
    (sum, claim) => sum + Number(claim?.claimed_portions ?? 0),
    0
  );

  const acceptedClaims = claims.filter((claim) => claim?.status === 'ACCEPTED');
  const pendingClaims = claims.filter((claim) => claim?.status === 'PENDING');

  return {
    availablePortions: Math.max(Number(offer?.portions ?? 0) - totalClaimed, 0),
    pendingClaims: pendingClaims.length,
    acceptedClaims: acceptedClaims.length,
    totalClaimed
  };
}
