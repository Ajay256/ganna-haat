import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { checkLoginRateLimit, recordFailedLogin, resetLoginRateLimit } from "../../src/lib/rateLimit";

describe("2. Rate Limiting Test Suite", () => {
  const testPhone = "9998887770";

  beforeEach(() => {
    resetLoginRateLimit(testPhone);
  });

  it("allows initial login attempts", () => {
    const status = checkLoginRateLimit(testPhone);
    assert.equal(status.allowed, true);
  });

  it("tracks remaining attempts before lockout", () => {
    const attempt1 = recordFailedLogin(testPhone);
    assert.equal(attempt1.isBlocked, false);
    assert.equal(attempt1.remainingAttempts, 4);

    const attempt2 = recordFailedLogin(testPhone);
    assert.equal(attempt2.isBlocked, false);
    assert.equal(attempt2.remainingAttempts, 3);
  });

  it("triggers mandatory 15-minute block upon 5th consecutive failure", () => {
    recordFailedLogin(testPhone); // 1
    recordFailedLogin(testPhone); // 2
    recordFailedLogin(testPhone); // 3
    recordFailedLogin(testPhone); // 4
    const attempt5 = recordFailedLogin(testPhone); // 5

    assert.equal(attempt5.isBlocked, true);
    assert.equal(attempt5.remainingAttempts, 0);

    const check = checkLoginRateLimit(testPhone);
    assert.equal(check.allowed, false);
    assert.ok(check.retryAfterSeconds && check.retryAfterSeconds > 800); // ~15 minutes
  });

  it("resets failure counter upon successful login", () => {
    recordFailedLogin(testPhone); // 1
    recordFailedLogin(testPhone); // 2
    assert.equal(recordFailedLogin(testPhone).remainingAttempts, 2);

    // User enters correct PIN
    resetLoginRateLimit(testPhone);

    const check = checkLoginRateLimit(testPhone);
    assert.equal(check.allowed, true);

    // Fresh failure starts from 4 remaining attempts
    const newAttempt = recordFailedLogin(testPhone);
    assert.equal(newAttempt.remainingAttempts, 4);
  });
});
