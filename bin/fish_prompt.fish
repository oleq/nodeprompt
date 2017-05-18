if status --is-interactive
	function fish_prompt
		if test -d "$PWD";
			echo -e (nodeprompt --fish)
		end
	end
end