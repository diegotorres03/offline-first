#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OfflineTestStack } from '../lib/offline-test-stack';


const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAUL_REGION || 'us-east-2',
}


const app = new cdk.App();
new OfflineTestStack(app, 'OfflineTestStack', { env });

