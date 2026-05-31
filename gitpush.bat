@echo off
git add .
git commit -m "ci: add GitHub Actions workflow to build and deploy to Pages"
git push origin explore
git checkout main
git merge explore
git push origin main
git checkout explore
