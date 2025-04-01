// Simple color extraction service that returns mock data
function getColorName(rgb) {
  const [r, g, b] = rgb;
  
  // Define color ranges
  if (r > 200 && g > 200 && b > 200) return 'white';
  if (r < 50 && g < 50 && b < 50) return 'black';
  if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) return 'gray';
  if (r > 200 && g < 100 && b < 100) return 'red';
  if (r < 100 && g > 150 && b < 100) return 'green';
  if (r < 100 && g < 100 && b > 150) return 'blue';
  if (r > 200 && g > 200 && b < 100) return 'yellow';
  if (r > 200 && g < 150 && b > 150) return 'pink';
  if (r > 150 && g > 100 && b < 100) return 'orange';
  return 'unknown';
}

async function extractDominantColors(imagePath) {
  // Return mock color data
  return [
    {
      rgb: [220, 20, 60],
      hex: '#DC143C',
      percentage: 40,
      name: 'red'
    },
    {
      rgb: [25, 25, 112],
      hex: '#191970',
      percentage: 30,
      name: 'navy'
    },
    {
      rgb: [245, 245, 245],
      hex: '#F5F5F5',
      percentage: 30,
      name: 'white'
    }
  ];
}

module.exports = {
  extractDominantColors,
  getColorName
}; 