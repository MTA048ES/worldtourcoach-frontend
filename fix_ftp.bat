@echo off
cd /d %~dp0
node -e "const fs=require('fs');const f='src/components/dashboard/RecentActivities.jsx';let c=fs.readFileSync(f,'utf8');c=c.replace('Tiempo > FTP','Tiempo > FTP');fs.writeFileSync(f,c);console.log('Fixed!');"
pause