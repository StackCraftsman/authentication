#!/bin/bash

# Set your GitHub username
GITHUB_USERNAME="sam-of-flutter"

# Prompt user for the repository name
read -p "Enter the repository name: " REPO_NAME

# Initialize a local Git repository
git init
git add .
read -p "Enter the initial commit message: " INITIAL_COMMIT_MESSAGE
git commit -m "$INITIAL_COMMIT_MESSAGE"

# Create a new repository on GitHub
curl -u $GITHUB_USERNAME https://api.github.com/user/repos -d '{"name":"'$REPO_NAME'"}'

# Connect the local repository to the GitHub repository
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
git branch -M main
git push -u origin main

# Check if .gitignore exists and create it if not
if [ ! -e .gitignore ]; then
  touch .gitignore
fi

# Append entries to .gitignore
echo -e "node_modules/\n.env\nplay.sh\npackage-lock.json" >> .gitignore

# Add, commit, and push changes
git add .
read -p "Enter the commit message for .gitignore: " GITIGNORE_COMMIT_MESSAGE
git commit -m "$GITIGNORE_COMMIT_MESSAGE"
git push -u origin main

# Open VS Code or your preferred code editor
code .

# Print a message indicating completion
echo "GitHub repository '$REPO_NAME' created and configured successfully!"

