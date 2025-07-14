#!/bin/bash

# Exit on error
set -e

# Load .env.local variables
set -o allexport
source .env.local
set +o allexport

# Forward all arguments to codex
codex "$@"
