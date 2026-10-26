#!/bin/sh
set -eu

aws s3 sync --delete --metadata-directive REPLACE --cache-control max-age=86400,public web s3://lsdsoftware-websites/ttstool.com

distribution_id=E1JLNPLOT5RF52
invalidation_id=$(aws cloudfront create-invalidation \
  --distribution-id "$distribution_id" \
  --paths '/*' \
  --query 'Invalidation.Id' \
  --output text)

echo "Waiting for CloudFront invalidation $invalidation_id to complete..."
aws cloudfront wait invalidation-completed \
  --distribution-id "$distribution_id" \
  --id "$invalidation_id"
echo "CloudFront invalidation complete."
