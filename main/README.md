# Webflow Large-Scale Software Development Kit

A minimalist template repository for building rich native JavaScript/jQuery applications for Webflow.

## 🚀 Getting Started

### Using GitHub Codespaces

1. Click **Use this template**.
2. Select **Open in a codespace**.
3. Wait 30 seconds to two minutes for everything to install automatically.
4. Type `npm start` in the terminal.
5. Press `http://localhost:1234`.
6. Follow the instructions page to integrate with your Webflow project.

### Using Desktop

1. Open the terminal and type `npm i`, then `npm start`.
2. Press `http://localhost:1234`.
3. Follow the instructions page to integrate with your Webflow project.

_Make sure you have npm installed: [https://nodejs.org/en/download](https://nodejs.org/en/download)_

---

## 🏗️ Building Production Code

1. After you're done, type `npm run build` in the terminal.
2. Follow the instructions to locate and use the generated production files.

---

## 🌐 Hosting Production Files on GitHub

### Manual Method

1. Copy the compressed controller JavaScript code from the `dist` folder.
2. [Create a new file] in your GitHub repository and paste the copied code.
3. Commit the new file.
4. Get the jsDelivr link by pasting the file's URL on [jsDelivr's GitHub page](https://www.jsdelivr.com/github).
5. Replace the `src` URL in your Webflow project settings with the jsDelivr link.
6. Publish your Webflow project.

### Using Git

_Make sure you have Git installed: [https://git-scm.com/downloads](https://git-scm.com/downloads)_

1. Initialize the Git repository using `git init`.
2. Rename the default branch to `main` using `git branch -m master main`.
3. Configure your Git username and email using `git config --global user.name YOUR NAME` and `git config --global user.email YOUR_EMAIL`.
4. Add and commit your changes using `git add -A` and `git commit -m 'first commit 🚀'`.
5. Add your GitHub repository as the remote origin using `git remote add origin https://github.com/USER/REPO.git`.
6. Set the remote URL using `git remote set-url origin https://github.com/USER/REPO.git`.
7. Push your changes to GitHub using `git push origin main`.

git pull `https://github.com/USER/REPO.git` main
(For updating your local git incase someone made changes to the GitHub version in the mean times)

### Additional Handy Git Functions

- `rm -fr .git` (Mac) or `rmdir .git -force` (Windows) // To remove an existing Git instance (and e.g. nest it in other Git folders)
- `git config --local credential.helper ""` // To prompt for username and password

######

- Username: `wf-02100`
- Password: `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` (Personal access token)
