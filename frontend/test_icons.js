import * as lucide from 'lucide-react';
console.log('Lucide keys:', Object.keys(lucide).filter(k => k.startsWith('Lucide')).slice(0, 50));
console.log('Twitter Check:', Object.keys(lucide).filter(k => k.toLowerCase().includes('twitter')));
console.log('Github Check:', Object.keys(lucide).filter(k => k.toLowerCase().includes('github')));
console.log('Linkedin Check:', Object.keys(lucide).filter(k => k.toLowerCase().includes('linkedin')));
