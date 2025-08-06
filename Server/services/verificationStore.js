// services/verificationStore.js

const verificationCodes = new Map()

export const storeVerificationCode = (email, code) => {
  verificationCodes.set(email, code)

  // Auto-expire after 10 minutes
  setTimeout(() => {
    verificationCodes.delete(email)
  }, 5 * 60 * 1000)
}

export const getVerificationCode = (email) => verificationCodes.get(email)

export const deleteVerificationCode = (email) => verificationCodes.delete(email)
