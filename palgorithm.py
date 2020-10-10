# -*- coding: utf-8 -*-
"""
Created on Sun Feb 10 17:05:28 2019

@author: DELLXPS
"""
import numpy as np
import pandas as pd
from scipy.optimize import linear_sum_assignment

major_index = 3
preprof_index = 5
mentee_mentor_index = 8

# Major bins
businessBin = ["Accounting", "Accounting / International Business", "Actuarial Science Certificate", "Business & Political German Certificate", "Economics (A.B.)", "Economics (B.B.A.)", "Economics / International Business", "Environmental Economics & Management", "Finance", "Finance / International Business", "Financial Planning", "General Business (Griffin)", "General Business (Online)", "International Affairs", "International Business", "Legal Studies Certificate", "Management", "Management / International Business", "Management Info Systems / Int'l Business", "Management Information Systems", "Marketing", "Marketing / International Business", "Political Science", "Pre-Business", "Pre-Law", "Real Estate", "Real Estate / International Business", "Risk Management & Insurance", "Risk Mgmt & Insurance / Int'l Business"]
gradyBin = ["Advertising", "Communication Sciences & Disorders", "Communication Studies", "Entertainment and Media Studies", "Journalism", "New Media Certificate", "Pre-Journalism", "Public Relations", "Journalism - Visual Journalism"]
agricultureBin = ["Agribusiness", "Agribusiness Law Certificate", "Agricultural & Applied Economics", "Agricultural Communication", "Agricultural Education", "Agricultural Engineering", "Agriscience & Environmental Systems", "Agrosecurity Certificate", "Animal Health", "Animal Science", "Avian Biology", "Dairy Science", "Food Industry Marketing & Administration", "Food Science", "Horticulture", "Integrated Pest Management Certificate", "International Agriculture Certificate", "Local Food Systems Certificate", "Organic Agriculture Certificate", "Poultry Science"]
artBin = ["Art - Ceramics", "Art - Drawing", "Art - Fabric Design", "Art - Graphic Design", "Art - Jewelry & Metalwork", "Art - Painting", "Art - Photography", "Art - Printmaking", "Art - Scientific Illustration", "Art - Sculpture", "Art Education", "Art History", "Art X: Expanded Forms", "Furnishings & Interiors", "Interior Design", "Music", "Music Business Certificate", "Music Composition", "Music Performance", "Music Theory", "Music Therapy", "Studio Art", "Theatre", "Landscape Architecture", "Dance (A.B.)", "Dance (B.F.A.)", "Mass Media Arts"]
biologyBin = ["Biochemistry & Molecular Biology", "Biological Science", "Biology", "Cellular Biology", "Chemistry (B.S.)","Chemistry (B.S.Chem.)", "Environmental Chemistry", "Genetics", "Global Health Certificate", "Applied Biotechnology", "Microbiology", "Pharmaceutical Sciences", "Pharmacy", "Physics & Astronomy", "Plant Biology", "Pre-Dentistry", "Pre-Medicine", "Pre-Optometry", "Pre-Pharmacy", "Pre-Veterinary Medicine (B.S.)", "Pre-Veterinary Medicine (B.S.A.)", "Pre-Veterinary Medicine (B.S.F.R.)"]
computerBin = ["Cognitive Science", "Computer Science", "Computing Certificate", "Environmental Engineering", "Mathematics","Statistics", "Physics"]
humanitiesBin = ["Comparative Literature", "Film Studies", "History", "Honors Interdisc. Studies (A.B.)", "Honors Interdisc. Studies (B.S.)", "Honors Interdisc. Studies (B.S.A.)", "Honors Interdisc. Studies (B.S.F.C.S.)", "Interdisciplinary Studies (A.B.)", "Interdisciplinary Studies (A.B.)", "Interdisciplinary Studies (B.F.A.)", "Interdisciplinary Studies (B.S.)", "Interdisciplinary Writing Certificate","Linguistics", "Medieval Studies Certificate", "Native American Studies Certificate", "African American Studies", "African American Studies Certificate", "African Studies Certificate", "Anthropology", "Archaeological Sciences Certificate",  "Philosophy", "Pre-Theology", "Religion", "Women's Studies"]
cultureBin = ["Classical Culture", "Classical Languages","English","French", "German", "Germanic & Slavic Languages", "Greek","Chinese Language & Literature", "British & Irish Studies Certificate", "Italian", "Japanese Language & Literatures", "Latin American & Caribbean Studies", "Latin American & Caribbean Studies Cert.", "Arabic","Asian Studies Certificate","Romance Languages", "Russian", "Spanish", "Chinese Language and Literature"]
peopleBin = ["Dietetics", "Disability Studies Certificate", "Consumer Economics", "Consumer Foods", "Consumer Journalism", "Criminal Justice", "Environmental Health Science", "Environmental Resource Science", "Exercise & Sport Science", "Family & Consumer Sciences Education", "Fashion Merchandising", "Health Promotion", "Housing Management and Policy", "Human Development and Family Science", "Leadership & Service Certificate", "Athletic Training", "Nutritional Sciences", "Personal & Org. Leadership Cert.", "Social Work", "Sociology", "Sport Management", "Turfgrass Management", "Psychology"]
educationBin = ["Early Childhood Education", "Educ. Psych & Instructional Tech Certif.", "English Education", "Health and Physical Education", "Mathematics / Mathematics Education", "Mathematics Education", "Middle School Education", "Music Education", "Science Education", "Special Education", "World Language Education", "Biology / Science Education", "English / English Education","History / Social Studies Education"]
natureBin = ["Ecology", "Ecology (A.B.)", "Ecology (B.S.)", "Fisheries & Wildlife", "Entomology", "Forestry", "Geographic Information Science Cert.", "Geography (A.B.)", "Geography (B.S.)", "Geology (A.B.)", "Geology (B.S.)", "Global Studies Certificate", "Community Forestry Certificate", "Natural Resource Recreation & Tourism", "Pre-Forest Resources", "Water & Soil Resources (B.S.E.S.)", "Water & Soil Resources (B.S.F.R.)", "Water Resources Certificate", "Coastal & Oceanographic Eng. Cert.", "Atmospheric Sciences", "Environmental Ethics Certificate"]
engineeringBin = ["Electrical and Electronics Engineering", "Engineering Physics Certificate", "Engineering Science Certificate", "Computer Systems Engineering", "Computer Systems Engineering Certificate", "Civil Engineering", "Mechanical Engineering", "Biochemical Engineering", "Biological Engineering"]
undecidedBin = ["Undecided"]

binBin = []
binBin.append(businessBin)
binBin.append(gradyBin)
binBin.append(agricultureBin)
binBin.append(artBin)
binBin.append(biologyBin)
binBin.append(computerBin)
binBin.append(humanitiesBin)
binBin.append(cultureBin)
binBin.append(peopleBin)
binBin.append(educationBin)
binBin.append(natureBin)
binBin.append(engineeringBin)

major_dict = {'business': businessBin, 'grady': gradyBin, 'agriculture': agricultureBin, 'art': artBin, \
    'biology': biologyBin, 'computer': computerBin, 'humanities': humanitiesBin, 'culture': cultureBin, \
    'people': peopleBin, 'education': educationBin, 'nature': natureBin, 'engineering': engineeringBin, \
    'undecided': undecidedBin}

def find_categories(row, label):
    row_categories = []
    if pd.isnull(row[label]):
        return 'none'

    for major in row[label].split(';'):
        for category in major_dict.keys():
            if major in major_dict[category]:
                row_categories.append(category)
                break
    return ';'.join(row_categories)

# labels for the Google form survey data 
measured_attributes = ['timestamp', 'email', 'first_name', 'last_name', 'majors', 'minors', 'professional', 'phone', 'year', 'type', 'double_dawgs', 'fun_question']

# read in data
form_responses = pd.read_csv('data/pal_responses.csv', delimiter=',', header=0, names=measured_attributes)
form_responses.sort_values(by='timestamp', inplace=True)
# drop all but the latest response of an individual
form_responses.drop_duplicates(['first_name', 'last_name'], keep='last', inplace=True)
# engineer additional features
form_responses['major_category'] = form_responses.apply(lambda row: find_categories(row, 'majors'), axis=1)
form_responses['minor_category'] = form_responses.apply(lambda row: find_categories(row, 'minors'), axis=1)
# separate into mentors and mentees
mentees = form_responses.loc[form_responses['type'] == 'Mentee', :].reset_index(drop=True)
mentors = form_responses.loc[form_responses['type'] == 'Mentor', :].reset_index(drop=True)

def compute_similarity(mentee, mentor):
    score = 0
    # weights
    major_type = 5
    same_major_bonus = 2
    minor_type = 2
    same_minor_bonus = 1
    professional = 10
    max_score = major_type + same_major_bonus + minor_type + same_minor_bonus + professional
    # step 1, compute major similarity
    # Assign points for each same major category
    score += major_type * len(set(mentee['major_category'].split(';')) & set(mentor['major_category'].split(';')))
    # Assign points for each same major
    score += same_major_bonus * len(set(mentee['majors'].split(';')) & set(mentor['majors'].split(';')))

    # step 2, compute pre-professional similarity
    if not pd.isnull(mentee['professional']) and not pd.isnull(mentor['professional']):
        if mentee['professional'] == mentor['professional']:
            score += professional

    # step 3, compute minor similarity
    if not pd.isnull(mentee['minors']) and not pd.isnull(mentor['minors']):
        # Assign points for each same minor category
        score += minor_type * len(set(mentee['minor_category'].split(';')) & set(mentor['minor_category'].split(';')))
        # Assign points for each same minor
        score += same_minor_bonus * len(set(mentee['minors'].split(';')) & set(mentor['minors'].split(';')))

    # this is, strictly speaking, a cost function
    return max_score - score

number_mentors = len(mentors)
number_mentees = len(mentees)
match_matrix = np.zeros([number_mentees, number_mentors])
for mentee_index, mentee_row in mentees.iterrows():
    for mentor_index, mentor_row in mentors.iterrows():
        # mentees are in the rows (we put mentees first!)
        match_matrix[mentee_index, mentor_index] = compute_similarity(mentee_row, mentor_row)

print(match_matrix)

mentee_matches, mentor_matches = linear_sum_assignment(match_matrix)

print(len(mentee_matches), len(mentor_matches))

matched_mentees = mentees.iloc[mentee_matches].reset_index(drop=True)
matched_mentors = mentors.iloc[mentor_matches].reset_index(drop=True)

ix = [i for i in mentees.index if i not in mentee_matches]
unmatched_mentees = mentees.loc[ix].reset_index(drop=True)
unmatched_mentees.to_csv(path_or_buf='unmatched_mentees.csv', index=False)
print('# unmatched mentees:')
print(len(unmatched_mentees))

matches = matched_mentees.join(matched_mentors, lsuffix='_mentee', rsuffix='_mentor')
matches.to_csv(path_or_buf='matches.csv', index=False)

def summarize_data():
    print('Mentors:', len(mentors))
    print('Mentees:', len(mentees))
    print(form_responses.describe())

summarize_data()

