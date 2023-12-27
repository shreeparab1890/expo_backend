const { OpenAI } = require("openai");
const openai = require("openai");
const dotenv = require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
openai.apiKey = OPENAI_API_KEY;
client = new OpenAI();
const logger = require("../config/logger.js");

const prompt = "Translate the following English text to French: ";

//@desc Test Triptoe API
//@route GET /api/v1/tripytoe
const testAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  return res.status(200).send("Tripytoe API Test Successfully");
};

//@desc Get Itinerary
//@route POST /api/v1/tripytoe
const getItinerary = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { destination, no_of_days, start_date, no_of_ppl, preference, budget } =
    req.body;
  response = await client.completions.create({
    model: "text-davinci-003",
    prompt: `Generate a travel itineray at destination ${destination} for ${no_of_days} days and the number of people are ${no_of_ppl} w.r.t. user interest ${preference}.`,
    temperature: 0.6,
    max_tokens: 2550,
    top_p: 1.0,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  logger.info(
    `${ip}: API /api/v1/tripytoe  | responnded with "Itinerary Generated Successfull" `
  );

  //return res.status(200).send(response.choices[0].text);
  return await res.status(200).json({
    itinerary: response.choices[0].text,
    message: "Itinerary Generated successfully",
  });
};

module.exports = {
  testAPI,
  getItinerary,
};
