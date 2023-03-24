#!/bin/bash

echo "发布开始"
pnpm run build
pnpm run release
echo "发布完成" 
