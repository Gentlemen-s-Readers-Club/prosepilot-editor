interface PaddlePriceIds {
  starter: string;
  pro: string;
  studio: string;
}

interface PaddleCreditPriceIds {
  tenCredits: string;
  twentyFiveCredits: string;
  fiftyCredits: string;
}

interface PaddleConfig {
  subscriptionPrices: PaddlePriceIds;
  creditPrices: PaddleCreditPriceIds;
}

const sandboxConfig: PaddleConfig = {
  subscriptionPrices: {
    starter: "pri_01jxbekwgfx9k8tm8cbejzrns6", // $9/month Starter Plan
    pro: "pri_01jxben1kf0pfntb8162sfxhba", // $29/month Pro Plan
    studio: "pri_01jxxb51m8t8edd9w3wvw96bt4", // $79/month Studio Plan
  },
  creditPrices: {
    tenCredits: "pri_01jxxam0wza70ewcbrw5vvyp7z", // $20 for 10 credits
    twentyFiveCredits: "pri_01jxywh0md90vjkn0b6zw1n6eq", // $45 for 25 credits
    fiftyCredits: "pri_01jxywj076ey2z7cdtw22skc6s", // $80 for 50 credits
  },
};

const productionConfig: PaddleConfig = {
  subscriptionPrices: {
    starter: "pri_01jy2c1ff3k4pddzfztx7vzxah", // $9/month Starter Plan
    pro: "pri_01jy2c21wq1hp63e5gkmb5scrq", // $29/month Pro Plan
    studio: "pri_01jy2c2ngn55wtpqvt6drswzd2", // $79/month Studio Plan
  },
  creditPrices: {
    tenCredits: "pri_01jy2bxm9gvq8ehhab30gww71t", // $20 for 10 credits
    twentyFiveCredits: "pri_01jy2by8t0d2r59sgzadwstnf4", // $45 for 25 credits
    fiftyCredits: "pri_01jy2bz3jscw527pecwatht4yd", // $80 for 50 credits
  },
};

export const getPaddleConfig = (): PaddleConfig => {
  const environment = import.meta.env.VITE_PADDLE_ENV || "sandbox";
  console.log("🏷️ Getting Paddle price config for environment:", environment);
  const config = environment === "sandbox" ? sandboxConfig : productionConfig;
  console.log("🏷️ Using price IDs:", {
    subscriptionPrices: config.subscriptionPrices,
    creditPrices: config.creditPrices,
  });
  return config;
};

export const getSubscriptionPriceIds = (): string[] => {
  const config = getPaddleConfig();
  return Object.values(config.subscriptionPrices);
};

export const getCreditPriceIds = (): string[] => {
  const config = getPaddleConfig();
  return Object.values(config.creditPrices);
};
