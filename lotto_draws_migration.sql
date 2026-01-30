-- LottoInsight: Lotto Draws Table Migration
-- Run this in Supabase Dashboard → SQL Editor

-- Create lotto_draws table
CREATE TABLE IF NOT EXISTS public.lotto_draws (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  label text NOT NULL,
  is_upcoming boolean DEFAULT false,
  
  -- Summary KPIs for quick display
  kpi jsonb,
  -- Example: {"historical": "53", "sources": "1, 4", "trending": "67"}
  
  -- Actual lottery results (null for upcoming draws)
  result jsonb,
  -- Example: {"first": "835492", "lastTwo": "17", "lastThreeFront": ["492", "835"], "lastThreeBack": ["282", "651"]}
  
  -- Historical statistics (22-year data table)
  historical_stats jsonb,
  -- Example: [{"year": 2568, "first": "558700", "lastTwo": "51", "front3": ["285", "418"], "back3": ["685", "824"]}, ...]
  
  -- Sunday-specific statistics
  sunday_stats jsonb,
  -- Example: {"lastTwo": [{"count": 2, "numbers": ["15", "20", "40", "50"]}], "firstTwo": [{"count": 3, "numbers": ["06"]}]}
  
  -- Famous fortune teller predictions
  sources jsonb,
  -- Example: [{"name": "เจ๊ฟองเบียร์", "theme": "เน้นเลข 4", "color": "green", "numberHot": "4", "two": ["45", "46"], "three": ["345", "641"]}, ...]
  
  -- Event-driven numbers
  events jsonb,
  -- Example: [{"title": "เครื่องบินตกจอมทอง", "details": [...], "numbers": ["41", "107", "411"]}]
  
  -- Horoscope and Chinese calendar analysis
  horoscope jsonb,
  -- Example: {"yearAnimal": "มะเมียธาตุไฟ", "luckyNumbers": ["9", "5", "1"], "chineseCalendar": {"numbers": ["5", "0", "2", "7"], "pairs": ["50", "52", "57"]}}
  
  -- VIP memorial numbers
  vip_numbers jsonb,
  -- Example: [{"name": "เจ้าคุณพระสินีนาถ", "event": "วันคล้ายวันเกิด", "date": "26 มกราคม", "numbers": ["26", "28", "41"]}]
  
  -- Conclusion summary groups
  conclusion jsonb,
  -- Example: {"statistical": ["09", "06", "04", "181", "426"], "eventDriven": ["411", "107", "41", "08", "28"], "consensus": ["4", "1", "05", "58"]}
  
  -- Pool for random lucky number generation
  lucky_pool text[],
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lotto_draws_date ON public.lotto_draws(date DESC);
CREATE INDEX IF NOT EXISTS idx_lotto_draws_upcoming ON public.lotto_draws(is_upcoming);

-- Enable Row Level Security
ALTER TABLE public.lotto_draws ENABLE ROW LEVEL SECURITY;

-- Public read access for all users
DROP POLICY IF EXISTS "Anyone can view lotto draws" ON public.lotto_draws;
CREATE POLICY "Anyone can view lotto draws" ON public.lotto_draws
  FOR SELECT USING (true);

-- Only admins can insert/update/delete
DROP POLICY IF EXISTS "Admins can manage lotto draws" ON public.lotto_draws;
CREATE POLICY "Admins can manage lotto draws" ON public.lotto_draws
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lotto_draws_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lotto_draws_updated_at ON public.lotto_draws;
CREATE TRIGGER lotto_draws_updated_at
  BEFORE UPDATE ON public.lotto_draws
  FOR EACH ROW EXECUTE FUNCTION update_lotto_draws_updated_at();

-- =====================================================
-- SEED DATA: งวด 1 กุมภาพันธ์ 2569 (Upcoming Draw)
-- =====================================================
INSERT INTO public.lotto_draws (
  date,
  label,
  is_upcoming,
  kpi,
  historical_stats,
  sunday_stats,
  sources,
  events,
  horoscope,
  vip_numbers,
  conclusion,
  lucky_pool
) VALUES (
  '2026-02-01',
  'งวด 1 กุมภาพันธ์ 2569',
  true,
  '{"historical": "53", "sources": "1, 4", "trending": "67"}'::jsonb,
  
  -- Historical stats (22-year data)
  '[
    {"year": 2568, "first": "558700", "lastTwo": "51", "front3": ["285", "418"], "back3": ["685", "824"]},
    {"year": 2567, "first": "607063", "lastTwo": "09", "front3": ["454", "943"], "back3": ["544", "591"]},
    {"year": 2566, "first": "297411", "lastTwo": "92", "front3": ["181", "789"], "back3": ["101", "664"]},
    {"year": 2565, "first": "944308", "lastTwo": "30", "front3": ["942", "061"], "back3": ["509", "485"]},
    {"year": 2564, "first": "912307", "lastTwo": "97", "front3": ["605", "248"], "back3": ["282", "651"]},
    {"year": 2563, "first": "589227", "lastTwo": "06", "front3": ["259", "552"], "back3": ["927", "375"]},
    {"year": 2562, "first": "967134", "lastTwo": "04", "front3": ["643", "779"], "back3": ["197", "948"]},
    {"year": 2561, "first": "026853", "lastTwo": "31", "front3": ["106", "947"], "back3": ["181", "519"]},
    {"year": 2560, "first": "054672", "lastTwo": "42", "front3": ["066", "807"], "back3": ["426", "628"]},
    {"year": 2559, "first": "927800", "lastTwo": "09", "front3": ["625", "999"], "back3": ["054", "076"]},
    {"year": 2558, "first": "155537", "lastTwo": "79", "front3": [], "back3": ["083", "286", "813", "008"]},
    {"year": 2557, "first": "180149", "lastTwo": "95", "front3": [], "back3": ["406", "492", "888", "976"]},
    {"year": 2556, "first": "565566", "lastTwo": "66", "front3": [], "back3": ["452", "695", "641", "782"]},
    {"year": 2555, "first": "320605", "lastTwo": "32", "front3": [], "back3": ["749", "426", "498", "598"]},
    {"year": 2554, "first": "610089", "lastTwo": "55", "front3": [], "back3": ["596", "361", "121", "432"]},
    {"year": 2553, "first": "186312", "lastTwo": "14", "front3": [], "back3": ["936", "577", "694", "403"]},
    {"year": 2552, "first": "534533", "lastTwo": "69", "front3": [], "back3": ["660", "777", "015", "427"]},
    {"year": 2551, "first": "212684", "lastTwo": "26", "front3": [], "back3": ["311", "472", "732", "796"]},
    {"year": 2550, "first": "769925", "lastTwo": "56", "front3": [], "back3": ["893", "239", "287", "865"]},
    {"year": 2549, "first": "412729", "lastTwo": "87", "front3": [], "back3": ["915", "720", "149", "384"]},
    {"year": 2548, "first": "540054", "lastTwo": "34", "front3": [], "back3": ["389", "180", "863", "571"]},
    {"year": 2547, "first": "216822", "lastTwo": "77", "front3": [], "back3": ["361", "242", "769", "765"]}
  ]'::jsonb,
  
  -- Sunday stats
  '{
    "note": "วันที่ 1 กุมภาพันธ์ 2569 ตรงกับวันอาทิตย์",
    "lastTwo": [
      {"count": 2, "numbers": ["15", "20", "40", "50", "62", "94", "98"]},
      {"count": 1, "numbers": ["02", "14", "18", "29", "31", "32", "37", "52", "61", "66", "69", "71", "79", "81", "83", "85", "87", "88"]}
    ],
    "firstTwoFromFirst": [
      {"count": 3, "numbers": ["06"]},
      {"count": 2, "numbers": ["04"]}
    ],
    "dominantDigits": ["0", "1", "5", "8"]
  }'::jsonb,
  
  -- Sources
  '[
    {"name": "เจ๊ฟองเบียร์", "theme": "เน้นเลข 4", "color": "green", "numberHot": "4", "singlePick": "45", "two": ["46", "43", "49"], "three": ["345", "641", "549"]},
    {"name": "แม่น้ำหนึ่ง", "theme": "เลขฟันธง 4", "color": "pink", "numberHot": "4", "two": ["54", "56", "52", "46", "42", "62"], "four": "5462", "altNote": "เลข 0 มาแน่นอน ล้านเปอร์เซ็นต์", "altTwo": ["92", "90", "02"]},
    {"name": "น้องเพชรกล้า", "theme": "เลขปิงปอง 0-5", "color": "blue", "two": ["05", "06", "09", "58", "65", "95"], "favPicks": ["06", "58"], "three": ["065"]},
    {"name": "อ.น๊อตตี้ พารวย", "theme": "จุดธูปมงคลได้เลข 611", "color": "purple", "two": ["61", "11", "21"], "three": ["611", "621"]},
    {"name": "ดุ่ย ภรัญฯ", "theme": "เน้นเลข 1", "color": "orange", "two": ["01", "21", "31", "81", "32", "83"]}
  ]'::jsonb,
  
  -- Events
  '[
    {
      "title": "เครื่องบินตกจอมทอง เชียงใหม่",
      "icon": "✈️",
      "details": [
        {"label": "รหัสเครื่องบิน", "value": "AT-6TH"},
        {"label": "หมายเลขประจำเครื่อง", "value": "41107"},
        {"label": "เวลาเกิดเหตุ", "value": "10:40 น."}
      ],
      "hotNumbers": ["41", "107", "411"],
      "allNumbers": ["41", "10", "07", "40", "29", "107", "110", "411", "147", "047"]
    },
    {
      "title": "การเลือกตั้งทั่วไป 2569",
      "icon": "🗳️",
      "details": [
        {"label": "วันเลือกตั้ง", "value": "8 กุมภาพันธ์ 2569"},
        {"label": "การเลือกตั้ง สส. ครั้งที่", "value": "28"},
        {"label": "นายกรัฐมนตรีลำดับที่", "value": "33"}
      ],
      "partyNumbers": [
        {"party": "ภูมิใจไทย", "number": "37"},
        {"party": "ประชาชน", "number": "46"},
        {"party": "เพื่อไทย", "number": "09"}
      ],
      "hotNumbers": ["08", "28", "33"]
    }
  ]'::jsonb,
  
  -- Horoscope
  '{
    "year": {
      "animal": "มะเมีย",
      "element": "ธาตุไฟ",
      "luckyNumbers": ["9", "5", "1"],
      "balanceNumber": "5",
      "relatedPairs": ["51", "52", "59", "54"]
    },
    "chineseCalendar": {
      "dateMatch": "วันมะเมีย",
      "notGoodWith": "ปีชวด",
      "goodWith": ["ปีขาล", "ปีมะแม", "ปีจอ"],
      "verticalNumbers": ["5", "0", "2", "7"],
      "twoPairs": ["50", "52", "57", "02", "07", "27"],
      "threePairs": ["502", "027", "527", "507"]
    }
  }'::jsonb,
  
  -- VIP Numbers
  '[
    {"name": "เจ้าคุณพระสินีนาถ พิลาสกัลยาณี", "event": "วันคล้ายวันเกิด", "date": "26 มกราคม 2528", "anniversary": "ครบรอบ 41 ปี", "numbers": ["26", "28", "41"]},
    {"name": "หลวงปู่มั่น ภูริทัตโต", "event": "วันชาตกาล", "date": "20 มกราคม", "anniversary": "ครบรอบ 156 ปี", "numbers": ["20", "156"]},
    {"name": "หลวงพ่อสด วัดปากน้ำ", "event": "วันมรณภาพ", "date": "3 กุมภาพันธ์", "anniversary": "ครบรอบ 67 ปี (อายุ 75)", "numbers": ["67", "75"]},
    {"name": "หลวงตามหาบัว", "event": "วันมรณภาพ", "date": "30 มกราคม", "anniversary": "ครบรอบ 15 ปี (อายุ 98)", "numbers": ["15", "98"]},
    {"name": "ปอ ทฤษฎี สหวงษ์", "event": "รำลึกอดีตดารา", "date": "เกิด 23 ม.ค. 2523, เสียชีวิต 18 ม.ค. 2559", "anniversary": "อายุ 36 ปี", "numbers": ["18", "59", "36"]}
  ]'::jsonb,
  
  -- Conclusion
  '{
    "statistical": {
      "title": "เลขเด่นเชิงสถิติสูงสุด",
      "icon": "📊",
      "numbers": [
        {"num": "09", "reason": "ออกซ้ำบ่อยที่สุดในประวัติศาสตร์ 1 ก.พ."},
        {"num": "06", "reason": "ออกบ่อยที่สุดในงวดวันอาทิตย์"},
        {"num": "04", "reason": "ออกบ่อยอันดับ 2 ในวันอาทิตย์"},
        {"num": "181", "reason": "เลข 3 ตัวที่ออกซ้ำข้ามหมวด"},
        {"num": "426", "reason": "เลข 3 ตัวที่ออกซ้ำข้ามหมวด"}
      ]
    },
    "eventDriven": {
      "title": "เลขจากเหตุการณ์ปัจจุบัน",
      "icon": "🔥",
      "numbers": [
        {"num": "411", "reason": "เครื่องบินตกจอมทอง - เลขแรงสุด"},
        {"num": "107", "reason": "หมายเลขประจำเครื่อง"},
        {"num": "41", "reason": "รหัสเครื่องบิน"},
        {"num": "08", "reason": "วันเลือกตั้ง 8 ก.พ."},
        {"num": "28", "reason": "การเลือกตั้ง สส. ครั้งที่ 28"},
        {"num": "14", "reason": "วันวาเลนไทน์และเลขมงคลเดือน"}
      ]
    },
    "consensus": {
      "title": "เลขฉันทามติจากสำนักดัง",
      "icon": "🤝",
      "numbers": [
        {"num": "4", "reason": "ยืนยันจากเจ๊ฟองเบียร์และแม่น้ำหนึ่ง"},
        {"num": "1", "reason": "ชนกันใน 3 สำนักใหญ่ + สถิติอาทิตย์"},
        {"num": "05", "reason": "น้องเพชรกล้า + ปฏิทินจีน"},
        {"num": "58", "reason": "น้องเพชรกล้า - เลขที่ชอบที่สุด"}
      ]
    },
    "finalPicks": {
      "twoDigit": ["41", "09", "14", "28", "06", "58"],
      "threeDigit": ["107", "411", "345", "611", "546"]
    }
  }'::jsonb,
  
  -- Lucky pool
  ARRAY['41', '41', '41', '09', '09', '14', '28', '06', '58', '107', '411', '04', '46', '33', '08']
  
) ON CONFLICT (date) DO UPDATE SET
  label = EXCLUDED.label,
  is_upcoming = EXCLUDED.is_upcoming,
  kpi = EXCLUDED.kpi,
  historical_stats = EXCLUDED.historical_stats,
  sunday_stats = EXCLUDED.sunday_stats,
  sources = EXCLUDED.sources,
  events = EXCLUDED.events,
  horoscope = EXCLUDED.horoscope,
  vip_numbers = EXCLUDED.vip_numbers,
  conclusion = EXCLUDED.conclusion,
  lucky_pool = EXCLUDED.lucky_pool;

-- =====================================================
-- SEED DATA: งวด 16 มกราคม 2569 (Past Draw)
-- =====================================================
INSERT INTO public.lotto_draws (
  date,
  label,
  is_upcoming,
  kpi,
  result,
  lucky_pool
) VALUES (
  '2026-01-16',
  'งวด 16 มกราคม 2569',
  false,
  '{"historical": "17", "sources": "8, 3", "trending": "92"}'::jsonb,
  '{"first": "835492", "lastTwo": "17", "lastThreeFront": ["492", "835"], "lastThreeBack": ["282", "651"]}'::jsonb,
  ARRAY['17', '83', '92', '54', '35']
) ON CONFLICT (date) DO UPDATE SET
  label = EXCLUDED.label,
  is_upcoming = EXCLUDED.is_upcoming,
  kpi = EXCLUDED.kpi,
  result = EXCLUDED.result;

-- Verify data
SELECT id, date, label, is_upcoming FROM public.lotto_draws ORDER BY date DESC;
