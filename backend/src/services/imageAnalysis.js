const axios = require('axios');
const fs = require('fs');

async function analyzeImage(imagePath) {
  try {
    // Read and convert image to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Make request to local Ollama server
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llava',
      prompt: 'Analyze this fashion image. Describe: 1. Type of clothing 2. Colors 3. Patterns 4. Style category',
      images: [base64Image]
    });
    
    // Parse the response to extract structured information
    const analysis = parseAnalysisResponse(response.data.response);
    
    return {
      clothingType: analysis.clothingType,
      colors: analysis.colors,
      patterns: analysis.patterns,
      style: analysis.style
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
}

function parseAnalysisResponse(text) {
  // Initialize default values
  const analysis = {
    clothingType: '',
    colors: [],
    patterns: '',
    style: ''
  };

  // Extract clothing type
  const clothingTypes = ['dress', 'shirt', 't-shirt', 'pants', 'skirt', 'jacket', 'coat', 'sweater'];
  for (const type of clothingTypes) {
    if (text.toLowerCase().includes(type)) {
      analysis.clothingType = type;
      break;
    }
  }

  // Extract colors
  const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'orange'];
  for (const color of colors) {
    if (text.toLowerCase().includes(color)) {
      analysis.colors.push(color);
    }
  }

  // Extract patterns
  const patterns = ['striped', 'floral', 'solid', 'plaid', 'checkered', 'polka dot', 'geometric'];
  for (const pattern of patterns) {
    if (text.toLowerCase().includes(pattern)) {
      analysis.patterns = pattern;
      break;
    }
  }

  // Extract style
  const styles = ['casual', 'formal', 'business', 'sporty', 'bohemian', 'vintage', 'modern', 'classic'];
  for (const style of styles) {
    if (text.toLowerCase().includes(style)) {
      analysis.style = style;
      break;
    }
  }

  return analysis;
}

module.exports = {
  analyzeImage
}; 