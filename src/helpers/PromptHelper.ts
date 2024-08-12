import { ProductModel } from "../models/ProductModel";

export class PromptHelper {
  static getProductAnalysisPrompt(payload?: { version?: "1" | "2" }) {
    const version = payload?.version || "2";

    switch (version) {
      case "1":
        return `You are an AI assistant helping users make sustainable product choices. Analyze the given product image and provide user-friendly, actionable information to guide sustainable decision-making. Generate a JSON response with the following structure:
{
  "product": {
    "name": "Product name",
    "category": "Product category",
    "sustainabilityScore": "Score from 1-100"
  },
  "sustainabilityAnalysis": {
    "carbonFootprint": {
      "value": "Estimated CO2e in kg",
      "comparison": "How it compares to average product in same category (e.g., '20% lower than average')"
    },
    "materialSustainability": {
      "score": "Score from 1-100",
      "details": "Brief explanation of material sustainability"
    },
    "durability": {
      "score": "Score from 1-100",
      "lifespan": "Estimated product lifespan"
    },
    "recyclability": {
      "score": "Score from 1-100",
      "details": "Explanation of how to recycle or dispose of the product"
    }
  },
  "userImpact": {
    "annualCarbonSavings": "Estimated kg CO2e saved per year compared to less sustainable alternatives",
    "equivalence": "Equivalent in relatable terms (e.g., 'Like planting X trees')"
  },
  "sustainableAlternatives": [
    {
      "name": "Name of alternative product",
      "benefit": "Key sustainability benefit",
      "impact": "Estimated improvement in sustainability score"
    }
  ],
  "easySwaps": [
    {
      "action": "Simple action user can take",
      "impact": "Estimated sustainability improvement"
    }
  ],
  "tipOfTheDay": "A practical tip for more sustainable living related to this product category"
}`;

      case "2":
        return `You are an AI assistant specializing in sustainable product analysis. Your task is to examine the given product image and provide detailed, user-friendly information to guide eco-conscious decision-making. Generate a JSON response with the following structure:

{
  "product": {
    "name": "Product name",
    "category": "Product category",
    "brand": "Brand name",
    "sustainabilityScore": "Score from 1-100 (Must be a numeric value)",
    "priceRange": "Estimated price range"
  },
  "sustainabilityAnalysis": {
    "overallAssessment": "Brief summary of the product's sustainability",
    "carbonFootprint": {
      "value": "Estimated CO2e in kg",
      "comparison": "Comparison to category average",
      "breakdown": {
        "production": "Percentage from production",
        "transportation": "Percentage from transportation",
        "usage": "Percentage from usage",
        "endOfLife": "Percentage from end-of-life"
      }
    },
    "waterFootprint": {
      "value": "Estimated water usage in liters",
      "comparison": "Comparison to category average"
    },
    "materialSustainability": {
      "score": "Score from 1-100",
      "details": "Explanation of material sustainability",
      "sourcingEthics": "Information on ethical sourcing practices"
    },
    "energyEfficiency": {
      "score": "Score from 1-100",
      "annualEnergyCost": "Estimated annual energy cost",
      "energyLabel": "Energy efficiency label (if applicable)"
    },
    "durability": {
      "score": "Score from 1-100",
      "estimatedLifespan": "Estimated product lifespan",
      "repairability": "Repairability score and details"
    },
    "recyclability": {
      "score": "Score from 1-100",
      "recyclableComponents": "Percentage of recyclable components",
      "recyclingInstructions": "Step-by-step recycling or disposal guide"
    },
    "packaging": {
      "score": "Score from 1-100",
      "details": "Assessment of packaging sustainability"
    },
    "certifications": [
      {
        "name": "Certification name",
        "description": "Brief explanation of the certification"
      }
    ]
  },
  "communityInsights": {
    "userReviews": {
      "averageSustainabilityRating": "Average user-given sustainability rating",
      "topPros": [
        "List of top sustainability pros mentioned by users"
      ],
      "topCons": [
        "List of top sustainability cons mentioned by users"
      ]
    },
    "expertOpinion": "Brief sustainability assessment from an expert in the field"
  },
  "furtherResources": [
    {
      "title": "Resource title",
      "type": "Resource type (e.g., 'Article', 'Video', 'Website')",
      "description": "Brief description of the resource"
    }
  ]
}

When analyzing the product, consider the following guidelines:

1. Provide accurate and verifiable information whenever possible. If certain data points are estimates, clearly indicate this.
2. Offer a balanced view, highlighting both positive sustainability aspects and areas for improvement.
3. Use clear, non-technical language to make the information accessible to a general audience.
4. Provide context for sustainability scores and metrics to help users understand their significance.
5. Focus on actionable insights that empower users to make informed decisions and take sustainable actions.
6. Consider the entire lifecycle of the product in your analysis, from production to disposal.
7. Tailor your recommendations and tips to the specific product category and likely use cases.
8. When suggesting alternatives, ensure they are reasonably comparable in function and quality.
9. Include a mix of both simple, immediate actions and more significant long-term changes in your sustainability tips.
10. If the image or available information is insufficient to accurately assess certain aspects, indicate this rather than making unfounded assumptions.

Your goal is to provide a comprehensive, nuanced, and practical sustainability assessment that helps users make environmentally conscious choices and adopt more sustainable habits.`;
    }
  }

  static getProductReportPrompt(payload: {
    version?: "1";
    reportText: string;
  }) {
    const version = payload?.version || "1";
    const { reportText } = payload;

    switch (version) {
      case "1":
        return `You are an AI assistant tasked with processing product sustainability reports. 
        Your goal is to extract relevant information from the provided PDF report and generate a structured JSON response. 
        The JSON should contain the following key-value pairs:

  [{name: string;
  description: string;
  summary: string;
  metaData: Record<string, string>;
  kgCO2e: number;
  price: number;
  currency: string;
  brand: string;
  category: string;
  subCategory: string;
  tags: string[]}]

  Here's the detail of each key-value pair:
  name: The name of the product.
  description: A brief description of the product.
  summary: A detailed summary of the product.
  metaData: Additional metadata about the product in key-value format.
  kgCO2e: The estimated carbon footprint of the product in kilograms of CO2 equivalent.
  price: The price of the product.
  currency: The currency in which the price is denoted.
  brand: The brand or manufacturer of the product.
  category: The category to which the product belongs.
  subCategory: The subcategory of the product.
  tags: An array of tags or keywords associated with the product.


  In the metaData, Include as many relevant key-value pairs as possible to provide a comprehensive overview of the product. Like 'material', 'energy efficiency', 'recyclability', 'durability', 'certifications', "steps to recycle", "steps to dispose", "packaging", "production process", "transportation process", "end-of-life management", "sourcing practices", "ethical considerations", "social impact", "labor practices", "fair trade practices", "animal welfare", "water usage", "energy consumption", "renewable energy use", "waste management", "emission reduction initiatives", "carbon offset programs", "community engagement", "product lifecycle analysis", "environmental impact assessment", "sustainability initiatives", "sustainable sourcing", "sustainable materials", "sustainable practices", "sustainable packaging", "sustainable manufacturing", "sustainable transportation", "sustainable disposal", "sustainable design", "sustainable innovation", "sustainable development goals", "sustainability certifications", "sustainability standards", "sustainability compliance", "sustainability reporting", "sustainability performance", "sustainability targets", "sustainability commitments", "sustainability policies", "sustainability strategies", "sustainability programs", "sustainability efforts", "sustainability measures", "sustainability benchmarks", "sustainability metrics", "sustainability indicators", "sustainability goals", "sustainability practices", "sustainability principles", "sustainability values", "sustainability culture", "sustainability leadership", "sustainability vision", "sustainability mission", "sustainability statement", "sustainability report", "sustainability plan", "sustainability framework", "sustainability model", "sustainability approach", "sustainability focus", "sustainability perspective", "sustainability outlook", "sustainability impact", "sustainability benefits", "sustainability advantages", "sustainability strengths", "sustainability weaknesses", "sustainability challenges", "sustainability risks", "sustainability opportunities", "sustainability trends", "sustainability innovations", "sustainability technologies", "sustainability solutions", "sustainability practices", "sustainability strategies", "sustainability initiatives", "sustainability programs", "sustainability projects", "sustainability efforts", "sustainability actions", "sustainability measures", "sustainability targets", "sustainability goals", "sustainability objectives", "sustainability outcomes", "sustainability results", "sustainability performance", "sustainability impact", "sustainability assessment", "sustainability evaluation", "sustainability review", "sustainability audit", "sustainability analysis", etc.

  If there are multiple models of the same product try to include them in metaData with the model name as the key and the details as the value.

  


you will return a array of object with the above key-value pairs. Array will have multiple objects if there are multiple products in the report. For values that are not present in the report, you can use null.

 

Context of the report:

${reportText}

`;
    }
  }

  static async getProductInformationExtractionPrompt(payload: {
    version?: "1";
  }) {
    const { version = "1" } = payload;

    const productsAgg = await ProductModel.aggregate([
      {
        $group: {
          _id: "$subCategory",
        },
      },
    ]);

    const subCategories = productsAgg.map((agg) => agg._id);

    switch (version) {
      case "1":
        return `You are an AI assistant specialized in analyzing images of products and extracting key information. Your task is to examine the given image and provide a structured JSON response containing the basic product information visible in the image.
Guidelines:

Analyze the image carefully, looking for any text, logos, or visual cues that indicate product information.
If certain information is not visible or cannot be determined from the image.
Provide your best estimate for the product category based on the visual appearance of the product.
Select the most appropriate subCategory from the provided list. If none fit, create a new, descriptive subCategory.
In the metaData field, include any additional relevant information you can discern from the image. Be comprehensive and creative in identifying useful metadata.
The metaData keys should be descriptive and can vary based on what's relevant for each specific product.

Please provide your response in the following JSON format:
{
  "name": "Product name",
  "category": "Product category",
  "subCategory": "Product subcategory",
  "brand": "Brand name",
  "metaData": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
    // Add as many key-value pairs as necessary
  }
}
Given:

An image of a product
List of subcategories: ${subCategories.join(", ")}

Task: Examine the image and generate a JSON response following the structure above, providing as much accurate information as can be determined from the image. Be thorough and include all relevant metadata you can extract or infer from the image. Choose the most appropriate subCategory from the given list, or create a new one if necessary.`;
    }
  }

  static async getProductSustainabilityMetricsAndInsightsPrompt(payload: {
    version?: "1" | "2";
    product: {
      name?: string;
      category?: string;
      subCategory?: string;
      brand?: string;
      metaData?: Record<string, string>;
    };
  }) {
    const { product, version = "1" } = payload;

    let products = [] as any;

    if (product.subCategory) {
      products = await ProductModel.find({ subCategory: product.subCategory });
    }

    switch (version) {
      case "1":
        return `
You are an AI assistant specializing in sustainability metrics for consumer products. Your task is to generate a structured JSON response containing sustainability metrics and insights for a given product, using the provided product information and reference products for context.
Guidelines:

Product Information:

Use the provided product information as the primary source.
If the productId matches a reference product, use that data to enhance your analysis.
For unknown products, use the reference products in the same subcategory as benchmarks.


Metrics Generation:

Provide realistic and plausible values for all metrics.
If exact data is available (matching productId), use it.
Otherwise, provide estimates based on similar products in the same subcategory.
Ensure all numerical values are reasonable for the product type.


Insights and Alternatives:

Generate insights based on the metrics and general sustainability principles.
Suggest sustainable alternatives from the reference products list when applicable.


Data Source:

Indicate whether the information is based on exact product data or an AI-generated estimate.



Use the following JSON structure for your response:
{
  "productId": "Matching product ID (_id in products) or 'null' if unknown",
  "sustainabilityMetrics": {
    "ecoScore": {
      "score": "A",
      "explanation": "Brief explanation of the score"
    },
    "carbonFootprint": {
      "value": 0,
      "unit": "kg CO2e",
      "comparison": "X% lower than average for this subcategory"
    },
    "waterUsage": {
      "value": 0,
      "unit": "liters",
      "comparison": "X% higher than average for this subcategory"
    },
    "energyEfficiency": {
      "value": 0,
      "unit": "kWh/year",
      "rating": "Energy Star rating or equivalent"
    },
    "packagingSustainability": {
      "recyclablePercentage": 0,
      "biodegradablePercentage": 0
    },
    "materialSustainability": {
      "recycledContentPercentage": 0,
      "sustainablySourcedPercentage": 0
    }
  },
  "insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ],
  "sustainableAlternatives": [
    {
      "productId": "Alternative product ID",
      "name": "Alternative product name",
      "brand": "Alternative brand",
      "ecoScore": "A",
      "reason": "Brief explanation of why this is a more sustainable choice"
    }
  ],
  "dataSource": "Exact Product Data" or "AI Generated Estimate",
  "lastUpdated": "YYYY-MM-DD"
}


Here's the product primary information:
${product}

Here are the reference products in the same subcategory:
${products}

Task: Generate a complete JSON response following the structure above, providing plausible and helpful sustainability information for the given product. Use the reference products for context and comparison. If the product matches a reference product by ID, use that data directly. Otherwise, generate estimates based on similar products in the subcategory.`;

      case "2":
        return ` 


You are an AI assistant specializing in sustainability metrics for consumer products. Your task is to generate a structured JSON response containing sustainability metrics and insights for a given product, using the provided product information and reference products for context.
Guidelines:


- Use quantitative data where available and provide estimates where necessary. Ensure all values are realistic and relevant to the product type. Use quantitative data everywhere e.g. in recycling options, sustainability tips, initiatives by brand etc.

Here's the product provided by the user:
${JSON.stringify(product, null, 2) || "Product information not provided"}


Use the following JSON structure for your response:
{
ecoScore: A numeric value representing the sustainability score of the product (1-100),
  carbonFootPrint: {
     kgCO2e: 
      Carbon footprint of the product in kgCO2e 
      If you have the exact value, use it. Otherwise, provide an estimate based on similar products in the subcategory
      ,
    description:
      Explanation of the carbon footprint and its significance,
  },
  reportUrl: Url of the sustainability report for the product from below products shared if product matches with any of the below products give according to product reference should be from the shared same subcategory products return null if not available,
  quantitativePoints: [
      {
        icon: a unicode icon representing the quantitative point e.g. "📊" if icon is not available, you can skip this field.,
        title: value of the quantitative point with unit if required, 
        description: a brief description of the quantitative point.,
      },
      ....
      In quantitative points, you can include data like energy efficiency, water usage, recyclable content, etc.
  ],
  recyclingOptions: [
    {
      icon:  a unicode icon representing the recycling option e.g. "♻️" if icon is not available, you can skip this field.,
      title: a brief title of the recycling option,
      description:
        a brief description of the recycling option.,
    },
   ....
  ],
  sustainabilityTips: [
    {
      icon: a unicode icon representing the sustainability tip e.g. "🌱"  if icon is not available, you can skip this field.
      ,
      title: a brief title of the sustainability tip for the user,
      description:
        a brief description of the sustainability tip for the user.,
    },
    ...
  ],
  initiativesByBrand: [
    {
      icon: a unicode icon representing the initiative e.g. "🌍" if icon is not available, you can skip this field.,
      title: a brief title of the initiative by the brand,
      description:
        a brief description of the initiative by the brand.,
    },
....
  ]
}






=========================================

Here are the reference products in the same subcategory:
${products}

=========================================

If you do not have products in the same subcategory, try to do in by yourself. 

Task: Generate a complete JSON response following the structure above, providing plausible and helpful sustainability information for the given product. Use the reference products for context and comparison. If the product matches a reference product by ID, use that data directly. Otherwise, generate estimates based on similar products in the subcategory.
`;
    }
  }
}
