#!/bin/bash
#=========================================================
# © 2024 Ronan LE MEILLAT for SCTG Development
#=========================================================
# This script generates the icons for the app
pushd assets > /dev/null
for size in 16 32 64 80 128; do
    # from ImageMagick
    magick logo-filled.png -resize ${size}x${size} icon-$size.png
    DATA_URL="data:image/png;base64,$(base64 -i icon-$size.png)"
    echo $DATA_URL > icon-$size.txt
done
magick logo-filled.png -resize 16x16 -resize 32x32 -resize 64x64 -resize 128x128 -colors 256 favicon.ico
popd > /dev/null