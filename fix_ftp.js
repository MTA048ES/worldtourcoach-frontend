import fs from 'fs';
const filePath = 'src/components/dashboard/RecentActivities.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const fixed = content.replace('Tiempo > FTP', 'Tiempo > FTP');
fs.writeFileSync(filePath, fixed);
console.log('Fixed!');