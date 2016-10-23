#!/bin/bash

# 2>&1 ejemplo: redirigir el stderr al stdout

# me cambio de directorio al directorio actual de este archivo y redirijo el stdout al /dev/null para no imprimir nada
pushd "$(dirname "$0")" 1>/dev/null
dir=`pwd`
parentdir="$(dirname "$dir")"
find $parentdir -name .DS_Store -print0 | xargs -0 git rm --ignore-unmatch

# me cambio de directorio donde estuviera antes de lanzar el script y redirijo el stdout al /dev/null para no imprimir nada
popd 1>/dev/null
