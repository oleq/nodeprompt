#!/bin/bash

# Abort if not an interactive shell.
[[ $- != *i* ]] && return

NODEPROMPT_SCRIPT_DIR=$(dirname $BASH_SOURCE)

NODEPROMPT_ENV_ARGS=(
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
				# Truncate lines to avoid "Argument list too long" error, preserving work tree/index
				# info but discarding file name, which is obsolete for further processing (#4):
				#
				# ## master                  ## master
				#  M foo.js     becomes       M
				# ?? bar/                    ??
				"--status=$(git status --porcelain --branch 2>/dev/null |
					awk '{ if ( NR>1 ) { print substr($0,1,3) } else { print $0 } }')"
				"--namerev=$(git name-rev --name-only HEAD 2>/dev/null)"
				"--hash=$(git rev-parse HEAD 2>/dev/null)"
				"--head=$(cat $GIT_DIR/HEAD 2>/dev/null)"
				"--merge-head=$(git name-rev --name-only $(cat $GIT_DIR/MERGE_HEAD 2>/dev/null) 2>/dev/null)"
				"--bisect-log=$(cat $GIT_DIR/BISECT_LOG 2>/dev/null)"
			)
		fi
	# }
	# time {
		# Check whether current directory still exists (#2).
		if [ -d "$PWD" ]; then
			PS1=$($NODEPROMPT_SCRIPT_DIR/nodeprompt.js "${NODEPROMPT_ENV_ARGS[@]}" "${GIT_ARGS[@]}")
		fi
	# }
}

PROMPT_COMMAND=setPS1