function fish_prompt
	set NODEPROMPT_SCRIPT_DIR '/opt/nodeprompt' #(dirname $BASH_SOURCE)

	set HOSTNAME (hostname -s)

	set NODEPROMPT_ENV_ARGS \
		"--host=$HOSTNAME" \
		"--user=$USER"

	# With "2>/dev/null" errors go to hell.
	set GIT_DIR (git rev-parse --git-dir 2>/dev/null)

	set GIT_ARGS "--git=$GIT_DIR"

	# Check if not in ".git" folder (#7)
	if test -n "$GIT_DIR" -a "$GIT_DIR" != ".";
		set GIT_STATUS (git status --porcelain --branch 2>/dev/null | awk '{ if ( NR>1 ) { print substr($0,1,3) } else { print $0 } }' | tr '\n' '\r')
		set GIT_NAMEREV (git name-rev --name-only HEAD 2>/dev/null)
		set GIT_HASH (git rev-parse HEAD 2>/dev/null)
		set GIT_HEAD (cat $GIT_DIR/HEAD 2>/dev/null)
		set GIT_MERGE_HEAD_CAT (cat $GIT_DIR/MERGE_HEAD 2>/dev/null)
		set GIT_MERGE_HEAD (git name-rev --name-only $GIT_MERGE_HEAD_CAT 2>/dev/null)
		set GIT_BISECT_LOG (cat $GIT_DIR/BISECT_LOG 2>/dev/null)

		set GIT_ARGS \
			"$GIT_ARGS" \
			"--status=$GIT_STATUS" \
			"--namerev=$GIT_NAMEREV" \
			"--hash=$GIT_HASH" \
			"--head=$GIT_HEAD" \
			"--merge-head=$GIT_MERGE_HEAD" \
			"--bisect-log=$GIT_BISECT_LOG"
	end
	# Check whether current directory still exists (#2).
	if test -d "$PWD";
		# Unfortunately because of fish limits it would be hard to get and execute script path dynamically.
		set PROMPT (nodeprompt.js $NODEPROMPT_ENV_ARGS $GIT_ARGS)
		echo -e $PROMPT
	end
end