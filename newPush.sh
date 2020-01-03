git pull origin master
FILE=./static/js/bundle.test.js
if test -f "$FILE"; 
	then
    echo "$FILE exist. Update dataset and minify? (Y/N)"
    read STA
    if [ $STA == 'Y' ] 
    	then
    	echo "yes"
    	node update.js
	elif [ $STA == 'N' ]
		then
		echo "No accepted. Pushing to cloud."
	else
		echo "Defaulting to NO. Pushing to cloud."
    fi
    git add .
    echo "Please enter comment: "
    read comment
    git commit -m "$comment"
    git push origin master
fi