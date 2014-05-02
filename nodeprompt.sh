#!/bin/bash

# Abort if not an interactive shell.
[[ $- != *i* ]] && exit

SCRIPT_DIR=$(dirname $BASH_SOURCE)

ENV_ARGS=(
	"--host=$(hostname -s)"
	"--user=$USER"
)

function setPS1() {
	# time {
		# With "2>/dev/null" errors go to hell.
		local GIT_DIR="$(git rev-parse --git-dir 2>/dev/null)"

		local GIT_ARGS=(
			"--git=$GIT_DIR"
		)

		if [ -n "$GIT_DIR" ]; then
			GIT_ARGS+=(
				"--status=$(git status --porcelain --branch 2>/dev/null)"
				"--namerev=$(git name-rev --name-only HEAD 2>/dev/null)"
				"--hash=$(git rev-parse HEAD 2>/dev/null)"
				"--head=$(cat $GIT_DIR/HEAD 2>/dev/null)"
				"--merge-head=$(git name-rev --name-only $(cat $GIT_DIR/MERGE_HEAD 2>/dev/null) 2>/dev/null)"
				"--bisect-log=$(cat $GIT_DIR/BISECT_LOG 2>/dev/null)"
			)
		fi
	# }
	# time {
		PS1=$(node $SCRIPT_DIR/nodeprompt.js "${ENV_ARGS[@]}" "${GIT_ARGS[@]}")
	# }
}

PROMPT_COMMAND=setPS1