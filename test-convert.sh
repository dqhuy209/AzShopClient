#!/bin/bash

# Test script to convert just one file safely

echo "Testing conversion on a single file..."

# Test with a simple TypeScript file
test_file="src/types/blogItem.ts"

if [ ! -f "$test_file" ]; then
    echo "Test file $test_file not found"
    exit 1
fi

echo "Original content:"
echo "=================="
cat "$test_file"
echo ""
echo "=================="

# Create converted version
new_file="${test_file%.*}.converted.js"

echo "Converting to $new_file..."

# Simple conversion - more careful with type definitions
cat "$test_file" | \
grep -v "^import type " | \
sed 's/^export type [A-Za-z0-9_]* = {/export const defaultValues = {/g' | \
sed 's/^type [A-Za-z0-9_]* = {/const defaultValues = {/g' | \
sed '/^export interface /,/^}/c\// Interface removed during TypeScript to JavaScript conversion' | \
sed '/^interface /,/^}/c\// Interface removed during TypeScript to JavaScript conversion' | \
sed 's/: string;/: "",/g' | \
sed 's/: number;/: 0,/g' | \
sed 's/: boolean;/: false,/g' | \
sed 's/: React\.FC[^=]*=/=/g' | \
sed 's/: React\.ReactElement//g' | \
sed 's/: JSX\.Element//g' | \
sed 's/ as [A-Za-z0-9_]*//g' \
> "$new_file"

echo ""
echo "Converted content:"
echo "=================="
cat "$new_file"
echo ""
echo "=================="

echo "Test completed. Check $new_file to verify the conversion."
