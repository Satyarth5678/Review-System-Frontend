@echo off
git add .
git commit -m "fix: react plugin, HashRouter, relative favicon for GitHub Pages"
git push origin explore
git checkout main
git merge explore --no-edit
git push origin main
git checkout explore
