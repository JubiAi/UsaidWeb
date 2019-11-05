git pull origin master
pm2 restart web8192 -- 8192
pm2 restart web8194 -- 8194
pm2 restart web8196 -- 8196
pm2 logs

# git pull origin master
# sudo pm2 restart usaidWeb
# sudo pm2 logs usaidWeb