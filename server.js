

const callLocalAPI = async() => {
    const axios = require('axios');
    const response = await axios.post('http://localhost:4300/v1/chat/completions', {
        model: "SanctumAI/Meta-Llama-3-8B-Instruct-GGUF",
        messages: [
            { role: "system", content: "You are be able to speak Indonesia" },
            { role: "user", content: "apakah kamu tau berapa jumlah kaki sapi" }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: true
    }, {
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
        if (!chunk) return;

        const chunkStr = chunk.toString().trim();
        if (chunkStr.startsWith("data: ")) {
            const jsonStr = chunkStr.substring(6);
            if (jsonStr === "[DONE]") {
                return;
            }
            try {
                const data = JSON.parse(jsonStr);
                if (data.choices && data.choices.length > 0 && data.choices[0].delta) {
                    process.stdout.write(data.choices[0].delta.content || "");
                }
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }
        }
    });

    response.data.on('end', () => {
        console.log('\nResponse stream ended.');
    });
}

async function run() {
    await callLocalAPI();
}

run().catch(console.error);

