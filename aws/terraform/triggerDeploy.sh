#!/bin/bash

# trigger a ng build for the current occupation dashboard web UI
cd ../ui/room-status
ng build

# trigger terraform aws rollout
cd ../../terraform/
terraform apply