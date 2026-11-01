# Billing (Stripe Invoicing)

How we get paid: 50% deposit to start, 50% at launch, on Stripe-hosted invoice pages
(card payments). Monthly plans (Site Subscription $79, Care Plan $99) charge the saved
card automatically after the first paid invoice, and Stripe retries failed cards.

Products in Stripe are tagged with `metadata.key`: `site_subscription`, `care_plan`,
`launch_site`, `launch_package`, `business_site`, `custom_project`.

```
export STRIPE_SECRET_KEY=sk_test_...   # never commit this
node tools/billing/invoice.mjs deposit   --email client@x.com --name "Client" --project "Token Launch Site" --total 299
node tools/billing/invoice.mjs final     --email client@x.com --name "Client" --project "Token Launch Site" --total 299
node tools/billing/invoice.mjs subscribe --email client@x.com --name "Client" --plan site_subscription
```

Payments are reconciled in the Stripe Dashboard (no accounting sync needed yet).
