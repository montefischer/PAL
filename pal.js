var Converter = require('csvtojson').Converter;
var converter = new Converter({});

converter.on("end_parsed", function(jsonArray){
    
    //split people into mentors and mentees
    var mentors = [];
    var mentees = [];
    var output = [];
    var cleanUpMentees = [];
    

    for(var i = 0; i < jsonArray.length; i++){

        if(jsonArray[i]["I\'m applying as a"] === "Mentor"){
            mentors.push(jsonArray[i]);
        }else{
            mentees.push(jsonArray[i]);
        }
    }

    console.log(mentors.length);
    console.log(mentees.length);


    algorithm(mentors, mentees, output, cleanUpMentees, false);    
    console.log(mentors.length);
    console.log(cleanUpMentees.length);
    console.log(output.length);

    algorithm(mentors, cleanUpMentees, output, [], true);
    console.log(mentors.length);
    console.log(cleanUpMentees.length);

    console.log(output.length);
    
    console.log(output);
    



});

function algorithm(mentors, mentees, output, cleanUpMentees, cleanUp){
    var pool = [];
    var updatedPool = [];
    
    for(var i = 0; i < mentees.length; i++){
        //console.log("i: " + i + " : length" + mentors.length);
        pool = mentors.slice();
        updatedPool = [];

        //search for exact first or second major match
        for(var k = 0; k < mentors.length; k++){
            
            if(mentees[i].Major === mentors[k].Major){
                //console.log("i: " + i + " " + mentees[i].Major + " " + mentors[k].Major);
                updatedPool.push(mentors[k]);
            }else if((mentees[i].Major === mentors[k]["Second Major"] || mentees[i]["Second Major"] === mentors[k].Major || mentees[i]["Second Major"] === mentors[k]["Second Major"]) && mentees[i]["Second Major"] !== ""){
                updatedPool.push(mentors[k]);
            }
        }

        //no match has been found, go to major bins
        if(updatedPool.length === 0){
            
            //find correct bin
            var bin;
            if(businessBin.indexOf(mentees[i].Major) > -1){
                bin = businessBin.slice();
            }else if(gradyBin.indexOf(mentees[i].Major) > -1){
                bin = gradyBin.slice();
            }else if(agricultureBin.indexOf(mentees[i].Major) > -1){
                bin = agricultureBin.slice();
            }else if(artBin.indexOf(mentees[i].Major) > -1){
                bin = artBin.slice();
            }else if(biologyBin.indexOf(mentees[i].Major) > -1){
                bin = biologyBin.slice();
            }else if(computerBin.indexOf(mentees[i].Major) > -1){
                bin = computerBin.slice();
            }else if(humanitiesBin.indexOf(mentees[i].Major) > -1){
                bin = humanitiesBin.slice();
            }else if(peopleBin.indexOf(mentees[i].Major) > -1){
                bin = peopleBin.slice();
            }else if(educationBin.indexOf(mentees[i].Major) > -1){
                bin = educationBin.slice();
            }else if(natureBin.indexOf(mentees[i].Major) > -1){
                bin = natureBin.slice();
            }else if(engineeringBin.indexOf(mentees[i].Major) > -1){
                bin = engineeringBin.slice();
            }else if(peopleBin.indexOf(mentees[i].Major) > -1){
                bin = peopleBin.slice();
            }else{
                console.log("This should not be reached: " + mentees[i].Major);
            }

            for(var k = 0; k < mentors.length; k++){
                if(bin.indexOf(mentors[k].Major) > -1){
                    updatedPool.push(mentors[k]);
                }
            } 
        }


        if(updatedPool.length === 1){
            //console.log("i: " + i + " :" + mentees[i].Major);
            output.push([mentees[i], updatedPool[0]]);
            mentors.splice(mentors.indexOf(updatedPool[0]), 1);
            continue;
        }else if(updatedPool.length > 1){
            pool = updatedPool.slice();
        }

        updatedPool = [];

        //move onto first or second minor match
        for(var k = 0; k < pool.length; k++){
            
            if(mentees[i]["Minoring?"] === pool[k]["Minoring?"] && mentees[i]["Minoring?"] !== ""){
                updatedPool.push(pool[k]);
            }else if((mentees[i]["Minoring?"] === pool[k]["2nd Minor"] || mentees[i]["2nd Minor"] === pool[k]["Minoring?"] || mentees[i]["2nd Minor"] === pool[k]["2nd Minor"]) && mentees[i]["2nd Minor"] !== ""){
                updatedPool.push(pool[k]);
            }
        }

        if(updatedPool.length === 1){
            output.push([mentees[i], updatedPool[0]]);
            mentors.splice(mentors.indexOf(updatedPool[0]), 1);
            continue;
        }else if(updatedPool.length > 1){
            pool = updatedPool.slice();
        }
        
        
        updatedPool = [];

        for(var k = 0; k < pool.length; k++){
            
            if(mentees[i]["Personality Profile"] === pool[k]["Personality Profile"]){
                updatedPool.push(pool[k]);
            }
        }

        if(updatedPool.length === 1){
            output.push([mentees[i], updatedPool[0]]);
            mentors.splice(mentors.indexOf(updatedPool[0]), 1);
            continue;
        }else if(updatedPool.length > 1){
            pool = updatedPool.slice();
        }
        

        if(mentors.length === 0){
            console.log("no more mentors");
            break;
        }

        
        //console.log("Person is at end with " + pool.length);

        if(cleanUp){
            output.push([mentees[i], pool[0]]);
            mentors.splice(mentors.indexOf(pool[0]), 1);
        }else{
            cleanUpMentees.push(mentees[i]);
        }
    }
}


var businessBin = ["Accounting", "Accounting / International Business", "Actuarial Science Certificate", "Business & Political German Certificate", "Economics (A.B.)", "Economics (B.B.A.)", "Economics / International Business", "Environmental Economics & Management", "Finance", "Finance / International Business", "Financial Planning", "General Business (Griffin)", "General Business (Online)", "International Affairs", "International Business", "Legal Studies Certificate", "Management", "Management / International Business", "Management Info Systems / Int'l Business", "Management Information Systems", "Marketing", "Marketing / International Business", "Political Science", "Pre-Business", "Pre-Law", "Real Estate", "Real Estate / International Business", "Risk Management & Insurance", "Risk Mgmt & Insurance / Int'l Business"];
var gradyBin = ["Advertising", "Communication Sciences & Disorders", "Communication Studies", "Entertainment and Media Studies", "Journalism", "New Media Certificate", "Pre-Journalism", "Public Relations", "Journalism - Visual Journalism"];
var agricultureBin = ["Agribusiness", "Agribusiness Law Certificate", "Agricultural & Applied Economics", "Agricultural Communication", "Agricultural Education", "Agricultural Engineering", "Agriscience & Environmental Systems", "Agrosecurity Certificate", "Animal Health", "Animal Science", "Avian Biology", "Dairy Science", "Food Industry Marketing & Administration", "Food Science", "Horticulture", "Integrated Pest Management Certificate", "International Agriculture Certificate", "Local Food Systems Certificate", "Organic Agriculture Certificate", "Poultry Science"];
var artBin = ["Art - Ceramics", "Art - Drawing", "Art - Fabric Design", "Art - Graphic Design", "Art - Jewelry & Metalwork", "Art - Painting", "Art - Photography", "Art - Printmaking", "Art - Scientific Illustration", "Art - Sculpture", "Art Education", "Art History", "Art X: Expanded Forms", "Furnishings & Interiors", "Interior Design", "Music", "Music Business Certificate", "Music Composition", "Music Performance", "Music Theory", "Music Therapy", "Studio Art", "Theatre", "Landscape Architecture", "Dance (A.B.)", "Dance (B.F.A.)"];
var biologyBin = ["Biochemistry & Molecular Biology", "Biological Science", "Biology", "Cellular Biology", "Chemistry (B.S.)","Chemistry (B.S.Chem.)", "Environmental Chemistry", "Genetics", "Global Health Certificate", "Applied Biotechnology", "Microbiology", "Pharmaceutical Sciences", "Pharmacy", "Physics & Astronomy", "Plant Biology", "Pre-Dentistry", "Pre-Medicine", "Pre-Optometry", "Pre-Pharmacy", "Pre-Veterinary Medicine (B.S.)", "Pre-Veterinary Medicine (B.S.A.)", "Pre-Veterinary Medicine (B.S.F.R.)"];
var computerBin = ["Cognitive Science", "Computer Science", "Computing Certificate", "Environmental Engineering", "Mathematics","Statistics", "Physics"];
var humanitiesBin = ["Comparative Literature", "Film Studies", "History", "Honors Interdisc. Studies (A.B.)", "Honors Interdisc. Studies (B.S.)", "Honors Interdisc. Studies (B.S.A.)", "Honors Interdisc. Studies (B.S.F.C.S.)", "Interdisciplinary Studies (A.B.)", "Interdisciplinary Studies (A.B.)", "Interdisciplinary Studies (B.F.A.)", "Interdisciplinary Studies (B.S.)", "Interdisciplinary Writing Certificate","Linguistics", "Medieval Studies Certificate", "Native American Studies Certificate", "African American Studies", "African American Studies Certificate", "African Studies Certificate", "Anthropology", "Archaeological Sciences Certificate",  "Philosophy", "Pre-Theology", "Religion", "Women's Studies"];
var cultureBin = ["Classical Culture", "Classical Languages","English","French", "German", "Germanic & Slavic Languages", "Greek","Chinese Language & Literature", "British & Irish Studies Certificate", "Italian", "Japanese Language & Literatures", "Latin American & Caribbean Studies", "Latin American & Caribbean Studies Cert.", "Arabic","Asian Studies Certificate","Romance Languages", "Russian", "Spanish"];
var peopleBin = ["Dietetics", "Disability Studies Certificate", "Consumer Economics", "Consumer Foods", "Consumer Journalism", "Criminal Justice", "Environmental Health Science", "Environmental Resource Science", "Exercise & Sport Science", "Family & Consumer Sciences Education", "Fashion Merchandising", "Health Promotion", "Housing Management and Policy", "Human Development and Family Science", "Leadership & Service Certificate", "Athletic Training", "Nutritional Sciences", "Personal & Org. Leadership Cert.", "Social Work", "Sociology", "Sport Management", "Turfgrass Management", "Psychology"];
var educationBin = ["Early Childhood Education", "Educ. Psych & Instructional Tech Certif.", "English Education", "Health and Physical Education", "Mathematics / Mathematics Education", "Mathematics Education", "Middle School Education", "Music Education", "Science Education", "Special Education", "World Language Education", "Biology / Science Education", "English / English Education","History / Social Studies Education"];
var natureBin = ["Ecology (A.B.)", "Ecology (B.S.)", "Fisheries & Wildlife", "Entomology", "Forestry", "Geographic Information Science Cert.", "Geography (A.B.)", "Geography (B.S.)", "Geology (A.B.)", "Geology (B.S.)", "Global Studies Certificate", "Community Forestry Certificate", "Natural Resource Recreation & Tourism", "Pre-Forest Resources", "Water & Soil Resources (B.S.E.S.)", "Water & Soil Resources (B.S.F.R.)", "Water Resources Certificate", "Coastal & Oceanographic Eng. Cert.", "Atmospheric Sciences", "Environmental Ethics Certificate"];
var engineeringBin = ["Electrical and Electronics Engineering", "Engineering Physics Certificate", "Engineering Science Certificate", , "Computer Systems Engineering", "Computer Systems Engineering Certificate", "Civil Engineering", "Mechanical Engineering", "Biochemical Engineering", "Biological Engineering"];

require('fs').createReadStream('/home/kyle/Downloads/b.csv').pipe(converter);