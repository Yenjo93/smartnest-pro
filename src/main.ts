// The entry Home Assistant loads is tiny: the app itself comes in a hashed chunk, so a new version is never served
// from an old cache.
import("./app");
