// I would suggest running this program as follows:
// $ node pal.js > sorted.csv

var Converter = require('csvtojson').Converter;
var converter = new Converter({});

converter.on("end_parsed", function(jsonArray){

    //split entries into mentors and mentees
    var mentors = [];
    var mentees = [];
    for(var i = 0; i < jsonArray.length; i++){
        if(jsonArray[i]["I\'m applying as a"] == "Mentor"){
            mentors.push(jsonArray[i]);
        }else{
            mentees.push(jsonArray[i]);
        }
    }

	// This sets up the array of similarity coefficients that the algorithm
	// will fill. coeffarr[i] will be the array of all mentor similarity
	// coefficients with the ith mentee. The algorithm prioritizes mentees who
  // signed up first.
	var coeffarr = new Array(mentees.length);
	for(var menteeIndex = 0; menteeIndex < coeffarr.length; menteeIndex++) {
		coeffarr[menteeIndex] = new Array(mentors.length);
	}
  assigncoeffarr(mentors, mentees, coeffarr);

  // List of Mentors, will be ordered in optimal manner: mentee-to-mentee
  // Currently assumes mentors <= mentees
  var orderedMentors = []; //new Array(mentees.length);
  for(var i = 0; i < mentees.length; i++) {
    var maxCoeff = 0;
    for(var j = 0; j < mentors.length; j++) {
      if(coeffarr[i][j] > maxCoeff && orderedMentors.indexOf(mentors[j]) == -1) {
        maxCoeff = coeffarr[i][j];
      }
    }
    for (var j = 0; j < mentors.length; j++) {
      if (coeffarr[i][j] === maxCoeff && orderedMentors.indexOf(mentors[j]) == -1) {
        // Uncomment this line if you want to see the similarity coefficients
        // console.log(mentees[i]["Last Name"] + " " + mentors[j]["Last Name"] + " " + maxCoeff);
        orderedMentors.push(mentors[j]);
        break;
      }
    }
  }

  // Spew the list of mentees out in .csv format
  console.log("MENTEES");
  for(var i = 0; i < mentees.length; i++) {
    console.log(mentees[i]["Preferred Name"] + "," + mentees[i]["Last Name"] + "," + mentees[i]["Major"] +
    "," + mentees[i]["Second Major"] + "," + mentees[i]["2nd Minor"] + "," + mentees[i].PP + "," +
    mentees[i].Email + "," + mentees[i].Personality);
  }

  // Spew the list of mentors out in .csv format
  console.log("MENTORS");
  for(var i = 0; i < orderedMentors.length; i++) {
    console.log(orderedMentors[i]["Preferred Name"] + "," + orderedMentors[i]["Last Name"] + "," +
    orderedMentors[i]["Major"] + "," + orderedMentors[i]["Second Major"] + "," + orderedMentors[i]["2nd Minor"] + "," +
    orderedMentors[i].PP + "," + orderedMentors[i].Email + "," + orderedMentors[i].Personality);
  }
});

// Takes lists of mentors and mentees and a mentees.length by mentors.length
// multidimensional array, and fills the array with similarity coefficients
function assigncoeffarr(mentors, mentees, coeffarr) {
	// Outer loop - mentees
	for(var i = 0; i < mentees.length; i++) {
		// Inner loop - mentors
		for(var j = 0;  j < mentors.length; j++) {
			// Similarity coefficient
			var simcoeff = 0;

			// Pre-Professional track match -> +10 pts
      // I count Graduate School as essentially None, but with a slight boost
			if((mentees[i].PP == mentors[j].PP) ||
         (mentees[i].PP == "na" && mentors[j].PP == "Graduate School") ||
         (mentors[j].PP == "na" && mentees[j].PP == "Graduate School")){
           if(mentees[i].PP == "Graduate School" && mentors[j].PP == "Graduate School") {
             simcoeff += 2;
           }
        simcoeff += 10;
			}

      // Major or 2nd Major in same bin -> +3pts
      var majorbinmatch = false;
      for(var bin in binBin) {
        // this could be simplified but I'm too tired. Sorry.
        if(bin.indexOf(mentees[i]["Major"]) != -1 && bin.indexOf(mentors[j]["Major"]) != -1) {
          majorbinmatch = true;
          break;
        }

        if(bin.indexOf(mentees[i]["Second Major"]) != -1 && bin.indexOf(mentors[j]["Major"]) != -1) {
          majorbinmatch = true;
          break;
        }

        if(bin.indexOf(mentees[i]["Major"]) != -1 && bin.indexOf(mentors[j]["Second Major"]) != -1) {
          majorbinmatch = true;
          break;
        }

        if(bin.indexOf(mentees[i]["Second Major"]) != -1 && bin.indexOf(mentors[j]["Second Major"]) != -1) {
          majorbinmatch = true;
          break;
        }
      }
      if(majorbinmatch) {
        simcoeff += 3;
      }

			// Major or 2nd Major direct match -> +4 pts
			if(([mentees[i]["Major"], mentees[i]["Second Major"]].indexOf(mentors[j]["Major"]) != -1 ) ||
       ([mentees[i]["Major"], mentees[i]["Second Major"]].indexOf(mentors[j]["Second Major"]) != -1 && mentors[j]["Second Major"] != '')) {
				simcoeff += 4;
			}

			// Minor or 2nd Minor direct match -> +2 pts
			if(([mentees[i].Minor, mentees[i]["2nd Minor"]].indexOf(mentors[j].Minor) != -1 ) ||
       ([mentees[i].Minor, mentees[i]["2nd Minor"]].indexOf(mentors[j]["2nd Minor"]) != -1 && mentors[j]["2nd Minor"] != '')) {
				simcoeff += 2;
			}

			// Personality match -> +1 pt
			if(mentees[i].Personality == mentors[j].Personality) {
				simcoeff += 1;
			}

			// Store similarity coefficient in coefficient array
			coeffarr[i][j] = simcoeff;
		}
	}
}

// Major bins
var businessBin = ["Accounting", "Accounting / International Business", "Actuarial Science Certificate", "Business & Political German Certificate", "Economics (A.B.)", "Economics (B.B.A.)", "Economics / International Business", "Environmental Economics & Management", "Finance", "Finance / International Business", "Financial Planning", "General Business (Griffin)", "General Business (Online)", "International Affairs", "International Business", "Legal Studies Certificate", "Management", "Management / International Business", "Management Info Systems / Int'l Business", "Management Information Systems", "Marketing", "Marketing / International Business", "Political Science", "Pre-Business", "Pre-Law", "Real Estate", "Real Estate / International Business", "Risk Management & Insurance", "Risk Mgmt & Insurance / Int'l Business"];
var gradyBin = ["Advertising", "Communication Sciences & Disorders", "Communication Studies", "Entertainment and Media Studies", "Journalism", "New Media Certificate", "Pre-Journalism", "Public Relations", "Journalism - Visual Journalism"];
var agricultureBin = ["Agribusiness", "Agribusiness Law Certificate", "Agricultural & Applied Economics", "Agricultural Communication", "Agricultural Education", "Agricultural Engineering", "Agriscience & Environmental Systems", "Agrosecurity Certificate", "Animal Health", "Animal Science", "Avian Biology", "Dairy Science", "Food Industry Marketing & Administration", "Food Science", "Horticulture", "Integrated Pest Management Certificate", "International Agriculture Certificate", "Local Food Systems Certificate", "Organic Agriculture Certificate", "Poultry Science"];
var artBin = ["Art - Ceramics", "Art - Drawing", "Art - Fabric Design", "Art - Graphic Design", "Art - Jewelry & Metalwork", "Art - Painting", "Art - Photography", "Art - Printmaking", "Art - Scientific Illustration", "Art - Sculpture", "Art Education", "Art History", "Art X: Expanded Forms", "Furnishings & Interiors", "Interior Design", "Music", "Music Business Certificate", "Music Composition", "Music Performance", "Music Theory", "Music Therapy", "Studio Art", "Theatre", "Landscape Architecture", "Dance (A.B.)", "Dance (B.F.A.)", "Mass Media Arts"];
var biologyBin = ["Biochemistry & Molecular Biology", "Biological Science", "Biology", "Cellular Biology", "Chemistry (B.S.)","Chemistry (B.S.Chem.)", "Environmental Chemistry", "Genetics", "Global Health Certificate", "Applied Biotechnology", "Microbiology", "Pharmaceutical Sciences", "Pharmacy", "Physics & Astronomy", "Plant Biology", "Pre-Dentistry", "Pre-Medicine", "Pre-Optometry", "Pre-Pharmacy", "Pre-Veterinary Medicine (B.S.)", "Pre-Veterinary Medicine (B.S.A.)", "Pre-Veterinary Medicine (B.S.F.R.)"];
var computerBin = ["Cognitive Science", "Computer Science", "Computing Certificate", "Environmental Engineering", "Mathematics","Statistics", "Physics"];
var humanitiesBin = ["Comparative Literature", "Film Studies", "History", "Honors Interdisc. Studies (A.B.)", "Honors Interdisc. Studies (B.S.)", "Honors Interdisc. Studies (B.S.A.)", "Honors Interdisc. Studies (B.S.F.C.S.)", "Interdisciplinary Studies (A.B.)", "Interdisciplinary Studies (A.B.)", "Interdisciplinary Studies (B.F.A.)", "Interdisciplinary Studies (B.S.)", "Interdisciplinary Writing Certificate","Linguistics", "Medieval Studies Certificate", "Native American Studies Certificate", "African American Studies", "African American Studies Certificate", "African Studies Certificate", "Anthropology", "Archaeological Sciences Certificate",  "Philosophy", "Pre-Theology", "Religion", "Women's Studies"];
var cultureBin = ["Classical Culture", "Classical Languages","English","French", "German", "Germanic & Slavic Languages", "Greek","Chinese Language & Literature", "British & Irish Studies Certificate", "Italian", "Japanese Language & Literatures", "Latin American & Caribbean Studies", "Latin American & Caribbean Studies Cert.", "Arabic","Asian Studies Certificate","Romance Languages", "Russian", "Spanish", "Chinese Language and Literature"];
var peopleBin = ["Dietetics", "Disability Studies Certificate", "Consumer Economics", "Consumer Foods", "Consumer Journalism", "Criminal Justice", "Environmental Health Science", "Environmental Resource Science", "Exercise & Sport Science", "Family & Consumer Sciences Education", "Fashion Merchandising", "Health Promotion", "Housing Management and Policy", "Human Development and Family Science", "Leadership & Service Certificate", "Athletic Training", "Nutritional Sciences", "Personal & Org. Leadership Cert.", "Social Work", "Sociology", "Sport Management", "Turfgrass Management", "Psychology"];
var educationBin = ["Early Childhood Education", "Educ. Psych & Instructional Tech Certif.", "English Education", "Health and Physical Education", "Mathematics / Mathematics Education", "Mathematics Education", "Middle School Education", "Music Education", "Science Education", "Special Education", "World Language Education", "Biology / Science Education", "English / English Education","History / Social Studies Education"];
var natureBin = ["Ecology (A.B.)", "Ecology (B.S.)", "Fisheries & Wildlife", "Entomology", "Forestry", "Geographic Information Science Cert.", "Geography (A.B.)", "Geography (B.S.)", "Geology (A.B.)", "Geology (B.S.)", "Global Studies Certificate", "Community Forestry Certificate", "Natural Resource Recreation & Tourism", "Pre-Forest Resources", "Water & Soil Resources (B.S.E.S.)", "Water & Soil Resources (B.S.F.R.)", "Water Resources Certificate", "Coastal & Oceanographic Eng. Cert.", "Atmospheric Sciences", "Environmental Ethics Certificate"];
var engineeringBin = ["Electrical and Electronics Engineering", "Engineering Physics Certificate", "Engineering Science Certificate", , "Computer Systems Engineering", "Computer Systems Engineering Certificate", "Civil Engineering", "Mechanical Engineering", "Biochemical Engineering", "Biological Engineering"];

// bin of bins, for ease of use
var binBin = [];
binBin.push(businessBin);
binBin.push(gradyBin);
binBin.push(agricultureBin);
binBin.push(artBin);
binBin.push(biologyBin);
binBin.push(computerBin);
binBin.push(humanitiesBin);
binBin.push(cultureBin);
binBin.push(peopleBin);
binBin.push(educationBin);
binBin.push(engineeringBin);

// data.csv is the .csv file exported by Google Forms. Put it in the same directory as newpal.js
// Currently, you need to change the field names in b.csv to:
// Fname,Lname,Major,Major2,Minor,Minor2,PP,Email,Phone,Personality,"I\'m applying as a", Blank (leave blank)
require('fs').createReadStream('data.csv').pipe(converter);
