# Community Of Hope

Community of Hope is looking for a way to allow St. Louis area moms to easily get help from their volunteers.  Our site will allow registered moms to send an alert to community of hope volunteers asking for help.  A verified volunteer will then be able to accept the request and chat with the mom, so that they can come over to the mom and help.

# Setup Instructions

## Backend

- cd into the `/CommunityOfHope/backend` directory.
- run `npm install` for first time setup
- run `npm run go` to launch the app
- make sure it says "In Development Mode", if not something is run with the .env file

## Frontend

- cd into the `/CommunitOfHope/coh-admin` directory
- run `yarn` for first time setup
- run `npm run dev` to launch the app

## Mobile App

- cd into the `/CommunitOfHope/coh-mobile` directory
- run `yarn` for first time setup
- run `npx expo start` to launch the app
- open on the web or scan the QR code with Expo Go App to launch on your phone.  Note: For me this doesn't work unless my phone and computer are connceted to the same wifi network.

## Git Instructions

- First, ALWAYS `git pull` before you make changes.
- `git branch [Name of Branch]` to create a new branch
- `git checkout [Name of Branch]` to move into your newly created branch
- `git add [filename]` to track changes in individual files or `git add *` to track changes in all files.
- `git commit -m "[Commit Message Here]"`.  Use your commit message to give a brief description of what you worked on.
- `git push`, if it tells you to rerun the command again with `--set-upstream`, then copy the code they give you in that error message and run it.
- Finally, go onto the CommunityOfHope Github and create a pull request.
