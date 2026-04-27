const jsonServer = require("json-server");
const fs = require("fs");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
// const { v4: uuidv4 } = require("uuid");

// const path = require("path")

// const adapter = new FileSync("db.json");
// const db = low(adapter);


const customHeadersMiddleware = (req, res, next) => {
  // Set custom headers
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("abc", "XYZ123");

  // Continue with the next middleware or route handler
  next();
};

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(customHeadersMiddleware);

// server.post("/add-template", async (req, res) => {
//   try {
//     const template = req.body.template;
//     console.log("template==>", template);

//     if (!template || Object.keys(template).length === 0) {
//       return res.status(400).json({ error: "Template body cannot be empty" });
//     }

//     // Ensure id and templateId exist
//     if (!template.id) {
//       const randomId = uuidv4();
//       template.id = randomId;
//       template.templateId = randomId;
//     }

//     // Validate category
//     const categoryInput = template.category?.[0];
//     if (!categoryInput) {
//       return res.status(400).json({ error: "Template must have a 'category' field" });
//     }

//     // Find category ignoring case
//     const allCategories = Object.keys(db.value());
//     let matchedCategory = allCategories.find(
//       (cat) => cat.toLowerCase() === categoryInput.toLowerCase()
//     );

//     // If no match found, create new category
//     if (!matchedCategory) {
//       matchedCategory = categoryInput;
//       db.set(matchedCategory, []).write();
//     }

//     // Add template at top of that category (immutable way)
//     const existingTemplates = db.get(matchedCategory).value() || [];
//     const updatedTemplates = [template, ...existingTemplates];

//     db.set(matchedCategory, updatedTemplates).write();

//     console.log(`✅ Added new template to category '${matchedCategory}'`, template);

//     res.status(200).json({
//       message: `Template added to category '${matchedCategory}'.`,
//       template,
//     });
//   } catch (error) {
//     console.error("Error adding template:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });



// server.post("/push-to-github", async (req, res) => {
//   try {
//     const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // ✅ stored in Vercel env vars
//     const REPO = "VidyBack/PostRequestVercel"; // your repo
//     const FILE_PATH = "db.json";
//     const BRANCH = "master";

//     // Read local db.json
//     const dbPath = path.join(process.cwd(), "db.json");
//     const updatedContent = fs.readFileSync(dbPath, "utf-8");

//     // 1️⃣ Fetch file metadata (get latest SHA)
//     const getFile = await fetch(
//       `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
//       {
//         headers: {
//           Authorization: `token ${GITHUB_TOKEN}`,
//         },
//       }
//     );

//     const fileData = await getFile.json();

//     if (!fileData.sha) {
//       console.error("Could not get file SHA from GitHub response:", fileData);
//       return res.status(500).json({ error: "Failed to get file SHA from GitHub" });
//     }

//     // 2️⃣ Encode content to base64
//     const encodedContent = Buffer.from(updatedContent).toString("base64");

//     // 3️⃣ Commit updated file
//     const commit = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `token ${GITHUB_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: `Updated db.json via API`,
//         content: encodedContent,
//         sha: fileData.sha,
//         branch: BRANCH,
//       }),
//     });

//     const commitResponse = await commit.json();

//     if (commitResponse.commit) {
//       console.log("✅ db.json successfully pushed to GitHub.");
//       return res.status(200).json({
//         message: "db.json successfully pushed to GitHub.",
//         commit: commitResponse.commit,
//       });
//     } else {
//       console.error("❌ GitHub commit failed:", commitResponse);
//       return res.status(500).json({ error: "GitHub commit failed", commitResponse });
//     }
//   } catch (error) {
//     console.error("Error pushing to GitHub:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// server.post("/:purpose", (req, res) => {
//   // Process the request body and add/update data in db.json using lowdb
//   const newData = req.body;
//   // Add a new post
//   db.get(req.params.purpose).push(newData).write();
//   console.log("Added new post:", newData);
//   res.status(200).json(newData);
// });

function moveTemplateToCategory(templateIds, newCategory) {
  const ids = Array.isArray(templateIds) ? templateIds : [templateIds];
  const dbData = JSON.parse(fs.readFileSync("./db.json", "utf8"));

  if (!dbData[newCategory]) {
    dbData[newCategory] = [];
  }

  const added = [];
  const notFound = [];

  for (const templateId of ids) {
    let trueVersion = null;
    let falseVersion = null;

    for (const templates of Object.values(dbData)) {
      for (const template of templates) {
        const id = template.templateId || template.id;
        if (id === templateId) {
          if (template.isMultipleTemplate === true && !trueVersion) {
            trueVersion = JSON.parse(JSON.stringify(template));
          }
          if (template.isMultipleTemplate === false && !falseVersion) {
            falseVersion = JSON.parse(JSON.stringify(template));
          }
        }
      }
    }

    if (!trueVersion && !falseVersion) {
      notFound.push(templateId);
      continue;
    }

    for (const version of [trueVersion, falseVersion]) {
      if (version) {
        version.category = [newCategory];
        dbData[newCategory].push(version);
        added.push(version);
      }
    }
  }

  if (added.length > 0) {
    fs.writeFileSync("./db.json", JSON.stringify(dbData, null, "\t"));
    router.db.read();
  }

  return { added, notFound };
}
const arr = [
"smlnwtmp730jip",
"tempjgolkanewtempla",
"sdsdsbxdsdcggfhb",
"heloogdfgsjs",
"kolfgdfgsdsbxdstst1",
"uipwen23dsks92soper",
"koludijgolkadHxw6cs",
"iffernzpturatyuie",
"hhoshandsHxsds",
"dmsipmdf934ndlidop",
"z7p2n9m4qxtyuie",
"zeeighzeotsxmlt",
"9dhiwpd9dj3jklmdae",
"ueo3d02ssntulipms",
"promnewgolkadHxwtmk",
"netmtewntyonenow",
"prtnrwiodjdnzdszo",
"mblnwssmsngultrpr",
"kolakolkadHxw6cQInmj1",
"kolakolkadHxw6cQInmj3",
"gfukilopdHxw6ffds3",
"stoninetempnewtre",
"nstrtemelvnmdrnn",
"ffprmnlsttemkupdd",
"sttmnooipewsuwiod",
"newmuflsifxw6cQIdfd1",
"newmuflsifxw6cQIdfd3",
"sdfsdjkdkfjsbxyjdsbdssf",
"updtedfsddtemplg",
"boiikolkadHxw6cQInmj",
"teoknoenelkadHxw6cQInew",
"FF6ulJJgL1ObGnxoN7-5t",
"barranolkadHxw6cQInml1",
"barranolkadHxw6cQInml2",
"XAsp7PuFdH-orange-gshfgdshfgsdjgfjhgfj",
"bki-EPL1tFS-3nVd4t6Da1",
"bki-EPL1tFS-3nVd4t6Da2",
"bki-EPL1tFS-3nVd4t6Da3",
"8tLzaWm5RZ6PMc3IrAtaW",
"p0yWxeUYnRHBtcr6zGUBj",
"colddeamfomm1",
"colddeamfomm2",
"colddeamfomm3",
"N7Lkz5OPLrxGdVitf7YEa1",
"N7Lkz5OPLrxGdVitf7YEa2",
"N7Lkz5OPLrxGdVitf7YEa3",
"varanolkadHxw6cQInml",
"ghujikolpt1",
"jYpUCf8BiPueCmGnvXQEM1",
"jYpUCf8BiPueCmGnvXQEM2",
"jYpUCf8BiPueCmGnvXQEM3",
"ldr6G5EkDkuoXdTpQmirg1",
"ldr6G5EkDkuoXdTpQmirg2",
"ldr6G5EkDkuoXdTpQmirg3",
"XTaD1Mkda40NZ2Ncsg0BV1",
"XTaD1Mkda40NZ2Ncsg0BV2",
"XTaD1Mkda40NZ2Ncsg0BV3",
"LeMY31reMNqtbRdZIA41C",
"JUk8mLrYLdPWfLl--jO0ntrandy1",
"JUk8mLrYLdPWfLl--jO0ntrandy2",
"JUk8mLrYLdPWfLl--jO0ntrandy3",
"ddssttsdssJadHgthdfs",
"dsdsssdsddsdsff",
"88frttt-JadHxwfgtyhuji01",
"88frttt-JadHxwfgtyhuji02",
"88frttt-JadHxwfgtyhuji03",
"kolaslkadHxwrtghfu",
"888frttt-JadHxw6cQI8881",
"888frttt-JadHxw6cQI8882",
"988frttt-JadHxw6cQI9871",
"988frttt-JadHxw6cQI9872",
"988frttt-JadHxw6cQI9873",
"123dsssdsddsdsff",
"323dsssdsddsdsff",
"4243dsssdsddsdsff",
"tyu43dsssdsddsdsddssdddd"
];
const arr2 = [
"josyhtuochdwhy",
"newmosuchidnfcQf",
"prm43@ifu#54",
"pmion#iod@57",
"tisfnltmplprtifnl",
"hujikolddbddi",
"ccofdanolkadHxmissk",
"promtempneweditne",
"humngfkadHxw6cQId",
"nahidmsdHxw7ymh",
"kolakolkadHxw6cQInmj2",
"gfukilopdHxw6ffds1",
"gfukilopdHxw6ffds2",
"kstrntwlvnwtuioo",
"nsttisgtupdingnow",
"stornewmodrntempn",
"thnmtmpsttuiodkf",
"ftntmchtimnersft",
"eridfdlfxocesersg",
"newmuflsifxw6cQIdfd2",
"abcshB1D3w5M--ZCNX7ci0ayyODbaa1",
"abcshB1D3w5M--ZCNX7ci0ayyODbaa2",
"abcshB1D3w5M--ZCNX7ci0ayyODbaa3",
"EznUp0Hs2pG2ct2IScFBr",
"humbkodhsdjcfvv",
"iqfvDjOwIG7ObfRkeHW7F",
"xzzRyKwMkkIgaIF0PAOt1",
"sdshB1D3w5M--ZCNX7ci0sa1",
"sdshB1D3w5M--ZCNX7ci0sa2",
"sdshB1D3w5M--ZCNX7ci0sa3",
"lolakolkadHxw6cQInmj",
"ddknwtmp2625snmi",
"hEhI84NA47Ij8C1eNwK0t",
"gulabolkadHxw6cQInmnm2",
"gulabolkadHxw6cQInmnm3",
"ghujikolpt2",
"gujiokoldHxw6monls",
"koimilHxw6cQInms1",
"koimilHxw6cQInms2",
"koimilHxw6cQInms3",
"mddddHxw6cQInsss"
];
//  moveTemplateToCategory(arr2, "p_Visual");
server.use(router);

const port = 3000;
server.listen(process.env.PORT || 8000, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
