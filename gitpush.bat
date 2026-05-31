@echo off
git add .
git commit -m "fix: add react plugin, HashRouter and base path for GitHub Pages"
git push origin explore
git checkout main
git merge explore
git push origin main
git checkout explore
