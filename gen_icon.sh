#!/bin/bash
#=========================================================
# © 2024 Ronan LE MEILLAT for SCTG Development
#=========================================================
# This script generates the icons for the app
pushd assets > /dev/null
for size in 16 32 64 80 128; do
    # from ImageMagick
    convert logo-filled.png -resize ${size}x${size} icon-$size.png
    DATA_URL="data:image/png;base64,$(base64 -i icon-$size.png)"
    echo $DATA_URL > icon-$size.txt
done
popd > /dev/null