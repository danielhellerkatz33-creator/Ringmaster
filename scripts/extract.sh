#!/bin/bash
cd /vercel/share/v0-project
echo "=== Listing ZIP contents ==="
unzip -l "Ringmaster V0.1.zip" | head -100
echo "=== Extracting ZIP ==="
unzip -o "Ringmaster V0.1.zip" -d /tmp/ringmaster-extracted
echo "=== Extracted contents ==="
find /tmp/ringmaster-extracted -type f | head -100
