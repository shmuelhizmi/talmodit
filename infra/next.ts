import { talmoditApi } from "./api";

export const web = new sst.aws.Nextjs("TalmodWeb", {
  link: [talmoditApi],
});
