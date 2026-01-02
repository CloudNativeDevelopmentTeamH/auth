export default class Session {
  id!: string;
  userId!: number;

  refreshTokenHash!: string;
  expiresAt!: Date;

  revokedAt?: Date;

  constructor(
    id: string,
    userId: number,
    refreshTokenHash: string,
    expiresAt: Date,
    revokedAt?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.refreshTokenHash = refreshTokenHash;
    this.expiresAt = expiresAt;
    
    if (revokedAt) {
      this.revokedAt = revokedAt;
    }
  }
}