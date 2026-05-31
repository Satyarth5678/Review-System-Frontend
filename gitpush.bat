@echo off
git add .
git commit -m "fix: replace PageTransition with stable FadeRoute, wrap ExplorePage in error boundary"
git push origin explore
git checkout main
git merge explore
git push origin main
git checkout explore
