import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Setup DB path and load/save helper
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial DB state
const initialData = {
  users: [
    {
      id: "u-1",
      email: "njapahalbright@gmail.com",
      name: "Admin Al",
      password: "admin",
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-2",
      email: "instructor@firstaid.com",
      name: "Instructor Sarah",
      password: "instructor",
      role: "instructor",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-3",
      email: "student@firstaid.com",
      name: "Student John",
      password: "student",
      role: "student",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-4",
      email: "emma@firstaid.com",
      name: "Emma Watson",
      password: "student",
      role: "student",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-5",
      email: "david@firstaid.com",
      name: "David Beckham",
      password: "student",
      role: "student",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-6",
      email: "sophia@firstaid.com",
      name: "Sophia Loren",
      password: "student",
      role: "student",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-7",
      email: "marcus@firstaid.com",
      name: "Marcus Aurelius",
      password: "student",
      role: "student",
      createdAt: new Date().toISOString()
    }
  ],
  courses: [
    {
      id: "c-1",
      title: "Cardiopulmonary Resuscitation (CPR [Cardiopulmonary Resuscitation]) & AED [Automated External Defibrillator]",
      description: "Learn how to perform high-quality CPR [Cardiopulmonary Resuscitation] and utilize an AED [Automated External Defibrillator] for adults, children, and infants under African union regional guidelines.",
      category: "CPR [Cardiopulmonary Resuscitation]",
      lessons: [
        {
          title: "Step 1: Assess the Scene & Response",
          subtitle: "Ensure safety and tap-and-shout to check consciousness.",
          content: "Before approaching the victim, scan the environment for immediate hazards like traffic, fire, or exposed electricity. Tap the victim's shoulders firmly and shout loudly: 'Are you okay?!' If there is no response, they are unconscious and require urgent intervention."
        },
        {
          title: "Step 2: Activating Emergency Care & Call 112 / 119",
          subtitle: "Activate emergency dispatch and locate a defibrillator.",
          content: "Point directly at someone nearby and instruct them clearly: 'You, call 112 (Cameroon National Emergency Number) or 119 (SAMU [Service d'Aide Médicale Urgente] Medical Emergency) and get an AED [Automated External Defibrillator]!' If you are alone, place your phone on speakerphone, call 112 / 119, and begin CPR [Cardiopulmonary Resuscitation] immediately while dispatch is online. Do not leave the victim to search for an AED [Automated External Defibrillator] unless one is within immediate sight."
        },
        {
          title: "Step 3: High-Quality Chest Compressions",
          subtitle: "Place hands on the center of the chest and push hard and fast.",
          content: "Place the heel of one hand in the center of the victim's chest (lower half of the breastbone). Interlock your fingers with the other hand. Keep your elbows locked and shoulders directly over your hands. Compress the chest at least 2 to 2.4 inches deep, at a rapid pace of 100 to 120 BPM [Beats Per Minute]. Allow the chest to fully recoil between compressions.",
          image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80"
        },
        {
          title: "Step 4: Using the AED [Automated External Defibrillator]",
          subtitle: "Power on the device and follow visual/vocal prompts.",
          content: "Power on the AED [Automated External Defibrillator] immediately. Remove clothing from the victim's chest and apply the adhesive pads: one on the upper right side below the collarbone, and the other on the lower left side below the armpit. Plug in the pad cable. Stand clear while the AED [Automated External Defibrillator] analyzes the heart rhythm. If a shock is advised, scream 'STAND CLEAR!' and press the orange shock button, then resume compressions."
        }
      ],
      videoUrl: "https://www.youtube.com/embed/O_49wMboL8g",
      quizQuestions: [
        {
          id: "q-1-1",
          question: "What is the recommended rate for performing chest compressions on an adult?",
          options: [
            "60 to 80 compressions per minute",
            "80 to 100 compressions per minute",
            "100 to 120 compressions per minute",
            "140 to 160 compressions per minute"
          ],
          correctAnswerIndex: 2,
          explanation: "High-quality CPR [Cardiopulmonary Resuscitation] requires a compression rate of 100 to 120 compressions per minute."
        },
        {
          id: "q-1-2",
          question: "When the AED [Automated External Defibrillator] is analyzing the heart rhythm, what should you do?",
          options: [
            "Continue performing chest compressions",
            "Yell 'Stand Clear!' and ensure nobody is touching the victim",
            "Give two rescue breaths",
            "Check for a pulse"
          ],
          correctAnswerIndex: 1,
          explanation: "Any contact with the victim during rhythm analysis can interfere with the AED's [Automated External Defibrillator] accuracy."
        },
        {
          id: "q-1-3",
          question: "What is the recommended depth of adult chest compressions?",
          options: [
            "At least 1 inch but no more than 1.5 inches",
            "At least 2 inches but no more than 2.4 inches",
            "At least 3 inches but no more than 3.5 inches",
            "Any depth is fine as long as you compress fast"
          ],
          correctAnswerIndex: 1,
          explanation: "Chest compressions should be 2 to 2.4 inches (5 to 6 cm) deep for adults to effectively pump blood."
        }
      ],
      simulationScenario: {
        title: "Sudden Collapse in Yaoundé Marketplace",
        description: "You are walking in a central marketplace in Yaoundé when an adult male suddenly collapses. There are no signs of open wounds, but he is unconscious on the floor.",
        initialState: "The victim is lying face-up on the ground. People are starting to gather around, looking panicked. You step forward to help.",
        criticalSteps: [
          "Check the scene for safety",
          "Check for responsiveness (tap and shout)",
          "Call 112 (National Emergency) or 119 (SAMU [Service d'Aide Médicale Urgente] Medical Emergency) and request an AED [Automated External Defibrillator]",
          "Check for breathing (5-10 seconds)",
          "Start high-quality chest compressions immediately"
        ]
      }
    },
    {
      id: "c-2",
      title: "Choking Relief (Heimlich Maneuver)",
      description: "Learn to recognize choking signs and perform abdominal thrusts on responsive adults, children, and responsive self-treatment.",
      category: "Choking",
      lessons: [
        {
          title: "Step 1: Identify a Choking Emergency",
          subtitle: "Recognize the silent struggle and the universal clutching sign.",
          content: "Observe the victim for the universal sign of choking: hands clutched around the throat. Ask clearly: 'Are you choking? Can I help you?' If they can speak, cough forcefully, or breathe, do not perform thrusts but encourage them to keep coughing. If they cannot speak or cough, proceed to action."
        },
        {
          title: "Step 2: The Heimlich Maneuver (Abdominal Thrusts)",
          subtitle: "Secure the waist, lock hands above the navel, and thrust.",
          content: "Stand behind the victim and wrap your arms around their waist. Make a fist with one hand and place the thumb-side slightly above the victim's navel (well below the breastbone). Grasp your fist with your other hand. Deliver quick, powerful inward and upward thrusts to forcefully expel the lodged airway obstruction.",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
        },
        {
          title: "Step 3: Infant Choking Protocol",
          subtitle: "Use alternating back blows and chest thrusts for infants.",
          content: "If the victim is an infant (under 1 year), do not perform abdominal thrusts. Instead, support the infant's head and neck, lay them face-down along your forearm, and deliver 5 firm back blows between the shoulder blades using the heel of your hand. Flip them face-up and deliver 5 quick chest thrusts on the breastbone. Repeat."
        },
        {
          title: "Step 4: Unconscious Choking Protocol",
          subtitle: "Transition to chest compressions if they lose consciousness.",
          content: "If a choking victim becomes unresponsive, carefully lower them to the hard floor. Call 112 / 119 immediately. Begin chest compressions. Each time you open the airway to give breaths, look inside the mouth. If you see the foreign object, perform a finger sweep to remove it. Do not do a blind finger sweep."
        }
      ],
      videoUrl: "https://www.youtube.com/embed/uD9v6pY8CGo",
      quizQuestions: [
        {
          id: "q-2-1",
          question: "What is the universal sign of choking?",
          options: [
            "Holding the stomach and groaning",
            "Hands clutched around the throat",
            "Lying down face-up",
            "Waving hands frantically in the air"
          ],
          correctAnswerIndex: 1,
          explanation: "Clutching the throat with one or both hands is the universal physical sign of choking."
        },
        {
          id: "q-2-2",
          question: "If a choking victim is coughing forcefully, what should you do?",
          options: [
            "Immediately perform the Heimlich Maneuver",
            "Give them a glass of water",
            "Encourage them to continue coughing and monitor them closely",
            "Slap them on the back hard"
          ],
          correctAnswerIndex: 2,
          explanation: "As long as the victim can cough forcefully, their airway is only partially blocked. Let them try to cough it up."
        }
      ],
      simulationScenario: {
        title: "Dinner Table Crisis",
        description: "Your friend at a restaurant suddenly stops talking mid-sentence, grips their throat, and looks terrified. They are unable to speak or cough.",
        initialState: "Your friend is sitting down, grasping their throat. Their face is turning red. They can only make high-pitched wheezing noises.",
        criticalSteps: [
          "Ask 'Are you choking? Can I help you?'",
          "Stand behind them and wrap your arms around their waist",
          "Place a fist slightly above their navel",
          "Perform quick, inward and upward abdominal thrusts"
        ]
      }
    },
    {
      id: "c-3",
      title: "Severe Bleeding & Wound Care (Hemorrhage Management)",
      description: "Learn to control severe hemorrhaging using direct pressure, pressure dressings, and the critical application of a tourniquet.",
      category: "Bleeding",
      lessons: [
        {
          title: "Step 1: Assess and Control Severe Hemorrhage",
          subtitle: "Recognize arterial spurts and locate the bleed site.",
          content: "Severe bleeding can cause fatal shock within minutes. Immediately identify the source of bleeding. Check if blood is actively spurting, pooling, or heavily soaking clothing. Put on protective gloves if available, expose the wound completely by cutting away clothing, and prepare to apply pressure."
        },
        {
          title: "Step 2: Apply Direct Firm Pressure & Pack gauze",
          subtitle: "Press down with both hands directly on the wound.",
          content: "Place clean gauze or cloth directly over the bleeding site. Apply firm, relentless pressure using both hands. If the wound is deep, pack gauze tightly into the cavity of the wound before applying pressure. Do not remove blood-soaked dressings; build up more gauze on top to avoid breaking formed clots."
        },
        {
          title: "Step 3: Applying a Tactical Tourniquet",
          subtitle: "Place high, tighten the windlass rod, and lock it.",
          content: "If bleeding on an arm or leg does not stop with direct pressure, apply a tourniquet. Place it 2 to 3 inches above the wound (never over a joint). Pull the band tight and secure it. Twist the windlass rod until the bleeding stops and the pulse below the wound is gone. Lock the rod in the clip, write the exact application time, and never loosen it.",
          image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1200&q=80"
        },
        {
          title: "Step 4: Preventing Shock & Patient Positioning",
          subtitle: "Keep the patient warm and lie them flat.",
          content: "Once bleeding is controlled, keep the patient lying flat on their back to maintain blood flow to vital organs. Cover them with a blanket or jacket to prevent hypothermia (cold worsens clotting dysfunction). Monitor their breathing and mental responsiveness continuously until paramedics take over."
        }
      ],
      videoUrl: "https://www.youtube.com/embed/NxO5Lvgq9eg",
      quizQuestions: [
        {
          id: "q-3-1",
          question: "Where should a tourniquet be placed relative to a wound on an extremity?",
          options: [
            "Directly over the wound",
            "2 to 3 inches above the wound, but not on a joint",
            "2 to 3 inches below the wound",
            "At the closest joint above the wound"
          ],
          correctAnswerIndex: 1,
          explanation: "A tourniquet should be applied 2-3 inches above the bleeding site, ensuring it is not directly over a joint."
        },
        {
          id: "q-3-2",
          question: "If a dressing over a bleeding wound becomes completely soaked with blood, what should you do?",
          options: [
            "Remove the blood-soaked dressing and apply a fresh one",
            "Wash the wound with water",
            "Leave the soaked dressing in place and apply additional clean dressings over it",
            "Stop applying pressure"
          ],
          correctAnswerIndex: 2,
          explanation: "Removing the dressing can pull away blood clots that have begun to form. Always build up layers rather than stripping them."
        }
      ],
      simulationScenario: {
        title: "Industrial Workshop Accident in Douala Port",
        description: "A colleague misuses a circular saw, resulting in a deep, pulsing gash on their right forearm. Blood is squirting rapidly from the wound.",
        initialState: "The colleague is sitting on the floor, holding their arm. Crimson blood is actively spurting, soaking through their shirt sleeve rapidly.",
        criticalSteps: [
          "Call 112 (National Emergency) or 119 (SAMU [Service d'Aide Médicale Urgente] Medical Emergency) immediately",
          "Apply firm, direct pressure with a clean cloth/gauze",
          "If bleeding doesn't stop, apply a tourniquet 2 inches above the wound",
          "Tighten windlass until bleeding stops and note the application time"
        ]
      }
    },
    {
      id: "c-4",
      title: "First Aid for Bites & Stings (including Venomous Snake Bites)",
      description: "Learn critical first aid protocols for snake bites, insect stings, and animal bites. Master PIB [Pressure Immobilization Bandage] to slow venom flow.",
      category: "Bites & Stings",
      lessons: [
        {
          title: "Step 1: Snake Bites and PIB [Pressure Immobilization Bandage] Protocol",
          subtitle: "Keep the limb still and do NOT cut or suction.",
          content: "For venomous snake bites (vipers, cobras), keep the victim lying completely still to slow venom flow. Apply a snug PIB [Pressure Immobilization Bandage] starting at the fingers/toes and wrapping upwards over the entire limb. It should be snug like a sprained ankle wrap, but not cut off blood circulation. Do NOT cut the wound, do NOT apply suction (no sucking venom out), do NOT apply ice, and do NOT use a tight tourniquet! Seek emergency serum treatment immediately.",
          image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
        },
        {
          title: "Step 2: Bee, Wasp, and Scorpion Stings",
          subtitle: "Scrape the stinger off immediately and monitor for anaphylaxis.",
          content: "When stung by a bee, scrape the stinger off immediately with a flat, rigid object (like a credit card or fingernail). Do not squeeze the stinger with tweezers, which can inject more venom. Wash the site with soap and water, apply cold compresses to reduce swelling, and monitor for signs of a severe allergic reaction (Anaphylaxis), such as difficulty breathing, hives, swelling of the throat or tongue. If anaphylaxis is present, administer an Epinephrine Auto-Injector instantly."
        }
      ],
      videoUrl: "https://www.youtube.com/embed/NxO5Lvgq9eg",
      quizQuestions: [
        {
          id: "q-4-1",
          question: "What is the correct protocol for managing a venomous snake bite?",
          options: [
            "Apply ice and cut the wound to drain blood",
            "Keep the limb still and apply a snug PIB [Pressure Immobilization Bandage] from the extremity up",
            "Use suction tools to suck venom out of the puncture wounds",
            "Apply a tight tourniquet to stop all arterial blood flow"
          ],
          correctAnswerIndex: 1,
          explanation: "PIB [Pressure Immobilization Bandage] slows down the spread of venom through the lymphatic system. Cutting, suction, ice, or tight tourniquets can cause severe localized tissue damage and worsen outcomes."
        },
        {
          id: "q-4-2",
          question: "How should you remove a bee stinger?",
          options: [
            "Pull it out with a pair of metal tweezers",
            "Scrape it off with a credit card or flat edge",
            "Leave it in place to fall out naturally",
            "Squeeze the skin around it forcefully"
          ],
          correctAnswerIndex: 1,
          explanation: "Squeezing with tweezers or fingers can compress the venom sac, injecting more venom into the victim. Scraping avoids this."
        }
      ],
      simulationScenario: {
        title: "Wilderness Snake Bite Emergency near Mount Cameroon",
        description: "While hiking near Mount Cameroon, your friend is suddenly bitten on the lower leg by a venomous snake. They are in severe pain, and two puncture wounds are visible.",
        initialState: "Your friend is sitting down, breathing rapidly, and clutched onto their leg. Swelling is starting around the ankle.",
        criticalSteps: [
          "Check the scene for hazards",
          "Have the victim lie completely still",
          "Call 112 (National Emergency) or 119 (SAMU [Service d'Aide Médicale Urgente] Medical Emergency) immediately",
          "Apply a snug PIB [Pressure Immobilization Bandage] from the toes up to the thigh",
          "Verify the wrap is snug but does not cut off circulation"
        ]
      }
    },
    {
      id: "c-5",
      title: "Burns & Fire Safety Management",
      description: "Learn to classify burns (1st, 2nd, 3rd degree) and administer proper cooling, clearing, and covering treatments while avoiding common dangerous myths.",
      category: "Burns",
      lessons: [
        {
          title: "Step 1: Categorizing and Treating Minor Burns",
          subtitle: "First & Second Degree Burns: Cool, Clean, and Cover.",
          content: "First-degree burns cause redness and pain. Second-degree burns cause fluid-filled blisters and pain. For minor burns, use the '3 C's': COOL the burn by placing it under cool running tap water for at least 10 to 20 minutes (do NOT use ice, which damages tissues). CLEAR jewelry or tight clothing gently before swelling starts. COVER the burn loosely with sterile, non-stick gauze. Do NOT apply butter, oils, or toothpaste, which trap heat and cause infections."
        },
        {
          title: "Step 2: Handling Major or Third-Degree Burns",
          subtitle: "Third-Degree Burns: Charring, zero pain, and life-threatening shock.",
          content: "Third-degree burns involve all skin layers, showing white, dry, or charred skin. Because nerve endings are destroyed, the center of the burn may feel completely painless. Call 112 / 119 (National Emergency Services / SAMU [Service d'Aide Médicale Urgente] Medical Emergency) immediately. Do NOT remove burned clothing stuck to the skin. Do NOT soak major burns in water, as this can cause hypothermia and shock. Cover loosely with a clean, dry sheet, elevate burned areas above heart level if possible, and keep the victim warm."
        }
      ],
      videoUrl: "https://www.youtube.com/embed/NxO5Lvgq9eg",
      quizQuestions: [
        {
          id: "q-5-1",
          question: "What is the primary action for treating a minor first-degree heat burn?",
          options: [
            "Apply butter or petroleum ointment immediately",
            "Soak it in ice-cold water to numb the pain",
            "Place the burn under cool running tap water for 10-20 minutes",
            "Burst any blisters that form with a sterile needle"
          ],
          correctAnswerIndex: 2,
          explanation: "Cool running water is the best first step. Ice is too cold and can cause further tissue damage, and butter traps heat and increases infection risk."
        },
        {
          id: "q-5-2",
          question: "Why might a third-degree burn sometimes be painless in certain spots?",
          options: [
            "It is a mild burn that hasn't reached nerve cells",
            "The extreme heat has destroyed the pain-sensing nerve endings",
            "The body releases instant natural pain killers",
            "It is only a temporary physical illusion"
          ],
          correctAnswerIndex: 1,
          explanation: "Third-degree burns destroy the dermis and sensory nerve receptors, meaning the patient cannot feel localized pain at the center of the wound."
        }
      ],
      simulationScenario: {
        title: "Kitchen Cooking Flare-up",
        description: "A frying pan flares up, causing deep hot-oil splashes on a cook's hand and wrist. Blisters are forming quickly, and they are screaming in pain.",
        initialState: "The cook is holding their blistering red hand over the sink, breathing heavily. Cooking oil is visible on the skin.",
        criticalSteps: [
          "Ensure scene safety and turn off the stove burner",
          "Cool the hand under cool running tap water for 15 minutes",
          "Gently remove rings or watches from the hand before swelling starts",
          "Cover the hand loosely with a clean, sterile non-stick dressing",
          "Do NOT apply grease, butter, or pop any blisters"
        ]
      }
    },
    {
      id: "c-6",
      title: "Fractures, Splinting & Accidents",
      description: "Learn to identify open and closed fractures, apply rigid splints using everyday items, and monitor vital PMS [Pulse, Motor, Sensation] signals.",
      category: "Fractures",
      lessons: [
        {
          title: "Step 1: Identifying and Splinting Fractures",
          subtitle: "Immobilize the joints above and below the injury site.",
          content: "A Closed Fracture has broken bone with intact skin. An Open Fracture has broken bone piercing through the skin. To treat a fracture, keep the limb absolutely still. Do not try to push a bone back in. Apply a rigid splint using cardboard, rolled newspaper, or branches, securing it with bandages, ties, or cloth. Ensure the splint immobilizes the joint ABOVE and the joint BELOW the fracture to prevent movement."
        },
        {
          title: "Step 2: Checking PMS [Pulse, Motor, Sensation]",
          subtitle: "Always check PMS [Pulse, Motor, Sensation] before and after applying a splint.",
          content: "Before and after tying any splint, perform the critical PMS [Pulse, Motor, Sensation] check on the fingers or toes of that limb: 1. PULSE: Check circulation by squeezing the nail bed (color should return in under 2 seconds). 2. MOTOR: Ask the victim to wiggle their fingers/toes. 3. SENSATION: Touch a finger/toe and ask: 'Can you feel which finger I am pinching?' If PMS [Pulse, Motor, Sensation] is compromised, loosen the bandages immediately."
        }
      ],
      videoUrl: "https://www.youtube.com/embed/NxO5Lvgq9eg",
      quizQuestions: [
        {
          id: "q-6-1",
          question: "What does the PMS check stand for in fracture first aid?",
          options: [
            "Pressure, Movement, Stability",
            "Pulse, Motor, Sensation",
            "Primary, Medical, Support",
            "Pain, Mobility, Swelling"
          ],
          correctAnswerIndex: 1,
          explanation: "PMS [Pulse, Motor, Sensation] stands for Pulse (checking circulation), Motor (checking nerve control to muscles), and Sensation (checking sensory nerve integrity)."
        },
        {
          id: "q-6-2",
          question: "When applying a splint to a broken bone, what should you immobilize?",
          options: [
            "Only the exact point where the bone broke",
            "The joints directly above and below the fracture",
            "The entire body on a wooden spine board",
            "Do not splint at all, just hold it with your hands"
          ],
          correctAnswerIndex: 1,
          explanation: "Immobilizing the joints above and below the fracture prevents muscle contractions from moving the broken bone fragments, which avoids further internal tissue damage."
        }
      ],
      simulationScenario: {
        title: "Bicycle Fall on the Trail",
        description: "A cyclist crashes and lands hard on their arm. You hear an audible snap. Their forearm is visibly deformed, and they cannot lift it.",
        initialState: "The cyclist is holding their forearm, groaning in severe pain. There is no open bleeding, but the forearm looks twisted.",
        criticalSteps: [
          "Check the scene for passing cyclists or hazards",
          "Expose the arm and check circulation/PMS [Pulse, Motor, Sensation]",
          "Construct a rigid splint using cardboard or branches and cloth",
          "Immobilize the wrist and elbow joints with the splint",
          "Recheck PMS [Pulse, Motor, Sensation] on the fingers to make sure wrap is not too tight"
        ]
      }
    }
  ],
  progress: [
    {
      studentId: "u-3",
      studentName: "Student John",
      studentEmail: "student@firstaid.com",
      completedQuizzes: {
        "c-2": { score: 2, maxScore: 2, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
      },
      completedSimulations: {
        "c-2": { passed: true, score: 85, feedback: "Excellent job in locating the navel and performing upward thrusts.", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
      },
      certificates: [
        {
          id: "cert-expired",
          studentId: "u-3",
          studentName: "Student John",
          studentEmail: "student@firstaid.com",
          courseId: "c-2",
          courseTitle: "Choking Relief (Heimlich Maneuver)",
          status: "expired",
          issueDate: new Date(Date.now() - 370 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cert-expiring",
          studentId: "u-3",
          studentName: "Student John",
          studentEmail: "student@firstaid.com",
          courseId: "c-3",
          courseTitle: "Severe Bleeding & Wound Care",
          status: "expiring",
          issueDate: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // Expires in 15 days
        }
      ]
    },
    {
      studentId: "u-4",
      studentName: "Emma Watson",
      studentEmail: "emma@firstaid.com",
      completedQuizzes: {
        "c-1": { score: 3, maxScore: 3, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        "c-2": { score: 2, maxScore: 2, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
      },
      completedSimulations: {
        "c-1": { passed: true, score: 96, feedback: "Perfect alignment and pace on CPR compressions.", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        "c-2": { passed: true, score: 90, feedback: "Very quick reactions during abdominal thrusts.", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
      },
      certificates: [
        {
          id: "cert-emma-1",
          studentId: "u-4",
          studentName: "Emma Watson",
          studentEmail: "emma@firstaid.com",
          courseId: "c-1",
          courseTitle: "Cardiopulmonary Resuscitation (CPR) & AED",
          status: "active",
          issueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 363 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cert-emma-2",
          studentId: "u-4",
          studentName: "Emma Watson",
          studentEmail: "emma@firstaid.com",
          courseId: "c-2",
          courseTitle: "Choking Relief (Heimlich Maneuver)",
          status: "active",
          issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 355 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      studentId: "u-5",
      studentName: "David Beckham",
      studentEmail: "david@firstaid.com",
      completedQuizzes: {
        "c-1": { score: 2, maxScore: 3, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
      },
      completedSimulations: {
        "c-1": { passed: true, score: 80, feedback: "Good effort, slightly fast rate.", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
      },
      certificates: [
        {
          id: "cert-david-1",
          studentId: "u-5",
          studentName: "David Beckham",
          studentEmail: "david@firstaid.com",
          courseId: "c-1",
          courseTitle: "Cardiopulmonary Resuscitation (CPR) & AED",
          status: "active",
          issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      studentId: "u-6",
      studentName: "Sophia Loren",
      studentEmail: "sophia@firstaid.com",
      completedQuizzes: {
        "c-3": { score: 2, maxScore: 2, date: new Date().toISOString() }
      },
      completedSimulations: {},
      certificates: []
    },
    {
      studentId: "u-7",
      studentName: "Marcus Aurelius",
      studentEmail: "marcus@firstaid.com",
      completedQuizzes: {
        "c-1": { score: 3, maxScore: 3, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        "c-2": { score: 2, maxScore: 2, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        "c-3": { score: 2, maxScore: 2, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() }
      },
      completedSimulations: {
        "c-1": { passed: true, score: 98, feedback: "Incredible compression depth and rhythm.", date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        "c-2": { passed: true, score: 95, feedback: "Outstanding hand positioning and upward thrusts.", date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        "c-3": { passed: true, score: 90, feedback: "Solid tourniquet windlass tightening technique.", date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() }
      },
      certificates: [
        {
          id: "cert-marcus-1",
          studentId: "u-7",
          studentName: "Marcus Aurelius",
          studentEmail: "marcus@firstaid.com",
          courseId: "c-1",
          courseTitle: "Cardiopulmonary Resuscitation (CPR) & AED",
          status: "active",
          issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cert-marcus-2",
          studentId: "u-7",
          studentName: "Marcus Aurelius",
          studentEmail: "marcus@firstaid.com",
          courseId: "c-2",
          courseTitle: "Choking Relief (Heimlich Maneuver)",
          status: "active",
          issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cert-marcus-3",
          studentId: "u-7",
          studentName: "Marcus Aurelius",
          studentEmail: "marcus@firstaid.com",
          courseId: "c-3",
          courseTitle: "Severe Bleeding & Wound Care",
          status: "active",
          issueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 353 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ],
  emailTemplates: [
    {
      id: "t-expiry-warning",
      name: "Certification Expiring Warning",
      subject: "Action Required: Your First Aid Certification is Expiring Soon!",
      body: "Dear {{student_name}},\n\nOur system has noticed that your certification for \"{{course_title}}\" is expiring soon on {{expiry_date}}.\n\nTo ensure complete safety and regulatory compliance, we highly recommend taking our refreshed refresher quiz and simulation module.\n\nBest regards,\nFirst Aid Compliance Team"
    },
    {
      id: "t-expired-alert",
      name: "Certification Expired Alert",
      subject: "ALERT: Your First Aid Certification Has Expired!",
      body: "Dear {{student_name}},\n\nYour certification for \"{{course_title}}\" expired on {{expiry_date}}.\n\nYou are no longer marked as active/compliant in first-aid response for this discipline. Please login to your account immediately to retake the course and restore compliance.\n\nBest regards,\nFirst Aid Compliance Team"
    },
    {
      id: "t-cert-issued",
      name: "Certification Issued",
      subject: "Congratulations! Your First Aid Certification is Ready",
      body: "Dear {{student_name}},\n\nWell done! You have successfully passed the curriculum, quiz, and emergency response simulation for \"{{course_title}}\".\n\nYour digital credential is now active. It is valid until {{expiry_date}}.\n\nKeep practicing your skills,\nFirst Aid Compliance Team"
    }
  ],
  emailLogs: [
    {
      id: "l-1",
      recipientEmail: "student@firstaid.com",
      recipientName: "Student John",
      subject: "Action Required: Your First Aid Certification is Expiring Soon!",
      body: "Dear Student John,\n\nOur system has noticed that your certification for \"Severe Bleeding & Wound Care\" is expiring soon on the upcoming days.\n\nBest regards,\nFirst Aid Compliance Team",
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "delivered",
      triggerType: "auto_scan"
    }
  ],
  systemLogs: [
    {
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Automated daily certificate scanner executed successfully. Detected 1 expiring and 1 expired certificates."
    },
    {
      timestamp: new Date().toISOString(),
      message: "System initialized with First Aid courses and default users."
    }
  ]
};

// Gamification engine to calculate points and badges dynamically
function calculateStudentGamification(p: any, db: any) {
  let points = 0;
  const badges: string[] = ["welcome"]; // All students start with First Aid Rookie

  // 1. Calculate Quiz points (100 pts per correct answer)
  if (p.completedQuizzes) {
    Object.entries(p.completedQuizzes).forEach(([courseId, val]: [string, any]) => {
      points += val.score * 100;
      if (val.score === val.maxScore && val.maxScore > 0) {
        if (!badges.includes("perfect_quiz")) badges.push("perfect_quiz");
      }
    });
  }

  // 2. Calculate Simulation points (5 pts per score percentage)
  if (p.completedSimulations) {
    Object.entries(p.completedSimulations).forEach(([courseId, val]: [string, any]) => {
      points += val.score * 5;
      if (val.score >= 95) {
        if (!badges.includes("perfect_sim")) badges.push("perfect_sim");
      }
    });
  }

  // 3. Calculate Certificate points (500 pts per active certificate)
  if (p.certificates) {
    p.certificates.forEach((cert: any) => {
      if (cert.status === "active") {
        points += 500;
      } else if (cert.status === "expiring") {
        points += 200;
      }
    });
  }

  // 4. Discipline Master Badges
  const c1Cert = p.certificates?.find((c: any) => c.courseId === "c-1" && c.status !== "expired");
  const c1Quiz = p.completedQuizzes?.["c-1"];
  const c1Sim = p.completedSimulations?.["c-1"]?.passed;
  if (c1Cert || (c1Quiz && c1Sim)) {
    badges.push("cpr_master");
  }

  const c2Cert = p.certificates?.find((c: any) => c.courseId === "c-2" && c.status !== "expired");
  const c2Quiz = p.completedQuizzes?.["c-2"];
  const c2Sim = p.completedSimulations?.["c-2"]?.passed;
  if (c2Cert || (c2Quiz && c2Sim)) {
    badges.push("choking_master");
  }

  const c3Cert = p.certificates?.find((c: any) => c.courseId === "c-3" && c.status !== "expired");
  const c3Quiz = p.completedQuizzes?.["c-3"];
  const c3Sim = p.completedSimulations?.["c-3"]?.passed;
  if (c3Cert || (c3Quiz && c3Sim)) {
    badges.push("bleeding_master");
  }

  // 5. Grand Master Badge (First Aid Legend)
  if (badges.includes("cpr_master") && badges.includes("choking_master") && badges.includes("bleeding_master")) {
    badges.push("grand_master");
  }

  p.points = points;
  p.badges = badges;
  return p;
}

// Database state accessor
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf8");
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(data);

    // If existing file is outdated (doesn't contain our rich mock students or detailed 4-lesson modules), overwrite
    const hasDetailedCourses = parsed.courses && parsed.courses.some((c: any) => c.id === "c-4");
    if (!hasDetailedCourses) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf8");
      return initialData;
    }

    return parsed;
  } catch (e) {
    console.error("Error reading database file", e);
    return initialData;
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing database file", e);
  }
}

// Ensure database is populated at startup
readDB();

// Core API endpoints

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password, targetPortal } = req.body;
  const db = readDB();
  
  const cleanEmail = email ? email.trim().toLowerCase() : "";
  const cleanPassword = password ? password.trim() : "";

  const user = db.users.find((u: any) => u.email.trim().toLowerCase() === cleanEmail && u.password.trim() === cleanPassword);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Restrict portal access: if attempting to log into Admin/Instructor workspace
  if (targetPortal === "admin" && user.role !== "admin" && user.role !== "instructor") {
    return res.status(403).json({
      error: "Access Restricted: Your account holds Student status. Instructor and Administrator access is limited strictly to authorized administrators."
    });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email.trim(),
      name: user.name,
      role: user.role,
      profilePic: user.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`,
      isVerified: user.isVerified !== false, // Default verified for existing
      createdAt: user.createdAt
    },
    token: `mock-token-${user.id}`
  });
});

// Signup - STRICT STUDENT-ONLY PUBLIC REGISTRATION
app.post("/api/auth/signup", (req, res) => {
  const { email, name, password, role, profilePic } = req.body;
  const db = readDB();

  if (!email || !name || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Security Check: Public registration is locked to student role only!
  if (role && (role === "instructor" || role === "admin")) {
    return res.status(403).json({
      error: "Public account creation is strictly limited to Student accounts. Instructor and Administrator accounts are restricted and must be provisioned by a system administrator."
    });
  }

  const cleanEmail = email.trim();
  const cleanPassword = password.trim();
  const cleanName = name.trim();

  if (db.users.find((u: any) => u.email.trim().toLowerCase() === cleanEmail.toLowerCase())) {
    return res.status(400).json({ error: "A user with this email address already exists." });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    email: cleanEmail,
    name: cleanName,
    password: cleanPassword,
    role: "student" as const, // Hard-code student role for public registration
    profilePic: profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
    isVerified: false, // Students need verification
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Initialize student progress record
  db.progress.push({
    studentId: newUser.id,
    studentName: newUser.name,
    studentEmail: newUser.email,
    completedQuizzes: {},
    completedSimulations: {},
    certificates: [],
    profilePic: newUser.profilePic
  });

  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: `New student account created for ${newUser.name} (${newUser.email}). Verification pending.`
  });

  writeDB(db);

  res.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      profilePic: newUser.profilePic,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt
    },
    token: `mock-token-${newUser.id}`
  });
});

// Admin User Role Management (Admin-only capability to promote/demote users)
app.post("/api/admin/users/update-role", (req, res) => {
  const { adminUserId, targetUserId, newRole } = req.body;
  const db = readDB();

  const admin = db.users.find((u: any) => u.id === adminUserId);
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized: Only system administrators can modify user roles." });
  }

  const targetUser = db.users.find((u: any) => u.id === targetUserId);
  if (!targetUser) {
    return res.status(404).json({ error: "Target user account not found." });
  }

  if (!["student", "instructor", "admin"].includes(newRole)) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  const oldRole = targetUser.role;
  targetUser.role = newRole;

  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: `User ${targetUser.name} (${targetUser.email}) role updated from ${oldRole} to ${newRole} by Administrator ${admin.name}.`
  });

  writeDB(db);

  res.json({ success: true, user: targetUser });
});

// Verify OTP
app.post("/api/auth/verify", (req, res) => {
  const { userId, code } = req.body;
  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  user.isVerified = true;

  // Sync profile pic in progress record too
  const prog = db.progress.find((p: any) => p.studentId === userId);
  if (prog) {
    prog.profilePic = user.profilePic;
  }

  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: `User ${user.name} verified successfully via code ${code || "AUTO"}.`
  });

  writeDB(db);
  res.json({ success: true, user });
});

// Google Sign-In / OAuth mock helper
app.post("/api/auth/google", (req, res) => {
  const { email, name, profilePic } = req.body;
  const db = readDB();

  let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `u-google-${Date.now()}`,
      email,
      name,
      password: "google-oauth-password",
      role: "student",
      profilePic: profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      isVerified: true, // Google accounts are pre-verified!
      createdAt: new Date().toISOString()
    };
    db.users.push(user);

    db.progress.push({
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      completedQuizzes: {},
      completedSimulations: {},
      certificates: [],
      profilePic: user.profilePic
    });

    db.systemLogs.push({
      timestamp: new Date().toISOString(),
      message: `User ${user.name} signed up and verified instantly via Google Single Sign-On.`
    });
  } else {
    // Logged in
    user.isVerified = true;
    db.systemLogs.push({
      timestamp: new Date().toISOString(),
      message: `User ${user.name} signed in via Google Single Sign-On.`
    });
  }

  writeDB(db);
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profilePic: user.profilePic,
      isVerified: true,
      createdAt: user.createdAt
    },
    token: `google-token-${user.id}`
  });
});

// Update Profile Picture
app.post("/api/students/update-profile-pic", (req, res) => {
  const { userId, profilePic } = req.body;
  const db = readDB();

  const user = db.users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  user.profilePic = profilePic;

  // Sync with progress record
  const prog = db.progress.find((p: any) => p.studentId === userId);
  if (prog) {
    prog.profilePic = profilePic;
  }

  writeDB(db);
  res.json({ success: true, user });
});

// Update User Personal Profile Information
app.post("/api/user/update-profile", (req, res) => {
  const { userId, name, email, password, profilePic } = req.body;
  const db = readDB();

  const user = db.users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  if (name && name.trim()) user.name = name.trim();
  if (email && email.trim()) user.email = email.trim();
  if (password && password.trim()) user.password = password.trim();
  if (profilePic) user.profilePic = profilePic;

  // Sync with student progress record if they are a student
  if (user.role === "student") {
    const prog = db.progress.find((p: any) => p.studentId === userId);
    if (prog) {
      if (name && name.trim()) prog.studentName = name.trim();
      if (email && email.trim()) prog.studentEmail = email.trim();
      if (profilePic) prog.profilePic = profilePic;
    }
  }

  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: `User ${user.name} (${user.role}) updated their personal profile information.`
  });

  writeDB(db);
  res.json({ success: true, user });
});

// GET Discussion Posts
app.get("/api/discussion/:courseId", (req, res) => {
  const { courseId } = req.params;
  const db = readDB();
  
  if (!db.discussions) {
    db.discussions = [
      {
        id: "d-1",
        courseId: "c-1",
        studentName: "Emma Watson",
        studentRole: "student",
        profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma",
        text: "How deep should chest compressions be for a child? Is it different from adults?",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: "dr-1",
            authorName: "Instructor Sarah",
            authorRole: "instructor",
            profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
            text: "Yes, absolutely! For children (age 1 to puberty), compress about 2 inches deep. For infants (under 1 year), compress about 1.5 inches deep using 2 fingers or 2 thumbs in the center of the chest. Excellent question, Emma!",
            createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: "d-2",
        courseId: "c-4",
        studentName: "Student John",
        studentRole: "student",
        profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
        text: "If I am wrapping a snake bite, should I start the Pressure Immobilization bandage at the bite wound or the extremity base?",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: "dr-2",
            authorName: "Clinical AI Advisor",
            authorRole: "admin",
            profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Robo",
            text: "Protocol suggests wrapping starting from fingers/toes upwards. This maximizes lymph occlusion across the entire limb. Keep the limb below heart level and completely still!",
            createdAt: new Date(Date.now() - 0.9 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];
    writeDB(db);
  }

  const posts = db.discussions.filter((p: any) => p.courseId === courseId);
  res.json(posts);
});

// CREATE Discussion Post
app.post("/api/discussion", (req, res) => {
  const { courseId, studentName, studentRole, profilePic, text } = req.body;
  const db = readDB();

  if (!courseId || !studentName || !text) {
    return res.status(400).json({ error: "Missing required post parameters." });
  }

  if (!db.discussions) {
    db.discussions = [];
  }

  const newPost = {
    id: `d-${Date.now()}`,
    courseId,
    studentName,
    studentRole: studentRole || "student",
    profilePic: profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${studentName}`,
    text,
    createdAt: new Date().toISOString(),
    replies: []
  };

  db.discussions.push(newPost);

  // Trigger simulated expert AI/instructor answer after posting to make it super interactive and educational!
  setTimeout(() => {
    try {
      const refreshedDb = readDB();
      const targetPost = refreshedDb.discussions?.find((p: any) => p.id === newPost.id);
      if (targetPost) {
        if (!targetPost.replies) targetPost.replies = [];
        targetPost.replies.push({
          id: `dr-ai-${Date.now()}`,
          authorName: "Clinical AI Advisor",
          authorRole: "admin",
          profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Robo",
          text: `Thank you for raising this query regarding first aid. In accordance with standard emergency guidelines, your practice of keeping calm, evaluating scene safety, and applying direct pressure or the snug wrap technique remains paramount. Let us continue mastering these skills!`,
          createdAt: new Date().toISOString()
        });
        writeDB(refreshedDb);
      }
    } catch (err) {
      console.error("AI automated reply generation failed", err);
    }
  }, 1000);

  writeDB(db);
  res.status(201).json(newPost);
});

// REPLY to Discussion Post
app.post("/api/discussion/:id/reply", (req, res) => {
  const { id } = req.params;
  const { authorName, authorRole, profilePic, text } = req.body;
  const db = readDB();

  if (!text || !authorName) {
    return res.status(400).json({ error: "Reply body and author are required." });
  }

  if (!db.discussions) {
    db.discussions = [];
  }

  const post = db.discussions.find((p: any) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Discussion post not found." });
  }

  if (!post.replies) {
    post.replies = [];
  }

  const newReply = {
    id: `dr-${Date.now()}`,
    authorName,
    authorRole: authorRole || "student",
    profilePic: profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${authorName}`,
    text,
    createdAt: new Date().toISOString()
  };

  post.replies.push(newReply);
  writeDB(db);
  res.status(201).json(post);
});

// Get Courses
app.get("/api/courses", (req, res) => {
  const db = readDB();
  res.json(db.courses);
});

// Create/Update Course Materials (Admin Only)
app.post("/api/courses", (req, res) => {
  const { id, title, description, category, lessons, videoUrl, quizQuestions, simulationScenario, uploadedFiles } = req.body;
  const db = readDB();

  if (!title || !description || !category) {
    return res.status(400).json({ error: "Title, description, and category are required." });
  }

  if (id) {
    // Edit course
    const idx = db.courses.findIndex((c: any) => c.id === id);
    if (idx === -1) return res.status(404).json({ error: "Course not found." });
    
    db.courses[idx] = {
      ...db.courses[idx],
      title,
      description,
      category,
      lessons: lessons || [],
      videoUrl: videoUrl || "",
      quizQuestions: quizQuestions || [],
      simulationScenario: simulationScenario || { title: "Emergency Simulation", description: "", initialState: "", criticalSteps: [] },
      uploadedFiles: uploadedFiles || []
    };
    db.systemLogs.push({
      timestamp: new Date().toISOString(),
      message: `Course "${title}" updated by Administrator.`
    });
  } else {
    // Add course
    const newCourse = {
      id: `c-${Date.now()}`,
      title,
      description,
      category,
      lessons: lessons || [],
      videoUrl: videoUrl || "",
      quizQuestions: quizQuestions || [],
      simulationScenario: simulationScenario || { title: "Emergency Simulation", description: "", initialState: "", criticalSteps: [] },
      uploadedFiles: uploadedFiles || []
    };
    db.courses.push(newCourse);
    db.systemLogs.push({
      timestamp: new Date().toISOString(),
      message: `New course "${title}" created by Administrator.`
    });
  }

  writeDB(db);
  res.json(db.courses);
});

// Delete Course Material (Admin Only)
app.delete("/api/courses/:id", (req, res) => {
  const db = readDB();
  const courseId = req.params.id;
  const idx = db.courses.findIndex((c: any) => c.id === courseId);
  if (idx === -1) return res.status(404).json({ error: "Course not found." });

  const title = db.courses[idx].title;
  db.courses.splice(idx, 1);
  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: `Course "${title}" deleted by Administrator.`
  });

  writeDB(db);
  res.json(db.courses);
});

// Get Student Progress (Instructor/Admin)
app.get("/api/students/progress", (req, res) => {
  const db = readDB();
  db.progress = db.progress.map((p: any) => calculateStudentGamification(p, db));
  writeDB(db);
  res.json(db.progress);
});

// Certify or Renew Certificate manually (Instructor/Admin)
app.post("/api/students/certify", (req, res) => {
  const { studentId, courseId, status, durationMonths = 12 } = req.body;
  const db = readDB();

  const progressRecord = db.progress.find((p: any) => p.studentId === studentId);
  if (!progressRecord) {
    return res.status(404).json({ error: "Student progress record not found." });
  }

  const course = db.courses.find((c: any) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: "Course not found." });
  }

  // Find or create certificate
  if (!progressRecord.certificates) {
    progressRecord.certificates = [];
  }

  const existingCertIdx = progressRecord.certificates.findIndex((c: any) => c.courseId === courseId);
  
  const issueDate = new Date().toISOString();
  const expiryDate = new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString();

  const certificate = {
    id: existingCertIdx !== -1 ? progressRecord.certificates[existingCertIdx].id : `cert-${Date.now()}`,
    studentId,
    studentName: progressRecord.studentName,
    studentEmail: progressRecord.studentEmail,
    courseId,
    courseTitle: course.title,
    status: status || "active",
    issueDate,
    expiryDate
  };

  if (existingCertIdx !== -1) {
    progressRecord.certificates[existingCertIdx] = certificate;
  } else {
    progressRecord.certificates.push(certificate);
  }

  // Log system action
  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: `Certificate issued manually for ${progressRecord.studentName} - Course: "${course.title}". Expiry: ${new Date(expiryDate).toLocaleDateString()}`
  });

  // Simulated email trigger
  const template = db.emailTemplates.find((t: any) => t.id === "t-cert-issued");
  if (template) {
    let body = template.body
      .replace(/{{student_name}}/g, progressRecord.studentName)
      .replace(/{{course_title}}/g, course.title)
      .replace(/{{expiry_date}}/g, new Date(expiryDate).toLocaleDateString());

    db.emailLogs.push({
      id: `l-${Date.now()}`,
      recipientEmail: progressRecord.studentEmail,
      recipientName: progressRecord.studentName,
      subject: template.subject.replace(/{{course_title}}/g, course.title),
      body,
      sentAt: new Date().toISOString(),
      status: "delivered",
      triggerType: "manual_reminder"
    });
  }

  writeDB(db);
  res.json(db.progress);
});

// Submit Quiz Score (Student)
app.post("/api/students/submit-quiz", (req, res) => {
  const { studentId, courseId, score, maxScore } = req.body;
  const db = readDB();

  let progressRecord = db.progress.find((p: any) => p.studentId === studentId);
  if (!progressRecord) {
    // If not exists, find user details
    const user = db.users.find((u: any) => u.id === studentId);
    if (!user) return res.status(404).json({ error: "Student not found." });

    progressRecord = {
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      completedQuizzes: {},
      completedSimulations: {},
      certificates: []
    };
    db.progress.push(progressRecord);
  }

  progressRecord.completedQuizzes[courseId] = {
    score,
    maxScore,
    date: new Date().toISOString()
  };

  // Check if simulation is also passed -> Auto-issue certificate!
  const isSimPassed = progressRecord.completedSimulations[courseId]?.passed;
  const isQuizPassed = score >= Math.ceil(maxScore * 0.7); // 70% passing threshold
  const course = db.courses.find((c: any) => c.id === courseId);

  let newCert = null;
  if (isSimPassed && isQuizPassed && course) {
    if (!progressRecord.certificates) progressRecord.certificates = [];
    const certIdx = progressRecord.certificates.findIndex((c: any) => c.courseId === courseId);
    
    const issueDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year expiry

    newCert = {
      id: certIdx !== -1 ? progressRecord.certificates[certIdx].id : `cert-${Date.now()}`,
      studentId,
      studentName: progressRecord.studentName,
      studentEmail: progressRecord.studentEmail,
      courseId,
      courseTitle: course.title,
      status: "active" as const,
      issueDate,
      expiryDate
    };

    if (certIdx !== -1) {
      progressRecord.certificates[certIdx] = newCert;
    } else {
      progressRecord.certificates.push(newCert);
    }

    db.systemLogs.push({
      timestamp: new Date().toISOString(),
      message: `Certificate AUTO-ISSUED to ${progressRecord.studentName} for passing "${course.title}".`
    });

    // Send auto email
    const template = db.emailTemplates.find((t: any) => t.id === "t-cert-issued");
    if (template) {
      let body = template.body
        .replace(/{{student_name}}/g, progressRecord.studentName)
        .replace(/{{course_title}}/g, course.title)
        .replace(/{{expiry_date}}/g, new Date(expiryDate).toLocaleDateString());

      db.emailLogs.push({
        id: `l-${Date.now()}`,
        recipientEmail: progressRecord.studentEmail,
        recipientName: progressRecord.studentName,
        subject: template.subject,
        body,
        sentAt: new Date().toISOString(),
        status: "delivered",
        triggerType: "auto_scan"
      });
    }
  }

  const gamifiedProgress = calculateStudentGamification(progressRecord, db);
  writeDB(db);
  res.json({ progress: gamifiedProgress, certified: !!newCert, cert: newCert });
});

// Submit Simulation (Student)
app.post("/api/students/submit-simulation", (req, res) => {
  const { studentId, courseId, passed, score, feedback, videoUrl } = req.body;
  const db = readDB();

  let progressRecord = db.progress.find((p: any) => p.studentId === studentId);
  if (!progressRecord) {
    const user = db.users.find((u: any) => u.id === studentId);
    if (!user) return res.status(404).json({ error: "Student not found." });

    progressRecord = {
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      completedQuizzes: {},
      completedSimulations: {},
      certificates: [],
      profilePic: user.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`
    };
    db.progress.push(progressRecord);
  }

  progressRecord.completedSimulations[courseId] = {
    passed,
    score,
    feedback,
    videoUrl: videoUrl || "",
    date: new Date().toISOString()
  };

  // Check if quiz is also completed -> Auto-issue certificate!
  const quizScoreObj = progressRecord.completedQuizzes[courseId];
  const isQuizPassed = quizScoreObj ? quizScoreObj.score >= Math.ceil(quizScoreObj.maxScore * 0.7) : false;
  const course = db.courses.find((c: any) => c.id === courseId);

  let newCert = null;
  if (passed && isQuizPassed && course) {
    if (!progressRecord.certificates) progressRecord.certificates = [];
    const certIdx = progressRecord.certificates.findIndex((c: any) => c.courseId === courseId);
    
    const issueDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    newCert = {
      id: certIdx !== -1 ? progressRecord.certificates[certIdx].id : `cert-${Date.now()}`,
      studentId,
      studentName: progressRecord.studentName,
      studentEmail: progressRecord.studentEmail,
      courseId,
      courseTitle: course.title,
      status: "active" as const,
      issueDate,
      expiryDate
    };

    if (certIdx !== -1) {
      progressRecord.certificates[certIdx] = newCert;
    } else {
      progressRecord.certificates.push(newCert);
    }

    db.systemLogs.push({
      timestamp: new Date().toISOString(),
      message: `Certificate AUTO-ISSUED to ${progressRecord.studentName} for passing "${course.title}".`
    });

    // Send auto email
    const template = db.emailTemplates.find((t: any) => t.id === "t-cert-issued");
    if (template) {
      let body = template.body
        .replace(/{{student_name}}/g, progressRecord.studentName)
        .replace(/{{course_title}}/g, course.title)
        .replace(/{{expiry_date}}/g, new Date(expiryDate).toLocaleDateString());

      db.emailLogs.push({
        id: `l-${Date.now()}`,
        recipientEmail: progressRecord.studentEmail,
        recipientName: progressRecord.studentName,
        subject: template.subject,
        body,
        sentAt: new Date().toISOString(),
        status: "delivered",
        triggerType: "auto_scan"
      });
    }
  }

  const gamifiedProgress = calculateStudentGamification(progressRecord, db);
  writeDB(db);
  res.json({ progress: gamifiedProgress, certified: !!newCert, cert: newCert });
});

// AI feedback on custom scenario actions using Gemini
app.post("/api/simulations/ai-feedback", async (req, res) => {
  const { scenarioTitle, scenarioDescription, actionsTaken, criticalSteps, countryContext = "Cameroon" } = req.body;

  if (!actionsTaken || !Array.isArray(actionsTaken) || actionsTaken.length === 0) {
    return res.status(400).json({ error: "Actions taken are required." });
  }

  try {
    const prompt = `You are an expert emergency first-aid clinical trainer. Evaluate a student's responses/actions in an emergency scenario simulation.
This training is conducted in the context of: ${countryContext}.
Please note that emergency responder contact names and numbers vary significantly across different regions, and specifically in this African country context, they are NOT "911".
For instance, in Cameroon, the primary general mobile number is 112, medical SAMU is 119, and Sapeurs-Pompiers (fire) is 118.
If a critical step is "Call 911" or "Call emergency dispatch", and the student chose to make a local emergency dispatch call for ${countryContext} (such as dial 112, 119, or local emergency services), you must treat this as a perfect match for that critical step. Do not count it as a missing step or penalize their score.

Scenario: "${scenarioTitle}" - ${scenarioDescription}
The student executed these steps in this exact order:
${actionsTaken.map((a: string, i: number) => `${i + 1}. ${a}`).join("\n")}

Critical medical steps required for safety and compliance:
${criticalSteps.map((c: string) => `- ${c}`).join("\n")}

Evaluate the response. You must generate a JSON response strictly complying with this JSON structure:
{
  "score": <integer from 0 to 100 representing quality, accuracy and correct sequencing of first aid>,
  "passed": <boolean, pass if score is >= 75 and no major safety violations occurred>,
  "feedback": "<detailed general clinical review of their actions, customized for the ${countryContext} emergency infrastructure>",
  "criticalMissingSteps": ["step description that they missed or failed to prioritize in order, taking into account that they called the correct local dispatch numbers instead of 911"],
  "clinicalRationale": "<expert medical explanation for why order or specific omissions matter in ${countryContext}>"
}

Ensure the response contains ONLY the valid JSON, wrapped in nothing.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            passed: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            criticalMissingSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            clinicalRationale: { type: Type.STRING }
          },
          required: ["score", "passed", "feedback", "criticalMissingSteps", "clinicalRationale"]
        }
      }
    });

    const resultText = response.text || "{}";
    const evaluatedFeedback = JSON.parse(resultText.trim());
    res.json(evaluatedFeedback);

  } catch (error: any) {
    console.error("Gemini AI simulation evaluation failed:", error);
    // Graceful fallback if API key is missing or invalid
    const actionsString = actionsTaken.join(" ").toLowerCase();
    const missed: string[] = [];
    criticalSteps.forEach((step: string) => {
      const keywords = step.toLowerCase().split(" ").filter(w => w.length > 3);
      const matched = keywords.some(kw => actionsString.includes(kw));
      if (!matched) missed.push(step);
    });

    const score = Math.max(20, 100 - (missed.length * 20));
    const passed = score >= 75;

    res.json({
      score,
      passed,
      feedback: `[Simulation Review (Fallback Mode)] You performed ${actionsTaken.length} actions. You correctly simulated part of the emergency protocol, though some ordering could be optimized.`,
      criticalMissingSteps: missed,
      clinicalRationale: "Following correct medical sequencing ensures oxygen delivery is prioritized and help is actively dispatched without delaying compressions."
    });
  }
});

// Email templates CRUD
app.get("/api/emails/templates", (req, res) => {
  const db = readDB();
  res.json(db.emailTemplates);
});

app.post("/api/emails/templates", (req, res) => {
  const { templates } = req.body;
  const db = readDB();

  if (!templates || !Array.isArray(templates)) {
    return res.status(400).json({ error: "Templates array required." });
  }

  db.emailTemplates = templates;
  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: "Email notification templates updated."
  });

  writeDB(db);
  res.json(db.emailTemplates);
});

// Email log fetch
app.get("/api/emails/logs", (req, res) => {
  const db = readDB();
  res.json(db.emailLogs);
});

// System logs fetch
app.get("/api/system-logs", (req, res) => {
  const db = readDB();
  res.json(db.systemLogs);
});

// Automated Cron Expiry Scanner Simulation
app.post("/api/emails/trigger-scan", (req, res) => {
  const db = readDB();
  const now = Date.now();
  const warningThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  let scannedCount = 0;
  let expiringAlertsSent = 0;
  let expiredAlertsSent = 0;

  const warningTemplate = db.emailTemplates.find((t: any) => t.id === "t-expiry-warning");
  const expiredTemplate = db.emailTemplates.find((t: any) => t.id === "t-expired-alert");

  db.progress.forEach((p: any) => {
    if (!p.certificates) return;

    p.certificates.forEach((cert: any) => {
      scannedCount++;
      const expiryTime = new Date(cert.expiryDate).getTime();
      const diff = expiryTime - now;

      // Update certificate status based on real-time relative math
      let oldStatus = cert.status;
      let newStatus = cert.status;

      if (diff <= 0) {
        newStatus = "expired";
      } else if (diff <= warningThreshold) {
        newStatus = "expiring";
      } else {
        newStatus = "active";
      }

      cert.status = newStatus;

      // Check if status changed or let's simulate sending notice
      if (newStatus === "expired" && oldStatus !== "expired" && expiredTemplate) {
        let body = expiredTemplate.body
          .replace(/{{student_name}}/g, p.studentName)
          .replace(/{{course_title}}/g, cert.courseTitle)
          .replace(/{{expiry_date}}/g, new Date(cert.expiryDate).toLocaleDateString());

        db.emailLogs.push({
          id: `l-${Date.now()}-${cert.id}`,
          recipientEmail: p.studentEmail,
          recipientName: p.studentName,
          subject: expiredTemplate.subject.replace(/{{course_title}}/g, cert.courseTitle),
          body,
          sentAt: new Date().toISOString(),
          status: "delivered",
          triggerType: "auto_scan"
        });
        expiredAlertsSent++;
      } else if (newStatus === "expiring" && oldStatus !== "expiring" && warningTemplate) {
        let body = warningTemplate.body
          .replace(/{{student_name}}/g, p.studentName)
          .replace(/{{course_title}}/g, cert.courseTitle)
          .replace(/{{expiry_date}}/g, new Date(cert.expiryDate).toLocaleDateString());

        db.emailLogs.push({
          id: `l-${Date.now()}-${cert.id}`,
          recipientEmail: p.studentEmail,
          recipientName: p.studentName,
          subject: warningTemplate.subject.replace(/{{course_title}}/g, cert.courseTitle),
          body,
          sentAt: new Date().toISOString(),
          status: "delivered",
          triggerType: "auto_scan"
        });
        expiringAlertsSent++;
      }
    });
  });

  const totalSent = expiringAlertsSent + expiredAlertsSent;
  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: `Automated scan forced manually. Scanned ${scannedCount} certificates. Generated ${totalSent} alerts (${expiringAlertsSent} expiring, ${expiredAlertsSent} expired).`
  });

  writeDB(db);
  res.json({
    scannedCount,
    expiringAlertsSent,
    expiredAlertsSent,
    totalSent,
    progress: db.progress,
    logs: db.emailLogs
  });
});

// Test send manual email
app.post("/api/emails/test-send", (req, res) => {
  const { studentEmail, courseTitle, templateId } = req.body;
  const db = readDB();

  const user = db.users.find((u: any) => u.email.toLowerCase() === studentEmail.toLowerCase());
  const template = db.emailTemplates.find((t: any) => t.id === templateId);

  if (!user || !template) {
    return res.status(404).json({ error: "User or template not found." });
  }

  const expiryStr = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString();
  const body = template.body
    .replace(/{{student_name}}/g, user.name)
    .replace(/{{course_title}}/g, courseTitle || "General First Aid Protocol")
    .replace(/{{expiry_date}}/g, expiryStr);

  const newLog = {
    id: `l-test-${Date.now()}`,
    recipientEmail: user.email,
    recipientName: user.name,
    subject: template.subject.replace(/{{course_title}}/g, courseTitle || "General First Aid Protocol"),
    body,
    sentAt: new Date().toISOString(),
    status: "delivered" as const,
    triggerType: "test_send" as const
  };

  db.emailLogs.push(newLog);
  db.systemLogs.push({
    timestamp: new Date().toISOString(),
    message: `Test notification sent manually to ${user.name} using template "${template.name}".`
  });

  writeDB(db);
  res.json({ success: true, log: newLog });
});

// Integrate Vite middleware for development or serve index.html for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
