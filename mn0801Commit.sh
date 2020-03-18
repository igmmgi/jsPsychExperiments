#!/bin/sh

git config --global user.name "ian"
git config --global user.email "ian.mackenzie@uni-tuebingen.de"
git config core.editor vim
git add . -A
git commit
git push origin master
