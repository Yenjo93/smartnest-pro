// The furniture you can place. Sizes are footprints in metres (w along x, d along y before rotation).
// Kept free of three.js so the 2D editor can list and draw pieces without loading the 3D engine.
import * as I from "@mdi/js";
import type { Lang } from "../types";

export type Category = "smart" | "living" | "bedroom" | "kitchen" | "bath" | "office" | "outdoor" | "structure";

export interface CatalogItem {
  type: string;
  category: Category;
  name: { en: string; ar: string };
  icon: string;
  w: number;
  d: number;
  /** Device domains it can be linked to; it reacts to that device and tapping it controls it. */
  domains?: string[];
  /** "ceiling" pieces hang from the ceiling, so they follow the floor's wall height. */
  mount?: "ceiling";
  /** Default height above the floor (or below the ceiling for ceiling pieces), in metres. */
  z?: number;
}

const L = ["light", "switch"];
const SW = ["switch", "input_boolean"];
const MEDIA = ["media_player"];

const it = (
  type: string,
  category: Category,
  en: string,
  ar: string,
  icon: string,
  w: number,
  d: number,
  extra: Partial<CatalogItem> = {},
): CatalogItem => ({ type, category, name: { en, ar }, icon, w, d, ...extra });

export const CATALOG: CatalogItem[] = [
  // ---------- Smart: react to their device ----------
  it("ac", "smart", "AC (wall unit)", "مكيف حيط", I.mdiAirConditioner, 0.95, 0.26, { domains: ["climate"], z: 0.72 }),
  it("ac_floor", "smart", "AC (standing)", "مكيف واقف", I.mdiAirConditioner, 0.45, 0.35, { domains: ["climate"] }),
  it("ceiling_fan", "smart", "Ceiling fan", "مروحة سقف", I.mdiCeilingFan ?? I.mdiFan, 1.2, 1.2, { domains: ["fan", ...SW], mount: "ceiling" }),
  it("floor_fan", "smart", "Standing fan", "مروحة أرضية", I.mdiFan, 0.45, 0.45, { domains: ["fan", ...SW] }),
  it("air_purifier", "smart", "Air purifier", "منقّي هوا", I.mdiAirPurifier, 0.35, 0.35, { domains: ["fan", ...SW] }),
  it("humidifier", "smart", "Humidifier", "مرطّب", I.mdiAirHumidifier, 0.3, 0.3, { domains: ["humidifier", ...SW] }),
  it("radiator", "smart", "Radiator / heater", "دفاية", I.mdiRadiator, 1.0, 0.12, { domains: ["climate", ...SW] }),
  it("water_heater", "smart", "Water heater", "سخان", I.mdiWaterBoiler, 0.5, 0.5, { domains: [...SW, "climate", "water_heater"] }),
  it("floor_lamp", "smart", "Floor lamp", "لمبادير", I.mdiFloorLamp, 0.42, 0.42, { domains: L }),
  it("table_lamp", "smart", "Table lamp", "أباجورة", I.mdiLampOutline, 0.32, 0.32, { domains: L, z: 0.37 }),
  it("desk_lamp", "smart", "Desk lamp", "ضو مكتب", I.mdiDeskLamp, 0.25, 0.25, { domains: L, z: 0.54 }),
  it("ceiling_light", "smart", "Ceiling light", "ضو سقف", I.mdiCeilingLight, 0.55, 0.55, { domains: L, mount: "ceiling" }),
  it("kitchen_light", "smart", "Pendant light", "ضو معلّق", I.mdiLightbulbVariantOutline, 0.5, 0.5, { domains: L, mount: "ceiling" }),
  it("chandelier", "smart", "Chandelier", "ثريا", I.mdiChandelier, 0.9, 0.9, { domains: L, mount: "ceiling" }),
  it("spotlight", "smart", "Spotlight", "سبوت", I.mdiSpotlight, 0.2, 0.2, { domains: L, mount: "ceiling" }),
  it("led_strip", "smart", "LED strip", "شريط LED", I.mdiLedStripVariant, 2.0, 0.04, { domains: L, z: 0.95 }),
  it("tv_unit", "smart", "TV + unit", "تلفزيون مع طاولة", I.mdiTelevision, 1.8, 0.45, { domains: MEDIA }),
  it("tv_wall", "smart", "Wall TV", "تلفزيون حيط", I.mdiTelevisionAmbientLight, 1.4, 0.08, { domains: MEDIA, z: 0.42 }),
  it("projector", "smart", "Projector", "بروجكتر", I.mdiProjector, 0.35, 0.3, { domains: MEDIA, mount: "ceiling" }),
  it("projector_screen", "smart", "Projector screen", "شاشة عرض", I.mdiProjectorScreen, 2.0, 0.1, { domains: [...MEDIA, "cover"], z: 0.25 }),
  it("soundbar", "smart", "Soundbar", "ساوندبار", I.mdiSoundbar, 0.9, 0.12, { domains: MEDIA, z: 0.3 }),
  it("speaker", "smart", "Speaker", "سماعة", I.mdiSpeaker, 0.3, 0.3, { domains: MEDIA }),
  it("speaker_round", "smart", "Smart speaker", "سماعة ذكية", I.mdiSpeakerWireless, 0.18, 0.18, { domains: MEDIA, z: 0.37 }),
  it("curtain", "smart", "Curtain", "برداية", I.mdiCurtains, 2.0, 0.14, { domains: ["cover"] }),
  it("blinds", "smart", "Blinds", "ستارة شرائح", I.mdiBlindsHorizontal, 1.6, 0.08, { domains: ["cover"], z: 0.2 }),
  it("roller_shade", "smart", "Roller shade", "ستارة رول", I.mdiRollerShade, 1.6, 0.08, { domains: ["cover"], z: 0.2 }),
  it("window", "smart", "Window", "شباك", I.mdiWindowOpenVariant, 1.4, 0.12, { domains: ["binary_sensor", "cover"], z: 0.3 }),
  it("door_smart", "smart", "Door", "باب", I.mdiDoor, 0.95, 0.12, { domains: ["lock", "binary_sensor"] }),
  it("garage_door", "smart", "Garage door", "باب كراج", I.mdiGarageVariant, 2.6, 0.12, { domains: ["cover"] }),
  it("camera", "smart", "Security camera", "كاميرا مراقبة", I.mdiCctv, 0.18, 0.18, { domains: ["camera", "binary_sensor"], z: 0.85 }),
  it("doorbell", "smart", "Video doorbell", "جرس بكاميرا", I.mdiDoorbellVideo, 0.1, 0.05, { domains: ["binary_sensor", "camera", "event"], z: 0.45 }),
  it("thermostat", "smart", "Thermostat", "ترموستات", I.mdiThermostat, 0.14, 0.04, { domains: ["climate"], z: 0.5 }),
  it("smoke_detector", "smart", "Smoke detector", "حساس دخان", I.mdiSmokeDetector, 0.16, 0.16, { domains: ["binary_sensor"], mount: "ceiling" }),
  it("robot", "smart", "Robot vacuum", "روبوت تنظيف", I.mdiRobotVacuum, 0.36, 0.36, { domains: ["vacuum"] }),
  it("robot_mower", "smart", "Robot mower", "روبوت عشب", I.mdiRobotMower, 0.6, 0.45, { domains: ["lawn_mower", "vacuum"] }),
  it("washer", "smart", "Washing machine", "غسالة", I.mdiWashingMachine, 0.6, 0.6, { domains: [...SW, "sensor", "binary_sensor"] }),
  it("dryer", "smart", "Dryer", "نشافة", I.mdiTumbleDryer, 0.6, 0.6, { domains: [...SW, "sensor", "binary_sensor"] }),
  it("dishwasher", "smart", "Dishwasher", "جلاية", I.mdiDishwasher, 0.6, 0.6, { domains: [...SW, "sensor", "binary_sensor"] }),
  it("coffee_machine", "smart", "Coffee machine", "ماكينة قهوة", I.mdiCoffeeMaker, 0.3, 0.35, { domains: SW, z: 0.62 }),
  it("kettle", "smart", "Kettle", "غلاية", I.mdiKettle, 0.2, 0.2, { domains: SW, z: 0.62 }),
  it("ev_charger", "smart", "EV charger", "شاحن سيارة", I.mdiEvStation, 0.3, 0.2, { domains: [...SW, "sensor", "binary_sensor"], z: 0.35 }),
  it("router", "smart", "Wi-Fi router", "راوتر", I.mdiRouterWireless, 0.25, 0.15, { domains: [...SW, "binary_sensor", "device_tracker"], z: 0.37 }),
  it("pet_feeder", "smart", "Pet feeder", "أكل الحيوان", I.mdiDogSide, 0.3, 0.3, { domains: SW }),
  it("aquarium", "smart", "Aquarium", "حوض سمك", I.mdiFishbowlOutline, 1.2, 0.45, { domains: L }),

  // ---------- Living ----------
  it("sofa", "living", "Sofa", "كنباية", I.mdiSofaOutline, 2.1, 0.9),
  it("loveseat", "living", "Loveseat", "كنباية صغيرة", I.mdiSofaOutline, 1.5, 0.85),
  it("sofa_l", "living", "Corner sofa", "كنباية زاوية", I.mdiSofaOutline, 2.5, 1.7),
  it("sofa_u", "living", "U-shaped sofa", "كنباية حرف U", I.mdiSofa, 3.0, 2.2),
  it("armchair", "living", "Armchair", "كرسي مريح", I.mdiSofaSingleOutline, 0.85, 0.85),
  it("bean_bag", "living", "Bean bag", "بين باغ", I.mdiSeatOutline, 0.8, 0.8),
  it("pouf", "living", "Pouf", "بوف", I.mdiSeatOutline, 0.5, 0.5),
  it("coffee_table", "living", "Coffee table", "طاولة وسط", I.mdiTableFurniture, 1.1, 0.6),
  it("coffee_round", "living", "Round coffee table", "طاولة وسط مدورة", I.mdiTableFurniture, 0.8, 0.8),
  it("side_table", "living", "Side table", "طاولة جانبية", I.mdiTableFurniture, 0.45, 0.45),
  it("console_table", "living", "Console table", "كونسول", I.mdiTableLarge, 1.2, 0.35),
  it("sideboard", "living", "Sideboard", "بوفيه", I.mdiDresserOutline, 1.8, 0.45),
  it("tv_stand", "living", "TV stand (no TV)", "طاولة تلفزيون", I.mdiDresserOutline, 1.8, 0.45),
  it("bookshelf", "living", "Bookshelf", "مكتبة", I.mdiBookshelf, 1.0, 0.35),
  it("shelf_wall", "living", "Wall shelf", "رف حيط", I.mdiBookOpenVariant, 1.0, 0.25, { z: 0.55 }),
  it("fireplace", "living", "Fireplace", "موقدة", I.mdiFireplace, 1.4, 0.4, { domains: L }),
  it("piano", "living", "Piano", "بيانو", I.mdiPiano, 1.5, 0.6),
  it("mirror_floor", "living", "Floor mirror", "مراية", I.mdiMirror, 0.6, 0.06),
  it("wall_art", "living", "Wall art", "لوحة", I.mdiImageFrame, 1.0, 0.04, { z: 0.45 }),
  it("clock_wall", "living", "Wall clock", "ساعة حيط", I.mdiClockOutline, 0.4, 0.04, { z: 0.6 }),
  it("rug", "living", "Rug", "سجادة", I.mdiRug, 2.2, 1.5),
  it("rug_round", "living", "Round rug", "سجادة مدورة", I.mdiRug, 1.8, 1.8),
  it("plant", "living", "Plant", "نبتة", I.mdiFlowerOutline, 0.5, 0.5),
  it("plant_tall", "living", "Tall plant", "نبتة طويلة", I.mdiFlowerTulipOutline, 0.55, 0.55),
  it("cactus", "living", "Cactus", "صبّار", I.mdiCactus, 0.3, 0.3),
  it("candle", "living", "Candles", "شموع", I.mdiCandle, 0.25, 0.25, { domains: L, z: 0.3 }),
  it("pillar", "structure", "Column", "عامود", I.mdiPillar, 0.4, 0.4),
  it("stairs", "structure", "Stairs", "درج", I.mdiStairs, 1.0, 2.6),

  // ---------- Bedroom ----------
  it("bed_king", "bedroom", "King bed", "تخت كبير", I.mdiBedKingOutline, 2.0, 2.2),
  it("bed_double", "bedroom", "Double bed", "تخت مزدوج", I.mdiBedDoubleOutline, 1.7, 2.1),
  it("bed_single", "bedroom", "Single bed", "تخت مفرد", I.mdiBedSingleOutline, 1.0, 2.0),
  it("bunk_bed", "bedroom", "Bunk bed", "تخت طابقين", I.mdiBunkBed, 1.0, 2.0),
  it("crib", "bedroom", "Crib", "سرير بيبي", I.mdiBabyCarriage, 0.7, 1.3),
  it("nightstand", "bedroom", "Nightstand", "كومودينا", I.mdiDresserOutline, 0.45, 0.4),
  it("dresser", "bedroom", "Dresser", "تسريحة أدراج", I.mdiDresserOutline, 1.2, 0.5),
  it("vanity", "bedroom", "Dressing table", "تسريحة", I.mdiMirrorRectangle, 1.1, 0.5),
  it("wardrobe", "bedroom", "Wardrobe", "خزانة", I.mdiWardrobeOutline, 1.4, 0.6),
  it("wardrobe_big", "bedroom", "Big wardrobe", "خزانة كبيرة", I.mdiWardrobe, 2.4, 0.6),
  it("clothes_rack", "bedroom", "Clothes rack", "علّاقة تياب", I.mdiHanger, 1.2, 0.45),
  it("shoe_rack", "bedroom", "Shoe rack", "جزامة", I.mdiShoeFormal, 0.9, 0.3),
  it("bench", "bedroom", "Bench", "مقعد", I.mdiBench, 1.2, 0.4),

  // ---------- Kitchen & dining ----------
  it("counter", "kitchen", "Kitchen counter", "مطبخ", I.mdiCountertopOutline, 2.4, 0.62),
  it("counter_sink", "kitchen", "Counter with sink", "مجلى", I.mdiCountertop, 1.2, 0.62),
  it("counter_corner", "kitchen", "Corner counter", "زاوية مطبخ", I.mdiCountertopOutline, 1.2, 1.2),
  it("wall_cabinets", "kitchen", "Wall cabinets", "خزاين علوية", I.mdiDresserOutline, 2.4, 0.35, { z: 0.65 }),
  it("island", "kitchen", "Kitchen island", "جزيرة مطبخ", I.mdiCountertopOutline, 1.6, 0.9),
  it("stove", "kitchen", "Stove", "غاز", I.mdiStove, 0.75, 0.65, { domains: SW }),
  it("oven_tall", "kitchen", "Oven tower", "فرن عامودي", I.mdiStove, 0.65, 0.62, { domains: SW }),
  it("microwave", "kitchen", "Microwave", "ميكرويف", I.mdiMicrowave, 0.5, 0.4, { domains: SW, z: 0.62 }),
  it("toaster", "kitchen", "Toaster", "توستر", I.mdiToaster, 0.28, 0.18, { domains: SW, z: 0.62 }),
  it("fridge", "kitchen", "Fridge", "براد", I.mdiFridgeOutline, 0.75, 0.7),
  it("fridge_double", "kitchen", "Double fridge", "براد بابين", I.mdiFridgeIndustrialOutline, 0.95, 0.75),
  it("wine_fridge", "kitchen", "Wine fridge", "براد نبيذ", I.mdiGlassWine, 0.6, 0.6, { domains: SW }),
  it("pantry", "kitchen", "Pantry cabinet", "خزانة مونة", I.mdiDresserOutline, 0.9, 0.6),
  it("trash", "kitchen", "Trash bin", "زبالة", I.mdiTrashCanOutline, 0.35, 0.35),
  it("dining", "kitchen", "Dining table (6)", "طاولة سفرة 6", I.mdiTableChair, 1.8, 1.6),
  it("dining_4", "kitchen", "Dining table (4)", "طاولة سفرة 4", I.mdiTableChair, 1.3, 1.4),
  it("table_round", "kitchen", "Round table", "طاولة مدورة", I.mdiTableChair, 1.4, 1.4),
  it("bar_counter", "kitchen", "Bar counter", "بار", I.mdiCountertop, 1.8, 0.5),
  it("stool", "kitchen", "Bar stool", "كرسي بار", I.mdiStool, 0.4, 0.4),
  it("chair", "kitchen", "Chair", "كرسي", I.mdiChairRolling, 0.5, 0.5),

  // ---------- Bathroom ----------
  it("toilet", "bath", "Toilet", "تواليت", I.mdiToilet, 0.42, 0.68),
  it("basin", "bath", "Wash basin", "مغسلة", I.mdiFaucet, 0.7, 0.45),
  it("vanity_double", "bath", "Double basin", "مغسلة مزدوجة", I.mdiFaucet, 1.4, 0.5),
  it("bathtub", "bath", "Bathtub", "بانيو", I.mdiBathtubOutline, 1.7, 0.78),
  it("jacuzzi", "bath", "Jacuzzi", "جاكوزي", I.mdiBathtub, 1.6, 1.6, { domains: SW }),
  it("shower", "bath", "Shower", "دوش", I.mdiShower, 0.95, 0.95),
  it("mirror_wall", "bath", "Wall mirror", "مراية حيط", I.mdiMirrorRectangle, 0.8, 0.04, { z: 0.45, domains: L }),
  it("towel_rail", "bath", "Heated towel rail", "منشفة مدفّاة", I.mdiHeatingCoil, 0.6, 0.1, { z: 0.3, domains: SW }),
  it("laundry_basket", "bath", "Laundry basket", "سلة غسيل", I.mdiBasketOutline, 0.4, 0.4),
  it("bath_mat", "bath", "Bath mat", "دعّاسة", I.mdiRug, 0.8, 0.5),

  // ---------- Office & tech ----------
  it("desk", "office", "Desk", "مكتب", I.mdiDesk, 1.3, 0.65),
  it("desk_l", "office", "Corner desk", "مكتب زاوية", I.mdiDesk, 1.6, 1.6),
  it("office_chair", "office", "Office chair", "كرسي مكتب", I.mdiChairRolling, 0.6, 0.6),
  it("monitor", "office", "Monitor", "شاشة", I.mdiMonitor, 0.6, 0.22, { domains: [...SW, ...MEDIA], z: 0.54 }),
  it("laptop", "office", "Laptop", "لابتوب", I.mdiLaptop, 0.35, 0.25, { domains: [...SW, "binary_sensor"], z: 0.54 }),
  it("printer", "office", "Printer", "طابعة", I.mdiPrinter, 0.45, 0.4, { domains: [...SW, "sensor"], z: 0.37 }),
  it("server_rack", "office", "Server rack", "سيرفر", I.mdiServer, 0.6, 0.8, { domains: SW }),
  it("game_console", "office", "Game console", "بلايستيشن", I.mdiGamepadVariantOutline, 0.3, 0.2, { domains: [...SW, ...MEDIA], z: 0.3 }),
  it("filing_cabinet", "office", "Filing cabinet", "خزانة ملفات", I.mdiFileCabinet, 0.45, 0.6),

  // ---------- Outdoor & garage ----------
  it("outdoor_sofa", "outdoor", "Outdoor sofa", "كنباية برّا", I.mdiSofaOutline, 2.0, 0.85),
  it("lounger", "outdoor", "Sun lounger", "شيزلونج", I.mdiSeat, 0.7, 1.9),
  it("outdoor_table", "outdoor", "Patio table", "طاولة برّا", I.mdiTableChair, 1.4, 1.4),
  it("parasol", "outdoor", "Parasol", "شمسية", I.mdiUmbrellaBeachOutline, 2.2, 2.2),
  it("bbq", "outdoor", "Grill", "شوّاية", I.mdiGrill, 1.0, 0.6, { domains: SW }),
  it("pool", "outdoor", "Pool", "مسبح", I.mdiPool, 4.0, 2.2, { domains: SW }),
  it("tree", "outdoor", "Tree", "شجرة", I.mdiTree, 1.6, 1.6),
  it("pine", "outdoor", "Pine tree", "صنوبرة", I.mdiPineTree, 1.2, 1.2),
  it("hedge", "outdoor", "Hedge", "سياج نبات", I.mdiTreeOutline, 2.0, 0.6),
  it("flower_bed", "outdoor", "Flower bed", "حوض ورد", I.mdiFlowerPoppy, 1.5, 0.6, { domains: ["switch", "valve"] }),
  it("fence", "outdoor", "Fence", "سور", I.mdiFence, 2.0, 0.08),
  it("car", "outdoor", "Car", "سيارة", I.mdiCar, 1.9, 4.4, { domains: ["device_tracker", "binary_sensor", "sensor"] }),
  it("bicycle", "outdoor", "Bicycle", "بسكليت", I.mdiBicycle, 0.6, 1.7),

  // ---------- More: kitchen ----------
  it("counter_plain", "kitchen", "Counter (plain)", "مطبخ فاضي", I.mdiCountertopOutline, 2.4, 0.62),
  it("base_cabinet", "kitchen", "Base cabinet", "خزانة سفلية", I.mdiDresserOutline, 0.6, 0.62),
  it("upper_cabinet", "kitchen", "Upper cabinet", "خزانة علوية", I.mdiDresserOutline, 0.8, 0.35, { z: 0.65 }),
  it("range_hood", "kitchen", "Range hood", "شفاط", I.mdiFan, 0.9, 0.5, { domains: [...L, "fan"], z: 0.72 }),
  it("island_seats", "kitchen", "Island with stools", "جزيرة مع كراسي", I.mdiCountertop, 1.7, 1.4),
  it("breakfast_table", "kitchen", "Breakfast table (2)", "طاولة فطور", I.mdiTableChair, 0.8, 1.5),
  it("bar_table", "kitchen", "Bar table", "طاولة بار", I.mdiTableFurniture, 0.7, 0.7),
  it("dining_bench", "kitchen", "Dining bench", "مقعد سفرة", I.mdiBench, 1.4, 0.4),
  it("water_dispenser", "kitchen", "Water dispenser", "براد مي", I.mdiWater ?? I.mdiCup, 0.35, 0.35, { domains: SW }),
  it("fruit_bowl", "kitchen", "Fruit bowl", "صحن فواكه", I.mdiFoodApple ?? I.mdiFoodVariant, 0.3, 0.3, { z: 0.62 }),

  // ---------- More: living ----------
  it("recliner", "living", "Recliner", "كرسي استرخاء", I.mdiSofaSingle, 0.9, 1.3),
  it("chaise", "living", "Chaise longue", "شيزلونج داخلي", I.mdiSeat, 0.7, 1.6),
  it("ottoman_round", "living", "Round ottoman", "بوف مدور", I.mdiSeatOutline, 0.6, 0.6),
  it("floor_cushion", "living", "Floor cushion", "مخدة أرضية", I.mdiSquareRounded ?? I.mdiSeatOutline, 0.6, 0.6),
  it("bookcase_tall", "living", "Tall bookcase", "مكتبة طويلة", I.mdiBookshelf, 0.9, 0.35),
  it("vitrine", "living", "Glass cabinet", "فترينة", I.mdiDresserOutline, 0.9, 0.45, { domains: L }),
  it("room_divider", "living", "Room divider", "فاصل", I.mdiDivision ?? I.mdiViewParallel ?? I.mdiWall, 1.4, 0.2),
  it("floor_vase", "living", "Floor vase", "مزهرية", I.mdiFlowerOutline, 0.3, 0.3),
  it("bar_cart", "living", "Bar cart", "عربة بار", I.mdiGlassWine, 0.7, 0.45),
  it("massage_chair", "living", "Massage chair", "كرسي مساج", I.mdiSofaSingle, 0.8, 1.2),
  it("rocking_chair", "living", "Rocking chair", "كرسي هزاز", I.mdiChairRolling, 0.7, 0.9),
  it("mirror_round", "living", "Round mirror", "مراية مدورة", I.mdiMirror, 0.6, 0.04, { z: 0.45 }),
  it("rug_runner", "living", "Runner rug", "سجادة طويلة", I.mdiRug, 2.5, 0.8),
  it("record_player", "living", "Record player", "جرامافون", I.mdiRecordPlayer ?? I.mdiAlbum, 0.45, 0.35, { domains: MEDIA, z: 0.37 }),
  it("plant_hanging", "living", "Hanging plant", "نبتة معلّقة", I.mdiFlowerOutline, 0.35, 0.35, { mount: "ceiling" }),

  // ---------- More: bedroom ----------
  it("wardrobe_sliding", "bedroom", "Sliding wardrobe", "خزانة سحّاب", I.mdiWardrobe, 2.0, 0.65),
  it("chest", "bedroom", "Chest / trunk", "صندوق", I.mdiTreasureChest ?? I.mdiDresserOutline, 0.9, 0.45),
  it("toy_box", "bedroom", "Toy box", "صندوق ألعاب", I.mdiToyBrickOutline ?? I.mdiBabyCarriage, 0.7, 0.4),
  it("changing_table", "bedroom", "Changing table", "طاولة غيار", I.mdiBabyCarriage, 0.9, 0.55),
  it("kids_bed", "bedroom", "Kids bed", "تخت ولاد", I.mdiBedSingleOutline, 0.9, 1.7),
  it("nightstand_round", "bedroom", "Round side table", "كومودينا مدورة", I.mdiTableFurniture, 0.45, 0.45),

  // ---------- More: bath ----------
  it("washer_dryer", "bath", "Washer-dryer stack", "غسالة ونشافة", I.mdiWashingMachine, 0.6, 0.62, { domains: [...SW, "sensor", "binary_sensor"] }),
  it("bidet", "bath", "Bidet", "شطّاف", I.mdiToilet, 0.38, 0.55),
  it("bath_cabinet", "bath", "Tall bath cabinet", "خزانة حمام", I.mdiDresserOutline, 0.4, 0.35),

  // ---------- More: office ----------
  it("standing_desk", "office", "Standing desk", "مكتب واقف", I.mdiDesk, 1.4, 0.7),
  it("whiteboard", "office", "Whiteboard", "لوح أبيض", I.mdiDraw ?? I.mdiImageFrame, 1.2, 0.05, { z: 0.35 }),
  it("meeting_table", "office", "Meeting table", "طاولة اجتماعات", I.mdiTableChair, 2.2, 2.4),
  it("office_cabinet", "office", "Office cabinet", "خزانة مكتب", I.mdiFileCabinet, 0.8, 0.45),
  it("bookshelf_ladder", "office", "Ladder shelf", "رف سلّم", I.mdiBookshelf, 0.8, 0.45),

  // ---------- More: outdoor ----------
  it("garden_bench", "outdoor", "Garden bench", "مقعد حديقة", I.mdiBench, 1.4, 0.55),
  it("fire_pit", "outdoor", "Fire pit", "موقد نار", I.mdiFire, 1.0, 1.0, { domains: [...SW, ...L] }),
  it("outdoor_heater", "outdoor", "Patio heater", "دفاية برّا", I.mdiHeatingCoil, 0.5, 0.5, { domains: SW }),
  it("lamp_post", "outdoor", "Lamp post", "عامود ضو", I.mdiPostLamp ?? I.mdiLightbulbOutline, 0.3, 0.3, { domains: L }),
  it("wall_light_out", "outdoor", "Outdoor wall light", "ضو حيط برّا", I.mdiWallSconce ?? I.mdiLightbulbOutline, 0.15, 0.12, { domains: L, z: 0.6 }),
  it("gate", "outdoor", "Gate", "بوابة", I.mdiGate, 2.2, 0.15, { domains: ["cover", "switch", "lock"] }),
  it("trampoline", "outdoor", "Trampoline", "ترامبولين", I.mdiCircleOutline, 2.4, 2.4),
  it("garden_swing", "outdoor", "Garden swing", "مرجوحة", I.mdiSeat, 1.9, 1.2),
  it("kids_slide", "outdoor", "Kids slide", "زحليطة", I.mdiSlide ?? I.mdiStairs, 0.6, 2.2),
  it("sunbed_double", "outdoor", "Double sunbed", "سرير شمس", I.mdiBedDoubleOutline, 1.6, 2.0),
  it("planter", "outdoor", "Planter box", "حوض زرع", I.mdiFlowerOutline, 1.0, 0.4),
  it("shed", "outdoor", "Garden shed", "مخزن حديقة", I.mdiHomeOutline, 2.0, 1.6),
  it("dog_house", "outdoor", "Dog house", "بيت كلب", I.mdiDogSide, 0.8, 1.0),
  it("mailbox", "outdoor", "Mailbox", "صندوق بريد", I.mdiMailboxOutline ?? I.mdiEmailOutline, 0.3, 0.45),
  it("motorcycle", "outdoor", "Motorcycle", "موتور", I.mdiMotorbike, 0.6, 2.0),

  // ---------- Structure ----------
  it("spiral_stairs", "structure", "Spiral stairs", "درج حلزوني", I.mdiStairs, 1.6, 1.6),
  it("railing", "structure", "Railing", "درابزين", I.mdiFence, 2.0, 0.06),
  it("glass_wall", "structure", "Glass partition", "حيط زجاج", I.mdiWindowClosedVariant, 2.0, 0.05),
  it("column_square", "structure", "Square column", "عامود مربع", I.mdiSquareOutline, 0.4, 0.4),
  it("built_in_shelves", "structure", "Built-in shelves", "رفوف بالحيط", I.mdiBookshelf, 1.6, 0.35),
];

export const CATEGORIES: { key: Category; name: { en: string; ar: string } }[] = [
  { key: "smart", name: { en: "Smart", ar: "ذكية" } },
  { key: "living", name: { en: "Living", ar: "صالة" } },
  { key: "bedroom", name: { en: "Bedroom", ar: "نوم" } },
  { key: "kitchen", name: { en: "Kitchen", ar: "مطبخ" } },
  { key: "bath", name: { en: "Bath", ar: "حمام" } },
  { key: "office", name: { en: "Office", ar: "مكتب" } },
  { key: "outdoor", name: { en: "Outdoor", ar: "برّا" } },
  { key: "structure", name: { en: "Structure", ar: "بناء" } },
];

export const item = (type: string) => CATALOG.find((c) => c.type === type);
export const itemName = (type: string, lang: Lang) => item(type)?.name[lang] ?? type;

/** Height above the floor (or below the ceiling) a placed piece actually uses. */
export const pieceZ = (type: string, z?: number) => z ?? item(type)?.z ?? 0;

/** Screens that can show a camera's picture (what's on the TV). */
export const PICTURE_TYPES = ["tv_unit", "tv_wall", "monitor"];
