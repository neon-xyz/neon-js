#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

verify_commit_is_signed() {
  local commit_hash=$(git log -1 --format="%H")

  if ! git verify-commit "$commit_hash" &> /dev/null; then
    echo "error: Commit ${commit_hash} is not signed"
    exit 1
  fi
}

USAGE="usage: $(basename "$0") <major | minor | patch>"

if [ $# -lt 1 ]; then
  echo "$USAGE" >&2
  exit 1
fi

RELEASE_TYPE="$1"

case $1 in
  -h | --help | help)
    echo "$USAGE" >&2
    exit 1
    ;;
esac

# Validate passed release type
case $RELEASE_TYPE in
  patch | minor | major) ;;
  *)
    echo "error: invalid release type \"${RELEASE_TYPE}\"" >&2
    echo "$USAGE" >&2
    exit 1
    ;;
esac

echo "Make sure our working dir is the repo root directory"
cd "$(git rev-parse --show-toplevel)"
echo "Working in ${PWD}"

echo "Fetching git remotes"
git fetch

echo "Checking git status"
GIT_STATUS=$(git status)

if ! grep -q 'On branch main' <<< "$GIT_STATUS"; then
  echo "error: Must be on main branch to publish" >&2
  exit 1
fi

if ! grep -q "Your branch is up to date with 'origin/main'." <<< "$GIT_STATUS"; then
  echo "error: Must be up to date with origin/main to publish" >&2
  exit 1
fi

if ! grep -q 'working tree clean' <<< "$GIT_STATUS"; then
  echo "error: Cannot publish with dirty working tree" >&2
  exit 1
fi

cd "$(dirname "$(dirname "$0")")"
echo "Running in directory: $PWD"

echo "installing packages"
yarn install --immutable

echo "Bumping version (${1})"
yarn version "$1"

echo "Creating a commit with these changes"
git commit -asm "Release"

echo "Pushing release"
git push

echo "Building..."
yarn run build

echo "Publishing release"
yarn npm publish --access=public

echo "Done!"
