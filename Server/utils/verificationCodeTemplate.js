export function generateVerificationEmail(code) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4a90e2;">Collab Space</h2>
      <p>Dear user,</p>
      <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
      <h1 style="color: #222; background: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 6px;">
        ${code}
      </h1>
      <p style="margin-top: 20px;">This code will expire in <strong>10 minutes</strong>.</p>
      <p>If you didn’t request this code, please ignore this message.</p>
      <br/>
      <p style="font-size: 0.9rem; color: #777;">— The Smart Application Portal Team</p>
    </div>
  `
}
