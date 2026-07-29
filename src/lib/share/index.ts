/** Public surface of the share utility: destination, attribution, actions, assets. */

export {
  JOIN_DESTINATION_URL,
  QR_SHARE_URL,
  SHARE_ATTRIBUTION,
  CAMPAIGN_PARAM_KEYS,
  buildJoinShareUrl,
} from "./destination";
export type { ShareMedium } from "./destination";
export { canNativeShare, copyToClipboard, shareOrCopy } from "./actions";
export type {
  SharePayload,
  ShareOutcome,
  ShareCapableNavigator,
} from "./actions";
export {
  SHARE_ASSETS,
  STANDARD_QR_ASSET,
  STORY_ASSET,
  SQUARE_ASSET,
} from "./assets";
export type { ShareAssetSpec } from "./assets";
