#!/bin/bash
##
## Install ssh-agent if not already installed, it is required by Docker.
## (change apt-get to yum if you use an RPM-based image)
##
which ssh-agent || ( apt-get update -y && apt-get install openssh-client git -y )

##
## Run ssh-agent (inside the build environment)
##
eval $(ssh-agent -s)
mkdir ~/.ssh
chmod 700 ~/.ssh
echo "$C_SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

##
## Add the SSH key stored in SSH_PRIVATE_KEY variable to the agent store
## We're using tr to fix line endings which makes ed25519 keys work
## without extra base64 encoding.
## https://gitlab.com/gitlab-examples/ssh-private-key/issues/1#note_48526556
##
echo "$C_SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null

##
## Create the SSH directory and give it the right permissions
##
mkdir -p ~/.ssh
chmod 700 ~/.ssh

##
## Use ssh-keyscan to scan the keys of your private server. Replace gitlab.com
## with your own domain name. You can copy and repeat that command if you have
## more than one server to connect to.
##
ssh-keyscan git.dev.sh.ctripcorp.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts

##
## Alternatively, assuming you created the SSH_SERVER_HOSTKEYS variable
## previously, uncomment the following two lines instead.
##
#- echo "$SSH_SERVER_HOSTKEYS" > ~/.ssh/known_hosts'
#- chmod 644 ~/.ssh/known_hosts

##
## You can optionally disable host key checking. Be aware that by adding that
## you are suspectible to man-in-the-middle attacks.
## WARNING: Use this only with the Docker executor, if you use it with shell
## you will overwrite your user's SSH config.
##
#- '[[ -f /.dockerenv ]] && echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config'

##
## Optionally, if you will be using any Git commands, set the user name and
## email.
##
git config --global user.email "hwzcteam_tec@ctrip.com"
git config --global user.name "hwzcteam_tec"
git remote set-url origin git@git.dev.sh.ctripcorp.com:open-source/react-native-building-block.git