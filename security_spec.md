# Security Specification - EduCast

## Data Invariants
1. A video task must belong to an institution.
2. Users can only see videos belonging to their institution (scoped by `institutionId`).
3. Users can only create videos for their own institution.
4. User profiles (private data) are restricted to the owner.

## The Dirty Dozen (Test Matrix)
- [ ] Create video for a different institution ID.
- [ ] Read videos of another institution.
- [ ] Update a video status from COMPLETED to QUEUED (Terminal state lock).
- [ ] Inject 1MB string into video title.
- [ ] Delete a video owned by another user.
- [ ] Spoof user role to SUPER_ADMIN.
- [ ] Create a video with a negative progress value.
- [ ] Update backgroundId to a non-existent string.
- [ ] Read institution quota if not an admin.
- [ ] Access another user's profile metadata.
- [ ] Bypass email verification (if enforced).
- [ ] Batch write with invalid relation.
