const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SchemaType } = require('@google/generative-ai');


// Initialize the client
const client = new GoogleGenerativeAI({
    apiKey: 'AIzaSyDDegLFH16_83hzter8APkLKsgHgkCoI6o',
});

// Exported function to send a prompt and get the response
exports.chatGptAsk = async function (req, res, next) {
    try {
        const genAI = new GoogleGenerativeAI('AIzaSyDDegLFH16_83hzter8APkLKsgHgkCoI6o');
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.ARRAY,
                    items: {
                        "type": "object",
                        "properties": {
                            "lat": { "type": "number", "format": "double" },
                            "lon": { "type": "number", "format": "double" }
                        }
                    }
                },
            }
        });

        const { prompt } = req.body;

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        res.json({ answer: result.response.text() })

    } catch (error) {
        console.log(error);
        next(error)
    }
}

