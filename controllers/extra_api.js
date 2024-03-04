const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
var axios = require("axios");

//@desc verify whatsapp number
//@route POST /api/v1/data/verify/whatsapp
//@access Private: Login Required
const verifyWhatsappNumber = async (req, res) => {
  /* console.log("In verify");
  console.log(CHAT_USER_API); */
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { mobile_no } = req.body;

  if (user) {
    var config = {
      method: "get",
      url: `https://api.p.2chat.io/open/whatsapp/check-number/+917498164417/${mobile_no}`,
      headers: {
        "X-User-API-Key": process.env.CHAT_USER_API,
      },
    };

    axios(config)
      .then(function (response) {
        logger.info(
          `${ip}: API /api/v1/extra/verify/whatsapp responnded with Number Check Succesfully: ${mobile_no} `
        );
        return res
          .status(200)
          .send({ data: response.data, message: "Number Check Succesfull" });
      })
      .catch(function (error) {
        console.log(error);
        return res.status(401).send("Error!");
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/extra/verify/whatsapp responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get code by country
//@route GET /api/v1/extra/get/code/bycountry
//@access Private: Login Required
const getCodebyCountry = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { country } = req.params;

  const country_data = [
    { country: "Afghanistan", code: 93 },
    { country: "Albania", code: 355 },
    { country: "Algeria", code: 213 },
    { country: "American Samoa", code: "1-684" },
    { country: "Andorra", code: 376 },
    { country: "Angola", code: 244 },
    { country: "Anguilla", code: "1-264" },
    { country: "Antarctica", code: 672 },
    { country: "Antigua and Barbuda", code: "1-268" },
    { country: "Argentina", code: 54 },
    { country: "Armenia", code: 374 },
    { country: "Aruba", code: 297 },
    { country: "Australia", code: 61 },
    { country: "Austria", code: 43 },
    { country: "Azerbaijan", code: 994 },
    { country: "Bahamas", code: "1-242" },
    { country: "Bahrain", code: 973 },
    { country: "Bangladesh", code: 880 },
    { country: "Barbados", code: "1-246" },
    { country: "Belarus", code: 375 },
    { country: "Belgium", code: 32 },
    { country: "Belize", code: 501 },
    { country: "Benin", code: 229 },
    { country: "Bermuda", code: "1-441" },
    { country: "Bhutan", code: 975 },
    { country: "Bolivia", code: 591 },
    { country: "Bosnia and Herzegovina", code: 387 },
    { country: "Botswana", code: 267 },
    { country: "Brazil", code: 55 },
    { country: "British Indian Ocean Territory", code: 246 },
    { country: "British Virgin Islands", code: "1-284" },
    { country: "Brunei", code: 673 },
    { country: "Bulgaria", code: 359 },
    { country: "Burkina Faso", code: 226 },
    { country: "Burundi", code: 257 },
    { country: "Cambodia", code: 855 },
    { country: "Cameroon", code: 237 },
    { country: "Canada", code: 1 },
    { country: "Cape Verde", code: 238 },
    { country: "Cayman Islands", code: "1-345" },
    { country: "Central African Republic", code: 236 },
    { country: "Chad", code: 235 },
    { country: "Chile", code: 56 },
    { country: "China", code: 86 },
    { country: "Christmas Island", code: 61 },
    { country: "Cocos Islands", code: 61 },
    { country: "Colombia", code: 57 },
    { country: "Comoros", code: 269 },
    { country: "Cook Islands", code: 682 },
    { country: "Costa Rica", code: 506 },
    { country: "Croatia", code: 385 },
    { country: "Cuba", code: 53 },
    { country: "Curacao", code: 599 },
    { country: "Cyprus", code: 357 },
    { country: "Czech Republic", code: 420 },
    { country: "Democratic Republic of the Congo", code: 243 },
    { country: "Denmark", code: 45 },
    { country: "Djibouti", code: 253 },
    { country: "Dominica", code: "1-767" },
    { country: "Dominican Republic", code: "1-809, 1-829, 1-849" },
    { country: "East Timor", code: 670 },
    { country: "Ecuador", code: 593 },
    { country: "Egypt", code: 20 },
    { country: "El Salvador", code: 503 },
    { country: "Equatorial Guinea", code: 240 },
    { country: "Eritrea", code: 291 },
    { country: "Estonia", code: 372 },
    { country: "Ethiopia", code: 251 },
    { country: "Falkland Islands", code: 500 },
    { country: "Faroe Islands", code: 298 },
    { country: "Fiji", code: 679 },
    { country: "Finland", code: 358 },
    { country: "France", code: 33 },
    { country: "French Polynesia", code: 689 },
    { country: "Gabon", code: 241 },
    { country: "Gambia", code: 220 },
    { country: "Georgia", code: 995 },
    { country: "Germany", code: 49 },
    { country: "Ghana", code: 233 },
    { country: "Gibraltar", code: 350 },
    { country: "Greece", code: 30 },
    { country: "Greenland", code: 299 },
    { country: "Grenada", code: "1-473" },
    { country: "Guam", code: "1-671" },
    { country: "Guatemala", code: 502 },
    { country: "Guernsey", code: "44-1481" },
    { country: "Guinea", code: 224 },
    { country: "Guinea-Bissau", code: 245 },
    { country: "Guyana", code: 592 },
    { country: "Haiti", code: 509 },
    { country: "Honduras", code: 504 },
    { country: "Hong Kong", code: 852 },
    { country: "Hungary", code: 36 },
    { country: "Iceland", code: 354 },
    { country: "India", code: 91 },
    { country: "Indonesia", code: 62 },
    { country: "Iran", code: 98 },
    { country: "Iraq", code: 964 },
    { country: "Ireland", code: 353 },
    { country: "Isle of Man", code: "44-1624" },
    { country: "Israel", code: 972 },
    { country: "Italy", code: 39 },
    { country: "Ivory Coast", code: 225 },
    { country: "Jamaica", code: "1-876" },
    { country: "Japan", code: 81 },
    { country: "Jersey", code: "44-1534" },
    { country: "Jordan", code: 962 },
    { country: "Kazakhstan", code: 7 },
    { country: "Kenya", code: 254 },
    { country: "Kiribati", code: 686 },
    { country: "Kosovo", code: 383 },
    { country: "Kuwait", code: 965 },
    { country: "Kyrgyzstan", code: 996 },
    { country: "Laos", code: 856 },
    { country: "Latvia", code: 371 },
    { country: "Lebanon", code: 961 },
    { country: "Lesotho", code: 266 },
    { country: "Liberia", code: 231 },
    { country: "Libya", code: 218 },
    { country: "Liechtenstein", code: 423 },
    { country: "Lithuania", code: 370 },
    { country: "Luxembourg", code: 352 },
    { country: "Macau", code: 853 },
    { country: "Macedonia", code: 389 },
    { country: "Madagascar", code: 261 },
    { country: "Malawi", code: 265 },
    { country: "Malaysia", code: 60 },
    { country: "Maldives", code: 960 },
    { country: "Mali", code: 223 },
    { country: "Malta", code: 356 },
    { country: "Marshall Islands", code: 692 },
    { country: "Mauritania", code: 222 },
    { country: "Mauritius", code: 230 },
    { country: "Mayotte", code: 262 },
    { country: "Mexico", code: 52 },
    { country: "Micronesia", code: 691 },
    { country: "Moldova", code: 373 },
    { country: "Monaco", code: 377 },
    { country: "Mongolia", code: 976 },
    { country: "Montenegro", code: 382 },
    { country: "Montserrat", code: "1-664" },
    { country: "Morocco", code: 212 },
    { country: "Mozambique", code: 258 },
    { country: "Myanmar", code: 95 },
    { country: "Namibia", code: 264 },
    { country: "Nauru", code: 674 },
    { country: "Nepal", code: 977 },
    { country: "Netherlands", code: 31 },
    { country: "Netherlands Antilles", code: 599 },
    { country: "New Caledonia", code: 687 },
    { country: "New Zealand", code: 64 },
    { country: "Nicaragua", code: 505 },
    { country: "Niger", code: 227 },
    { country: "Nigeria", code: 234 },
    { country: "Niue", code: 683 },
    { country: "North Korea", code: 850 },
    { country: "Northern Mariana Islands", code: "1-670" },
    { country: "Norway", code: 47 },
    { country: "Oman", code: 968 },
    { country: "Pakistan", code: 92 },
    { country: "Palau", code: 680 },
    { country: "Palestine", code: 970 },
    { country: "Panama", code: 507 },
    { country: "Papua New Guinea", code: 675 },
    { country: "Paraguay", code: 595 },
    { country: "Peru", code: 51 },
    { country: "Philippines", code: 63 },
    { country: "Pitcairn", code: 64 },
    { country: "Poland", code: 48 },
    { country: "Portugal", code: 351 },
    { country: "Puerto Rico", code: "1-787, 1-939" },
    { country: "Qatar", code: 974 },
    { country: "Republic of the Congo", code: 242 },
    { country: "Reunion", code: 262 },
    { country: "Romania", code: 40 },
    { country: "Russia", code: 7 },
    { country: "Rwanda", code: 250 },
    { country: "Saint Barthelemy", code: 590 },
    { country: "Saint Helena", code: 290 },
    { country: "Saint Kitts and Nevis", code: "1-869" },
    { country: "Saint Lucia", code: "1-758" },
    { country: "Saint Martin", code: 590 },
    { country: "Saint Pierre and Miquelon", code: 508 },
    { country: "Saint Vincent and the Grenadines", code: "1-784" },
    { country: "Samoa", code: 685 },
    { country: "San Marino", code: 378 },
    { country: "Sao Tome and Principe", code: 239 },
    { country: "Saudi Arabia", code: 966 },
    { country: "Senegal", code: 221 },
    { country: "Serbia", code: 381 },
    { country: "Seychelles", code: 248 },
    { country: "Sierra Leone", code: 232 },
    { country: "Singapore", code: 65 },
    { country: "Sint Maarten", code: "1-721" },
    { country: "Slovakia", code: 421 },
    { country: "Slovenia", code: 386 },
    { country: "Solomon Islands", code: 677 },
    { country: "Somalia", code: 252 },
    { country: "South Africa", code: 27 },
    { country: "South Korea", code: 82 },
    { country: "South Sudan", code: 211 },
    { country: "Spain", code: 34 },
    { country: "Sri Lanka", code: 94 },
    { country: "Sudan", code: 249 },
    { country: "Suriname", code: 597 },
    { country: "Svalbard and Jan Mayen", code: 47 },
    { country: "Swaziland", code: 268 },
    { country: "Sweden", code: 46 },
    { country: "Switzerland", code: 41 },
    { country: "Syria", code: 963 },
    { country: "Taiwan", code: 886 },
    { country: "Tajikistan", code: 992 },
    { country: "Tanzania", code: 255 },
    { country: "Thailand", code: 66 },
    { country: "Togo", code: 228 },
    { country: "Tokelau", code: 690 },
    { country: "Tonga", code: 676 },
    { country: "Trinidad and Tobago", code: "1-868" },
    { country: "Tunisia", code: 216 },
    { country: "Turkey", code: 90 },
    { country: "Turkmenistan", code: 993 },
    { country: "Turks and Caicos Islands", code: "1-649" },
    { country: "Tuvalu", code: 688 },
    { country: "U.S. Virgin Islands", code: "1-340" },
    { country: "Uganda", code: 256 },
    { country: "Ukraine", code: 380 },
    { country: "United Arab Emirates", code: 971 },
    { country: "United Kingdom", code: 44 },
    { country: "United States", code: 1 },
    { country: "Uruguay", code: 598 },
    { country: "Uzbekistan", code: 998 },
    { country: "Vanuatu", code: 678 },
    { country: "Vatican", code: 379 },
    { country: "Venezuela", code: 58 },
    { country: "Vietnam", code: 84 },
    { country: "Wallis and Futuna", code: 681 },
    { country: "Western Sahara", code: 212 },
    { country: "Yemen", code: 967 },
    { country: "Zambia", code: 260 },
    { country: "Zimbabwe", code: 263 },
  ];
  if (user) {
    const cont = country_data.find(
      (entry) => entry.country.toLowerCase() === country.toLowerCase()
    );
    logger.info(
      `${ip}: API /api/v1/extra/get/code/bycountry responnded with success `
    );
    return res
      .status(200)
      .send({ data: cont.code, message: "Code Retrived Succesfull" });
  } else {
    logger.error(
      `${ip}: API /api/v1/extra/get/code/bycountry responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get countries code
//@route GET /api/v1/extra/get/code/country
//@access Private: Login Required
const getCodeCountry = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  const country_data = [
    { country: "Afghanistan", code: 93 },
    { country: "Albania", code: 355 },
    { country: "Algeria", code: 213 },
    { country: "American Samoa", code: "1-684" },
    { country: "Andorra", code: 376 },
    { country: "Angola", code: 244 },
    { country: "Anguilla", code: "1-264" },
    { country: "Antarctica", code: 672 },
    { country: "Antigua and Barbuda", code: "1-268" },
    { country: "Argentina", code: 54 },
    { country: "Armenia", code: 374 },
    { country: "Aruba", code: 297 },
    { country: "Australia", code: 61 },
    { country: "Austria", code: 43 },
    { country: "Azerbaijan", code: 994 },
    { country: "Bahamas", code: "1-242" },
    { country: "Bahrain", code: 973 },
    { country: "Bangladesh", code: 880 },
    { country: "Barbados", code: "1-246" },
    { country: "Belarus", code: 375 },
    { country: "Belgium", code: 32 },
    { country: "Belize", code: 501 },
    { country: "Benin", code: 229 },
    { country: "Bermuda", code: "1-441" },
    { country: "Bhutan", code: 975 },
    { country: "Bolivia", code: 591 },
    { country: "Bosnia and Herzegovina", code: 387 },
    { country: "Botswana", code: 267 },
    { country: "Brazil", code: 55 },
    { country: "British Indian Ocean Territory", code: 246 },
    { country: "British Virgin Islands", code: "1-284" },
    { country: "Brunei", code: 673 },
    { country: "Bulgaria", code: 359 },
    { country: "Burkina Faso", code: 226 },
    { country: "Burundi", code: 257 },
    { country: "Cambodia", code: 855 },
    { country: "Cameroon", code: 237 },
    { country: "Canada", code: 1 },
    { country: "Cape Verde", code: 238 },
    { country: "Cayman Islands", code: "1-345" },
    { country: "Central African Republic", code: 236 },
    { country: "Chad", code: 235 },
    { country: "Chile", code: 56 },
    { country: "China", code: 86 },
    { country: "Christmas Island", code: 61 },
    { country: "Cocos Islands", code: 61 },
    { country: "Colombia", code: 57 },
    { country: "Comoros", code: 269 },
    { country: "Cook Islands", code: 682 },
    { country: "Costa Rica", code: 506 },
    { country: "Croatia", code: 385 },
    { country: "Cuba", code: 53 },
    { country: "Curacao", code: 599 },
    { country: "Cyprus", code: 357 },
    { country: "Czech Republic", code: 420 },
    { country: "Democratic Republic of the Congo", code: 243 },
    { country: "Denmark", code: 45 },
    { country: "Djibouti", code: 253 },
    { country: "Dominica", code: "1-767" },
    { country: "Dominican Republic", code: "1-809, 1-829, 1-849" },
    { country: "East Timor", code: 670 },
    { country: "Ecuador", code: 593 },
    { country: "Egypt", code: 20 },
    { country: "El Salvador", code: 503 },
    { country: "Equatorial Guinea", code: 240 },
    { country: "Eritrea", code: 291 },
    { country: "Estonia", code: 372 },
    { country: "Ethiopia", code: 251 },
    { country: "Falkland Islands", code: 500 },
    { country: "Faroe Islands", code: 298 },
    { country: "Fiji", code: 679 },
    { country: "Finland", code: 358 },
    { country: "France", code: 33 },
    { country: "French Polynesia", code: 689 },
    { country: "Gabon", code: 241 },
    { country: "Gambia", code: 220 },
    { country: "Georgia", code: 995 },
    { country: "Germany", code: 49 },
    { country: "Ghana", code: 233 },
    { country: "Gibraltar", code: 350 },
    { country: "Greece", code: 30 },
    { country: "Greenland", code: 299 },
    { country: "Grenada", code: "1-473" },
    { country: "Guam", code: "1-671" },
    { country: "Guatemala", code: 502 },
    { country: "Guernsey", code: "44-1481" },
    { country: "Guinea", code: 224 },
    { country: "Guinea-Bissau", code: 245 },
    { country: "Guyana", code: 592 },
    { country: "Haiti", code: 509 },
    { country: "Honduras", code: 504 },
    { country: "Hong Kong", code: 852 },
    { country: "Hungary", code: 36 },
    { country: "Iceland", code: 354 },
    { country: "India", code: 91 },
    { country: "Indonesia", code: 62 },
    { country: "Iran", code: 98 },
    { country: "Iraq", code: 964 },
    { country: "Ireland", code: 353 },
    { country: "Isle of Man", code: "44-1624" },
    { country: "Israel", code: 972 },
    { country: "Italy", code: 39 },
    { country: "Ivory Coast", code: 225 },
    { country: "Jamaica", code: "1-876" },
    { country: "Japan", code: 81 },
    { country: "Jersey", code: "44-1534" },
    { country: "Jordan", code: 962 },
    { country: "Kazakhstan", code: 7 },
    { country: "Kenya", code: 254 },
    { country: "Kiribati", code: 686 },
    { country: "Kosovo", code: 383 },
    { country: "Kuwait", code: 965 },
    { country: "Kyrgyzstan", code: 996 },
    { country: "Laos", code: 856 },
    { country: "Latvia", code: 371 },
    { country: "Lebanon", code: 961 },
    { country: "Lesotho", code: 266 },
    { country: "Liberia", code: 231 },
    { country: "Libya", code: 218 },
    { country: "Liechtenstein", code: 423 },
    { country: "Lithuania", code: 370 },
    { country: "Luxembourg", code: 352 },
    { country: "Macau", code: 853 },
    { country: "Macedonia", code: 389 },
    { country: "Madagascar", code: 261 },
    { country: "Malawi", code: 265 },
    { country: "Malaysia", code: 60 },
    { country: "Maldives", code: 960 },
    { country: "Mali", code: 223 },
    { country: "Malta", code: 356 },
    { country: "Marshall Islands", code: 692 },
    { country: "Mauritania", code: 222 },
    { country: "Mauritius", code: 230 },
    { country: "Mayotte", code: 262 },
    { country: "Mexico", code: 52 },
    { country: "Micronesia", code: 691 },
    { country: "Moldova", code: 373 },
    { country: "Monaco", code: 377 },
    { country: "Mongolia", code: 976 },
    { country: "Montenegro", code: 382 },
    { country: "Montserrat", code: "1-664" },
    { country: "Morocco", code: 212 },
    { country: "Mozambique", code: 258 },
    { country: "Myanmar", code: 95 },
    { country: "Namibia", code: 264 },
    { country: "Nauru", code: 674 },
    { country: "Nepal", code: 977 },
    { country: "Netherlands", code: 31 },
    { country: "Netherlands Antilles", code: 599 },
    { country: "New Caledonia", code: 687 },
    { country: "New Zealand", code: 64 },
    { country: "Nicaragua", code: 505 },
    { country: "Niger", code: 227 },
    { country: "Nigeria", code: 234 },
    { country: "Niue", code: 683 },
    { country: "North Korea", code: 850 },
    { country: "Northern Mariana Islands", code: "1-670" },
    { country: "Norway", code: 47 },
    { country: "Oman", code: 968 },
    { country: "Pakistan", code: 92 },
    { country: "Palau", code: 680 },
    { country: "Palestine", code: 970 },
    { country: "Panama", code: 507 },
    { country: "Papua New Guinea", code: 675 },
    { country: "Paraguay", code: 595 },
    { country: "Peru", code: 51 },
    { country: "Philippines", code: 63 },
    { country: "Pitcairn", code: 64 },
    { country: "Poland", code: 48 },
    { country: "Portugal", code: 351 },
    { country: "Puerto Rico", code: "1-787, 1-939" },
    { country: "Qatar", code: 974 },
    { country: "Republic of the Congo", code: 242 },
    { country: "Reunion", code: 262 },
    { country: "Romania", code: 40 },
    { country: "Russia", code: 7 },
    { country: "Rwanda", code: 250 },
    { country: "Saint Barthelemy", code: 590 },
    { country: "Saint Helena", code: 290 },
    { country: "Saint Kitts and Nevis", code: "1-869" },
    { country: "Saint Lucia", code: "1-758" },
    { country: "Saint Martin", code: 590 },
    { country: "Saint Pierre and Miquelon", code: 508 },
    { country: "Saint Vincent and the Grenadines", code: "1-784" },
    { country: "Samoa", code: 685 },
    { country: "San Marino", code: 378 },
    { country: "Sao Tome and Principe", code: 239 },
    { country: "Saudi Arabia", code: 966 },
    { country: "Senegal", code: 221 },
    { country: "Serbia", code: 381 },
    { country: "Seychelles", code: 248 },
    { country: "Sierra Leone", code: 232 },
    { country: "Singapore", code: 65 },
    { country: "Sint Maarten", code: "1-721" },
    { country: "Slovakia", code: 421 },
    { country: "Slovenia", code: 386 },
    { country: "Solomon Islands", code: 677 },
    { country: "Somalia", code: 252 },
    { country: "South Africa", code: 27 },
    { country: "South Korea", code: 82 },
    { country: "South Sudan", code: 211 },
    { country: "Spain", code: 34 },
    { country: "Sri Lanka", code: 94 },
    { country: "Sudan", code: 249 },
    { country: "Suriname", code: 597 },
    { country: "Svalbard and Jan Mayen", code: 47 },
    { country: "Swaziland", code: 268 },
    { country: "Sweden", code: 46 },
    { country: "Switzerland", code: 41 },
    { country: "Syria", code: 963 },
    { country: "Taiwan", code: 886 },
    { country: "Tajikistan", code: 992 },
    { country: "Tanzania", code: 255 },
    { country: "Thailand", code: 66 },
    { country: "Togo", code: 228 },
    { country: "Tokelau", code: 690 },
    { country: "Tonga", code: 676 },
    { country: "Trinidad and Tobago", code: "1-868" },
    { country: "Tunisia", code: 216 },
    { country: "Turkey", code: 90 },
    { country: "Turkmenistan", code: 993 },
    { country: "Turks and Caicos Islands", code: "1-649" },
    { country: "Tuvalu", code: 688 },
    { country: "U.S. Virgin Islands", code: "1-340" },
    { country: "Uganda", code: 256 },
    { country: "Ukraine", code: 380 },
    { country: "United Arab Emirates", code: 971 },
    { country: "United Kingdom", code: 44 },
    { country: "United States", code: 1 },
    { country: "Uruguay", code: 598 },
    { country: "Uzbekistan", code: 998 },
    { country: "Vanuatu", code: 678 },
    { country: "Vatican", code: 379 },
    { country: "Venezuela", code: 58 },
    { country: "Vietnam", code: 84 },
    { country: "Wallis and Futuna", code: 681 },
    { country: "Western Sahara", code: 212 },
    { country: "Yemen", code: 967 },
    { country: "Zambia", code: 260 },
    { country: "Zimbabwe", code: 263 },
  ];
  if (user) {
    const countryNames = country_data.map((country) => country.country);
    logger.info(
      `${ip}: API /api/v1/extra/get/code/countries responnded with Countries retrived `
    );

    return res.status(200).send({
      data: countryNames,
      message: "Code Countries Retrived Succesfull",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/extra/get/code/countries responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get years
//@route GET /api/v1/extra/get/years
//@access Private: Login Required
const getYears = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  const years = [
    "2000",
    "2001",
    "2002",
    "2003",
    "2004",
    "2005",
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
    "2033",
    "2034",
    "2035",
    "2036",
    "2037",
    "2038",
    "2039",
    "2040",
    "2041",
    "2042",
    "2043",
    "2044",
    "2045",
    "2046",
    "2047",
    "2048",
    "2049",
    "2050",
  ];
  if (user) {
    return res.status(200).send({ data: years, message: "Years Retrived" });
  } else {
    logger.error(`${ip}: API /api/v1/extra/get/years years retrived`);
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get months
//@route GET /api/v1/extra/get/months
//@access Private: Login Required
const getMonths = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  const months = [
    { name: "January", code: 1 },
    { name: "February", code: 2 },
    { name: "March", code: 3 },
    { name: "April", code: 4 },
    { name: "May", code: 5 },
    { name: "June", code: 6 },
    { name: "July", code: 7 },
    { name: "August", code: 8 },
    { name: "September", code: 9 },
    { name: "October", code: 10 },
    { name: "November", code: 11 },
    { name: "December", code: 12 },
  ];
  if (user) {
    return res.status(200).send({ data: months, message: "Months Retrived" });
  } else {
    logger.error(`${ip}: API /api/v1/extra/get/months months retrived`);
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get countries
//@route GET /api/v1/extra/get/countries
//@access Private: Login Required
const getCountries = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  const countries = [
    { name: "Afghanistan", code: "AF" },
    { name: "land Islands", code: "AX" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "American Samoa", code: "AS" },
    { name: "AndorrA", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Anguilla", code: "AI" },
    { name: "Antarctica", code: "AQ" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Aruba", code: "AW" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bermuda", code: "BM" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Bouvet Island", code: "BV" },
    { name: "Brazil", code: "BR" },
    { name: "British Indian Ocean Territory", code: "IO" },
    { name: "Brunei Darussalam", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Cape Verde", code: "CV" },
    { name: "Cayman Islands", code: "KY" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Christmas Island", code: "CX" },
    { name: "Cocos (Keeling) Islands", code: "CC" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Congo, The Democratic Republic of the", code: "CD" },
    { name: "Cook Islands", code: "CK" },
    { name: "Costa Rica", code: "CR" },
    { name: 'Cote D"Ivoire', code: "CI" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Ethiopia", code: "ET" },
    { name: "Falkland Islands (Malvinas)", code: "FK" },
    { name: "Faroe Islands", code: "FO" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "French Guiana", code: "GF" },
    { name: "French Polynesia", code: "PF" },
    { name: "French Southern Territories", code: "TF" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Gibraltar", code: "GI" },
    { name: "Greece", code: "GR" },
    { name: "Greenland", code: "GL" },
    { name: "Grenada", code: "GD" },
    { name: "Guadeloupe", code: "GP" },
    { name: "Guam", code: "GU" },
    { name: "Guatemala", code: "GT" },
    { name: "Guernsey", code: "GG" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Heard Island and Mcdonald Islands", code: "HM" },
    { name: "Holy See (Vatican City State)", code: "VA" },
    { name: "Honduras", code: "HN" },
    { name: "Hong Kong", code: "HK" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran, Islamic Republic Of", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Isle of Man", code: "IM" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jersey", code: "JE" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: 'Korea, Democratic People"S Republic of', code: "KP" },
    { name: "Korea, Republic of", code: "KR" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: 'Lao People"S Democratic Republic', code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libyan Arab Jamahiriya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Macao", code: "MO" },
    { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Martinique", code: "MQ" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mayotte", code: "YT" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia, Federated States of", code: "FM" },
    { name: "Moldova, Republic of", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montenegro", code: "ME" },
    { name: "Montserrat", code: "MS" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands", code: "NL" },
    { name: "Netherlands Antilles", code: "AN" },
    { name: "New Caledonia", code: "NC" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "Niue", code: "NU" },
    { name: "Norfolk Island", code: "NF" },
    { name: "Northern Mariana Islands", code: "MP" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Palestinian Territory, Occupied", code: "PS" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Pitcairn", code: "PN" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Puerto Rico", code: "PR" },
    { name: "Qatar", code: "QA" },
    { name: "Reunion", code: "RE" },
    { name: "Romania", code: "RO" },
    { name: "Russian Federation", code: "RU" },
    { name: "RWANDA", code: "RW" },
    { name: "Saint Helena", code: "SH" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Pierre and Miquelon", code: "PM" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia", code: "RS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Georgia and the South Sandwich Islands", code: "GS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Svalbard and Jan Mayen", code: "SJ" },
    { name: "Swaziland", code: "SZ" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syrian Arab Republic", code: "SY" },
    { name: "Taiwan", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania, United Republic of", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Togo", code: "TG" },
    { name: "Tokelau", code: "TK" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Turks and Caicos Islands", code: "TC" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    { name: "United States Minor Outlying Islands", code: "UM" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Venezuela", code: "VE" },
    { name: "Viet Nam", code: "VN" },
    { name: "Virgin Islands, British", code: "VG" },
    { name: "Virgin Islands, U.S.", code: "VI" },
    { name: "Wallis and Futuna", code: "WF" },
    { name: "Western Sahara", code: "EH" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" },
  ];
  if (user) {
    return res
      .status(200)
      .send({ data: countries, message: "Countries Retrived" });
  } else {
    logger.error(`${ip}: API /api/v1/extra/get/countries countries retrived`);
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get countries and continent
//@route GET /api/v1/extra/get/count/continent
//@access Private: Login Required
const getCountContinent = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  const countries = [
    {
      country: "Afghanistan",
      continent: "Asia",
    },
    {
      country: "Albania",
      continent: "Europe",
    },
    {
      country: "Algeria",
      continent: "Africa",
    },
    {
      country: "American Samoa",
      continent: "Oceania",
    },
    {
      country: "Andorra",
      continent: "Europe",
    },
    {
      country: "Angola",
      continent: "Africa",
    },
    {
      country: "Anguilla",
      continent: "North America",
    },
    {
      country: "Antarctica",
      continent: "Antarctica",
    },
    {
      country: "Antigua and Barbuda",
      continent: "North America",
    },
    {
      country: "Argentina",
      continent: "South America",
    },
    {
      country: "Armenia",
      continent: "Asia",
    },
    {
      country: "Aruba",
      continent: "North America",
    },
    {
      country: "Australia",
      continent: "Oceania",
    },
    {
      country: "Austria",
      continent: "Europe",
    },
    {
      country: "Azerbaijan",
      continent: "Asia",
    },
    {
      country: "Bahamas",
      continent: "North America",
    },
    {
      country: "Bahrain",
      continent: "Asia",
    },
    {
      country: "Bangladesh",
      continent: "Asia",
    },
    {
      country: "Barbados",
      continent: "North America",
    },
    {
      country: "Belarus",
      continent: "Europe",
    },
    {
      country: "Belgium",
      continent: "Europe",
    },
    {
      country: "Belize",
      continent: "North America",
    },
    {
      country: "Benin",
      continent: "Africa",
    },
    {
      country: "Bermuda",
      continent: "North America",
    },
    {
      country: "Bhutan",
      continent: "Asia",
    },
    {
      country: "Bolivia",
      continent: "South America",
    },
    {
      country: "Bosnia and Herzegovina",
      continent: "Europe",
    },
    {
      country: "Botswana",
      continent: "Africa",
    },
    {
      country: "Bouvet Island",
      continent: "Antarctica",
    },
    {
      country: "Brazil",
      continent: "South America",
    },
    {
      country: "British Indian Ocean Territory",
      continent: "Africa",
    },
    {
      country: "Brunei",
      continent: "Asia",
    },
    {
      country: "Bulgaria",
      continent: "Europe",
    },
    {
      country: "Burkina Faso",
      continent: "Africa",
    },
    {
      country: "Burundi",
      continent: "Africa",
    },
    {
      country: "Cambodia",
      continent: "Asia",
    },
    {
      country: "Cameroon",
      continent: "Africa",
    },
    {
      country: "Canada",
      continent: "North America",
    },
    {
      country: "Cape Verde",
      continent: "Africa",
    },
    {
      country: "Cayman Islands",
      continent: "North America",
    },
    {
      country: "Central African Republic",
      continent: "Africa",
    },
    {
      country: "Chad",
      continent: "Africa",
    },
    {
      country: "Chile",
      continent: "South America",
    },
    {
      country: "China",
      continent: "Asia",
    },
    {
      country: "Christmas Island",
      continent: "Oceania",
    },
    {
      country: "Cocos (Keeling) Islands",
      continent: "Oceania",
    },
    {
      country: "Colombia",
      continent: "South America",
    },
    {
      country: "Comoros",
      continent: "Africa",
    },
    {
      country: "Congo",
      continent: "Africa",
    },
    {
      country: "Cook Islands",
      continent: "Oceania",
    },
    {
      country: "Costa Rica",
      continent: "North America",
    },
    {
      country: "Croatia",
      continent: "Europe",
    },
    {
      country: "Cuba",
      continent: "North America",
    },
    {
      country: "Cyprus",
      continent: "Asia",
    },
    {
      country: "Czech Republic",
      continent: "Europe",
    },
    {
      country: "Denmark",
      continent: "Europe",
    },
    {
      country: "Djibouti",
      continent: "Africa",
    },
    {
      country: "Dominica",
      continent: "North America",
    },
    {
      country: "Dominican Republic",
      continent: "North America",
    },
    {
      country: "East Timor",
      continent: "Asia",
    },
    {
      country: "Ecuador",
      continent: "South America",
    },
    {
      country: "Egypt",
      continent: "Africa",
    },
    {
      country: "El Salvador",
      continent: "North America",
    },
    {
      country: "England",
      continent: "Europe",
    },
    {
      country: "Equatorial Guinea",
      continent: "Africa",
    },
    {
      country: "Eritrea",
      continent: "Africa",
    },
    {
      country: "Estonia",
      continent: "Europe",
    },
    {
      country: "Ethiopia",
      continent: "Africa",
    },
    {
      country: "Falkland Islands",
      continent: "South America",
    },
    {
      country: "Faroe Islands",
      continent: "Europe",
    },
    {
      country: "Fiji Islands",
      continent: "Oceania",
    },
    {
      country: "Finland",
      continent: "Europe",
    },
    {
      country: "France",
      continent: "Europe",
    },
    {
      country: "French Guiana",
      continent: "South America",
    },
    {
      country: "French Polynesia",
      continent: "Oceania",
    },
    {
      country: "French Southern territories",
      continent: "Antarctica",
    },
    {
      country: "Gabon",
      continent: "Africa",
    },
    {
      country: "Gambia",
      continent: "Africa",
    },
    {
      country: "Georgia",
      continent: "Asia",
    },
    {
      country: "Germany",
      continent: "Europe",
    },
    {
      country: "Ghana",
      continent: "Africa",
    },
    {
      country: "Gibraltar",
      continent: "Europe",
    },
    {
      country: "Greece",
      continent: "Europe",
    },
    {
      country: "Greenland",
      continent: "North America",
    },
    {
      country: "Grenada",
      continent: "North America",
    },
    {
      country: "Guadeloupe",
      continent: "North America",
    },
    {
      country: "Guam",
      continent: "Oceania",
    },
    {
      country: "Guatemala",
      continent: "North America",
    },
    {
      country: "Guinea",
      continent: "Africa",
    },
    {
      country: "Guinea-Bissau",
      continent: "Africa",
    },
    {
      country: "Guyana",
      continent: "South America",
    },
    {
      country: "Haiti",
      continent: "North America",
    },
    {
      country: "Heard Island and McDonald Islands",
      continent: "Antarctica",
    },
    {
      country: "Holy See (Vatican City State)",
      continent: "Europe",
    },
    {
      country: "Honduras",
      continent: "North America",
    },
    {
      country: "Hong Kong",
      continent: "Asia",
    },
    {
      country: "Hungary",
      continent: "Europe",
    },
    {
      country: "Iceland",
      continent: "Europe",
    },
    {
      country: "India",
      continent: "Asia",
    },
    {
      country: "Indonesia",
      continent: "Asia",
    },
    {
      country: "Iran",
      continent: "Asia",
    },
    {
      country: "Iraq",
      continent: "Asia",
    },
    {
      country: "Ireland",
      continent: "Europe",
    },
    {
      country: "Israel",
      continent: "Asia",
    },
    {
      country: "Italy",
      continent: "Europe",
    },
    {
      country: "Ivory Coast",
      continent: "Africa",
    },
    {
      country: "Jamaica",
      continent: "North America",
    },
    {
      country: "Japan",
      continent: "Asia",
    },
    {
      country: "Jordan",
      continent: "Asia",
    },
    {
      country: "Kazakhstan",
      continent: "Asia",
    },
    {
      country: "Kenya",
      continent: "Africa",
    },
    {
      country: "Kiribati",
      continent: "Oceania",
    },
    {
      country: "Kuwait",
      continent: "Asia",
    },
    {
      country: "Kyrgyzstan",
      continent: "Asia",
    },
    {
      country: "Laos",
      continent: "Asia",
    },
    {
      country: "Latvia",
      continent: "Europe",
    },
    {
      country: "Lebanon",
      continent: "Asia",
    },
    {
      country: "Lesotho",
      continent: "Africa",
    },
    {
      country: "Liberia",
      continent: "Africa",
    },
    {
      country: "Libyan Arab Jamahiriya",
      continent: "Africa",
    },
    {
      country: "Liechtenstein",
      continent: "Europe",
    },
    {
      country: "Lithuania",
      continent: "Europe",
    },
    {
      country: "Luxembourg",
      continent: "Europe",
    },
    {
      country: "Macao",
      continent: "Asia",
    },
    {
      country: "North Macedonia",
      continent: "Europe",
    },
    {
      country: "Madagascar",
      continent: "Africa",
    },
    {
      country: "Malawi",
      continent: "Africa",
    },
    {
      country: "Malaysia",
      continent: "Asia",
    },
    {
      country: "Maldives",
      continent: "Asia",
    },
    {
      country: "Mali",
      continent: "Africa",
    },
    {
      country: "Malta",
      continent: "Europe",
    },
    {
      country: "Marshall Islands",
      continent: "Oceania",
    },
    {
      country: "Martinique",
      continent: "North America",
    },
    {
      country: "Mauritania",
      continent: "Africa",
    },
    {
      country: "Mauritius",
      continent: "Africa",
    },
    {
      country: "Mayotte",
      continent: "Africa",
    },
    {
      country: "Mexico",
      continent: "North America",
    },
    {
      country: "Micronesia, Federated States of",
      continent: "Oceania",
    },
    {
      country: "Moldova",
      continent: "Europe",
    },
    {
      country: "Monaco",
      continent: "Europe",
    },
    {
      country: "Mongolia",
      continent: "Asia",
    },
    {
      country: "Montenegro",
      continent: "Europe",
    },
    {
      country: "Montserrat",
      continent: "North America",
    },
    {
      country: "Morocco",
      continent: "Africa",
    },
    {
      country: "Mozambique",
      continent: "Africa",
    },
    {
      country: "Myanmar",
      continent: "Asia",
    },
    {
      country: "Namibia",
      continent: "Africa",
    },
    {
      country: "Nauru",
      continent: "Oceania",
    },
    {
      country: "Nepal",
      continent: "Asia",
    },
    {
      country: "Netherlands",
      continent: "Europe",
    },
    {
      country: "Netherlands Antilles",
      continent: "North America",
    },
    {
      country: "New Caledonia",
      continent: "Oceania",
    },
    {
      country: "New Zealand",
      continent: "Oceania",
    },
    {
      country: "Nicaragua",
      continent: "North America",
    },
    {
      country: "Niger",
      continent: "Africa",
    },
    {
      country: "Nigeria",
      continent: "Africa",
    },
    {
      country: "Niue",
      continent: "Oceania",
    },
    {
      country: "Norfolk Island",
      continent: "Oceania",
    },
    {
      country: "North Korea",
      continent: "Asia",
    },
    {
      country: "Northern Ireland",
      continent: "Europe",
    },
    {
      country: "Northern Mariana Islands",
      continent: "Oceania",
    },
    {
      country: "Norway",
      continent: "Europe",
    },
    {
      country: "Oman",
      continent: "Asia",
    },
    {
      country: "Pakistan",
      continent: "Asia",
    },
    {
      country: "Palau",
      continent: "Oceania",
    },
    {
      country: "Palestine",
      continent: "Asia",
    },
    {
      country: "Panama",
      continent: "North America",
    },
    {
      country: "Papua New Guinea",
      continent: "Oceania",
    },
    {
      country: "Paraguay",
      continent: "South America",
    },
    {
      country: "Peru",
      continent: "South America",
    },
    {
      country: "Philippines",
      continent: "Asia",
    },
    {
      country: "Pitcairn",
      continent: "Oceania",
    },
    {
      country: "Poland",
      continent: "Europe",
    },
    {
      country: "Portugal",
      continent: "Europe",
    },
    {
      country: "Puerto Rico",
      continent: "North America",
    },
    {
      country: "Qatar",
      continent: "Asia",
    },
    {
      country: "Reunion",
      continent: "Africa",
    },
    {
      country: "Romania",
      continent: "Europe",
    },
    {
      country: "Russian Federation",
      continent: "Europe",
    },
    {
      country: "Rwanda",
      continent: "Africa",
    },
    {
      country: "Saint Helena",
      continent: "Africa",
    },
    {
      country: "Saint Kitts and Nevis",
      continent: "North America",
    },
    {
      country: "Saint Lucia",
      continent: "North America",
    },
    {
      country: "Saint Pierre and Miquelon",
      continent: "North America",
    },
    {
      country: "Saint Vincent and the Grenadines",
      continent: "North America",
    },
    {
      country: "Samoa",
      continent: "Oceania",
    },
    {
      country: "San Marino",
      continent: "Europe",
    },
    {
      country: "Sao Tome and Principe",
      continent: "Africa",
    },
    {
      country: "Saudi Arabia",
      continent: "Asia",
    },
    {
      country: "Scotland",
      continent: "Europe",
    },
    {
      country: "Senegal",
      continent: "Africa",
    },
    {
      country: "Serbia",
      continent: "Europe",
    },
    {
      country: "Seychelles",
      continent: "Africa",
    },
    {
      country: "Sierra Leone",
      continent: "Africa",
    },
    {
      country: "Singapore",
      continent: "Asia",
    },
    {
      country: "Slovakia",
      continent: "Europe",
    },
    {
      country: "Slovenia",
      continent: "Europe",
    },
    {
      country: "Solomon Islands",
      continent: "Oceania",
    },
    {
      country: "Somalia",
      continent: "Africa",
    },
    {
      country: "South Africa",
      continent: "Africa",
    },
    {
      country: "South Georgia and the South Sandwich Islands",
      continent: "Antarctica",
    },
    {
      country: "South Korea",
      continent: "Asia",
    },
    {
      country: "South Sudan",
      continent: "Africa",
    },
    {
      country: "Spain",
      continent: "Europe",
    },
    {
      country: "Sri Lanka",
      continent: "Asia",
    },
    {
      country: "Sudan",
      continent: "Africa",
    },
    {
      country: "Suriname",
      continent: "South America",
    },
    {
      country: "Svalbard and Jan Mayen",
      continent: "Europe",
    },
    {
      country: "Swaziland",
      continent: "Africa",
    },
    {
      country: "Sweden",
      continent: "Europe",
    },
    {
      country: "Switzerland",
      continent: "Europe",
    },
    {
      country: "Syria",
      continent: "Asia",
    },

    {
      country: "Taiwan",
      continent: "Asia",
    },
    {
      country: "Tajikistan",
      continent: "Asia",
    },
    {
      country: "Tanzania",
      continent: "Africa",
    },
    {
      country: "Thailand",
      continent: "Asia",
    },
    {
      country: "The Democratic Republic of Congo",
      continent: "Africa",
    },
    {
      country: "Togo",
      continent: "Africa",
    },
    {
      country: "Tokelau",
      continent: "Oceania",
    },
    {
      country: "Tonga",
      continent: "Oceania",
    },
    {
      country: "Trinidad and Tobago",
      continent: "North America",
    },
    {
      country: "Tunisia",
      continent: "Africa",
    },
    {
      country: "Turkey",
      continent: "Asia",
    },
    {
      country: "Turkmenistan",
      continent: "Asia",
    },
    {
      country: "Turks and Caicos Islands",
      continent: "North America",
    },
    {
      country: "Tuvalu",
      continent: "Oceania",
    },
    {
      country: "Uganda",
      continent: "Africa",
    },
    {
      country: "Ukraine",
      continent: "Europe",
    },
    {
      country: "United Arab Emirates",
      continent: "Asia",
    },
    {
      country: "United Kingdom",
      continent: "Europe",
    },
    {
      country: "United States",
      continent: "North America",
    },
    {
      country: "United States Minor Outlying Islands",
      continent: "Oceania",
    },
    {
      country: "Uruguay",
      continent: "South America",
    },
    {
      country: "Uzbekistan",
      continent: "Asia",
    },
    {
      country: "Vanuatu",
      continent: "Oceania",
    },
    {
      country: "Venezuela",
      continent: "South America",
    },
    {
      country: "Vietnam",
      continent: "Asia",
    },
    {
      country: "Virgin Islands, British",
      continent: "North America",
    },
    {
      country: "Virgin Islands, U.S.",
      continent: "North America",
    },
    {
      country: "Wales",
      continent: "Europe",
    },
    {
      country: "Wallis and Futuna",
      continent: "Oceania",
    },
    {
      country: "Western Sahara",
      continent: "Africa",
    },
    {
      country: "Yemen",
      continent: "Asia",
    },
    {
      country: "Zambia",
      continent: "Africa",
    },
    {
      country: "Zimbabwe",
      continent: "Africa",
    },
  ];
  if (user) {
    return res
      .status(200)
      .send({ data: countries, message: "Countries Retrived" });
  } else {
    logger.error(
      `${ip}: API /api/v1/extra/get/count/continent countries retrived`
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

module.exports = {
  verifyWhatsappNumber,
  getCodebyCountry,
  getCodeCountry,
  getYears,
  getMonths,
  getCountries,
  getCountContinent,
};
