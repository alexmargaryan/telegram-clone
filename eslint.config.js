import { config as baseConfig } from "@telegram-clone/eslint-config/service";

// We can override the base config for specific apps or services if needed.
// in each object, we can specify the files to which the rules apply
// and the rules we want to override.
export default [...baseConfig];
