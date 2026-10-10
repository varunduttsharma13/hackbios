import { HealthCondition } from '@/types/healthGuide';

export const HEALTH_CONDITIONS: HealthCondition[] = [
  {
    id: 'fever',
    name: 'Fever & Elevated Body Temperature',
    hindiName: 'बुखार और शरीर का तापमान बढ़ना',
    category: 'FEVER',
    categoryLabel: 'Fever',
    iconName: 'Thermometer',
    shortSummary: 'Body temperature above 100.4°F (38°C), indicating immune system response to infection.',
    overview:
      'A fever is a temporary elevation in body temperature above the normal range (98.6°F / 37°C), typically triggered as an active immune response fighting off viral or bacterial infections. While often uncomfortable, fever itself is a defense mechanism rather than a standalone illness.',
    commonSymptoms: [
      'Body temperature exceeding 100.4°F (38°C)',
      'Shivering, chills, and goosebumps',
      'Flushed warm skin and sweating',
      'Generalized weakness, fatigue, and muscle aches',
      'Mild headache and loss of appetite',
    ],
    generalSelfCare: [
      'Drink plenty of fluids: water, clear soups, ORS, and warm herbal teas to prevent dehydration.',
      'Rest in a comfortably cool, well-ventilated room with light breathable clothing.',
      'Apply room-temperature or lukewarm damp washcloth compresses to forehead and neck (avoid ice water).',
      'Monitor temperature systematically every 4–6 hours using a calibrated digital thermometer.',
    ],
    medicineCategories: [
      {
        name: 'Antipyretics & Analgesics',
        description: 'Commonly discussed to help reduce fever discomfort and associated body pain.',
        commonExamples: ['Paracetamol (Acetaminophen)', 'Ibuprofen (adults only, with food)'],
      },
      {
        name: 'Electrolyte Solutions',
        description: 'Crucial for replenishing lost fluids and essential minerals from high perspiration.',
        commonExamples: ['WHO-Formula Oral Rehydration Salts (ORS)'],
      },
    ],
    relatedMedicineIds: ['paracetamol', 'ors', 'ibuprofen'],
    importantPrecautions: [
      'NEVER administer Aspirin to children or adolescents under 19 due to the risk of Reye syndrome.',
      'Do not combine multiple over-the-counter cold medicines that contain hidden Paracetamol (Acetaminophen) to avoid hepatotoxicity.',
      'Always follow age-appropriate and weight-based pediatric dosing as directed by a pediatrician.',
      'Antipyretics relieve temperature discomfort but do not cure the underlying infection.',
    ],
    whenToContactDoctor: [
      'Fever persisting beyond 3 consecutive days without improvement.',
      'Temperature continuously exceeding 103°F (39.4°C) in adults despite medication.',
      'Any fever in infants under 3 months old requires immediate same-day pediatric assessment.',
      'Accompanied by productive colored cough, painful urination, or persistent ear pain.',
    ],
    emergencyWarningSigns: [
      'Severe sudden neck stiffness accompanied by confusion or extreme drowsiness (suspected meningitis)',
      'Difficulty breathing, persistent chest tightness, or blueness of lips',
      'Seizures, convulsions, or inability to wake up',
      'Appearance of widespread unexplained petechial rash (tiny purple or red spots)',
    ],
    clinicalDisclaimer:
      'This information is provided strictly for educational purposes and does not constitute medical diagnosis or individual prescribing. Consult a registered medical practitioner before starting any therapeutic regimen.',
  },
  {
    id: 'cold-nasal',
    name: 'Common Cold & Nasal Congestion',
    hindiName: 'सर्दी, जुकाम और बंद नाक',
    category: 'COLD_NASAL',
    categoryLabel: 'Cold & Nasal',
    iconName: 'Wind',
    shortSummary: 'Upper respiratory viral syndrome with sneezing, runny nose, and nasal obstruction.',
    overview:
      'The common cold is a self-limiting viral infection of the upper respiratory tract, commonly caused by Rhinoviruses. Symptoms typically peak within 2 to 3 days and resolve naturally within 7 to 10 days in healthy individuals.',
    commonSymptoms: [
      'Nasal obstruction, stuffiness, and mouth breathing',
      'Clear watery nasal discharge progressing to thicker mucus',
      'Frequent sneezing episodes and nasal tickle',
      'Scratchy throat discomfort',
      'Mild low-grade fever or general lethargy',
    ],
    generalSelfCare: [
      'Inhale warm moist steam 2–3 times daily to loosen trapped nasal secretions.',
      'Use isotonic sterile saline nasal drops or rinses to gently flush nasal passages.',
      'Stay thoroughly hydrated with warm fluids to thin out mucosal secretions.',
      'Elevate the head with an extra pillow at bedtime to facilitate breathing.',
    ],
    medicineCategories: [
      {
        name: 'Saline Nasal Irrigants',
        description: 'Non-medicated gentle clearance of mucosal crusting and congestion.',
        commonExamples: ['0.9% Normal Saline Nasal Spray'],
      },
      {
        name: 'Antihistamines',
        description: 'May help dry up excessive rhinorrhea and reduce sneezing frequency.',
        commonExamples: ['Cetirizine', 'Chlorpheniramine'],
      },
    ],
    relatedMedicineIds: ['saline-nasal', 'cetirizine', 'paracetamol'],
    importantPrecautions: [
      'Antibiotics are completely ineffective against common cold viruses and should NEVER be taken without prescription.',
      'Topical decongestant sprays (e.g. Oxymetazoline) should not be used for more than 3 to 5 consecutive days to prevent rebound congestion (rhinitis medicamentosa).',
      'Many cold syrups contain sedative ingredients that can cause drowsiness; avoid driving.',
    ],
    whenToContactDoctor: [
      'Symptoms worsening significantly after 7–10 days rather than improving.',
      'High fever developing several days into the cold.',
      'Severe localized facial or frontal forehead pain indicating secondary sinus infection.',
    ],
    emergencyWarningSigns: [
      'Audible wheezing, severe shortness of breath, or stridor',
      'Inability to swallow liquids or keep fluids down',
    ],
    clinicalDisclaimer:
      'Educational guide only. Antibiotic stewardship is essential. Seek professional consultation for persistent symptoms.',
  },
  {
    id: 'cough-throat',
    name: 'Cough & Sore Throat',
    hindiName: 'खांसी और गले में खराश',
    category: 'COUGH_THROAT',
    categoryLabel: 'Cough & Throat',
    iconName: 'Activity',
    shortSummary: 'Dry tickly cough, productive phlegm cough, and pharyngeal mucosal inflammation.',
    overview:
      'Cough is a vital protective physiological reflex that clears airway secretions and irritants. Coughs are broadly categorized into dry (non-productive, tickly) and wet (productive with mucus or phlegm). Identifying the cough pattern is crucial because different mechanisms require different supportive care.',
    commonSymptoms: [
      'Dry hackling cough or phlegm-producing chest cough',
      'Raw, scratchy, or painful sensation during swallowing',
      'Hoarse voice or throat clearing',
      'Post-nasal drip sensation trickling down the back of the throat',
    ],
    generalSelfCare: [
      'Warm saltwater gargles (half teaspoon table salt in a glass of warm water) 3–4 times daily.',
      'Warm honey water with lemon (honey is clinically supported for soothing coughs in adults and children over 1 year).',
      'Maintain adequate ambient humidity and avoid exposure to tobacco smoke or air pollutants.',
      'Sip warm water frequently throughout the day to keep vocal cords lubricated.',
    ],
    medicineCategories: [
      {
        name: 'Cough Suppressants (Antitussives)',
        description: 'Target the brain cough reflex center to reduce exhausting non-productive dry coughing.',
        commonExamples: ['Dextromethorphan'],
      },
      {
        name: 'Expectorants & Mucolytics',
        description: 'Thin out and loosen thick bronchial phlegm to make chest coughs more productive.',
        commonExamples: ['Guaifenesin', 'Ambroxol'],
      },
    ],
    relatedMedicineIds: ['dextromethorphan', 'guaifenesin', 'paracetamol'],
    importantPrecautions: [
      'NEVER give honey to infants under 1 year of age due to the risk of infant botulism.',
      'Do not suppress a productive wet chest cough completely, as clearing phlegm protects against secondary pneumonia.',
      'Most acute coughs are viral; do not self-prescribe antibiotics.',
    ],
    whenToContactDoctor: [
      'Cough persisting longer than 3 weeks (chronic cough evaluation required).',
      'Rust-colored, dark green, or foul-smelling sputum production.',
      'Unexplained significant weight loss, night sweats, or extreme exhaustion.',
    ],
    emergencyWarningSigns: [
      'Coughing up frank red blood (hemoptysis)',
      'Severe respiratory distress, chest indrawing, or cyanosis',
      'Stridor or bark-like croup cough with difficulty catching breath',
    ],
    clinicalDisclaimer:
      'Educational guidance only. Chronic or blood-tinged cough mandates clinical investigation including chest radiography.',
  },
  {
    id: 'allergies',
    name: 'Allergies & Allergic Rhinitis',
    hindiName: 'एलर्जी और पित्ती',
    category: 'ALLERGIES',
    categoryLabel: 'Allergies',
    iconName: 'ShieldAlert',
    shortSummary: 'Hypersensitivity reactions causing sneezing, watery itchy eyes, hives, or skin rash.',
    overview:
      'Allergies occur when the immune system overreacts to ordinarily harmless environmental substances (allergens) such as pollen, dust mites, animal dander, mold, or insect stings. The immune system releases histamines and inflammatory mediators, causing mucosal edema and pruritus.',
    commonSymptoms: [
      'Paroxysms of sneezing and runny clear nasal discharge',
      'Itchy, red, watering eyes (allergic conjunctivitis)',
      'Palatal or inner ear itching',
      'Urticarial hives, wheals, or localized itchy skin flare-ups',
    ],
    generalSelfCare: [
      'Identify and minimize exposure to recognized personal triggers (dust, pet hair, seasonal pollen).',
      'Keep windows closed during high-pollen seasons; change outdoor clothes after returning home.',
      'Wash bedding weekly in warm water to reduce dust mite allergen burdens.',
      'Use cool damp compresses over irritated eyes and skin.',
    ],
    medicineCategories: [
      {
        name: 'Second-Generation Antihistamines',
        description: 'Block H1 histamine receptors with minimal sedation compared to older antihistamines.',
        commonExamples: ['Cetirizine', 'Loratadine', 'Fexofenadine'],
      },
      {
        name: 'Topical Emollients & Barrier Creams',
        description: 'Soothe pruritus and repair compromised skin moisture barriers.',
        commonExamples: ['Calamine lotion', 'Ceramide emollients'],
      },
    ],
    relatedMedicineIds: ['cetirizine', 'saline-nasal'],
    importantPrecautions: [
      'First-generation antihistamines (e.g. Diphenhydramine, Chlorpheniramine) cause significant drowsiness; avoid operating machinery.',
      'Distinguish mild localized allergy from life-threatening anaphylaxis.',
    ],
    whenToContactDoctor: [
      'Allergies severely disrupting sleep, work, or quality of life despite self-care.',
      'Secondary bacterial skin infection from vigorous scratching.',
      'Chronic symptoms requiring allergen immunotherapy or prescription nasal corticosteroids.',
    ],
    emergencyWarningSigns: [
      'ANAPHYLAXIS RED FLAGS: Swelling of tongue, lips, throat, or uvula',
      'Audible wheezing, throat tightness, or sudden voice hoarseness',
      'Dizziness, lightheadedness, confusion, or sudden fainting (drop in blood pressure)',
      'Immediate emergency injection (EpiPen / Adrenaline) and call 108 / ER required.',
    ],
    clinicalDisclaimer:
      'Emergency allergic reactions require immediate emergency hospitalization. Do not rely on oral tablets for anaphylaxis.',
  },
  {
    id: 'headache',
    name: 'Headaches (Tension & Minor)',
    hindiName: 'सिरदर्द और तनाव',
    category: 'HEADACHE',
    categoryLabel: 'Headache',
    iconName: 'Zap',
    shortSummary: 'Tension headaches, dehydration headaches, eye-strain, and lifestyle stress.',
    overview:
      'Headaches are among the most common physical discomforts. The vast majority are benign primary headaches, most frequently tension headaches (caused by neck/scalp muscle contraction, poor posture, or emotional stress) and dehydration headaches.',
    commonSymptoms: [
      'Dull, aching band-like pressure around the forehead, temples, or back of head',
      'Tenderness on the scalp, neck, and shoulder muscles',
      'Mild sensitivity to bright glare or loud noises',
      'Absence of progressive focal neurological deficits',
    ],
    generalSelfCare: [
      'Drink 500–750 ml of room temperature water immediately; dehydration is a frequent covert trigger.',
      'Rest in a quiet, dimly lit, cool room with eyes closed for 20–30 minutes.',
      'Apply a cool gel pack to the forehead or a warm compress to tight neck muscles.',
      'Take regular screen breaks (the 20-20-20 rule: look 20 feet away for 20 seconds every 20 minutes).',
    ],
    medicineCategories: [
      {
        name: 'Mild Analgesics',
        description: 'Provide temporary symptomatic relief for acute episodic tension headaches.',
        commonExamples: ['Paracetamol', 'Ibuprofen'],
      },
    ],
    relatedMedicineIds: ['paracetamol', 'ibuprofen'],
    importantPrecautions: [
      'Avoid overusing painkillers more than 2–3 days per week to prevent Medication Overuse Headaches (rebound headaches).',
      'Ensure adequate daily sleep, hydration, and meal regularity before relying on analgesics.',
    ],
    whenToContactDoctor: [
      'Headaches occurring more than 2 times per week or steadily increasing in intensity.',
      'Headaches accompanied by nausea, vomiting, or visual auras (requiring migraine evaluation).',
      'New-onset frequent headaches in individuals over 50 years of age.',
    ],
    emergencyWarningSigns: [
      'Sudden "thunderclap" headache peaking within seconds (worst headache of life)',
      'Headache accompanied by fever, stiff neck, confusion, or speech impairment',
      'Headache following a recent head injury, fall, or trauma',
      'Associated focal weakness, facial drooping, or numbness on one side of the body',
    ],
    clinicalDisclaimer:
      'Severe or sudden-onset headaches require urgent clinical exclusion of intracranial pathology.',
  },
  {
    id: 'stomach-digestive',
    name: 'Acidity, Indigestion & Mild Digestion Issues',
    hindiName: 'एसिडिटी, अपच और पेट की समस्याएं',
    category: 'STOMACH_DIGESTIVE',
    categoryLabel: 'Stomach & Digestive',
    iconName: 'Shield',
    shortSummary: 'Heartburn, acid reflux, bloating, indigestion, and mild transient diarrhea.',
    overview:
      'Digestive complaints such as acidity (gastroesophageal reflux), post-meal indigestion (dyspepsia), and bloating are commonly related to dietary habits, irregular meal timing, spicy foods, or psychological stress.',
    commonSymptoms: [
      'Burning sensation in chest or throat behind breastbone (heartburn)',
      'Sour acid regurgitation and frequent belching',
      'Fullness, upper abdominal bloating, and gas discomfort',
      'Mild transient looseness of stools without blood or fever',
    ],
    generalSelfCare: [
      'Eat smaller, more frequent meals rather than heavy large dinners.',
      'Avoid lying down or going to bed for at least 2–3 hours after eating.',
      'Reduce intake of deep-fried, heavily spiced, carbonated, and caffeinated beverages.',
      'For mild loose stools, maintain diligent hydration with WHO-formula ORS and light bland food (khichdi, curd, bananas).',
    ],
    medicineCategories: [
      {
        name: 'Antacids',
        description: 'Provide rapid neutralization of excess gastric hydrochloric acid for temporary relief.',
        commonExamples: ['Aluminum & Magnesium Hydroxide suspensions', 'Calcium Carbonate'],
      },
      {
        name: 'Acid Reducers (PPIs / H2 Blockers)',
        description: 'Suppress gastric acid secretion for short-term clinical management.',
        commonExamples: ['Pantoprazole', 'Famotidine'],
      },
      {
        name: 'Oral Rehydration Salts',
        description: 'Crucial replacement of fluid and electrolyte losses during mild diarrhea.',
        commonExamples: ['WHO-ORS'],
      },
    ],
    relatedMedicineIds: ['antacid', 'pantoprazole', 'ors', 'lactulose'],
    importantPrecautions: [
      'Do not take antacids within 2 hours of other oral prescription drugs, as they can impair drug absorption.',
      'Do not use antimotility drugs (like Loperamide) for acute infectious diarrhea with fever or bloody stools.',
      'Long-term self-medication with acid suppressants can mask serious underlying gastrointestinal conditions.',
    ],
    whenToContactDoctor: [
      'Heartburn or indigestion persisting for more than 2 weeks despite lifestyle adjustments.',
      'Unexplained unintentional weight loss or persistent vomiting.',
      'Difficulty or pain while swallowing solid foods (dysphagia).',
    ],
    emergencyWarningSigns: [
      'Chest pain radiating to arm, jaw, or shoulder (rule out myocardial infarction / heart attack immediately)',
      'Vomiting blood (hematemesis) or material resembling dark coffee grounds',
      'Black tarry stools (melena) or frank rectal bleeding',
      'Sudden severe, rigid abdominal pain that worsens upon gentle touch',
    ],
    clinicalDisclaimer:
      'Atypical chest pain from cardiac origin can mimic indigestion. When in doubt, seek emergency evaluation.',
  },
  {
    id: 'body-pain',
    name: 'Body Aches & Minor Muscular Pain',
    hindiName: 'शरीर में दर्द और मांसपेशियों का तनाव',
    category: 'BODY_PAIN',
    categoryLabel: 'Body Pain',
    iconName: 'Activity',
    shortSummary: 'Overexertion soreness, postural back strain, and non-traumatic muscular aches.',
    overview:
      'Musculoskeletal aches commonly follow strenuous physical work, unaccustomed exercise (DOMS), poor ergonomic posture at desk jobs, or viral illness fatigue. Most acute strains resolve with conservative rest and gentle physical care.',
    commonSymptoms: [
      'Localized muscle soreness, stiffness, and reduced flexibility',
      'Aching across shoulders, upper back, or lower lumbar region',
      'Tenderness when touching the affected muscle belly',
      'Absence of joint swelling, redness, or heat',
    ],
    generalSelfCare: [
      'Apply cold packs for the first 24–48 hours to reduce inflammation; switch to warm compresses afterward.',
      'Allow active gentle movement and stretching rather than prolonged complete bed rest.',
      'Maintain ergonomic seating with lumbar support and monitor desk monitor heights.',
      'Ensure adequate daily magnesium and hydration intake.',
    ],
    medicineCategories: [
      {
        name: 'Analgesics & Anti-inflammatories',
        description: 'Provide temporary pain relief and ease inflammatory muscle tenderness.',
        commonExamples: ['Paracetamol', 'Ibuprofen'],
      },
      {
        name: 'Topical Counter-irritants & Gels',
        description: 'Provide localized soothing warmth and distraction from deep muscle aches.',
        commonExamples: ['Diclofenac gel', 'Menthol / Methyl salicylate balms'],
      },
    ],
    relatedMedicineIds: ['paracetamol', 'ibuprofen'],
    importantPrecautions: [
      'Always take oral NSAIDs (e.g. Ibuprofen) with or immediately after food to protect stomach lining.',
      'Patients with chronic kidney disease, peptic ulcers, or heart conditions must avoid oral NSAIDs.',
    ],
    whenToContactDoctor: [
      'Pain persisting longer than 10–14 days without progressive relief.',
      'Pain accompanied by numbness, tingling, or radiating weakness down the leg or arm.',
      'Significant localized joint swelling, heat, or inability to bear weight.',
    ],
    emergencyWarningSigns: [
      'Back pain accompanied by loss of bowel or bladder control (cauda equina syndrome - emergency)',
      'Severe pain accompanied by high spiking fever and chills',
    ],
    clinicalDisclaimer:
      'Educational guide only. Persistent musculoskeletal symptoms require physical examination and imaging.',
  },
  {
    id: 'skin-concerns',
    name: 'Minor Skin Irritation & Itching',
    hindiName: 'त्वचा में खुजली और सामान्य जलन',
    category: 'SKIN',
    categoryLabel: 'Skin Concerns',
    iconName: 'Shield',
    shortSummary: 'Dry skin (xerosis), superficial itching, and mild non-infectious rash guidance.',
    overview:
      'Skin irritation and pruritus frequently arise from environmental triggers, low humidity, harsh detergents, or mild allergic contact. Protecting the skin lipid barrier is the cornerstone of dermatological self-care.',
    commonSymptoms: [
      'Dry, flaking, or rough skin texture',
      'Superficial itching without pus formation',
      'Mild erythema (redness) from friction or dry weather',
    ],
    generalSelfCare: [
      'Apply fragrance-free emollients or petroleum jelly immediately after bathing while skin is still damp.',
      'Take short lukewarm showers rather than prolonged hot water baths.',
      'Use gentle soap-free cleansers and avoid scrubbing irritated areas with loofahs.',
      'Wear loose-fitting, soft cotton clothing.',
    ],
    medicineCategories: [
      {
        name: 'Emollients & Barrier Creams',
        description: 'Restore skin lipid moisture barriers and prevent transepidermal water loss.',
        commonExamples: ['Liquid paraffin', 'Ceramide creams', 'Calamine lotion'],
      },
      {
        name: 'Oral Antihistamines',
        description: 'May relieve systemic histamine-driven nocturnal itching.',
        commonExamples: ['Cetirizine'],
      },
    ],
    relatedMedicineIds: ['cetirizine'],
    importantPrecautions: [
      'Do not apply over-the-counter potent steroid creams to unexplained skin rashes without dermatological prescription.',
      'Avoid scratching to prevent secondary bacterial infection (impetigo / cellulitis).',
    ],
    whenToContactDoctor: [
      'Rash spreading rapidly across large surface areas of the body.',
      'Pus, honey-colored crusting, or worsening pain developing.',
      'Lack of improvement after one week of gentle moisturizing care.',
    ],
    emergencyWarningSigns: [
      'Rash accompanied by fever, skin peeling, or mucosal blistering around mouth/eyes (suspected SJS/TEN - medical emergency)',
    ],
    clinicalDisclaimer:
      'Educational dermatological guidance only. Never self-administer topical steroid combinations.',
  },
  {
    id: 'eye-ear',
    name: 'Mild Eye Strain & Ear Discomfort',
    hindiName: 'आंखों का तनाव और कान में हल्की परेशानी',
    category: 'EYE_EAR',
    categoryLabel: 'Eye & Ear',
    iconName: 'Wind',
    shortSummary: 'Digital screen fatigue, mild environmental eye dryness, and non-painful ear sensation.',
    overview:
      'Prolonged screen usage leads to reduced blinking rates and digital eye strain. Mild ear discomfort often arises from pressure changes or water entry during bathing.',
    commonSymptoms: [
      'Burning, tired sensation in eyes after computer work',
      'Mild dry eye sensation or foreign body awareness',
      'Mild fullness in ear after swimming or air travel',
    ],
    generalSelfCare: [
      'Practice conscious blinking and take regular screen breaks.',
      'Adjust screen brightness and eliminate direct glare.',
      'NEVER insert cotton swabs (Q-tips), hairpins, or sharp objects into ear canals.',
      'Dry ears gently with a towel after swimming; tilt head to allow water exit.',
    ],
    medicineCategories: [
      {
        name: 'Lubricating Eye Drops',
        description: 'Preservative-free artificial tears help replenish ocular tear film.',
        commonExamples: ['Carboxymethylcellulose 0.5%'],
      },
    ],
    relatedMedicineIds: ['saline-nasal'],
    importantPrecautions: [
      'Never instill random over-the-counter eye or ear drops without medical examination.',
      'Do not wear contact lenses while eyes are irritated or red.',
    ],
    whenToContactDoctor: [
      'Eye redness accompanied by discharge, mattering, or crusting.',
      'Ear pain, drainage, or noticeable hearing reduction.',
    ],
    emergencyWarningSigns: [
      'Sudden loss or blurring of vision in one or both eyes',
      'Severe deep eye pain or seeing halos around lights',
      'Foreign body or chemical splash into the eye (flush immediately for 15 minutes and seek ER)',
    ],
    clinicalDisclaimer:
      'Ophthalmological symptoms require clinical slit-lamp evaluation to prevent permanent vision compromise.',
  },
  {
    id: 'oral-health',
    name: 'Mouth Ulcers & Gum Irritation',
    hindiName: 'मुंह के छाले और मसूड़ों में जलन',
    category: 'ORAL_HEALTH',
    categoryLabel: 'Oral Health',
    iconName: 'Shield',
    shortSummary: 'Aphthous stomatitis (canker sores), minor gum tenderness, and oral hygiene.',
    overview:
      'Recurrent aphthous stomatitis (canker sores) are benign, non-contagious small oral ulcers that develop on inner lips, cheeks, or tongue. They typically heal spontaneously within 7 to 10 days.',
    commonSymptoms: [
      'Small round or oval ulcers with a whitish-yellow center and red border',
      'Sharp stinging pain provoked by spicy, salty, or acidic foods',
      'Mild localized gum tenderness from vigorous brushing',
    ],
    generalSelfCare: [
      'Rinse with warm saltwater (half teaspoon in warm water) 2–3 times daily.',
      'Avoid spicy, acidic, citrus, and hard crunchy foods that mechanically irritate the ulcer.',
      'Use a soft-bristled toothbrush and maintain gentle daily oral hygiene.',
      'Stay hydrated and ensure adequate dietary intake of B-complex vitamins and iron.',
    ],
    medicineCategories: [
      {
        name: 'Oral Barrier Gels & Antiseptics',
        description: 'Provide a protective soothing film and promote hygienic mucosal recovery.',
        commonExamples: ['Chlorhexidine mouthwash', 'Choline salicylate / Lignocaine oral gel'],
      },
    ],
    relatedMedicineIds: ['antacid'],
    importantPrecautions: [
      'Do not apply raw chemicals or unverified home powders directly onto ulcers.',
      'Ulcers persisting beyond 2 weeks must be physically examined by a dental or ENT specialist.',
    ],
    whenToContactDoctor: [
      'Ulcers unusually large, extensive, or unusually painful.',
      'Ulcers lasting more than 2–3 weeks without healing.',
      'Frequent recurrent crops interfering with fluid intake or nutrition.',
    ],
    emergencyWarningSigns: [
      'Inability to swallow saliva or fluids leading to dehydration',
      'Ulcers accompanied by high fever or skin rashes across the body',
    ],
    clinicalDisclaimer:
      'Non-healing oral lesions persisting over 2 weeks mandate specialist biopsy to exclude malignancy.',
  },
  {
    id: 'child-health',
    name: 'Pediatric Care & Child Health Precautions',
    hindiName: 'बच्चों का स्वास्थ्य और विशेष सावधानियां',
    category: 'CHILD_HEALTH',
    categoryLabel: 'Child Health',
    iconName: 'HeartPulse',
    shortSummary: 'Crucial clinical safety guidance on pediatric medication, dosing, and red flags.',
    overview:
      'Children are not miniature adults. Their liver enzymes, renal filtration rates, and body surface ratios differ significantly from adults. Medication in pediatric patients requires extreme clinical precision based on exact body weight rather than estimated age.',
    commonSymptoms: [
      'Pediatric fever, fussiness, and lethargy',
      'Reduced fluid intake or wet diaper count',
      'Viral cough and nasal congestion in young children',
    ],
    generalSelfCare: [
      'Prioritize continuous hydration: breastmilk/formula for infants; ORS, water, and broths for older children.',
      'Dress in light clothing; maintain a comfortable room temperature.',
      'Use only the exact calibrated oral syringe or measuring cup supplied with the medication.',
      'Keep a detailed written log of medication times and amounts administered.',
    ],
    medicineCategories: [
      {
        name: 'Pediatric Antipyretic Suspensions',
        description: 'Strictly weight-dosed Paracetamol pediatric oral drops or syrup.',
        commonExamples: ['Pediatric Paracetamol Oral Suspension (100mg/ml or 120mg/5ml)'],
      },
      {
        name: 'Pediatric Oral Rehydration',
        description: 'Crucial for replenishing fluid losses during viral gastroenteritis.',
        commonExamples: ['WHO-Formula ORS solutions', 'Zinc supplements (for diarrhea under clinical guidance)'],
      },
    ],
    relatedMedicineIds: ['paracetamol', 'ors', 'zinc'],
    importantPrecautions: [
      'CRITICAL: NEVER give Aspirin to anyone under 19 years old (Reye syndrome risk).',
      'NEVER estimate doses using household teaspoons or soup spoons; use a calibrated syringe.',
      'NEVER give over-the-counter adult cough or cold medications to young children.',
      'NEVER administer honey to infants under 12 months (infant botulism risk).',
    ],
    whenToContactDoctor: [
      'Fever in any baby under 3 months of age mandates urgent emergency evaluation.',
      'Child refusing all liquids or producing significantly fewer wet diapers (under 4 in 24 hours).',
      'Fever lasting more than 48–72 hours.',
    ],
    emergencyWarningSigns: [
      'Labored breathing: nostrils flaring, chest pulling inward between ribs (retractions)',
      'Extreme lethargy: unusually floppy, unable to make eye contact, or difficult to wake up',
      'Inconsolable high-pitched crying or grunting sounds with every breath',
      'Blueish coloration around lips or tongue (central cyanosis)',
    ],
    clinicalDisclaimer:
      'Pediatric dosing must be calculated by a registered pediatrician according to exact body weight. Do not extrapolate adult doses.',
  },
  {
    id: 'other-concerns',
    name: 'Travel Wellness & Seasonal Health',
    hindiName: 'यात्रा स्वास्थ्य और मौसमी बदलाव',
    category: 'OTHER',
    categoryLabel: 'Other Concerns',
    iconName: 'Compass',
    shortSummary: 'Motion sickness guidance, seasonal humidity transitions, and travel wellness tips.',
    overview:
      'Motion sickness (kinetosis) arises when the inner ear vestibular system, eyes, and proprioceptors send conflicting sensory signals to the brain during travel in vehicles, planes, or boats.',
    commonSymptoms: [
      'Queasiness, nausea, and pale clammy skin during transit',
      'Dizziness, excessive yawning, and cold sweats',
      'Mild headache triggered by motion',
    ],
    generalSelfCare: [
      'Sit in positions with minimal motion: front seat of car, over airplane wings, or mid-deck on boats.',
      'Keep eyes focused on the stable horizon; avoid reading books or using mobile screens in moving vehicles.',
      'Ensure cool fresh air flow; open car windows or point overhead airplane air vents toward face.',
      'Consume a light non-greasy snack before traveling; avoid heavy fried foods or alcohol.',
    ],
    medicineCategories: [
      {
        name: 'Anti-motion Sickness Agents',
        description: 'Provide prophylaxis against vestibular nausea when taken prior to transit.',
        commonExamples: ['Dimenhydrinate', 'Promethazine teoclate (prescription only)'],
      },
    ],
    relatedMedicineIds: ['ors'],
    importantPrecautions: [
      'Most motion sickness medications cause marked drowsiness; never take if you are driving.',
      'Preventive travel medicines are most effective when taken 30–60 minutes before departure, not after nausea begins.',
    ],
    whenToContactDoctor: [
      'Severe vomiting preventing fluid intake during or following travel.',
      'Symptoms persisting long after travel has concluded.',
    ],
    emergencyWarningSigns: [
      'Severe dehydration, confusion, or inability to retain fluids for over 24 hours',
    ],
    clinicalDisclaimer:
      'Educational guide only. Consult a doctor for travel medicine prophylaxis and required travel immunizations.',
  },
];
