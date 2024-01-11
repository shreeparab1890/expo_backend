const { OpenAI } = require("openai");
const openai = require("openai");
const dotenv = require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
openai.apiKey = OPENAI_API_KEY;
client = new OpenAI();
const logger = require("../config/logger.js");

prompt1 =
  "Act as a Travel Agent and follow the below prompt: Generate a detailed travel itinerary with perfect Punctuation importantly ending each sentence with a full stop w.r.t. the title format below: Breakfast, Morning Activity, Lunch, Evening Activity, Night. Each day starting with Breakfast; suggest a good breakfast. After breakfast, suggest an activity to do in the first half naming it as 'Morning Activity'. Suggest a good Lunch naming it as 'Lunch'. After Lunch, suggest an activity to do in the second half naming it as 'Evening Activity'. Finally, suggest me how to spend the night naming it as 'Night'. for 3 days in goa w.r.t. the user interests in offbeat. and compulsorily end every day with &&.";

//@desc Test Triptoe API
//@route GET /api/v1/tripytoe
const testAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  return res.status(200).send("Tripytoe API Test Successfully");
};

//@desc Get Itinerary
//@route POST /api/v1/tripytoe
const getItinerary = async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const {
      destination,
      no_of_days,
      start_date,
      no_of_ppl,
      preference,
      budget,
    } = req.body;
    response = await client.completions.create({
      //model: "text-davinci-003",
      model: "gpt-3.5-turbo-instruct",
      //prompt: `Generate a travel itineray at destination ${destination} for ${no_of_days} days and the number of people are ${no_of_ppl} w.r.t. user interest ${preference}.`,
      prompt: prompt1,
      temperature: 0.6,
      max_tokens: 2550,
      top_p: 1.0,
      frequency_penalty: 1,
      presence_penalty: 1,
    });
    logger.info(
      `${ip}: API /api/v1/tripytoe  | responnded with "Itinerary Generated Successfull" `
    );

    /* //return res.status(200).send(response.choices[0].text);
    const iti = response.choices[0].text;
    const iti_list = iti.split("&&");
    //console.log(iti_list);

    const itineraryDict = {};

    let currentDay = "";
    let currentActivity = "";

    for (const line of iti_list) {
      if (line.startsWith("Day")) {
        currentDay = line.trim();
        itineraryDict[currentDay] = {};
      } else if (line.includes(":")) {
        const [timeOfDay, activity] = line
          .split(":")
          .map((item) => item.trim());
        currentActivity = timeOfDay;
        itineraryDict[currentDay][currentActivity] = activity;
      }
    }

    console.log(JSON.stringify(itineraryDict, null, 2)); */
    /* for (let i = 0; i < iti_list.length; i++) {
      console.log(iti_list[i]);
    } */
    return await res.status(200).json({
      itinerary: response.choices[0].text,
      message: "Itinerary Generated successfully",
    });
  } catch (error) {
    logger.error(`API /api/v1/tripytoe | responnded with Error `);
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

module.exports = {
  testAPI,
  getItinerary,
};
