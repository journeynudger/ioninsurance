#!/bin/sh
# Battle-tests the contact form against a production build. Run with `npm run test:form` (builds first).
# Starts a mock Resend/webhook receiver on :4999 and six servers on :3141-3146, each wired differently.
set -e
LOG=$(mktemp); OUT=$(mktemp -d)
node scripts/form-tests/mock.mjs "$LOG" & PIDS=$!
s() { port=$1; shift; env "$@" npx next start -p "$port" >/dev/null 2>&1 & PIDS="$PIDS $!"; }
OK="RESEND_API_KEY=test RESEND_API_URL=http://localhost:4999/resend FORMS_EMAIL_FROM=x@example.com FORMS_EMAIL_TO=a@example.com"
s 3141
s 3142 RESEND_API_KEY=test RESEND_API_URL=http://localhost:4999/resend "FORMS_EMAIL_FROM=ION <forms@example.com>" "FORMS_EMAIL_TO=a@example.com, b@example.com" FORMS_WEBHOOK_URL=http://localhost:4999/hook FORMS_WEBHOOK_SECRET=s3cret
s 3143 RESEND_API_KEY=test RESEND_API_URL=http://localhost:4999/fail FORMS_EMAIL_FROM=x@example.com FORMS_EMAIL_TO=a@example.com FORMS_WEBHOOK_URL=http://localhost:4999/fail
s 3144 $OK FORMS_WEBHOOK_URL=http://localhost:4999/fail
s 3145 $OK FORMS_WEBHOOK_URL=http://localhost:4999/slow
s 3146 FORMS_DRY_RUN=1
trap 'kill $PIDS 2>/dev/null' EXIT
sleep 5
node scripts/form-tests/api-test.mjs "$LOG"
node scripts/form-tests/e2e.mjs "$LOG" "$OUT"
