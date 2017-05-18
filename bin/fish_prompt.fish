if status --is-interactive
	function fish_prompt
		if test -d "$PWD";
			set DIR (dirname (readlink (status --current-filename)))
			echo -e (eval $DIR/nodeprompt)
		end
	end
end