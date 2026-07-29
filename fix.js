const fs = require('fs');

const file = 'd:/xampp/htdocs/MODAA/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const startTag = '{/* ── BRUTALIST MAGAZINE NEW ARRIVALS ── */}';
const startIndex = content.indexOf(startTag);
const endTag = '{/* Category Grid */}';
const endIndex = content.indexOf(endTag, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find section");
  process.exit(1);
}

// Ensure state is added
if (!content.includes('const [currentArrivalSlide')) {
  const stateInsertPoint = content.indexOf('const [touchStart');
  const stateInsert = `  const [currentArrivalSlide, setCurrentArrivalSlide] = useState(0);\n  const [arrivalTouchStart, setArrivalTouchStart] = useState<number | null>(null);\n`;
  content = content.slice(0, stateInsertPoint) + stateInsert + content.slice(stateInsertPoint);
}

// Add touch handlers
if (!content.includes('handleArrivalTouchStart')) {
  const handlerInsertPoint = content.indexOf('return (');
  const handlerInsert = `
  const NEW_ARRIVALS = [
    { id: 'prod_1', title: 'ARCHIVE HOODIE / BLK', price: 185, cat: 'OUTERWEAR', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMnaLnndF_wvRegzRbqWvrUQZ470GWCkFs_iCTTyXU-zATGX5IOJl2yKSgAa8Q6s78IrzlaPcNWYJW37ImRj8wONeKwjOPKaiGXCyx9yJsrq4qhhXAD_P-VUV-XFcIF1cTCLyNQ88sKtK0vCXe4RQScs2AByo2wUa2tmhlX_CnQcpeRZDUGVIQkW6X7e1iXkCrv69P4cQg5HQUaA671PeJLB7OyRda-E2-Cdi7lF6QGGraPhIqluhCD3PKGeU0mQH_whyw3HOD7ro' },
    { id: 'prod_2', title: 'TACTICAL PANT 02', price: 240, cat: 'BOTTOMS', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDttnpXadaa46-oxQNQSH17C1Mf46Pdm_xTRrTCufhocwbzysLEJAMwaktgNSequZEN0IAM36LmZdW-mhJj4y_2ZkmvsaAnw2K1Qq3HXRHVQfMy1NjqxI26G7n3jaQWrQvZvxXAIxX-nadn4mJGHj6Xzbfp6lwiUS8fGN_N1MfB3cHUKS5qQTZ0soX8540QCjOEFEpzGudvIgP7_RhzbkvYLtuY7mlK_2Xg3V4j5dtTmdPfNJgnDrqbJI_ZOELGwWGCd5VcdZmuHLI' },
    { id: 'prod_3', title: 'GRAPHIC TEE / RED', price: 75, cat: 'TOPS', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqBXdrJO3-EFMJCE6sbxxP41wzr3xX7pN6BKhteHRo31X-0oOV6PjO2iDitxmHh132-dZQ0rE-Pf-aGtuhsVogJSfE3GYjuCHhOf57uDv6h06-NKhkwg8_-8_BTNo5axg6dX1iu-CKYY65esVx36vtQJ8u7b2IjaWimtABgQE6gz0aHOziSiIBLrzG0MP1-oAN_Jx9XzLEReWYrFLZwwmqGGSMbzbR8qQULP8P3iygBSWRjaTJT5K9ZwfkgSynfPbr0qFZ69BebJs' },
    { id: 'prod_4', title: 'TECH SLING / 01', price: 130, cat: 'ACCESSORIES', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYZY7z2ZrxeLdlhYfAoaTtUm-tsH2pQ6C65MW36Q_Dny63WBlpUgSs7N-sZA_CnCsv0Xzgct-8rxBbquXRrJiVOJxRQ4KujwoqMXEoPlTKCxxGEXrvsVMoing9XBPiMhUpcYjgyxhmSPvC8mXqeslzyGyr-WOI6O0UlD0Wl64LyILJ8HOIetR_C6FmGdD3PIHPwBx37Rs0hXeLkDuXxNkP8KbOICK042ADdBCHl9-tGhefIBUqImwFumqQ5JAwc--ZXDWU_xzLAXo' }
  ];

  const handleArrivalTouchStart = (e: React.TouchEvent) => {
    setArrivalTouchStart(e.targetTouches[0].clientX);
  };

  const handleArrivalTouchEnd = (e: React.TouchEvent) => {
    if (arrivalTouchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = arrivalTouchStart - touchEnd;
    
    if (diff > 50) {
      setCurrentArrivalSlide((prev) => Math.min(prev + 1, NEW_ARRIVALS.length - 1));
    } else if (diff < -50) {
      setCurrentArrivalSlide((prev) => Math.max(prev - 1, 0));
    }
    setArrivalTouchStart(null);
  };
\n`;
  content = content.slice(0, handlerInsertPoint) + handlerInsert + content.slice(handlerInsertPoint);
}

// Re-calculate indexes after insertions
const finalStartIndex = content.indexOf(startTag);
const finalEndIndex = content.indexOf(endTag, finalStartIndex);

const carouselJSX = fs.readFileSync('d:/xampp/htdocs/MODAA/new-carousel.tsx', 'utf8');

const finalContent = content.slice(0, finalStartIndex) + carouselJSX + "\n      " + content.slice(finalEndIndex);

fs.writeFileSync(file, finalContent, 'utf8');
console.log('Fixed page.tsx');
