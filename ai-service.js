// --- Your OpenAI Configuration ---
const OPENAI_KEY = "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";

/**
 * Core AI Fetch Function
 */
async function askAI(prompt, systemPrompt) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Using the fast, efficient model
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // Handle API Errors (like quota exceeded or invalid key)
        if (data.error) {
            console.error("OpenAI API Error:", data.error.message);
            return `AI Error: ${data.error.message}`;
        }
        
        return data.choices[0].message.content;
    } catch (err) {
        console.error("Network Error:", err);
        return "Error: Check your internet connection or API limits.";
    }
}

/**
 * Summarization Logic
 */
export const getSummary = async (text) => {
    return await askAI(
        text, 
        "You are a professional study assistant. Summarize the user's notes into high-quality, bulleted study guides. Use Markdown bolding for key terms."
    );
};

/**
 * Quiz Generation Logic
 */
export const getQuiz = async (topic) => {
    return await askAI(
        topic, 
        "Create 3 challenging multiple-choice questions about this topic. Format: Question, followed by options A, B, C, D, and clearly label the Correct Answer at the bottom of each question."
    );
}
