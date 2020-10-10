# PAL
## History
### What is PAL?
PAL, or Peer-Assisted-Leadership, is an initiative of the University of Georgia Honors Program Student Council (HPSC). PAL provides an avenue for incoming UGA freshmen to connect with more experienced upperclassmen with similar professional and/or academic intentions. Interested students sign up by submitting a Google Form, providing information like their major(s), minor(s), and pre-professional track.

### What is this doing on GitHub?
Because a large number of students sign up for PAL, it would be difficult to pair off mentors and mentees by hand. Kyle Mercer, a former HPSC member, wrote the initial PAL sorting algorithm (PALgorithm) in JavaScript for [Node.js](https://nodejs.org/en/) using the [csvtojson](https://www.npmjs.com/package/csvtojson) module. Currently a different HPSC member, Monte Fischer, manages the project. Monte has rewritten the algorithm in Python to improve maintainability and mentor-mentee match quality.

## Details
### Running the PALgorithm
Make sure that you have Python installed and an environment set up with numpy, pandas, and scipy (for instance, Anaconda). Clone this repository, put the .csv file downloaded from the sign-up Google form into the same directory as `palgorithm.py` and rename it to `pal_responses.csv`. If there have been any changes to the questions asked,
## Help! It doesn't work!
If you are struggling to get the PALgorithm to work, consult a technical-minded friend or get in touch with Monte.
