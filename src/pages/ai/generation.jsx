export const detectIntent = async (prompt) => {
  try {
    const intentPrompt = `
      You are an intent classification system for a multimodal AI assistant.

      Your task is to analyze the user's message and determine the type of response they are expecting.

      Respond with **only one word**:
      - "image" → if the user is asking to see or generate a visual (e.g. drawings, photos, illustrations, scenes, renderings).
      - "text" → if the user is asking for information, explanation, story, advice, or any written content.

      Here are examples to guide you:

      1. "Draw a dragon surfing on lava" → image  
      2. "What are the symptoms of anxiety?" → text  
      3. "Generate a picture of a futuristic city in the sky" → image  
      4. "Explain how a nuclear reactor works" → text  
      5. "Create an image of a robot playing the violin on Mars" → image  
      6. "Write a story about a lonely astronaut" → text  
      7. "Show me a haunted forest with glowing eyes in the trees" → image  
      8. "How do I cook carbonara?" → text  
      9. "Make an image of a jellyfish spaceship" → image  
      10. "Give me tips for studying better" → text  

      Now classify the following message:

      "${prompt}"

      Your response ("image" or "text"):
    `;
    const response = await fetch(
      `https://text.pollinations.ai/prompt/${encodeURIComponent(intentPrompt)}?model=mistral&temperature=0.1`
    );
    
    if (!response.ok) throw new Error("Intent detection failed");
    
    const result = (await response.text()).toLowerCase().trim();
    if(result == "image"){
      generateImage(prompt);
    } else{
      generateTextResponse(prompt);
    }
    return result.includes("image") ? "image" : "text";
  } catch (error) {
    console.error("Error detecting intent:", error);
    return "text";
  }
};

export const generateTextResponse = async (prompt, conversationHistory = []) => {
  try {
    const systemPrompt = `
You are an emotionally intelligent and knowledgeable assistant on a platform called "Rant On Me" — a safe space where users can express emotions, ask questions, and explore thoughts without fear of judgment.

Your goals:
- Prioritize emotional awareness when the user expresses feelings (e.g., sadness, anger, loneliness, joy).
- Offer thoughtful, empathetic, and human-like responses that validate emotions and provide comfort when needed.
- When the user asks for information or expresses curiosity (not emotional distress), respond clearly, informatively, and engagingly — like a kind and supportive friend who knows things.
- Match your tone to the user's current mood.
- Avoid sounding robotic or overly formal.
- Never judge, lecture, or try to fix the user — listen, understand, and reflect.

Be versatile: support mental health, but also help users explore the world.

Always aim for connection, safety, and understanding.

Below is the latest conversation. Use this to understand the user’s tone, intent, and emotional state. Maintain consistency and continuity in your response:

${conversationHistory.slice(-6).map(
  msg => `${msg.type === 'user' ? 'User' : 'You'}: ${msg.content}`
).join('\n')}
`;

    const response = await fetch(
      `https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=mistral&system=${encodeURIComponent(systemPrompt)}&temperature=0.7`
    );

    if (!response.ok) throw new Error("Text generation failed");
    return await response.text();
  } catch (error) {
    console.error("Text generation error:", error);
    return "I couldn't generate a response. Please try again.";
  }
};

export const generateImage = async (prompt, options = {}) => {
  try {
    const {
      model = 'flux',
      seed = null,
      width = 512,
      height = 512,
      nologo = true,
      private: isPrivate = true,
      enhance = true,
      safe = true,
      transparent = false,
      referrer = 'rant-ai'
    } = options;

    // Build query parameters for Pollinations.ai
    const params = new URLSearchParams();
    if (model) params.append('model', model);
    if (seed) params.append('seed', seed);
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    if (nologo) params.append('nologo', nologo);
    if (isPrivate) params.append('private', isPrivate);
    if (enhance) params.append('enhance', enhance);
    if (safe) params.append('safe', safe);
    if (transparent) params.append('transparent', transparent);
    if (referrer) params.append('referrer', referrer);

    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;

    // 1. First fetch the generated image
    const imageResponse = await fetch(pollinationsUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch generated image');
    const imageBlob = await imageResponse.blob();

    // 2. Create a canvas to composite the image and logo
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 3. Load the generated image onto canvas
    const imageBitmap = await createImageBitmap(imageBlob);
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    // 4. Load your logo (assuming it's in your public folder)
    const logoResponse = await fetch('/logo.png'); // Path to your logo in public folder
    if (!logoResponse.ok) throw new Error('Failed to fetch logo');
    const logoBlob = await logoResponse.blob();
    const logoBitmap = await createImageBitmap(logoBlob);

    // 5. Calculate logo size and position (5% of width, bottom-right with padding)
    const logoWidth = Math.floor(width * 0.05);
    const logoHeight = (logoWidth * logoBitmap.height) / logoBitmap.width;
    const padding = 24;
    const logoX = width - logoWidth - padding;
    const logoY = height - logoHeight - padding;

    // 6. Draw logo onto the canvas
    ctx.drawImage(logoBitmap, logoX, logoY, logoWidth, logoHeight);

    // 7. Convert canvas to blob URL
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/png');
    });

  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
};