const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const filterText = async (req, res, next) => {
    const { content } = req.body;
    console.log("Content: ", content);
    if (content) {
        if (content.length > 250) {
            return res.json({
                error: "Your message is too long",
            });
        }
        try {
            const response = await openai.createModeration({
                input: content,
            });
            const { data } = response;
            if (data.results[0].flagged) {
                console.log("Your message is flagged as inappropriate");
                return res.json({
                    message: "Your message is flagged as inappropriate",
                    data: data.results[0],
                });
            } else {
                console.log("Your message has been approved");
                next();
            }
        } catch (error) {
            console.error(error);
            return res.json({
                message: "Error while filtering your message",
                error: error,
            });
        }
    } else {
        next();
    }
};

module.exports = { filterText };
