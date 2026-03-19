const sendEmail = require('./sendEmail');

// ── AUTH NOTIFICATIONS ──────────────────────────────────────────

// Welcome email after registration
const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: '🎉 Welcome to BrandConnect!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #FF6B35;">Welcome to BrandConnect, ${user.name}! 🚀</h2>
        <p>We're excited to have you on board.</p>
        ${user.role === 'vendor' 
          ? `<p>Start by creating your business profile so customers across Nigeria can find you.</p>
             <a href="${process.env.FRONTEND_URL}/create-profile" 
                style="background:#FF6B35; color:white; padding:12px 24px; text-decoration:none; border-radius:6px;">
                Create Your Profile
             </a>`
          : `<p>Start discovering amazing businesses near you.</p>
             <a href="${process.env.FRONTEND_URL}/explore" 
                style="background:#FF6B35; color:white; padding:12px 24px; text-decoration:none; border-radius:6px;">
                Explore Businesses
             </a>`
        }
        <p style="margin-top:24px; color:#888; font-size:12px;">— The BrandConnect Team</p>
      </div>
    `,
  });
};

// ── VENDOR NOTIFICATIONS ─────────────────────────────────────────

// Notify vendor when their profile is created
const sendProfileCreatedEmail = async (user, business) => {
  await sendEmail({
    to: user.email,
    subject: '✅ Your BrandConnect Profile is Live!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #FF6B35;">Your profile is live, ${user.name}!</h2>
        <p><strong>${business.businessName}</strong> is now visible to customers on BrandConnect.</p>
        <table style="width:100%; border-collapse:collapse; margin:16px 0;">
          <tr><td style="padding:8px; color:#888;">Category</td><td style="padding:8px;">${business.category}</td></tr>
          <tr><td style="padding:8px; color:#888;">Location</td><td style="padding:8px;">${business.location}</td></tr>
          <tr><td style="padding:8px; color:#888;">Plan</td><td style="padding:8px; text-transform:capitalize;">${business.subscriptionPlan}</td></tr>
        </table>
        <p>Want more visibility? Upgrade to a Pro or Premium plan.</p>
        <a href="${process.env.FRONTEND_URL}/subscription/plans" 
           style="background:#FF6B35; color:white; padding:12px 24px; text-decoration:none; border-radius:6px;">
           View Plans
        </a>
        <p style="margin-top:24px; color:#888; font-size:12px;">— The BrandConnect Team</p>
      </div>
    `,
  });
};

// Notify vendor when their profile is suspended by admin
const sendSuspensionEmail = async (user, business) => {
  await sendEmail({
    to: user.email,
    subject: '⚠️ Your BrandConnect Listing Has Been Suspended',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #e74c3c;">Listing Suspended</h2>
        <p>Hi ${user.name}, your listing <strong>${business.businessName}</strong> has been temporarily suspended.</p>
        <p>This may be due to a violation of our platform guidelines.</p>
        <p>If you believe this is a mistake, please contact our support team.</p>
        <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@brandconnect.ng'}" 
           style="background:#e74c3c; color:white; padding:12px 24px; text-decoration:none; border-radius:6px;">
           Contact Support
        </a>
        <p style="margin-top:24px; color:#888; font-size:12px;">— The BrandConnect Team</p>
      </div>
    `,
  });
};

// ── SUBSCRIPTION NOTIFICATIONS ────────────────────────────────────

// Notify vendor when payment is successful & subscription is active
const sendSubscriptionActivatedEmail = async (user, business, subscription) => {
  const planColors = { basic: '#3498db', pro: '#FF6B35', premium: '#f39c12' };
  const color = planColors[subscription.plan] || '#FF6B35';

  await sendEmail({
    to: user.email,
    subject: `🎊 ${subscription.plan.toUpperCase()} Plan Activated — BrandConnect`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: ${color};">Your ${subscription.plan} plan is now active!</h2>
        <p>Hi ${user.name}, payment was successful for <strong>${business.businessName}</strong>.</p>
        <table style="width:100%; border-collapse:collapse; margin:16px 0; border:1px solid #eee;">
          <tr style="background:#f9f9f9;">
            <td style="padding:10px; color:#888;">Plan</td>
            <td style="padding:10px; font-weight:bold; text-transform:capitalize; color:${color};">${subscription.plan}</td>
          </tr>
          <tr>
            <td style="padding:10px; color:#888;">Amount Paid</td>
            <td style="padding:10px;">₦${subscription.amount.toLocaleString()}</td>
          </tr>
          <tr style="background:#f9f9f9;">
            <td style="padding:10px; color:#888;">Start Date</td>
            <td style="padding:10px;">${new Date(subscription.startDate).toDateString()}</td>
          </tr>
          <tr>
            <td style="padding:10px; color:#888;">Expiry Date</td>
            <td style="padding:10px;">${new Date(subscription.expiryDate).toDateString()}</td>
          </tr>
        </table>
        <a href="${process.env.FRONTEND_URL}/vendor/dashboard" 
           style="background:${color}; color:white; padding:12px 24px; text-decoration:none; border-radius:6px;">
           Go to Dashboard
        </a>
        <p style="margin-top:24px; color:#888; font-size:12px;">— The BrandConnect Team</p>
      </div>
    `,
  });
};

// Remind vendor 3 days before subscription expires
const sendSubscriptionExpiryReminderEmail = async (user, business, subscription) => {
  const daysLeft = Math.ceil((new Date(subscription.expiryDate) - Date.now()) / (1000 * 60 * 60 * 24));

  await sendEmail({
    to: user.email,
    subject: `⏰ Your BrandConnect subscription expires in ${daysLeft} day(s)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #f39c12;">Your subscription is expiring soon!</h2>
        <p>Hi ${user.name}, your <strong>${subscription.plan}</strong> plan for 
           <strong>${business.businessName}</strong> expires on 
           <strong>${new Date(subscription.expiryDate).toDateString()}</strong> 
           (${daysLeft} day(s) remaining).
        </p>
        <p>Renew now to keep your listing active and visible to customers.</p>
        <a href="${process.env.FRONTEND_URL}/subscription/plans" 
           style="background:#f39c12; color:white; padding:12px 24px; text-decoration:none; border-radius:6px;">
           Renew Subscription
        </a>
        <p style="margin-top:24px; color:#888; font-size:12px;">— The BrandConnect Team</p>
      </div>
    `,
  });
};

// Notify vendor when subscription has expired
const sendSubscriptionExpiredEmail = async (user, business) => {
  await sendEmail({
    to: user.email,
    subject: '❌ Your BrandConnect Subscription Has Expired',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #e74c3c;">Subscription Expired</h2>
        <p>Hi ${user.name}, your subscription for <strong>${business.businessName}</strong> has expired.</p>
        <p>Your listing is now on the <strong>free plan</strong> and may have reduced visibility.</p>
        <p>Reactivate your plan to regain full features and featured placement.</p>
        <a href="${process.env.FRONTEND_URL}/subscription/plans" 
           style="background:#e74c3c; color:white; padding:12px 24px; text-decoration:none; border-radius:6px;">
           Reactivate Now
        </a>
        <p style="margin-top:24px; color:#888; font-size:12px;">— The BrandConnect Team</p>
      </div>
    `,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendProfileCreatedEmail,
  sendSuspensionEmail,
  sendSubscriptionActivatedEmail,
  sendSubscriptionExpiryReminderEmail,
  sendSubscriptionExpiredEmail,
};