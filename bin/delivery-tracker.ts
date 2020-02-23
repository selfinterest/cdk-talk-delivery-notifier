#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DeliveryTrackerStack } from '../lib/delivery-tracker-stack';

const app = new cdk.App();
new DeliveryTrackerStack(app, 'DeliveryTrackerStack');
