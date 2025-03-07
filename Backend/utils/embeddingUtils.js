const { OpenAI } = require("openai");
const db = require("../database/db");

const openai = new OpenAI({ apiKey: "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" });

// Get embeddings for text
async function getEmbedding(text) {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error("Embedding Error:", error);
        return null;
    }
}

// Calculate cosine similarity
function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val ** 2, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (magnitude1 * magnitude2);
}

// Match text with stored documents
async function matchWithStoredDocuments(userText) {
    const userEmbedding = await getEmbedding(userText);
    if (!userEmbedding) return null;

    return new Promise((resolve, reject) => {
        db.all("SELECT id, filename, filepath FROM documents", async (err, rows) => {
            if (err) return reject("Database error");

            let bestMatch = null;
            let highestScore = -1;

            for (const row of rows) {
                const fileText = fs.readFileSync(row.filepath, "utf-8"); // Read stored file
                const docEmbedding = await getEmbedding(fileText);
                const score = cosineSimilarity(userEmbedding, docEmbedding);

                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = row.filename;
                }
            }

            resolve(bestMatch);
        });
    });
}

module.exports = { getEmbedding, matchWithStoredDocuments };
