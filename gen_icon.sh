#!/bin/bash
#=========================================================
# © 2024 Ronan LE MEILLAT for SCTG Development
#=========================================================
# This script generates the icons for the app
pushd assets >/dev/null
for name in icon settings-icon; do
    for size in 16 32 64 80 128; do
        # from ImageMagick
        magick ${name}.png -resize ${size}x${size} ${name}-$size.png
        DATA_URL="data:image/png;base64,$(base64 -i ${name}-$size.png)"
        echo $DATA_URL >${name}-$size.txt
    done
done
magick logo-filled.png -bordercolor white -border 0 \
    \( -clone 0 -resize 16x16 \) \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 48x48 \) \
    \( -clone 0 -resize 64x64 \) \
    -delete 0 -alpha off -colors 256 favicon.ico
popd >/dev/null
