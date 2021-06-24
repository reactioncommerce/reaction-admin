#!/usr/bin/env bash

# Please Use Google Shell Style: https://google.github.io/styleguide/shell.xml

# ---- Start unofficial bash strict mode boilerplate
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -o errexit  # always exit on error
set -o errtrace # trap errors in functions as well
set -o pipefail # don't ignore exit codes when piping output
set -o posix    # more strict failures in subshells
# set -x          # enable debugging

IFS=$'\n\t'
# ---- End unofficial bash strict mode boilerplate

volumes=$(mount | grep -E '^/dev/' | grep -Ev ' on /etc/' || true)
if [[ -z "${volumes}" ]]; then
  echo "fix-volumes: No volumes found"
  exit
fi

# Volumes need some fixing both on Linux and on Mac OSX, but for different reasons.
# Here we are basically trying to detect which reason. On Mac, all linked volumes
# are always owned by root, even if that directory is present in the image with
# different ownership. On Linux, they are owned by `node` user, but the UID may
# be incorrectly carried in from the host machine. So the `if` below should be
# true only on Mac.
#
# On Linux, we "fix" by copying the working directory ownership to all volumes,
# in conjunction with changing the `node` user's UID to match the host machine,
# which was done earlier, outside of this script.
#
# On Mac, we "fix" by setting directory ownership to the container `node` user's
# UID:GID for every volume. The UID mismatch that happens sometimes on Linux
# is never an issue on Mac.
owner=$(stat -c "%u:%g" .)
if [[ "${owner}" =~ ^0: ]]; then
  desired_owner_user=$1
  if [[ -z "${desired_owner_user}" ]]; then
    owner="1000:1000" # use a reasonable guess if no argument was provided
  else
    owner="$(id -u ${desired_owner_user}):$(id -g ${desired_owner_user})"
  fi
fi

echo "fix-volumes: Fixing all volumes to be owned by '${owner}'"
echo "${volumes}" | awk '{print $3}' | {
  while IFS= read -r dir; do
    mkdir -p "${dir}"
    old_owner=$(stat -c "%u:%g" "${dir}")
    if [[ "${old_owner}" == "${owner}" ]]; then
      echo "fix-volumes: Skipping volume ${dir}. Already owned by ${owner}"
      continue
    fi
    printf "fix-volumes: Fixing volume %s (before=%s after=%s)…" "${dir}" "${old_owner}" "${owner}"
    chown -R "${owner}" "${dir}"
    chmod -R a+r,u+rw "${dir}"
    echo "✓"
  done
}
